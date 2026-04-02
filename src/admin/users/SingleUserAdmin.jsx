import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../admin.css'
import './user.css'
import data from '../data/data';
import NavAdmin from '../nav/NavAdmin';
import Footer from '../../pages/footer/FooterAdmin';

const SingleUserAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // const [users, setusers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const API_URL = 'http://localhost:8000/api/auth/users/';

  const [users, setUsers] = useState([]);

  // Fetch user
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/clt/login');
        return;
      }

      try {
        const res = await fetch(`${API_URL}${id}/`,
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
  }, [navigate,id]);

  // Delete users
  const handleDelete = async () => {
  if (!window.confirm('Are you sure?')) return;

  const token = localStorage.getItem('access_token');

  try {
    const res = await fetch(`${API_URL}${id}/delete/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Failed to delete user');

    alert('Deleted');
    navigate('/admin/users');
  } catch (err) {
    alert(err.message);
  }
};

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!users) return <p>No users found</p>;
  console.log(users)

  return (
    <div className='admin-main-bg'>
      <NavAdmin/>
      <div className='box-margin' ></div>
    <div className='single-users-admin admin-main-div'>
      <p>{data.user.fname} : {users.full_name}</p>
      <p>{data.user.uname} : {users.username}</p>
      <p>{data.user.email} : {users.email}</p>
      <p>{data.user.phone} : {users.phone_number}</p>
      <p>{data.user.role} : {users.role}</p>
      <br />

      <div className='btns-cnt' >

      <div className='btn-cnt'
        onClick={handleDelete}

      >
        <label className='main-btn click-btn2'>{data.user.btnDelete}</label>
      </div>
      <div className='btn-cnt '>
      <Link
        to={`/admin/userup/${id}`}
      >
        <label className='main-btn click-btn2'>{data.user.btnUpdate}</label>
      </Link>
      </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default SingleUserAdmin;