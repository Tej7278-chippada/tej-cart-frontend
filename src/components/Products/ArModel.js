import React, { useState } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function ArModel() {
  const [images, setImages] = useState([]);
  const [arModel, setArModel] = useState(null);
  const [showAR, setShowAR] = useState(false);
  const [modelUrl, setModelUrl] = useState(null);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setImages(files);
  };

  const uploadImages = async () => {
    if (images.length !== 5) {
      alert("Please upload exactly 5 images.");
      return;
    }

    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append(`image${index}`, image);
    });

    try {
      const response = await axios.post("http://localhost:5009/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setModelUrl(response.data.modelUrl);
      alert("AR model generated! You can try it now.");
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to generate AR model.");
    }
  };

  const tryOnModel = () => {
    setShowAR(true);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", padding: "20px" }}>
      <h1>3D Virtual Try-On</h1>
      <input type="file" accept="image/*" multiple onChange={handleFileChange} />
      <button onClick={uploadImages} style={{ margin: "10px" }}>
        Upload Images
      </button>
      {modelUrl && (
        <div>
          <h2>Your Model</h2>
          <model-viewer
            src={modelUrl}
            alt="Generated 3D Model"
            ar
            camera-controls
            auto-rotate
            style={{ width: "100%", height: "500px", margin: "20px auto" }}
          />
          <button
            style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "#fff", cursor: "pointer" }}
            onClick={() => alert("AR model overlay started!")}
          >
            Try On
          </button>
        </div>
      )}
    </div>
  );
}

export default ArModel;
