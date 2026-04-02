import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../admin.css'
import NavAdmin from '../nav/NavAdmin';
import Footer from '../../pages/footer/FooterAdmin';

const UpdateSingleTeamAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    phone_number: '',
    email: '',
    linkedin_url: '',
    description: '',
    profile_image: null,
  });

  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const API_URL = 'http://localhost:8000/api/members/';

  // ✅ Fetch existing member
  useEffect(() => {
    fetch(`${API_URL}${id}/`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch member');
        }
        return res.json();
      })
      .then((data) => {
        setFormData({
          name: data.name,
          role: data.role,
          phone_number: data.phone_number,
          email: data.email,
          linkedin_url: data.linkedin_url,
          description: data.description,
          profile_image: null,
        });
        setCurrentImage(data.profile_image);
        setLoading(false);
      })
      .catch((err) => {
        setMessage(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'profile_image') {
      setFormData({ ...formData, profile_image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ✅ Update member
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const data = new FormData();
    data.append('name', formData.name);
    data.append('role', formData.role);
    data.append('phone_number', formData.phone_number);
    data.append('email', formData.email);
    data.append('linkedin_url', formData.linkedin_url);
    data.append('description', formData.description);

    if (formData.profile_image) {
      data.append('profile_image', formData.profile_image);
    }

    try {
      const response = await fetch(`${API_URL}${id}/update/`, {
        method: 'PUT', // or PATCH
        body: data,
      });

      if (!response.ok) {
        throw new Error('Failed to update member');
      }

      setMessage('Team member updated successfully ✅');

      setTimeout(() => {
        navigate('/admin/team');
      }, 1000);

    } catch (error) {
      setMessage(error.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className='admin-main-bg'>
                      <NavAdmin/>
                      <div className='box-margin ' ></div>
    <div className='update-Single-Team admin-main-div'>
      <h2>Update Team Member</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">

        <div className='row'>
          <label>Name:</label><br />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* ROLE SELECT */}
        <div className='row'>
          <label>Role:</label><br />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            <option value="developer">Developer</option>
            <option value="designer">Designer</option>
            <option value="manager">Project Manager</option>
            <option value="RH">RH</option>
            <option value="stageur">Stagiaire</option>
            <option value="ign-tp-geo">Ingénieur Géomètre Topographe</option>
            <option value="CEO">CEO</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className='row'>
          <label>Phone:</label><br />
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            required
          />
        </div>

        <div className='row'>
          <label>Email:</label><br />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className='row'>
          <label>LinkedIn URL:</label><br />
          <input
            type="url"
            name="linkedin_url"
            value={formData.linkedin_url}
            onChange={handleChange}
          />
        </div>

        <div className='row'>
          <label>Description:</label><br />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Current Image */}
        {currentImage && (
          <div>
            <p>Current Image:</p> 
            <img src={currentImage} alt="Current" width="120" />
          </div>
        )}

        <div className='row'>
          <label>Replace Image:</label><br />
          <input
            type="file"
            name="profile_image"
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        <br />

        <button type="submit" className='click-btn2 main-btn'>
          Update Member
        </button>

      </form>
    </div>
    <Footer/>
    </div>
  );
};

export default UpdateSingleTeamAdmin;