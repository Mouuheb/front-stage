import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../admin.css'
import './consul.css'
import data from '../data/data';
import NavAdmin from '../nav/NavAdmin';
import Footer from '../../pages/footer/FooterAdmin';

const Consult = () => {
  const [consultations, setConsultations] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const CONSULT_API = 'http://localhost:8000/api/consultations/';
  const PROJECT_API = 'http://localhost:8000/api/projects/';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [consultRes, projectRes] = await Promise.all([
          fetch(CONSULT_API),
          fetch(PROJECT_API),
        ]);

        const consultData = await consultRes.json();
        const projectData = await projectRes.json();

        setConsultations(consultData);
        setProjects(projectData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to get project name by ID
  const getProjectName = (projectId) => {
    if (!projectId) return 'No Project Assigned';

    const project = projects.find((p) => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className='admin-main-bg'>
                      <NavAdmin/>
                      <div className='box-margin ' ></div>
    <div className='admin-cnsultation admin-main-div' >
      <h2>{data.consult.title} :</h2>
      <div className='btn-cnt' >
        <Link to="/admin/crtcs/" >
        <label className='click-btn2 main-btn'>create consultaion</label>
      
      </Link>

      </div>
      

      {consultations.map((consult) => (
        
        <div key={consult.id} className='card'>
          <h3>{consult.nom}</h3>
          <p><strong>{data.consult.sjt} :</strong> {consult.sujet}</p>
          <p><strong>{data.consult.ph} :</strong> {consult.phone_number || 'N/A'}</p>
          <p><strong>{data.consult.eml} :</strong> {consult.email || 'N/A'}</p>
          <p><strong>{data.consult.prj} :</strong> {getProjectName(consult.project)}</p>

          {consult.document && (
            <p>
              <a href={consult.document} className='lik' target="_blank" rel="noreferrer">
                View Document
              </a>
            </p>

          )}
          <div className='btn-cnt'>
            <Link to={`/admin/sgcs/${consult.id}`}>
          <label className='click-btn2 main-btn'>{data.consult.btn}</label>
          </Link></div>
        </div>
        // 
      ))}
    </div>
    <Footer/>
    </div>
  );
};

export default Consult;