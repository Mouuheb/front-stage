import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './profile.css';
import data from '../data/data';
import ConversationList from '../Messages/Conversation';
import { fetchWithAuth } from './api';  // adjust path
import Nav from '../pages/nav/Nav';
import NavAdmin from '../admin/nav/NavAdmin';
import Footer from '../pages/footer/Footer';
import UserProjects from './UserProjects';
import { MdEmail } from "react-icons/md";
import { MdLocalPhone } from "react-icons/md";


const API_BASE_URL = 'http://localhost:8000/auth';

const ProfileAdmin = () => {
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
    console.log(user)

    return (
        <>
            {user.role === 'normal' ? (<Nav />) : (<NavAdmin />)}

            <div className='box-margin'></div>

            <div className='profile-main-cnt main-cnt-div'>
                <div className='p1'>
                    <div className='profile-cnt'>
                        <div className='data'>
                            <h1>{data.auth.welcome} {user.username}</h1>
                            <p>
                                <strong><MdEmail />
                                    {/* {data.auth.email} : */}
                                </strong> {user.email}</p>
                            {/* <p><strong>{data.auth.tel} : </strong> {user.phone_number || '—'}</p> */}

                            <p><strong><MdLocalPhone /></strong> {user.phone_number || '—'}</p>

                        </div>
                        <div className=''>
                            {data.profilepageLink.map((link, index) => (
                                <Link to={link.path} key={index} className='links click-btn2'>
                                    <button className='click-btn2' onClick={handleLogout}>
                                        {link.name}
                                    </button>
                                </Link>
                            ))}
                            
                            
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
            <Footer />

        </>
    );
};

export default ProfileAdmin;