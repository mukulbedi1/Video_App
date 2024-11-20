# controllers/video_controller.py

from flask import request, jsonify
import cloudinary
import cloudinary.uploader
from config import CLOUDINARY_CONFIG
from models.video import Video

# Configure Cloudinary
cloudinary.config(**CLOUDINARY_CONFIG)

def upload_video(db):
    """Handle video upload and storage logic."""
    file = request.files['file']
    title = request.form.get('title')
    description = request.form.get('description')

    # Validate file type
    if not file.content_type.startswith("video/"):
        return jsonify({"message": "Invalid file type"}), 400

    # Specify the folder path in Cloudinary
    folder_path = "videos/uploads"

    try:
        # Upload the video to Cloudinary
        result = cloudinary.uploader.upload(
            file,
            resource_type="video",
            public_id=f"{folder_path}/{title}",
            folder=folder_path
        )

        # Create a video data dictionary
        video_data = {
            "title": title,
            "description": description,
            "url": result['secure_url'],
            "public_id": result['public_id']
        }

        # Save video data to MongoDB
        Video.save(db, video_data)

        return jsonify({"message": "Video uploaded successfully", "data": video_data}), 201

    except Exception as e:
        return jsonify({"message": f"Error uploading video: {str(e)}"}), 500

def get_videos(db):
    """Retrieve all videos from the database."""
    try:
        videos = Video.get_all(db)
        return jsonify({"videos": videos}), 200
    except Exception as e:
        return jsonify({"message": f"Error retrieving videos: {str(e)}"}), 500
