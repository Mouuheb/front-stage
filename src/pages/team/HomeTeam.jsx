import React, { useState, useEffect } from 'react'
import './team.css'
import data from '../../data/data'
import { FaLinkedinIn } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

const HomeTeam = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
    // or with state
    navigate('/tm', { state: { from: 'home' } });
  };
  useEffect(() => {
    fetch('http://localhost:8000/api/members/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setTeam(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);
  // console.log("eee")
  // console.log(team)
  return (
    loading === false ? (<div className='team main-cnt-div'>
      <div className='header' >
        <div className='title' >
          <h1>{data.team.title}</h1>
        </div>
        <p>{data.team.p}</p>
      </div>

      <div className='element' >
        {team.map((item, index) => {
          return (
            <div className='card' key={item.id} >
              <div className='p1' >
                <div className='img-containner' >
                  <img src={item.profile_image} />
                </div>

                <div className='txt-content' >
                  <h2>{item.name}</h2>
                  <p>{item.role_display}</p>
                </div>
                <div className='sosial' key={index} >
                  <a href={item.linkedin_url}>

                    <FaLinkedinIn />
                  </a>
                </div>

              </div>
              <hr />
              <div className='p2' >
                <p>{item.description}</p>
              </div>

            </div>
          )
        })}

      </div>
      <div className='btn-componment'>
        {data.team.btn.vzbl && <button className='btn click-btn2 main-btn' onClick={handleClick} href={data.team.btn.path} >
          {data.team.btn.txt}
        </button>}
      </div>
    </div>) : (<div>loading</div>)
  )
}

export default HomeTeam
