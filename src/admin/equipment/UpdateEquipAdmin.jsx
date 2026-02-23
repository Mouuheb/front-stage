import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../admin.css'
import './equ.css'
const UpdateEquipAdmin = () => {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [currentImage, setCurrentImage] = useState(null);

  const EQUIP_API = 'http://localhost:8000/api/equipment/';
  const PROJECT_API = 'http://localhost:8000/api/projects/';
  const MEMBER_API = 'http://localhost:8000/api/members/';

  // Fetch equipment, projects, members
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [equipRes, projectRes, memberRes] = await Promise.all([
          fetch(`${EQUIP_API}${id}/`),
          fetch(PROJECT_API),
          fetch(MEMBER_API),
        ]);

        const equipData = await equipRes.json();
        const projectData = await projectRes.json();
        const memberData = await memberRes.json();

        setFormData({
          name: equipData.name || '',
          number: equipData.number || '',
          status: equipData.status || '',
          description: equipData.description || '',
          purchase_date: equipData.purchase_date || '',
          purchase_price: equipData.purchase_price || '',
          project: equipData.project || '',
          assigned_to: equipData.assigned_to || '',
          image: null,
        });

        setCurrentImage(equipData.image);
        setProjects(projectData);
        setMembers(memberData);
        setLoading(false);
      } catch (err) {
        setMessage(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
      const res = await fetch(`${EQUIP_API}${id}/update/`, {
        method: 'PUT', // or PATCH
        body: data,
      });

      if (!res.ok) throw new Error('Failed to update equipment');

      setMessage('Equipment updated successfully ✅');
      setTimeout(() => navigate('/admin/equipment'), 1000);
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className='update-eq-admin'>
      <h2>Update Equipment</h2>
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
          <select name="project" value={formData.project || ''} onChange={handleChange}>
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className='row'>
          <label>Assign To:</label><br />
          <select name="assigned_to" value={formData.assigned_to || ''} onChange={handleChange}>
            <option value="">Select Member</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Current image */}
        {currentImage && (
          <p>
            Current Image: <a href={currentImage} target="_blank" rel="noreferrer">View</a>
          </p>
        )}

        <div className='row'>
          <label>Replace Image:</label><br />
          <input type="file" name="image" onChange={handleChange} />
        </div>

        <br />
        <button className='click-btn' type="submit" >Update Equipment</button>
      </form>
    </div>
  );
};

export default UpdateEquipAdmin;