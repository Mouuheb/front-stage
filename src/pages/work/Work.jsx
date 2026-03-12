import React, { useState, useEffect } from 'react'
import './work.css'
import { TiPlus, TiMinus } from "react-icons/ti";
import data from '../../data/data'
import { Link, useNavigate } from 'react-router-dom';
import MapWithLeaflet from '../map/MapWithLeaflet';
import MapwithLeafletMulti from '../map/MapwithLeafletMulti';

const Work = () => {
    const [project, setProject] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');   // new state for search input

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/');
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

    // Prepare locations for the map (fixed from 'projects' to 'project')
    const locations = project
        .map(project => {
            if (!project.location) return null;
            const [lat, lng] = project.location.split(',').map(Number);
            if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                return null;
            }
            return { lat, lng };
        })
        .filter(loc => loc !== null);

    return (
        loading === false ? (
            <div className='work main-cnt-div'>
                <div className='header'>
                    <div className='title'>
                        <h1>{data.work.title}</h1>
                    </div>
                    <p>{data.work.p}</p>
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
                <div className='split-page'>
                    <div className='map-cnt'>
                        <MapwithLeafletMulti projects={project} />
                    </div>
                    <div className='project-list'>
                        <div className='element'>
                            {project.slice(0, 3).map((item) => (
                                <div className='card' key={item.id}>
                                    <div className='txt-cmp'>
                                        <h5>{item.name}</h5>
                                        <small>Projet de {item.type}</small>
                                        <small>en {item.address}</small>
                                        <div className='btn-cnt'>
                                            <Link to={`/sgprj/${item.id}`}>
                                                <a className='main-btn click-btn2'>Voir Details</a>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className='img-cmp'>
                                        <img src={item.project_image} alt={item.name} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                
            </div>
        ) : (
            <div>loading...</div>
        )
    );
}

export default Work;

