import React, { useState, useEffect } from 'react';
import './singleProject.css';
import { TiPlus, TiMinus } from 'react-icons/ti';
import data from '../data/data';
import { useNavigate, Link } from 'react-router-dom';
import MapWithLeaflet from '../../pages/map/MapWithLeaflet';

const SingleProjectAdmin = (prop) => {
    const [proj, setproject] = useState(prop.id);
    const [project, setProject] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cat, setCat] = useState([]);
    const [model, setModel] = useState([]);

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/');
        // or with state
        navigate('/', { state: { from: 'singleproject' } });
    };

    // DELETE function
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                const response = await fetch(`http://localhost:8000/api/projects/${prop.id}/delete/`, {
                    method: 'DELETE',
                    'Content-Type': 'application/json',
                });
                if (!response.ok) {
                    throw new Error('Delete failed');
                }
                // Navigate to admin projects list (adjust the route as needed)
                navigate('/admin/prj');
            } catch (err) {
                alert('Error deleting project: ' + err.message);
            }
        }
    };

    useEffect(() => {
        fetch(`http://localhost:8000/api/projects/${prop.id}/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setProject(data);
                // setLoading(false);
                for (let i = 0; i < data.categories.length; i++) {
                    fetch(`http://localhost:8000/api/categories/${data.categories[i]}/`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            setCat(data);
                            setLoading(false);
                            console.log(cat);
                        })
                        .catch(error => {
                            setError(error.message);
                            setLoading(false);
                        });
                }

                // filemodel
                if (data.filemodel) {
                    console.log("starrrt")
                    fetch(`http://localhost:8000/folder/files/${data.filemodel[0]}/`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            setModel(data);
                            setLoading(false);
                            console.log(data)
                        })
                        .catch(error => {
                            setError(error.message);
                            setLoading(false);
                        });
                }
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    console.log(project);


    const updateStatus = async (newStatus, id) => {
        try {

            const formData = new FormData();
            formData.append("status", newStatus);
            if (newStatus === "complete") {
                const res = await fetch(
                    `http://localhost:8000/api/projects/cs/cmp/${id}/`,
                    {
                        method: "PATCH",
                        body: formData,
                    }
                );

            } else {
                const res = await fetch(
                    `http://localhost:8000/api/projects/${id}/update/`,
                    {
                        method: "PATCH",
                        body: formData,
                    }
                );

            }

            if (!res.ok) throw new Error("Failed to update");
        } catch (err) {
            console.error(err);
        }
    };





    return (
        loading === false ? (
            <div className='singleproject admin-main-div'>
                <div className='header'>
                    <div className='title'>
                        <h1>Nos Projet</h1>
                    </div>
                    <p>{project.name}</p>
                </div>

                <div className='element'>
                    {console.log(project.length)}
                    <div className='card'>
                        {project.project_image && <div className='img-cmp'>
                            <img src={project.project_image} alt='Project' />
                        </div>}
                        <div className='txt-cmp'>
                            <h1>{project.name}</h1>

                            <div className='txt-a-cmp'>
                                {project.address && <h2>{data.project.adrs} : {project.address}</h2>}
                                {project.state && <h2>{data.project.gvr} : {project.state}</h2>}
                                {project.type && <h2>{data.project.ctgr} : {project.type}</h2>}
                                <h2>{data.project.prc} : {project.price}</h2>
                                <h2>{data.project.stts} : {project.status}</h2>
                            </div>
                            {(project.folder || project.image_a || project.image_b || project.image_c || project.image_d) && (<div className='imgs-cnt'>
                                {project.folder && (
                                    <div className='sng-img'>
                                        <iframe
                                            width='560'
                                            height='315'
                                            src='https://www.youtube.com/embed/jv0YAVI7DbQ'
                                            title='YouTube video player'
                                            frameBorder='0'
                                            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                )}
                                {project.image_a && (
                                    <div className='sng-img'>
                                        <img src={project.image_a} alt='' />
                                    </div>
                                )}
                                {project.image_b && (
                                    <div className='sng-img'>
                                        <img src={project.image_b} alt='' />
                                    </div>
                                )}
                                {project.image_c && (
                                    <div className='sng-img'>
                                        <img src={project.image_c} alt='' />
                                    </div>
                                )}
                                {project.image_d && (
                                    <div className='sng-img'>
                                        <img src={project.image_d} alt='' />
                                    </div>
                                )}
                            </div>)}

                            <div className='txt-b-cmp'>
                                <div className='map-cnt'>
                                    <MapWithLeaflet location={project.location} />
                                </div>
                                <div className='desc-cmp'>
                                    <h2>description :</h2>
                                    <p>{project.description}</p>
                                </div>
                            </div>

                            {project.status === "idea" ? (
                                <>
                                    <div className='btn-cmp'>
                                        <a className='click-btn2 main-btn' onClick={() => updateStatus("not_complete", project.id)}>
                                            refuser
                                        </a>
                                    </div>

                                    {/* Update Button */}
                                    <div className='btn-cmp'>
                                        <Link to={`/admin/upsgprjAcp/${prop.id}`} className='click-btn2 main-btn'>
                                            edit et valider
                                        </Link>
                                    </div>
                                </>


                            ) : project.status == 'valider' ? (
                                <>

                                    {/* Delete Button */}
                                    <div className='btn-cmp'>
                                        <a className='click-btn2 main-btn' onClick={handleDelete}>
                                            Delete
                                        </a>
                                    </div>

                                    {/* Update Button */}
                                    <div className='btn-cmp'>
                                        <Link to={`/admin/upsgprjVld/${prop.id}`} className='click-btn2 main-btn'>
                                            validier
                                        </Link>
                                    </div>
                                </>
                            )
                                : project.status == 'in_process' ? (
                                    <>

                                        {/* Delete Button */}
                                        <div className='btn-cmp'>
                                            <a className='click-btn2 main-btn' onClick={handleDelete}>
                                                Delete
                                            </a>
                                        </div>

                                        {/* Update Button */}
                                        <div className='btn-cmp'>
                                            <Link to={`/admin/upsgprj/${prop.id}`} className='click-btn2 main-btn'>
                                                Update
                                            </Link>
                                        </div>

                                        {/* 3D Model Button */}
                                        <div className='btn-cmp'>
                                            <a
                                                onClick={() => updateStatus("complete", project.id)}
                                                className='click-btn2 main-btn'>Complete</a>
                                        </div>
                                    </>
                                ) : (
                                    <>

                                        {/* Delete Button */}
                                        <div className='btn-cmp'>
                                            <a className='click-btn2 main-btn' onClick={handleDelete}>
                                                Delete
                                            </a>
                                        </div>

                                        {/* Update Button */}
                                        <div className='btn-cmp'>
                                            <Link to={`/admin/upsgprj/${prop.id}`} className='click-btn2 main-btn'>
                                                Update
                                            </Link>
                                        </div>

                                        {/* 3D Model Button */}
                                        <div className='btn-cmp'>
                                            <a
                                                href={`http://localhost:8000/media/${model.file_unzip}`
                                                }
                                                className='click-btn2 main-btn'>Voir model en 3D</a>
                                        </div>
                                    </>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div>loading</div>
        )
    );
};

export default SingleProjectAdmin;