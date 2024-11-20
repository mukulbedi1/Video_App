import React, { useEffect, useState } from "react";

const VideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const fetchVideos = async () => {
    try {
      // Fetch videos from the server first
      const response = await fetch("http://localhost:5000/api/videos");
      if (!response.ok) {
        throw new Error(`Failed to fetch videos: ${response.statusText}`);
      }

      const fetchedVideos = await response.json();

      // Retrieve cached videos from localStorage
      const cachedVideos = localStorage.getItem("videos");
      let parsedCachedVideos = [];

      if (cachedVideos) {
        parsedCachedVideos = JSON.parse(cachedVideos);

        // Validate cached data
        if (!Array.isArray(parsedCachedVideos)) {
          parsedCachedVideos = []; // Reset if invalid data
        }
      }

      // Merge fetched and cached videos, avoiding duplicates
      const allVideos = [
        ...fetchedVideos,
        ...parsedCachedVideos.filter(
          (cachedVideo) =>
            !fetchedVideos.some(
              (fetchedVideo) => fetchedVideo._id === cachedVideo._id
            )
        ),
      ];

      // Update state and cache the merged videos
      setVideos(allVideos);
      localStorage.setItem("videos", JSON.stringify(allVideos));
    } catch (err) {
      console.error("Error fetching videos:", err);
      setError(err.message || "Failed to load videos.");
    } finally {
      setLoading(false);
    }
  };

  const deleteVideo = async (videoId) => {
    // Optimistically update the UI and localStorage
    const videoToDelete = videos.find((video) => video._id === videoId);
    const updatedVideos = videos.filter((video) => video._id !== videoId);
    setVideos(updatedVideos);
    localStorage.setItem("videos", JSON.stringify(updatedVideos));
  
    try {
      const response = await fetch(`http://localhost:5000/api/videos/${videoId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error(`Failed to delete video: ${response.statusText}`);
      }
  
      console.log(`Video with ID ${videoId} deleted successfully.`);
    } catch (err) {
      console.error("Error deleting video:", err);
      alert(`Failed to delete video: ${err.message}`);
  
      // Rollback changes in case of an error
      setVideos((prevVideos) => {
        const restoredVideos = [...prevVideos, videoToDelete];
        localStorage.setItem("videos", JSON.stringify(restoredVideos));
        return restoredVideos;
      });
    }
  };
  
  
  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div
      className="center"
      style={{
        width: "95vw",
        minHeight: "100vh",
        margin: 0,
        paddingLeft: 40,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Videos</h1>

      {/* Loading State */}
      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <h2>Loading videos...</h2>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <h2 style={{ color: "red" }}>Error: {error}</h2>
        </div>
      )}

      {/* Video Grid */}
      {!loading && !error && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)", 
            gap: "20px",
            width: "100%",
          }}
        >
          {videos.map((video) => (
            <div
              key={video._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "10px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
              }}
            >
              <h3 style={{ marginBottom: "10px" }}>{video.title}</h3>
              <p style={{ marginBottom: "10px", color: "#555" }}>
                {video.description}
              </p>
              <video
                width="100%"
                height="200px"
                controls
                style={{ objectFit: "cover", borderRadius: "5px" }}
              >
                <source src={video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this video?")) {
                    deleteVideo(video._id);
                  }
                }}
                style={{
                  marginTop: "10px",
                  padding: "8px 16px",
                  backgroundColor: "#ff4d4f",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideosPage;
