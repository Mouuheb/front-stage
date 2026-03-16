import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../admin.css'
import './team.css'
import data from '../data/data';
import NavAdmin from '../nav/NavAdmin';

const SingleTemAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:8000/api/members/'; // change if needed

  // ✅ Get Single Member
  useEffect(() => {
    fetch(`${API_URL}${id}/`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch member');
        }
        return res.json();
      })
      .then((data) => {
        setMember(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // ✅ Delete Member
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this member?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}${id}/delete/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete member');
      }

      alert('Member deleted successfully ✅');
      navigate('/admin/team'); // change to your team list route
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className='admin-main-bg'>
                  <NavAdmin/>
                  <div className='box-margin ' ></div>
    <div className='single-team-admin admin-main-div'>
      <div className='p1'>
      
      <div className='img-cnt' >
        <img
        src={member.profile_image}
        alt={member.name}
        width="150"
        style={{ borderRadius: '10px' }}
      />
      </div>
      </div> 
      
      <div className='p2' >
      <h3>{member.name}</h3>
      <p><strong>Role:</strong> {member.role_display}</p>
      <p><strong>Email:</strong> {member.email}</p>
      <p><strong>Phone:</strong> {member.phone_number}</p>
      <p>
        <strong>LinkedIn:</strong>{' '}
        <a href={member.linkedin_url} target="_blank" rel="noreferrer">
          View Profile
        </a>
      </p>
      <br/>
      <p>{member.description}</p>

      <br />

      <div className='btns-cnt'>
        <div className='btn-cnt' onClick={handleDelete}>
        <label className='main-btn click-btn2'
        
        
      >
        {data.team.btnDelete}
      </label>
      </div>
      <div className='btn-cnt'>
        <Link to={`/admin/upsgtm/${id}`}>
        <label className='main-btn click-btn2'>{data.team.btnUpdate}</label>
        
        </Link>
      </div>

      </div>
      
      </div>
    </div>
    </div>
  );
};

export default SingleTemAdmin;