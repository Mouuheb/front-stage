import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.css'
import data from '../data/data';
import ConversationList from '../Messages/Conversation';

const API_BASE_URL = 'http://localhost:8000/auth'; // Djoser endpoints

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/users/me/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token invalid/expired – try to refresh or redirect to login
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            navigate('/login');
          }
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
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
    navigate('/login');
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
    return null; // should not happen, but just in case
  }

  return (
    <div className='profile-main-cnt' >
      <div className='p1' >
        <div className='profile-cnt'>
          <h2>{data.auth.title3}</h2>
          <div>
            <p><strong>{data.auth.username}</strong> {user.username}</p>
            <p><strong>{data.auth.email}</strong> {user.email}</p>
            <p><strong>{data.auth.fname}</strong> {user.first_name || '—'}</p>
            <p><strong>{data.auth.lname}</strong> {user.last_name || '—'}</p>
            <p><strong>{data.auth.tel}</strong> {user.phone_number || '—'}</p>
          </div>
          <button
          className='click-btn'
            onClick={handleLogout}
            
          >
            {data.auth.logout}
          </button>
        </div>
      </div>
      <div className='p2' >
        <ConversationList/>

      </div>
    </div>

  );
};

export default Profile;