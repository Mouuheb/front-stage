import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.css';
import data from '../data/data';
import ConversationList from '../Messages/Conversation';
import { fetchWithAuth } from './api';  // adjust path
import Nav from '../pages/nav/Nav';

const API_BASE_URL = 'http://localhost:8000/auth';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetchWithAuth(`${API_BASE_URL}/users/me/`);

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        // Token refresh failed or other error – redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/clt/login');
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading profile...</div>;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>
        Error: {error}
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
    <Nav/>
    <div className='box-margin'></div>
    
    <div className='profile-main-cnt main-cnt-div'>
      <div className='p1'>
        <div className='profile-cnt'>
          <h1>{data.auth.welcome} {user.username}</h1>
          <div className='data'>
            <p><strong>{data.auth.username} : </strong> {user.username}</p>
            <p><strong>{data.auth.email} : </strong> {user.email}</p>
            <p><strong>{data.auth.fname} : </strong> {user.first_name || '—'}</p>
            <p><strong>{data.auth.lname} : </strong> {user.last_name || '—'}</p>
            <p><strong>{data.auth.tel} : </strong> {user.phone_number || '—'}</p>
          </div>
          <button className='click-btn2' onClick={handleLogout}>
            {data.auth.logout}
          </button>
        </div>
      </div>
      <div className='p2'>
        <ConversationList />
      </div>
    </div>
    </>
  );
};

export default Profile;