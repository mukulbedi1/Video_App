# app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from config import MONGO_URI
from controllers.video_controller import upload_video, get_videos

# Initialize Flask app
app = Flask(__name__)

# Enable CORS
CORS(app)

app.config["MONGO_URI"] = MONGO_URI  # Use the MongoDB URI from config

# Initialize MongoDB client
mongo = PyMongo(app)

@app.route('/upload', methods=['POST'])
def upload_video_route():
    return upload_video(mongo.db)

@app.route('/videos', methods=['GET'])
def get_videos_route():
    return get_videos(mongo.db)

if __name__ == '__main__':
    app.run(debug=True)
