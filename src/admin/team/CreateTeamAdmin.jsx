import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../admin.css'
import NavAdmin from '../nav/NavAdmin';

const CreateTeamAdmin = () => {
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

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const API_URL = 'http://localhost:8000/api/members/create/';

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'profile_image') {
      setFormData({ ...formData, profile_image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        throw new Error('Failed to create team member');
      }

      setMessage('Team member created successfully ✅');

      setTimeout(() => {
        navigate('/admin/tm');
      }, 1000);

    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='admin-main-bg'>
                      <NavAdmin/>
                      <div className='box-margin ' ></div>
    <div className='team-create admin-main-div'>
      <h2>Create Team Member</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">

        <div className='row' >
          <label>Name:</label><br />
          <input type="text" name="name" onChange={handleChange} required />
        </div>

        {/* ✅ ROLE SELECT */}
        <div className='row'>
          <label>Role:</label><br />
          <select name="role" value={formData.role} onChange={handleChange} required>
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
          <input type="text" name="phone_number" onChange={handleChange} required />
        </div>

        <div className='row'>
          <label>Email:</label><br />
          <input type="email" name="email" onChange={handleChange} required />
        </div>

        <div className='row'> 
          <label>LinkedIn URL:</label><br />
          <input type="url" name="linkedin_url" onChange={handleChange} />
        </div>

        <div className='row'>
          <label>Description:</label><br />
          <textarea name="description" onChange={handleChange} required />
        </div>

        <div className='row'>
          <label>Profile Image:</label><br />
          <input type="file" name="profile_image" accept="image/*" onChange={handleChange} />
        </div>

        <br />

        <button type="submit" disabled={loading} className='click-btn2 main-btn'>
          {loading ? 'Creating...' : 'Create Member'}
        </button>

      </form>
    </div>
    </div>
  );
};

export default CreateTeamAdmin;