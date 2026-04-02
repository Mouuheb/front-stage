import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './deadLine.css'

const TodayDeadline = () => {
  const [data, setData] = useState({
    todays_consultations: [],
    todays_projects: [],
  });

  useEffect(() => {
    fetch('http://localhost:8000/api/deadline/')
      .then(response => response.json())
      .then(result => {
        setData(result);
      })
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div className='today-dead-line-page'>
        <div className='left-part' >
            <h2>Consultations Today</h2>
            <div className='deadline-box-cnt'>
                {data.todays_consultations.map((c, index) => (
                    <Link key={index} to={`/admin/sgcs/${c.id}`}>
                              <label className='click-btn2 main-btn'>{c.nom} - {c.sujet}</label>
                    </Link>
                ))}
                

            </div>
        </div>
        <hr/>
        <div className='right-part' >
            <h2>Projects Deadline Today</h2>
            {data.todays_projects.map((p, index) => (
                <Link key={index} to={`/admin/sgprj/${p.id}`} >
                    <label className='main-btn click-btn2'> {p.name}</label>
                </Link>
         
        ))}

        </div>

    </div>
  );
};

export default TodayDeadline;