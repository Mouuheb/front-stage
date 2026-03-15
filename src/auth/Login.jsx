import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './auth.css'
import data from '../data/data';
import DroneCanvas from '../3d/Drone';


const API_BASE_URL = 'http://localhost:8000/auth'; // adjust as needed

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Obtain JWT tokens from Djoser
      const tokenResponse = await fetch(`${API_BASE_URL}/jwt/create/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        // Djoser returns non_field_errors for invalid credentials
        const message = errorData.non_field_errors?.[0] || 'Login failed';
        throw new Error(message);
      }

      const { access, refresh } = await tokenResponse.json();

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      console.log(access)
      // 2. Fetch current user from Djoser's /users/me/
      const userResponse = await fetch(`${API_BASE_URL}/users/me/`, {
        headers: { Authorization: `Bearer ${access}` },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        console.warn('Could not fetch user data');
      }

      // 3. Redirect to dashboard (or any protected route)
      navigate('/authset');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='main-auth-cnt'>
      <div className='black-p2' >
        
    <div className='login-page'>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h1>{data.auth.titleLogin}</h1>
      <form onSubmit={handleSubmit}>
        <div className='cnt'>
          <input
            type="text"
            id="username"
            value={username}
            placeholder={data.auth.username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div className='cnt'>
          <input
            type="password"
            id="password"
            value={password}
            placeholder={data.auth.password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div >
            <Link to="/clt/cracc" ><label>{data.auth.create}</label></Link> 
            <label>  </label>
            <Link to="/clt/frgpwd" ><label>{data.auth.forgetpass}</label></Link>
        </div>
        <button className='click-btn' type="submit" disabled={loading} >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        
      </form>
    </div>
    </div>
    <div className='model-cnt' >
        <div className='obj'><DroneCanvas/></div>
    </div>
    </div>
  );
};

export default Login;