import React, { useEffect, useState } from "react";
import axios from "axios";

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileData, setFileData] = useState(null);

  // 1️⃣ Fetch all files
  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8000/folder/files/");
        setFiles(res.data);
      } catch (err) {
        console.error("Failed to fetch files:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  // 2️⃣ Handle click on a file to fetch single file info
  const handleFileClick = async (fileId,filePath) => {
    setSelectedFile(fileId);
    setFileData(null);
    try {
      const res = await axios.get(`http://localhost:8000/folder/files/${fileId}/`);
      setFileData(res.data);
      console.log(res.data)
    } catch (err) {
      console.error("Failed to fetch single file:", err);
      alert("Failed to fetch file");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto" }}>
      <h2>Files</h2>

      {loading ? (
        <p>Loading files...</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {files.map((file) => (
            <li
              key={file.id}
              onClick={() => handleFileClick(file.id,file.file_unzip)}
              style={{
                padding: "10px",
                margin: "5px 0",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer",
                backgroundColor: selectedFile === file.id ? "#f0f8ff" : "#fff",
              }}
            >
              <strong>{file.name}</strong>
              {file.folder_name && <span> ({file.folder_name})</span>}
            </li>
          ))}
        </ul>
      )}

      {/* 3️⃣ Display single file info */}
      {fileData && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
          <h3>File Details (ID: {fileData.id})</h3>
          <p><strong>Name:</strong> {fileData.name}</p>
          <p><strong>Folder:</strong> {fileData.folder_name || "—"}</p>
          <p>
            <strong>ZIP URL:</strong>{" "}
            <a href={fileData.file_zip} target="_blank" rel="noopener noreferrer">
              Open ZIP
            </a>
          </p>
          {fileData.file_unzip && (
            <p>
              <strong>Unzip Folder:</strong>{" "}
              <a
                href={`http://localhost:8000/media/${fileData.file_unzip}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Unzip
              </a>
            </p>
          )}
          <p><strong>Uploaded at:</strong> {new Date(fileData.uploaded_at).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default FileList;