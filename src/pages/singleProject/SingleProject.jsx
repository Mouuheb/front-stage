import React, { useState, useEffect } from 'react'
import './singleProject.css'
import { TiPlus, TiMinus } from "react-icons/ti";
import data from '../../data/data'
import { useNavigate } from 'react-router-dom';
import MapWithLeaflet from '../map/MapWithLeaflet';
// import axios from "axios";

const SingleProject = (prop) => {
    // console.log("second id : "+prop.id)
    const [proj, setproject] = useState(prop.id)
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
                            // setLoading(false);
                            // console.log(cat)
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
                else {
                    setError(false)
                    console.log("endddddddddddddddddddddddddddddddddddddddddddddddddd")
                }


            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, []);
    console.log("3333")

    console.log(model);









    return (
        loading === false ? (<div className='singleproject-clt main-cnt-div'>
            <div className='header' >
                <div className='title' >
                    <h1>Nos Projet</h1>
                </div>
                <p>{project.name}</p>
            </div>

            <div className='element'>

                {/* {console.log(project.length)} */}
                <div className='card'>
                    <div className='img-cmp'>
                        <img src={project.project_image} />
                    </div>
                    <div className='txt-cmp'>
                        <h1>{project.name}</h1>

                        <div className='txt-a-cmp' >
                            <h2>Adresse :  {project.address}</h2>
                            <h2>gaverner : {project.state} </h2>
                            <h2>categorie : {cat.name}</h2>
                        </div>
                        <div className='imgs-cnt'>

                            {project.folder && <div className='sng-img'><iframe
                                width="560"
                                height="315"
                                src="https://www.youtube.com/embed/jv0YAVI7DbQ"
                                // src="https://www.youtube.com/embed/jv0YAVI7DbQ?autoplay=1&mute=1"
                                title="YouTube video player"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen
                            >

                            </iframe></div>}
                            {project.image_a && <div className='sng-img'><img src={project.image_a} /></div>}
                            {project.image_b && <div className='sng-img'><img src={project.image_b} /></div>}
                            {project.image_c && <div className='sng-img'><img src={project.image_c} /></div>}
                            {project.image_c && <div className='sng-img'><img src={project.image_d} /></div>}

                        </div>

                        <div className='txt-b-cmp' >
                            <div className='map-cnt' >
                                <MapWithLeaflet location={project.location} />
                            </div>
                            <div className='desc-cmp' >
                                <h2>description :</h2>
                                <p>
                                    {project.description}
                                </p>

                            </div>



                        </div>






                        <div className='btn-cmp'>
                            <a
                                href={`http://localhost:8000/media/${model.file_unzip}`
                                }
                                className='click-btn2 main-btn'>Voir model en 3D</a>
                        </div>
                    </div>


                </div>

            </div>
        </div>) : (<div>loading</div>)
    )
}

export default SingleProject