import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import './auth.css'
import data from '../data/data';
import DroneCanvas from '../3d/Drone';

const csrftoken = Cookies.get('csrftoken');
const API_BASE_URL = 'http://localhost:8000/api/auth'; // adjust to your backend

const CreateAcc = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    phone_number: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic client-side validation
    if (formData.password !== formData.password2) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Remove password2 before sending to backend
      const { password2, ...dataToSend } = formData;

      const response = await fetch(`${API_BASE_URL}/users/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
    //   'X-CSRFToken': csrftoken

      const responseData = await response.json();

      if (!response.ok) {
        // Handle field errors (e.g., username already exists)
        if (responseData.username) {
          throw new Error(responseData.username[0]);
        } else if (responseData.email) {
          throw new Error(responseData.email[0]);
        } else if (responseData.password) {
          throw new Error(responseData.password[0]);
        } else if (responseData.non_field_errors) {
          throw new Error(responseData.non_field_errors[0]);
        } else {
          throw new Error('Registration failed. Please try again.');
        }
      }

      // Registration successful – redirect to login
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='main-auth-cnt'>
    <div className='login-page'>
      <h2>{data.auth.title2}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder={data.auth.username}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
        
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={data.auth.email}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
        
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            placeholder={data.auth.fname}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            placeholder={data.auth.lname}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            placeholder={data.auth.tel}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            placeholder={data.auth.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          
          <input
            type="password"
            id="password2"
            name="password2"
            value={formData.password2}
            onChange={handleChange}
            placeholder={data.auth.cpwd}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <button type="submit" className='click-btn' disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/clt/login">Login</Link>
      </p>
    </div>
    <div className='model-cnt' >
      <div className='obj'><DroneCanvas/></div>
        
    </div>
    </div>
  );
};

export default CreateAcc;