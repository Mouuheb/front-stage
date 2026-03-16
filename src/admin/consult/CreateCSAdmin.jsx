import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../admin.css'
import NavAdmin from '../nav/NavAdmin';

const CreateCSAdmin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: '',
    sujet: '',
    date: '',
    phone_number: '',
    email: '',
    notes: '',
    project: '',
    document: null,
  });

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const CONSULT_API = 'http://localhost:8000/api/consultations/create/';
  const PROJECT_API = 'http://localhost:8000/api/projects/';

  // ✅ Fetch projects for dropdown
  useEffect(() => {
    fetch(PROJECT_API)
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching projects:', err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'document') {
      setFormData({ ...formData, document: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch(CONSULT_API, {
        method: 'POST',
        body: data,
      });

      if (!response.ok) throw new Error('Failed to create consultation');

      setMessage('Consultation created successfully ✅');

      setTimeout(() => navigate('/admin/consultations'), 1000);

    } catch (err) {
      setMessage(err.message);
    }
  };

  if (loading) return <p>Loading projects...</p>;

  return (
    <div className='admin-main-bg'>
                          <NavAdmin/>
                          <div className='box-margin ' ></div>
    <div className='create-consult-admin admin-main-div'>
      <h2>Create Consultation</h2>
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className='row'>
          <label>Name:</label><br />
          <input type="text" name="nom" value={formData.nom} onChange={handleChange} required />
        </div>

        <div className='row'>
          <label>Sujet:</label><br />
          <input type="text" name="sujet" value={formData.sujet} onChange={handleChange} required />
        </div>

        <div className='row'>
          <label>Date:</label><br />
          <input type="date" name="date" value={formData.date} onChange={handleChange} />
        </div>

        <div className='row'>
          <label>Phone:</label><br />
          <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} />
        </div>

        <div className='row'>
          <label>Email:</label><br />
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>

        <div className='row'>
          <label>Notes:</label><br />
          <textarea name="notes" value={formData.notes} onChange={handleChange} />
        </div>

        <div className='row'>
          <label>Project:</label><br />
          <select name="project" value={formData.project} onChange={handleChange}>
            <option value="">Select Project</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className='row'>
          <label>Document:</label><br />
          <input type="file" name="document" onChange={handleChange} />
        </div>

        <br />
        <button type="submit" className='click-btn2 main-btn'>Create Consultation</button>
      </form>
    </div>
    </div>
  );
};

export default CreateCSAdmin;