import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../admin.css'
import './equ.css'
import data from '../data/data';
import NavAdmin from '../nav/NavAdmin';

const EquipAdmin = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:8000/api/equipment/';

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Failed to fetch equipment');
        const data = await res.json();
        setEquipment(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  if (loading) return <p>Loading equipment...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className='admin-main-bg'>
                          <NavAdmin/>
                          <div className='box-margin ' ></div>
    <div className='equipment-admin admin-main-div'>
      <h2>{data.eq.title}</h2>
      <div className='btn-cnt'>
        <Link to="/admin/creq/" >
      <label className='click-btn2 main-btn'>
        {data.eq.btn}
        </label>
      </Link>
      </div>
      {equipment.length === 0 ? (
        <p>{data.eq.noEq}</p>
      ) : (
          <div className='card'>
            {equipment.map((item) => (
              <div key={item.id}>
                <p>{data.eq.name} : {item.name}</p>
                <p>{data.eq.num} : {item.number}</p>
                <p>{item.status_display}</p>
                <div className='btn-cnt'>
                <Link to={`/admin/sgeq/${item.id}`} >
                <label className='click-btn2 main-btn'>{data.eq.details}</label>
                </Link>
                </div>
              </div>
            ))}
            </div>


      )}
      
    </div>
    </div>
  );
};

export default EquipAdmin;