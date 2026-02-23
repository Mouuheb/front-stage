import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../admin.css'
import './equ.css'

const CreateEquipAdmin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    number: '',
    status: '',
    description: '',
    purchase_date: '',
    purchase_price: '',
    project: '',
    assigned_to: '',
    image: null,
  });

  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const EQUIP_API = 'http://localhost:8000/api/equipment/create/';
  const PROJECT_API = 'http://localhost:8000/api/projects/';
  const MEMBER_API = 'http://localhost:8000/api/members/';

  // Fetch projects and team members for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes, memberRes] = await Promise.all([
          fetch(PROJECT_API),
          fetch(MEMBER_API),
        ]);
        const projectData = await projectRes.json();
        const memberData = await memberRes.json();
        setProjects(projectData);
        setMembers(memberData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching projects or members:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== '') {
        data.append(key, formData[key]);
      }
    });

    try {
      const res = await fetch(EQUIP_API, {
        method: 'POST',
        body: data,
      });

      if (!res.ok) throw new Error('Failed to create equipment');

      setMessage('Equipment created successfully ✅');
      setTimeout(() => navigate('/admin/equipment'), 1000);
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (loading) return <p>Loading projects and members...</p>;

  return (
    <div className='create-equ-admin' >
      <h2>Create Equipment</h2>
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className='row'>
          <label>Name:</label><br />
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className='row'>
          <label>Number:</label><br />
          <input type="text" name="number" value={formData.number} onChange={handleChange} required />
        </div>

        <div className='row'>
          <label>Status:</label><br />
          <select name="status" value={formData.status} onChange={handleChange} required>
            <option value="">Select Status</option>
            <option value="available">Available</option>
            <option value="not_available">Not Available</option>
          </select>
        </div>

        <div className='row'>
          <label>Description:</label><br />
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </div>

        <div className='row'>
          <label>Purchase Date:</label><br />
          <input type="date" name="purchase_date" value={formData.purchase_date} onChange={handleChange} />
        </div>

        <div className='row'>
          <label>Purchase Price:</label><br />
          <input type="number" step="0.01" name="purchase_price" value={formData.purchase_price} onChange={handleChange} />
        </div>

        <div className='row'>
          <label>Project:</label><br />
          <select name="project" value={formData.project} onChange={handleChange}>
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className='row'>
          <label>Assign To:</label><br />
          <select name="assigned_to" value={formData.assigned_to} onChange={handleChange}>
            <option value="">Select Member</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        <div className='row'>
          <label>Image:</label><br />
          <input type="file" name="image" onChange={handleChange} />
        </div>

        <br />
        <button type="submit" className='click-btn'>Create Equipment</button>
      </form>
    </div>
  );
};

export default CreateEquipAdmin;