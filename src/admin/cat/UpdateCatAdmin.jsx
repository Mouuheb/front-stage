import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../admin.css'
import './cat.css'

const UpdateCatAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3498db',
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const API_URL = 'http://localhost:8000/api/categories/'; // change if needed

  // ✅ Fetch existing category
  useEffect(() => {
    fetch(`${API_URL}${id}/`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch category');
        }
        return res.json();
      })
      .then((data) => {
        setFormData({
          name: data.name,
          description: data.description,
          color: data.color,
        });
        setLoading(false);
      })
      .catch((err) => {
        setMessage(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Update category
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch(`${API_URL}${id}/update/`, {
        method: 'PUT', // or PATCH if you prefer
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update category');
      }

      setMessage('Category updated successfully ✅');

      // Optional redirect after update
      setTimeout(() => {
        navigate('/admin/categories');
      }, 1000);

    } catch (error) {
      setMessage(error.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className='update-cat-admin'>
      <h2>Update Category</h2>

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

        <button type="submit" className='click-btn'>
          Update Category
        </button>
      </form>
    </div>
  );
};

export default UpdateCatAdmin;