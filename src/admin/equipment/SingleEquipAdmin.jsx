import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../admin.css'
import data from '../data/data';
import NavAdmin from '../nav/NavAdmin';

const SingleEquipAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const EQUIP_API = 'http://localhost:8000/api/equipment/';
  const PROJECT_API = 'http://localhost:8000/api/projects/';
  const MEMBER_API = 'http://localhost:8000/api/members/';

  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);

  // Fetch equipment, projects, and members
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [equipRes, projectRes, memberRes] = await Promise.all([
          fetch(`${EQUIP_API}${id}/`),
          fetch(PROJECT_API),
          fetch(MEMBER_API),
        ]);

        if (!equipRes.ok) throw new Error('Failed to fetch equipment');
        const equipData = await equipRes.json();
        const projectData = await projectRes.json();
        const memberData = await memberRes.json();

        setEquipment(equipData);
        setProjects(projectData);
        setMembers(memberData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Delete equipment
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this equipment?')) return;

    try {
      const res = await fetch(`${EQUIP_API}${id}/delete/`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete equipment');

      alert('Equipment deleted successfully ✅');
      navigate('/admin/equipment');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!equipment) return <p>No equipment found</p>;

  // Find project and member names
  const projectName = projects.find((p) => p.id === equipment.project)?.name || 'N/A';
  const assignedName = members.find((m) => m.id === equipment.assigned_to)?.name || 'N/A';

  return (
    <div className='admin-main-bg'>
      <NavAdmin/>
      <div className='box-margin' ></div>
    <div className='single-equipment-admin admin-main-div'>
      <p><strong>{data.eq.name} :</strong> {equipment.name}</p>
      <p><strong>{data.eq.num} :</strong> {equipment.number}</p>
      <p><strong></strong> {equipment.status_display}</p>
      <p><strong>Description:</strong> {equipment.description || '-'}</p>
      <p><strong>Purchase Date:</strong> {equipment.purchase_date || '-'}</p>
      <p><strong>Purchase Price:</strong> {equipment.purchase_price || '-'}</p>
      <p><strong>Project:</strong> {projectName}</p>
      <p><strong>Assigned To:</strong> {assignedName}</p>

      {equipment.image && (
        <p>
          <strong>Image:</strong>{' '}
          <a href={equipment.image} target="_blank" rel="noreferrer" className='lik'>View Image</a>
        </p>
      )}

      <br />

      <div className='btns-cnt' >

      <div className='btn-cnt'
        onClick={handleDelete}

      >
        <label className='main-btn click-btn2'>{data.eq.btnDelete}</label>
      </div>
      <div className='btn-cnt '>
      <Link
        to={`/admin/upsgeq/${id}`}
      >
        <label className='main-btn click-btn2'>{data.eq.btnUpdate}</label>
      </Link>
      </div>
      </div>
    </div>
    </div>
  );
};

export default SingleEquipAdmin;