

import React, { useState } from "react";
import axios from "axios";

const UploadZip = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [folderName, setFolderName] = useState(""); // إذا تحب تستخدمه
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const onFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select a ZIP file!");
      return;
    }

    const formData = new FormData();
    formData.append("file_zip", selectedFile);
    if (folderName.trim()) {
      formData.append("folder_name", folderName); // لو تحب ترسل folder_name
    }

    try {
      setUploading(true);
      setMessage("");

      const response = await axios.post(
        "http://localhost:8000/folder/upload-zip/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Response:", response.data);
      setMessage(`Upload successful! Unzip folder: ${response.data.file_unzip}`);
      setSelectedFile(null);
      setFolderName("");
      document.getElementById("file-input").value = ""; // تفريغ input
    } catch (err) {
      console.error(err);
      setMessage("Upload failed. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "20px auto" }}>
      <h2>Upload 3D Project ZIP</h2>
      <form onSubmit={handleUpload}>
        <div style={{ marginBottom: "10px" }}>
          <input
            id="file-input"
            type="file"
            accept=".zip"
            onChange={onFileChange}
          />
        </div>

        {/* لو تحب folder name */}
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Folder name (optional)"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            style={{ width: "100%", padding: "5px" }}
          />
        </div>

        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload ZIP"}
        </button>
      </form>

      {message && <p style={{ marginTop: "10px" }}>{message}</p>}
    </div>
  );
};

export default UploadZip;