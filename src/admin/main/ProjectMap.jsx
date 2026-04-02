import React, { useState, useEffect } from 'react'
import { TiPlus, TiMinus } from "react-icons/ti";
import data from '../../data/data'
import { Link, useNavigate } from 'react-router-dom';
import MapwithLeafletMulti from '../../pages/map/MapwithLeafletMulti';
import './mapAdmin.css'


const ProjectMap = () => {
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
            <div className='map-admin-page'>
                    <div className='map-cnt'>
                        <MapwithLeafletMulti projects={project} />
                    </div>
            </div>
        ) : (
            <div>loading...</div>
        )
    );
}

export default ProjectMap;

