import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../admin.css'
import data from '../data/data';

import './cat.css'

const Cat = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:8000/api/categories/'; // change if needed

  // Fetch Categories
  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        return response.json();
      })
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Delete Category
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}${id}/delete/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      // Remove deleted item from state
      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className='category-admin'>
      <h2>{data.cat.name}</h2>

      <div className='btn-cnt'>
        <Link to="/admin/crtcat" className='click-btn'>
          <a>{data.cat.btn}</a>
        </Link>
      </div>

      {categories.map((cat) => (
        <div
          key={cat.id}
          className='card'
        >
          <h3>{cat.name}</h3>
          <p>{cat.description}</p>

          <div

          />
          <div className='btns-cnt'>

          <div className='btn-cnt click-btn'
            onClick={() => handleDelete(cat.id)}
            
          >
            <label>{data.cat.btnDelete}</label>
            
          </div>
          <div className='btn-cnt click-btn '>
            <Link to={`/admin/upsgcat/${cat.id}`} className=''>
              <label className='admin-btn' >{data.cat.btnUpdate}</label>
            </Link>
          </div>
          </div>

          

        </div>
      ))}
    </div>
  );
};

export default Cat;