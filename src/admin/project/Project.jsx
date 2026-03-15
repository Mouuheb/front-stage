import React, { useState, useEffect } from 'react'
import { TiPlus, TiMinus } from "react-icons/ti";
import data from '../../data/data';
import { Link, useNavigate } from 'react-router-dom';
import MapWithLeaflet from '../../pages/map/MapWithLeaflet';
import MapwithLeafletMulti from '../../pages/map/MapwithLeafletMulti';
import './project.css'
import '../admin.css'
import NavAdmin from '../nav/NavAdmin';

const Project = ({ page }) => {
    const [project, setProject] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');   // new state for search input

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/');
        // or with state
        navigate('/prj', { state: { from: 'home' } });
    };

    // Fetch projects (optionally with search term)
    const fetchProjects = (search = '') => {
        setLoading(true);
        let url = 'http://localhost:8000/api/projects/';
        if (search.trim() !== '') {
            url += `?search=${encodeURIComponent(search)}`;
        }
        fetch(url)
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
    };

    // Initial fetch on mount
    useEffect(() => {
        fetchProjects();
    }, []);


    // Handle search button click
    const handleSearch = () => {
        fetchProjects(searchTerm);
    };

    // Handle Enter key in input
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

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
        loading === false ? (
            <div className='admin-main-bg'>
                <NavAdmin />
                <div className='box-margin'></div>
                <div className='admin-project admin-main-div'>

                    <div className='btn-cnt'>
                        <Link to="/admin/crtprj/" className='click-btvn'>
                            <label className="click-btn2 main-btn">Create project</label>

                        </Link>
                    </div>

                    <div className='search-cnt'>
                        <div className='search'>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder={data.work.placeholder}
                            />
                            <button onClick={handleSearch}>{data.work.searchBtn}</button>
                        </div>
                    </div>

                    <div className='split-page' >
                        <div className='map-cnt'>
                            <MapwithLeafletMulti projects={project} />

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
                                                    <Link to={`/admin/sgprj/${item.id}`} >
                                                        <a className='main-btn click-btn2'>Voir Details</a>
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
                </div>
            </div>

        ) : (<div>loading</div>)
    )
}

export default Project