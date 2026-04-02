import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../admin.css";
import './consult.css'
import NavAdmin from "../nav/NavAdmin";
import Footer from "../../pages/footer/FooterAdmin";

const UploadFileAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    file_zip: null,
  });
  const [message, setMessage] = useState("");

  const API_URL = "http://localhost:8000/folder/upload-zip/"; // backend endpoint

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file_zip") {
      setFormData({ ...formData, file_zip: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/clt/login");
        return;
      }

      const data = new FormData();
      if (formData.name) data.append("name", formData.name);
      if (formData.file_zip) data.append("file_zip", formData.file_zip);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!res.ok) throw new Error(`Failed to upload file (status: ${res.status})`);

      const result = await res.json();
      setMessage("File created successfully ✅");
      console.log(result);

      // Redirect to file list after 1s
      setTimeout(() => navigate("/admin/allfile"), 1000);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="admin-main-bg">
      <NavAdmin />
      <div className="box-margin"></div>

      <div className="create-file-admin admin-main-div">
        <h2>Create New File</h2>
        {message && <p>{message}</p>}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="row">
            <label>Upload ZIP:</label><br />
            <input
              type="file"
              name="file_zip"
              accept=".zip"
              onChange={handleChange}
              required
            />
          </div>

          <br />
          <button type="submit" className="click-btn2 main-btn">
            Create File
          </button>
        </form>
      </div>
      <Footer/>
    </div>
  );
};

export default UploadFileAdmin;