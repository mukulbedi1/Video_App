import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import VideoList from "./components/videoList"; 
import VideoUpload from "./components/uploadVideo";   

const App = () => {
  return (
    <Router>
      <div className="center">
        <h1>Video Upload App</h1>
        <Routes>
          <Route path="/" element={<VideoUpload />} />
          <Route path="/videos" element={<VideoList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
