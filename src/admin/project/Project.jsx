import React, { useState, useEffect } from 'react'
import { TiPlus, TiMinus } from "react-icons/ti";
import data from '../../data/data';
import { Link, useNavigate } from 'react-router-dom';
import MapWithLeaflet from '../../pages/map/MapWithLeaflet';
import MapwithLeafletMulti from '../../pages/map/MapwithLeafletMulti';
import './project.css'
import '../admin.css'

const Project = ({ page }) => {
    const [project, setProject] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [projects, setProjects] = useState([]);

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
        loading === false ? (<div className='admin-project'>
            <div className='header' >
                <h1>Project</h1>

                {/* <div className='title' >
                    <h1>{data.work.title}</h1>
                </div> */}
                {/* <p>{data.work.p}</p> */}
            </div>
            <div className='btn-cnt'>
                <Link to="/admin/crtprj/" className='click-btvn'>
                    <label className="click-btn">Create project</label>
                    
                </Link>
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
                                            <Link to={`/admin/sgprj/${item.id}`} className='click-btn'>
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
        </div>) : (<div>loading</div>)
    )
}

export default Project






































// import React, { useState, useEffect } from 'react';

// const API_BASE_URL = 'http://localhost:8000/api'; // Change to your actual API base

// const Project = ({ type }) => {
//     console.log("type : "+type)
//     // State for projects list, form data, loading, errors, and selected project for update/delete
//     const [projects, setProjects] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [formData, setFormData] = useState({
//         type: '',
//         name: '',
//         project_image: null,
//         image_a: null,
//         image_b: null,
//         image_c: null,
//         image_d: null,
//         description: '',
//         start_date: '',
//         end_date: '',
//         price: '',
//         equipment: '',
//         status: 'pending', // default value
//         folder: '',
//         address: '',
//         state: '',
//         location: '',
//         categories: [],
//         assigned_members: []
//     });
//     const [selectedProjectId, setSelectedProjectId] = useState(null);
//     const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//     const [projectToDelete, setProjectToDelete] = useState(null);

//     // Fetch projects when component mounts or type changes to 'Get Project'
//     useEffect(() => {
//         if (type === 'Get Project') {
//             fetchProjects();
//         }
//     }, [type]);

//     // Fetch all projects
//     const fetchProjects = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await fetch(`${API_BASE_URL}/projects/`);
//             if (!response.ok) throw new Error('Failed to fetch projects');
//             const data = await response.json();
//             setProjects(data);
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Handle form input changes (text, number, date, select)
//     const handleInputChange = (e) => {
//         const { name, value, type: inputType, files } = e.target;
//         if (inputType === 'file') {
//             setFormData(prev => ({ ...prev, [name]: files[0] }));
//         } else {
//             setFormData(prev => ({ ...prev, [name]: value }));
//         }
//     };

//     // Handle form submission for create/update
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError(null);

//         // Prepare FormData for file uploads
//         const data = new FormData();
//         Object.keys(formData).forEach(key => {
//             if (formData[key] !== null && formData[key] !== '') {
//                 // For arrays like categories, assigned_members, send as JSON string or multiple entries
//                 if (Array.isArray(formData[key])) {
//                     formData[key].forEach(item => data.append(key, item));
//                 } else {
//                     data.append(key, formData[key]);
//                 }
//             }
//         });

//         try {
//             let response;
//             if (selectedProjectId) {
//                 // UPDATE
//                 response = await fetch(`${API_BASE_URL}/projects/${selectedProjectId}/`, {
//                     method: 'PUT',
//                     body: data
//                 });
//             } else {
//                 // CREATE
//                 response = await fetch(`${API_BASE_URL}/projects/`, {
//                     method: 'POST',
//                     body: data
//                 });
//             }
//             if (!response.ok) throw new Error('Failed to save project');
//             const savedProject = await response.json();
//             // Refresh list and reset form
//             await fetchProjects();
//             resetForm();
//             // Optionally switch to list view
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Handle delete confirmation
//     const confirmDelete = (project) => {
//         setProjectToDelete(project);
//         setShowDeleteConfirm(true);
//     };

//     const handleDelete = async () => {
//         if (!projectToDelete) return;
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await fetch(`${API_BASE_URL}/projects/${projectToDelete.id}/`, {
//                 method: 'DELETE'
//             });
//             if (!response.ok) throw new Error('Failed to delete project');
//             await fetchProjects();
//             setShowDeleteConfirm(false);
//             setProjectToDelete(null);
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Populate form with project data for editing
//     const editProject = (project) => {
//         setSelectedProjectId(project.id);
//         setFormData({
//             type: project.type || '',
//             name: project.name || '',
//             project_image: null, // file inputs can't be pre-filled for security
//             image_a: null,
//             image_b: null,
//             image_c: null,
//             image_d: null,
//             description: project.description || '',
//             start_date: project.start_date || '',
//             end_date: project.end_date || '',
//             price: project.price || '',
//             equipment: project.equipment || '',
//             status: project.status || 'pending',
//             folder: project.folder || '',
//             address: project.address || '',
//             state: project.state || '',
//             location: project.location || '',
//             categories: project.categories || [],
//             assigned_members: project.assigned_members || []
//         });
//     };

//     // Reset form to empty
//     const resetForm = () => {
//         setSelectedProjectId(null);
//         setFormData({
//             type: '',
//             name: '',
//             project_image: null,
//             image_a: null,
//             image_b: null,
//             image_c: null,
//             image_d: null,
//             description: '',
//             start_date: '',
//             end_date: '',
//             price: '',
//             equipment: '',
//             status: 'pending',
//             folder: '',
//             address: '',
//             state: '',
//             location: '',
//             categories: [],
//             assigned_members: []
//         });
//     };

//     // Render different views based on the `type` prop
//     const renderContent = () => {
//         switch (type) {
//             case 'Get Project':
//                 return (
//                     <div>
//                         <h2>Projects List</h2>
//                         {loading && <p>Loading...</p>}
//                         {error && <p className="error">Error: {error}</p>}
//                         {!loading && !error && (
//                             <ul className="project-list">
//                                 {projects.map(project => (
//                                     <li key={project.id}>
//                                         <h3>{project.name}</h3>
//                                         <p>Type: {project.type}</p>
//                                         <p>Status: {project.status}</p>
//                                         <button onClick={() => editProject(project)}>Edit</button>
//                                         <button onClick={() => confirmDelete(project)}>Delete</button>
//                                     </li>
//                                 ))}
//                             </ul>
//                         )}
//                     </div>
//                 );

//             case 'Create Project':
//             case 'Update Project':
//                 return (
//                     <div>
//                         <h2>{selectedProjectId ? 'Update Project' : 'Create New Project'}</h2>
//                         {loading && <p>Saving...</p>}
//                         {error && <p className="error">Error: {error}</p>}
//                         <form onSubmit={handleSubmit} encType="multipart/form-data">
//                             {/* Basic fields */}
//                             <label>Type:</label>
//                             <input type="text" name="type" value={formData.type} onChange={handleInputChange} required />

//                             <label>Name:</label>
//                             <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />

//                             <label>Description:</label>
//                             <textarea name="description" value={formData.description} onChange={handleInputChange} required />

//                             <label>Start Date:</label>
//                             <input type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} required />

//                             <label>End Date:</label>
//                             <input type="date" name="end_date" value={formData.end_date} onChange={handleInputChange} required />

//                             <label>Price:</label>
//                             <input type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} required />

//                             <label>Equipment:</label>
//                             <input type="text" name="equipment" value={formData.equipment} onChange={handleInputChange} />

//                             <label>Status:</label>
//                             <select name="status" value={formData.status} onChange={handleInputChange}>
//                                 <option value="pending">Pending</option>
//                                 <option value="in_progress">In Progress</option>
//                                 <option value="complete">Complete</option>
//                             </select>

//                             <label>Folder (video URL):</label>
//                             <input type="url" name="folder" value={formData.folder} onChange={handleInputChange} />

//                             <label>Address:</label>
//                             <input type="text" name="address" value={formData.address} onChange={handleInputChange} />

//                             <label>State:</label>
//                             <input type="text" name="state" value={formData.state} onChange={handleInputChange} />

//                             <label>Location (lat,lng):</label>
//                             <input type="text" name="location" value={formData.location} onChange={handleInputChange} />

//                             {/* File uploads */}
//                             <label>Project Image:</label>
//                             <input type="file" name="project_image" onChange={handleInputChange} accept="image/*" />

//                             <label>Image A:</label>
//                             <input type="file" name="image_a" onChange={handleInputChange} accept="image/*" />

//                             <label>Image B:</label>
//                             <input type="file" name="image_b" onChange={handleInputChange} accept="image/*" />

//                             <label>Image C:</label>
//                             <input type="file" name="image_c" onChange={handleInputChange} accept="image/*" />

//                             <label>Image D:</label>
//                             <input type="file" name="image_d" onChange={handleInputChange} accept="image/*" />

//                             {/* Categories and assigned members – you may replace with select dropdowns */}
//                             <label>Categories (comma-separated IDs):</label>
//                             <input
//                                 type="text"
//                                 name="categories"
//                                 value={formData.categories.join(',')}
//                                 onChange={(e) => setFormData(prev => ({
//                                     ...prev,
//                                     categories: e.target.value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
//                                 }))}
//                             />

//                             <label>Assigned Members (comma-separated IDs):</label>
//                             <input
//                                 type="text"
//                                 name="assigned_members"
//                                 value={formData.assigned_members.join(',')}
//                                 onChange={(e) => setFormData(prev => ({
//                                     ...prev,
//                                     assigned_members: e.target.value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
//                                 }))}
//                             />

//                             <div className="form-actions">
//                                 <button type="submit" disabled={loading}>
//                                     {selectedProjectId ? 'Update' : 'Create'}
//                                 </button>
//                                 <button type="button" onClick={resetForm}>Cancel</button>
//                             </div>
//                         </form>
//                     </div>
//                 );

//             case 'Delete Project':
//                 // This could be a dedicated delete view, but we integrate delete in list via confirm modal.
//                 // If you want a separate page, you can implement it similarly.
//                 return (
//                     <div>
//                         <h2>Delete Project</h2>
//                         {showDeleteConfirm && projectToDelete && (
//                             <div className="delete-confirm">
//                                 <p>Are you sure you want to delete "{projectToDelete.name}"?</p>
//                                 <button onClick={handleDelete} disabled={loading}>Yes, Delete</button>
//                                 <button onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
//                             </div>
//                         )}
//                         {!showDeleteConfirm && (
//                             <p>Select a project to delete from the list (use 'Get Project' first).</p>
//                         )}
//                     </div>
//                 );

//             default:
//                 return <p>Select an action from the navigation.</p>;
//         }
//     };

//     return (
//         <div className="project-crud">
//             {renderContent()}
//         </div>
//     );
// };

// export default Project;






// import React, { useState, useEffect } from 'react';

// // Replace with your actual API base URL
// const API_BASE_URL = 'http://localhost:8000/api';

// const Project = ({ type }) => {
//     // ---------- State ----------
//     const [projects, setProjects] = useState([]);          // list of projects
//     const [loading, setLoading] = useState(false);         // loading indicator
//     const [error, setError] = useState(null);              // error message
//     const [selectedProjectId, setSelectedProjectId] = useState(null); // for update
//     const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//     const [projectToDelete, setProjectToDelete] = useState(null);

//     const types = [
//         "Foresterie et gestion des ressources naturelles",
//         "Urbanisme et amenagement du territoire",
//         "Mne et carriere",
//         "Agriculture de precision",
//         "Environnement",
//         "Construction et Genie Civil",
//         "Energetique",
//         "Cartographie Precise"]

//     // Form data for create/update (matches API fields)
//     const [formData, setFormData] = useState({
//         type: '',
//         name: '',
//         project_image: null,
//         image_a: null,
//         image_b: null,
//         image_c: null,
//         image_d: null,
//         description: '',
//         start_date: '',
//         end_date: '',
//         price: '',
//         equipment: '',
//         status: 'pending',
//         folder: '',
//         address: '',
//         state: '',
//         location: '',
//         categories: [],
//         assigned_members: []
//     });

//     // ---------- Fetch projects when type is "Get Project" ----------
//     useEffect(() => {
//         if (type === 'Get Project') {
//             fetchProjects();
//         }
//     }, [type]);

//     const fetchProjects = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const res = await fetch(`${API_BASE_URL}/projects/`);
//             if (!res.ok) throw new Error('Failed to fetch projects');
//             const data = await res.json();
//             setProjects(data);
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ---------- Handle form input changes ----------
//     const handleInputChange = (e) => {
//         const { name, value, type: inputType, files } = e.target;
//         if (inputType === 'file') {
//             setFormData(prev => ({ ...prev, [name]: files[0] }));
//         } else {
//             setFormData(prev => ({ ...prev, [name]: value }));
//         }
//     };

//     // ---------- Create / Update submit ----------
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError(null);

//         const data = new FormData();
//         Object.keys(formData).forEach(key => {
//             if (formData[key] !== null && formData[key] !== '') {
//                 if (Array.isArray(formData[key])) {
//                     // Send each array item as separate field with same key
//                     formData[key].forEach(item => data.append(key, item));
//                 } else {
//                     data.append(key, formData[key]);
//                 }
//             }
//         });

//         try {
//             let response;
//             if (selectedProjectId) {
//                 // UPDATE
//                 response = await fetch(`${API_BASE_URL}/projects/${selectedProjectId}/`, {
//                     method: 'PUT',
//                     body: data
//                 });
//             } else {
//                 // CREATE
//                 response = await fetch(`${API_BASE_URL}/projects/`, {
//                     method: 'POST',
//                     body: data
//                 });
//             }
//             if (!response.ok) throw new Error('Failed to save project');
//             await fetchProjects();   // refresh list
//             resetForm();             // clear form and selected ID
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ---------- Delete ----------
//     const confirmDelete = (project) => {
//         setProjectToDelete(project);
//         setShowDeleteConfirm(true);
//     };

//     const handleDelete = async () => {
//         if (!projectToDelete) return;
//         setLoading(true);
//         setError(null);
//         try {
//             const res = await fetch(`${API_BASE_URL}/projects/${projectToDelete.id}/delete/`, {
//                 method: 'DELETE'
//             });
//             if (!res.ok) throw new Error('Failed to delete project');
//             await fetchProjects();
//             setShowDeleteConfirm(false);
//             setProjectToDelete(null);
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ---------- Populate form for editing ----------
//     const editProject = (project) => {
//         setSelectedProjectId(project.id);
//         setFormData({
//             type: project.type || '',
//             name: project.name || '',
//             project_image: null,          // file inputs can't be prefilled
//             image_a: null,
//             image_b: null,
//             image_c: null,
//             image_d: null,
//             description: project.description || '',
//             start_date: project.start_date || '',
//             end_date: project.end_date || '',
//             price: project.price || '',
//             equipment: project.equipment || '',
//             status: project.status || 'pending',
//             folder: project.folder || '',
//             address: project.address || '',
//             state: project.state || '',
//             location: project.location || '',
//             categories: project.categories || [],
//             assigned_members: project.assigned_members || []
//         });
//     };

//     // ---------- Reset form ----------
//     const resetForm = () => {
//         setSelectedProjectId(null);
//         setFormData({
//             type: '',
//             name: '',
//             project_image: null,
//             image_a: null,
//             image_b: null,
//             image_c: null,
//             image_d: null,
//             description: '',
//             start_date: '',
//             end_date: '',
//             price: '',
//             equipment: '',
//             status: 'pending',
//             folder: '',
//             address: '',
//             state: '',
//             location: '',
//             categories: [],
//             assigned_members: []
//         });
//     };

//     // ---------- Helper: render the form (used by Create and Update) ----------
//     const renderForm = () => (
//         <form onSubmit={handleSubmit} encType="multipart/form-data">
//             {loading && <p>Saving...</p>}
//             {error && <p className="error">Error: {error}</p>}

//             <label>Type:</label>
//             <input type="text" name="type" value={formData.type} onChange={handleInputChange} required />

//             <label>Name:</label>
//             <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />

//             <label>Description:</label>
//             <textarea name="description" value={formData.description} onChange={handleInputChange} required />

//             <label>Start Date:</label>
//             <input type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} required />

//             <label>End Date:</label>
//             <input type="date" name="end_date" value={formData.end_date} onChange={handleInputChange} required />

//             <label>Price:</label>
//             <input type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} required />

//             <label>Equipment:</label>
//             <input type="text" name="equipment" value={formData.equipment} onChange={handleInputChange} />

//             <label>Status:</label>
//             <select name="status" value={formData.status} onChange={handleInputChange}>
//                 <option value="pending">Pending</option>
//                 <option value="in_progress">In Progress</option>
//                 <option value="complete">Complete</option>
//             </select>

//             <label>Folder (video URL):</label>
//             <input type="url" name="folder" value={formData.folder} onChange={handleInputChange} />

//             <label>Address:</label>
//             <input type="text" name="address" value={formData.address} onChange={handleInputChange} />

//             <label>State:</label>
//             <input type="text" name="state" value={formData.state} onChange={handleInputChange} />

//             <label>Location (lat,lng):</label>
//             <input type="text" name="location" value={formData.location} onChange={handleInputChange} />

//             {/* File uploads */}
//             <label>Project Image:</label>
//             <input type="file" name="project_image" onChange={handleInputChange} accept="image/*" />

//             <label>Image A:</label>
//             <input type="file" name="image_a" onChange={handleInputChange} accept="image/*" />

//             <label>Image B:</label>
//             <input type="file" name="image_b" onChange={handleInputChange} accept="image/*" />

//             <label>Image C:</label>
//             <input type="file" name="image_c" onChange={handleInputChange} accept="image/*" />

//             <label>Image D:</label>
//             <input type="file" name="image_d" onChange={handleInputChange} accept="image/*" />

//             {/* Categories and assigned members as comma-separated IDs */}
//             <label>Categories (comma-separated IDs):</label>
//             <input
//                 type="text"
//                 name="categories"
//                 value={formData.categories.join(',')}
//                 onChange={(e) => setFormData(prev => ({
//                     ...prev,
//                     categories: e.target.value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
//                 }))}
//             />

//             <label>Assigned Members (comma-separated IDs):</label>
//             <input
//                 type="text"
//                 name="assigned_members"
//                 value={formData.assigned_members.join(',')}
//                 onChange={(e) => setFormData(prev => ({
//                     ...prev,
//                     assigned_members: e.target.value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
//                 }))}
//             />

//             <div className="form-actions">
//                 <button type="submit" disabled={loading}>
//                     {selectedProjectId ? 'Update' : 'Create'}
//                 </button>
//                 <button type="button" onClick={resetForm}>Cancel</button>
//             </div>
//         </form>
//     );

//     // ---------- Object mapping for views (no switch) ----------
//     const views = {
//         'Get Project': () => (
//             <div>
//                 <h2>Projects List</h2>
//                 {loading && <p>Loading...</p>}
//                 {error && <p className="error">Error: {error}</p>}
//                 {!loading && !error && (
//                     <ul className="project-list">
//                         {projects.map(project => (
//                             <li key={project.id}>
//                                 <h3>{project.name}</h3>
//                                 <p>Type: {project.type}</p>
//                                 <p>Status: {project.status}</p>
//                                 <button onClick={() => editProject(project)}>Edit</button>
//                                 <button onClick={() => confirmDelete(project)}>Delete</button>
//                             </li>
//                         ))}
//                     </ul>
//                 )}
//             </div>
//         ),
//         'Create Project': () => (
//             <div>
//                 <h2>Create New Project</h2>
//                 {renderForm()}
//             </div>
//         ),
//         'Update Project': () => (
//             <div>
//                 <h2>Update Project</h2>
//                 {renderForm()}
//             </div>
//         ),
//         'Delete Project': () => (
//             <div>
//                 <h2>Delete Project</h2>
//                 {showDeleteConfirm && projectToDelete && (
//                     <div className="delete-confirm">
//                         <p>Are you sure you want to delete "{projectToDelete.name}"?</p>
//                         <button onClick={handleDelete} disabled={loading}>Yes, Delete</button>
//                         <button onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
//                     </div>
//                 )}
//                 {!showDeleteConfirm && (
//                     <p>Select a project to delete from the list (use 'Get Project' first).</p>
//                 )}
//             </div>
//         )
//     };

//     // Render the appropriate view based on the `type` prop
//     const renderView = () => {
//         const viewFunction = views[type];
//         return viewFunction ? viewFunction() : <p>Select an action from the navigation.</p>;
//     };

//     return <div className="project-crud">{renderView()}</div>;
// };

// export default Project;