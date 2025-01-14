import axios from 'axios';
import React, { useState } from 'react'
import Cookies from 'js-cookie';

const TextFileUpperCase = () => {
    const [file, setFile] = useState(null);

    const BASE_BACKEND_URL = process.env.REACT_APP_BASE_BACKEND_URL;

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        // const token = localStorage.getItem("authToken");
        // if (!token) {
        //     alert("Please log in first.");
        //     return;
        // }
        if (!file) {
            alert("Please select a file first!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const csrfToken = Cookies.get('csrf_access_token');
            const response = await axios.post(
                `${BASE_BACKEND_URL}/upload-text`,
                formData,
                {
                    headers: {
                        // Authorization: `Bearer ${token}`,
                        'X-CSRF-TOKEN': csrfToken,
                    },
                    withCredentials:true,
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