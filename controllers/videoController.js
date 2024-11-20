const Video = require("../models/Video");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Middleware for uploading files
exports.uploadMiddleware = upload.single("file");

// Upload Video to Cloudinary
exports.uploadVideo = async (req, res) => {
  const { title, description } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "No video file uploaded" });
  }

  try {
    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: "videos/uploads",
    });

    // Save video details in MongoDB
    const video = new Video({
      title,
      description,
      url: result.secure_url,
      public_id: result.public_id,
    });

    await video.save();
    res.status(201).json({ message: "Video uploaded successfully", video });
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).json({ message: `Failed to upload video: ${error.message}` });
  }
};

// Fetch All Videos
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    const availableVideos = [];

    for (const video of videos) {
      try {
        // Verify the video exists on Cloudinary
        await cloudinary.api.resource(video.public_id, { resource_type: "video" });
        availableVideos.push(video); // Add if the video exists
      } catch (error) {
        if (error.http_code !== 404) {
          console.error(`Error checking video ${video.public_id}:`, error);
        }
        // Skip the video if it doesn't exist on Cloudinary
      }
    }

    res.status(200).json(availableVideos);
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    res.status(500).json({ message: `Failed to fetch videos: ${error.message}` });
  }
};

// Delete Video
exports.deleteVideo = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the video by ID in the database
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Delete video from Cloudinary
    await cloudinary.uploader.destroy(video.public_id, { resource_type: "video" });

    // Delete video from the database
    await video.deleteOne();

    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ message: `Failed to delete video: ${error.message}` });
  }
};
