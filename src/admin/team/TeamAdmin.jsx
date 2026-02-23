import React, { useState, useEffect } from 'react'
import './team.css'
import data from '../data/data'
import { FaLinkedinIn } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import '../admin.css';

const TeamAdmin = () => {
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
    loading === false ? (<div className='team'>
      <div className='header' >
        <div className='title' >
          <h2>{data.team.title}</h2>
        </div>
        <p>{data.team.p}</p>
      </div>
      <div className='btn-cnt click-btn'>
        <Link to="/admin/crttm/">
        <label className=''>{data.team.btn}</label>
      
        </Link>

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
                  {/* <p>Phone :{item.phone_number}</p> */}
                  {/* <p>Email :{item.email}</p> */}
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
                <div className='admin-btn click-btn2'>
                  <Link to={`/admin/sgtm/${item.id}`}><label>{data.team.btn2}</label></Link>
                </div>
              </div>

            </div>
            // </Link>
          )
        })}

      </div>
      <div className='btn-componment'>
        {/* {data.team.btn.vzbl && <button className='btn click-btn' onClick={handleClick} href={data.team.btn.path} >
          {data.team.btn.txt}
        </button>} */}
      </div>
    </div>) : (<div>loading</div>)
  )
}

export default TeamAdmin

// --------------------------------------------------------------------------------------


function UserList() {




  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}