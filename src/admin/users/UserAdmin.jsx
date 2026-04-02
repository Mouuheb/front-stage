import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../admin.css'
import './user.css'
import data from '../data/data';
import NavAdmin from '../nav/NavAdmin';
import Footer from '../../pages/footer/FooterAdmin';

const UserAdmin = () => {
  const [Users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const API_URL = 'http://localhost:8000/api/auth/users/';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/clt/login');
        return;
      }

      try {
        const res = await fetch(API_URL,
          {headers: {
    Authorization: `Bearer ${token}`,}
  },);
        
        if (!res.ok) {
          if (response.status === 401) {
            localStorage.removeItem('access_token');
            navigate('/clt/login');
          }
          throw new Error('Failed to fetch Users');
        }


        const data = await res.json();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  if (loading) return <p>Loading Users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className='admin-main-bg'>
      <NavAdmin />
      <div className='box-margin ' ></div>
      <div className='users-admin admin-main-div'>
        <h2>{data.user.title}</h2>
        <div className='btn-cnt'>
          <Link to="/admin/cruser/" >
            <label className='click-btn2 main-btn'>
              {data.user.btn}
            </label>
          </Link>
        </div>
        {Users.length === 0 ? (
          <p>{data.user.noEq}</p>
        ) : (
          <div className=''>
            {Users.map((item) => (
              <div key={item.id} className='card'>
                <p>{data.user.fname} : {item.full_name}</p>
                <p>{data.user.uname} : {item.username}</p>
                <p>{data.user.email} : {item.email}</p>
                <p>{data.user.phone} : {item.phone_number}</p>
                <p>{data.user.role} : {item.role}</p>
                {/* <p>d : {item.password}</p> */}
                
                {/* <p>{item.status_display}</p> */}
                <div className='btn-cnt'>
                  <Link to={`/admin/user/${item.id}`} >
                    <label className='click-btn2 main-btn'>{data.eq.details}</label>
                  </Link>
                </div>
              </div>
            ))}
          </div>


        )}

      </div>
      <Footer/>
    </div>
  );
};

export default UserAdmin;