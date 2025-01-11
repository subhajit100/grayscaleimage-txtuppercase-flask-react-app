import axios from 'axios';
import React, { useState } from 'react'

const TextFileUpperCase = () => {
    const [file, setFile] = useState(null);

    const BASE_BACKEND_URL = process.env.REACT_APP_BASE_BACKEND_URL;

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file first!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(
                `${BASE_BACKEND_URL}/upload-text`,
                formData,
                {
                    responseType: 'blob', // Important: ensures the response is treated as a file blob
                }
            );

            // Create a blob URL and trigger the file download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.download = `uppercase_${file.name}`;
            link.click();
            window.URL.revokeObjectURL(url); // Cleanup
        } catch (error) {
            console.error("Error during file upload:", error);
            alert(error.response?.data?.error || "File upload failed.");
        }
    };

    return (
        <div style={{marginTop: '30px'}}>
            <input type="file" accept=".txt" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload and Convert</button>
        </div>
    );
}

export default TextFileUpperCase