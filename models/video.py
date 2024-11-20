# models/video.py

from pymongo import MongoClient
from bson import ObjectId

class Video:
    def __init__(self, title, description, url, public_id):
        self.title = title
        self.description = description
        self.url = url
        self.public_id = public_id

    @classmethod
    def save(cls, db, video_data):
        """Save video data to the 'videos' collection in MongoDB."""
        return db.videos.insert_one(video_data)

    @classmethod
    def get_all(cls, db):
        """Retrieve all videos from the 'videos' collection."""
        return list(db.videos.find())

    @classmethod
    def get_by_id(cls, db, video_id):
        """Retrieve a single video from the 'videos' collection by its ID."""
        return db.videos.find_one({"_id": ObjectId(video_id)})
