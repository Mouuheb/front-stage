import React, { useState, useEffect } from 'react'
import './work.css'
import { TiPlus, TiMinus } from "react-icons/ti";
import data from '../../data/data'
import { Link, useNavigate } from 'react-router-dom';
import MapWithLeaflet from '../map/MapWithLeaflet';
import MapwithLeafletMulti from '../map/MapwithLeafletMulti';


const Work = (show) => {
    var [aff, setShow] = useState(show.show)
    const [project, setProject] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [projects, setProjects] = useState([]);

    // console.log()




    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/');
        // or with state
        navigate('/prj', { state: { from: 'home' } });
    };

    useEffect(() => {
        fetch('http://localhost:8000/api/projects/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setProject(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, []);
    console.log(project);

    // Convert each project's location string to {lat, lng}
    const locations = projects
        .map(project => {
        if (!project.location) return null;
        const [lat, lng] = project.location.split(',').map(Number);
        // Validate
        if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            return null;
        }
        return { lat, lng };
        })
        .filter(loc => loc !== null);



    return (
        loading === false ? (<div className='work'>
            <div className='header' >
                <div className='title' >
                    <h1>{data.work.title}</h1>
                </div>
                <p>{data.work.p}</p>
            </div>
            <div className='split-page' >
                <div className='map-cnt'>
                    <MapwithLeafletMulti projects={project}/>

                </div>
                <div className='project-list' >

                    <div className='element'>
                        {project.slice(0, 3).map((item) => {
                            { console.log(project.length) }
                            return (
                                <div className='card'>
                                    
                                    <div className='txt-cmp'>
                                        <h5>{item.name}</h5>
                                        <small>
                                            Projet de {item.type}

                                        </small>
                                        <small>
                                            en {item.address}

                                        </small>
                                        {console.log("id : " + item.id)}
                                        <div className='btn-cnt'>
                                        <Link to={`/sgprj/${item.id}`} className='click-btn'>
                                            {/* '/sgprj/1' */}
                                            <a>Voir Details</a>
                                        </Link>
                                        </div>
                                    </div>
                                    <div className='img-cmp'>
                                        <img src={item.project_image} />
                                    </div>

                                    


                                </div>)
                        })}

                    </div>
                </div>
            </div>

            {aff === true && <div className='footer-work'>
                <button className='btn click-btn' onClick={handleClick}>{data.work.footerBtn}</button>
            </div>}
        </div>) : (<div>loading</div>)
    )
}

export default Work




// -----------------------------------------------------------


