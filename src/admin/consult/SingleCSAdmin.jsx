import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../admin.css'
import data from '../data/data';
import NavAdmin from '../nav/NavAdmin';
import Footer from '../../pages/footer/FooterAdmin';

const SingleCSAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [consultation, setConsultation] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const CONSULT_API = 'http://localhost:8000/api/consultations/';
  const PROJECT_API = 'http://localhost:8000/api/projects/';

  // ✅ Fetch consultation + projects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const consultRes = await fetch(`${CONSULT_API}${id}/`);
        if (!consultRes.ok) throw new Error('Failed to fetch consultation');
        const consultData = await consultRes.json();

        const projectRes = await fetch(PROJECT_API);
        const projectData = await projectRes.json();

        setConsultation(consultData);
        setProjects(projectData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ✅ Get project name
  const getProjectName = (projectId) => {
    if (!projectId) return 'No Project Assigned';
    const project = projects.find((p) => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  // ✅ Delete consultation
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this consultation?')) {
      return;
    }

    try {
      const response = await fetch(`${CONSULT_API}${id}/delete/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete consultation');
      }

      alert('Consultation deleted successfully ✅');
      navigate('/admin/consultations'); // change to your list route
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!consultation) return <p>No data found</p>;

  return (
    <div className='admin-main-bg'>
                          <NavAdmin/>
                          <div className='box-margin ' ></div>
    <div className='single-consultation-admin admin-main-div'>
      <h2>{data.consult.sngl}</h2>
      <div className='cnt' >
      <p><strong>{data.consult.name} :</strong> {consultation.nom}</p>
      <p><strong>{data.consult.sjt} :</strong> {consultation.sujet}</p>
      <p><strong>{data.consult.date} :</strong> {consultation.date || 'N/A'}</p>
      <p><strong>{data.consult.date} :</strong> {consultation.phone_number || 'N/A'}</p>
      <p><strong>{data.consult.eml} :</strong> {consultation.email || 'N/A'}</p>
      <p><strong>{data.consult.note} :</strong> {consultation.notes || 'N/A'}</p>
      <p><strong>{data.consult.prj} :</strong> {getProjectName(consultation.project)}</p>

      {consultation.document && (
        <p>
          <a href={consultation.document} target="_blank" rel="noreferrer" className='lik'>
            View Document
          </a>
        </p>
      )}

      <br />
      <div className='btns-cnt' >

      <div
      className='btn-cnt'
        onClick={handleDelete}
      >
        <label className='main-btn click-btn2'>{data.consult.btnDelete}</label>
        
      </div>

      <div className='btn-cnt'>
      <Link to={`/admin/upsgcs/${id}`}>
      <label className='main-btn click-btn2'>
      {data.consult.btnUpdate}
      </label>
      </Link>
      </div>
      </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default SingleCSAdmin;