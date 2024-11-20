const express = require("express");
const { 
  uploadVideo, 
  getAllVideos, 
  uploadMiddleware, 
  deleteVideo // Include the deleteVideo controller 
} = require("../controllers/videoController");

const router = express.Router();

// Upload video
router.post("/upload", uploadMiddleware, uploadVideo);

// Get all videos
router.get("/", getAllVideos);

// Delete video by ID
router.delete("/:id", deleteVideo);

module.exports = router;
