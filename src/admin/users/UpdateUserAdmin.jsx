import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../admin.css";
import "./user.css";
import NavAdmin from "../nav/NavAdmin";
import Footer from "../../pages/footer/FooterAdmin";

const UpdateUserAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    role: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const API_URL = "http://localhost:8000/api/auth/users/";

  // ✅ Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        navigate("/clt/login");
        return;
      }

      try {
        const res = await fetch(`${API_URL}${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("access_token");
            navigate("/clt/login");
          }
          throw new Error("Failed to fetch user");
        }

        const data = await res.json();
        setFormData(data);
        setLoading(false);
      } catch (err) {
        setMessage(err.message);
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  // ✅ Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/clt/login");
      return;
    }

    try {
      const res = await fetch(`${API_URL}${id}/update/`, {
        method: "PUT", // ✅ أفضل من PUT
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update user");

      setMessage("User updated successfully ✅");

      setTimeout(() => {
        navigate("/admin/users");
      }, 1000);
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="admin-main-bg">
      <NavAdmin />
      <div className="box-margin"></div>

      <div className="update-users-admin admin-main-div">
        <h2>Update User</h2>

        {message && <p>{message}</p>}

        <form onSubmit={handleSubmit}>
          <div className="row">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row">
            <label>First Name:</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name || ""}
              onChange={handleChange}
            />
          </div>

          <div className="row">
            <label>Last Name:</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name || ""}
              onChange={handleChange}
            />
          </div>

          <div className="row">
            <label>Phone:</label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number || ""}
              onChange={handleChange}
            />
          </div>

          <div className="row">
            <label>Role:</label>
            <select
              name="role"
              value={formData.role || ""}
              onChange={handleChange}
            >
              <option value="">Select role</option>
              <option value="normal">Normale</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <br />

          <button className="click-btn2 main-btn" type="submit">
            Update User
          </button>
        </form>
      </div>
      <Footer/>
    </div>
  );
};

export default UpdateUserAdmin;