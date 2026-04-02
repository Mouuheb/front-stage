import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../admin.css'
import './consult.css'
import NavAdmin from '../nav/NavAdmin';
import Footer from '../../pages/footer/FooterAdmin';

const UpdateCsAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: '',
    date: '',
    sujet: '',
    phone_number: '',
    email: '',
    notes: '',
    project: '',
    document: null,
  });

  const [projects, setProjects] = useState([]);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const CONSULT_API = 'http://localhost:8000/api/consultations/';
  const PROJECT_API = 'http://localhost:8000/api/projects/';

  // ✅ Fetch consultation + projects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [consultRes, projectRes] = await Promise.all([
          fetch(`${CONSULT_API}${id}/`),
          fetch(PROJECT_API),
        ]);

        if (!consultRes.ok) throw new Error('Failed to fetch consultation');
        const consultData = await consultRes.json();

        const projectData = await projectRes.json();

        setFormData({
          nom: consultData.nom || '',
          date: consultData.date || '',
          sujet: consultData.sujet || '',
          phone_number: consultData.phone_number || '',
          email: consultData.email || '',
          notes: consultData.notes || '',
          project: consultData.project || '',
          document: null,
        });

        setProjects(projectData);
        setCurrentDocument(consultData.document);
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
      if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch(`${CONSULT_API}${id}/update/`, {
        method: 'PUT', // or PATCH
        body: data,
      });

      if (!response.ok) throw new Error('Failed to update consultation');

      setMessage('Consultation updated successfully ✅');
      setTimeout(() => navigate('/admin/consultations'), 1000);

    } catch (err) {
      setMessage(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className='admin-main-bg'>
                              <NavAdmin/>
                              <div className='box-margin' ></div>
    <div className='update-const-admin admin-main-div'>
      <h2>Update Consultation</h2>
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className='row' >
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

        {/* Project select */}
        <div className='row'>
          <label>Project:</label><br />
          <select name="project" value={formData.project || ''} onChange={handleChange}>
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Current document */}
        {currentDocument && (
          <p>
            Current Document: <a href={currentDocument} target="_blank" rel="noreferrer">View</a>
          </p>
        )}

        <div className='row'>
          <label>Replace Document:</label><br />
          <input type="file" name="document" onChange={handleChange} />
        </div>

        <br />
        <button type="submit" className='click-btn2 main-btn' >Update Consultation</button>
      </form>
    </div>
    <Footer/>
    </div>
  );
};

export default UpdateCsAdmin;