import React, { useState } from 'react';
import axios from 'axios';

const GrayScaleConverter = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [grayImageUrl, setGrayImageUrl] = useState(null);

    const BASE_BACKEND_URL = process.env.REACT_APP_BASE_BACKEND_URL;
  
    const handleFileChange = (event) => {
      setSelectedFile(event.target.files[0]);
    };
  
    const handleGrayScale = async () => {
      if (!selectedFile) {
        alert("Please upload an image first!");
        return;
      }
  
      const formData = new FormData();
      formData.append("image", selectedFile);
  
      try {
        const response = await axios.post(`${BASE_BACKEND_URL}/upload-image`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob", // To handle binary image data
        });
  
        // Create a URL for the grayscale image
        const grayImageBlob = new Blob([response.data], { type: "image/jpeg" });
        const grayImageUrl = URL.createObjectURL(grayImageBlob);
        setGrayImageUrl(grayImageUrl);
  
      } catch (error) {
        console.error("Error processing the image:", error);
      }
    };
  return (
    <div>
      <h1>Image Grayscale Converter</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleGrayScale}>Gray Scale</button>

      {grayImageUrl && (
        <div>
          <h2>Grayscale Image</h2>
          <img src={grayImageUrl} alt="Grayscale version" style={{ width: '500px', height: 'auto' }} />
        </div>
      )}
    </div>
  )
}

export default GrayScaleConverter