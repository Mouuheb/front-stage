import React, { useState } from 'react';
import '../admin.css'
import './cat.css'
import NavAdmin from '../nav/NavAdmin';

const CreateCatAdmin = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color:
    //  null
     '#3498db',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const API_URL = 'http://localhost:8000/api/categories/create/'; // change if needed

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create category');
      }

      const data = await response.json();

      setMessage('Category created successfully ✅');
      setFormData({
        name: '',
        description: '',
        color: '#3498db',
      });

    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='admin-main-bg'>
              <NavAdmin/>
              <div className='box-margin' ></div>
    <div className='create-cat-admin admin-main-div'>
      <h2>Create Category</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className='row'>
          <label>Name:</label>
          <br />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className='row'>
          <label>Description:</label>
          <br />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className='row'>
          <label>Color:</label>
          <br />
          <input
            type="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
          />
        </div>

        <br />

        <button type="submit" disabled={loading} className='click-btn2 main-btn' >
          {loading ? 'Creating...' : 'Create Category'}
        </button>
      </form>
    </div>
    </div>
  );
};

export default CreateCatAdmin;