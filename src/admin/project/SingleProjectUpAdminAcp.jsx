// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import './singleProjectUpAdmin.css';
// import '../admin.css'
// import NavAdmin from '../nav/NavAdmin';
// import Footer from '../../pages/footer/FooterAdmin';

// const SingleProjectUpAdminAcp = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // Form state for text fields
//   const [formData, setFormData] = useState({
//     type: '',
//     name: '',
//     description: '',
//     start_date: '',
//     end_date: '',
//     price: '',
//     equipment: '',
//     status: 'not_complete',
//     folder: '',
//     address: '',
//     state: '',
//     location: '',
//     categories: [],
//     assigned_members: [],
//     filemodel:[],
//   });

//   // Separate state for files (new uploads)
//   const [files, setFiles] = useState({
//     project_image: null,
//     image_a: null,
//     image_b: null,
//     image_c: null,
//     image_d: null,
//     filemodel: null,
//   });

//   // Store existing image URLs for preview
//   const [existingImages, setExistingImages] = useState({
//     project_image: '',
//     image_a: '',
//     image_b: '',
//     image_c: '',
//     image_d: '',
//     // filermodel: '',
//   });

//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState(null);

//   // Options for dropdowns
//   const [categories, setCategories] = useState([]);
//   const [members, setMembers] = useState([]);
//   const [model, setModel] = useState([]);


//   // Type choices from the model
//   const typeChoices = [
//     'Cartographie Precise',
//     'Energetique',
//     'Construction et Genie Civil',
//     'Environnement',
//     'Agriculture de precision',
//     'Mne et carriere',
//     'Urbanisme et amenagement du territoire',
//     'Foresterie et gestion des ressources naturelles',
//   ];

//   // Status choices from the model
//   const statusChoices = [
//     { value: 'idea', label: 'Idea' },
//     { value: 'nonvalider', label: 'Non valider' },
//     { value: 'valider', label: 'Valider' },
    
//     { value: 'not_complete', label: 'Not Complete' },
//     { value: 'in_process', label: 'In Process' },

//     { value: 'complete', label: 'Complete' },
    
//   ];

//   // Fetch project data, categories, members
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch project details
//         const projectRes = await fetch(`http://localhost:8000/api/projects/${id}/`);
//         if (!projectRes.ok) throw new Error('Failed to fetch project');
//         const projectData = await projectRes.json();

//         // Fetch all categories
//         const categoriesRes = await fetch('http://localhost:8000/api/categories/');
//         if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
//         const categoriesData = await categoriesRes.json();

//         // Fetch all files
//         const fileRes = await fetch('http://localhost:8000/folder/files/');
//         if (!fileRes.ok) throw new Error('Failed to fetch files');
//         const filesData = await fileRes.json();

//         // Fetch all members
//         const membersRes = await fetch('http://localhost:8000/api/members/');
//         if (!membersRes.ok) throw new Error('Failed to fetch members');
//         const membersData = await membersRes.json();

//         // Set form data with existing project values
//         setFormData({
//           type: projectData.type || '',
//           name: projectData.name || '',
//           description: projectData.description || '',
//           start_date: projectData.start_date || '',
//           end_date: projectData.end_date || '',
//           price: projectData.price || '',
//           equipment: projectData.equipment || '',
//           status: 'nonvalider',
//           folder: projectData.folder || '',
//           address: projectData.address || '',
//           state: projectData.state || '',
//           location: projectData.location || '',
//           categories: projectData.categories || [],
//           assigned_members: projectData.assigned_members || [],
//           filermodel: projectData.filemodel || [],
//         });

//         // Store existing image URLs for preview
//         setExistingImages({
//           project_image: projectData.project_image || '',
//           image_a: projectData.image_a || '',
//           image_b: projectData.image_b || '',
//           image_c: projectData.image_c || '',
//           image_d: projectData.image_d || '',
//         });

//         setCategories(categoriesData);
//         setMembers(membersData);
//         setModel(filesData)
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id]);

//   // Handle text/select changes
//   const handleChange = (e) => {
//     const { name, value, type, options } = e.target;
//     if (type === 'select-multiple') {
//       const selected = Array.from(options)
//         .filter(opt => opt.selected)
//         .map(opt => opt.value);
//       setFormData(prev => ({ ...prev, [name]: selected }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   // Handle file input changes
//   const handleFileChange = (e) => {
//     const { name, files: fileList } = e.target;
//     if (fileList.length > 0) {
//       setFiles(prev => ({ ...prev, [name]: fileList[0] }));
//       // Optionally show a local preview for the new file (can be added later)
//     } else {
//       setFiles(prev => ({ ...prev, [name]: null }));
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     setError(null);

//     const formDataToSend = new FormData();

//     // Append all text fields (including folder)
//     Object.entries(formData).forEach(([key, value]) => {
//       if (Array.isArray(value)) {
//         // For many-to-many, append each id individually
//         value.forEach(item => formDataToSend.append(key, item));
//       } else if (value !== '' && value !== null) {
//         formDataToSend.append(key, value);
//       }
//     });

//     // Append files only if a new file was selected
//     Object.entries(files).forEach(([key, file]) => {
//       if (file) {
//         formDataToSend.append(key, file);
//       }
//     });

//     try {
//       const response = await fetch(`http://localhost:8000/api/projects/advld/${id}/`, {
//         method: 'PUT',
//         body: formDataToSend,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Update failed');
//       }

//       navigate('/admin/prj'); // adjust to your route
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return <div>Loading project data...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className='admin-main-bg'>
//       <NavAdmin/>
//       <div className='box-margin' ></div>
//       <div className="single-project-up-admin admin-main-div">
//       <h2>Valider la {formData.name}</h2>
//       <form onSubmit={handleSubmit} encType="multipart/form-data">

//       <div className='row'>
//           <label>Address</label>
//           <label>{formData.address}</label>
//         </div>

//         <div className='row'>
//           <label>State</label>
//           <label>{formData.state}</label>
//         </div>

        

//         <div className='row'>
//           <label>Type</label>
//           <select name="type" value={formData.type} onChange={handleChange}>
//             <option value="">-- Select Type --</option>
//             {typeChoices.map(choice => (
//               <option key={choice} value={choice}>{choice}</option>
//             ))}
//           </select>
//         </div>

        

//         <div className='row'>
//           <label>Price</label>
//           <input
//             type="number"
//             step="0.01"
//             min="0"
//             name="price"
//             value={formData.price}
//             onChange={handleChange}
//           />
//         </div>

        


//         {/* Categories multi-select */}
//         <div className='row'>
//           <label>Categories</label>
//           <select
//             name="categories"
//             // multiple
//             value={formData.categories}
//             onChange={handleChange}
//           >
//             {categories.map(cat => (
//               <option key={cat.id} value={cat.id}>
//                 {cat.name}
//               </option>
//             ))}
//           </select>
//           {/* <small>Hold Ctrl (Cmd) to select multiple</small> */}
//         </div>

//         <div className='row'>
//           <label>Description</label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             rows="4"
//           />
//         </div>




//         <button type="submit" disabled={submitting} className='click-btn2 main-btn'>
//           {submitting ? 'Updating...' : 'Valider Project'}
//         </button>

//         {error && <div className="error">{error}</div>}
//       </form>
//       </div>
//       <Footer/>

//     </div>

    
//   );
// };

// export default SingleProjectUpAdminAcp;













import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './singleProjectUpAdmin.css';
import '../admin.css'
import NavAdmin from '../nav/NavAdmin';
import Footer from '../../pages/footer/FooterAdmin';

const SingleProjectUpAdminAcp = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: '',
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    price: '',
    equipment: '',
    status: 'not_complete',
    folder: '',
    address: '',
    state: '',
    location: '',
    categories: [],
    assigned_members: [],
    filemodel: [],
  });

  const [files, setFiles] = useState({
    project_image: null,
    image_a: null,
    image_b: null,
    image_c: null,
    image_d: null,
    filemodel: null,
  });

  const [existingImages, setExistingImages] = useState({
    project_image: '',
    image_a: '',
    image_b: '',
    image_c: '',
    image_d: '',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [categories, setCategories] = useState([]);
  const [members, setMembers] = useState([]);
  const [model, setModel] = useState([]);

  const typeChoices = [
    'Cartographie Precise',
    'Energetique',
    'Construction et Genie Civil',
    'Environnement',
    'Agriculture de precision',
    'Mne et carriere',
    'Urbanisme et amenagement du territoire',
    'Foresterie et gestion des ressources naturelles',
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectRes = await fetch(`http://localhost:8000/api/projects/${id}/`);
        const projectData = await projectRes.json();

        const categoriesRes = await fetch('http://localhost:8000/api/categories/');
        const categoriesData = await categoriesRes.json();

        const fileRes = await fetch('http://localhost:8000/folder/files/');
        const filesData = await fileRes.json();

        const membersRes = await fetch('http://localhost:8000/api/members/');
        const membersData = await membersRes.json();

        // ✅ FIX: ensure categories are IDs
        const categoryIds = projectData.categories
          ? projectData.categories.map(c => (typeof c === 'object' ? c.id : c))
          : [];

        setFormData({
          type: projectData.type || '',
          name: projectData.name || '',
          description: projectData.description || '',
          start_date: projectData.start_date || '',
          end_date: projectData.end_date || '',
          price: projectData.price || '',
          equipment: projectData.equipment || '',
          status: 'nonvalider',
          folder: projectData.folder || '',
          address: projectData.address || '',
          state: projectData.state || '',
          location: projectData.location || '',
          categories: categoryIds,
          assigned_members: projectData.assigned_members || [],
          filemodel: projectData.filemodel || [],
        });

        setExistingImages({
          project_image: projectData.project_image || '',
          image_a: projectData.image_a || '',
          image_b: projectData.image_b || '',
          image_c: projectData.image_c || '',
          image_d: projectData.image_d || '',
        });

        setCategories(categoriesData);
        setMembers(membersData);
        setModel(filesData);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, options } = e.target;

    if (type === 'select-multiple') {
      const selected = Array.from(options)
        .filter(opt => opt.selected)
        .map(opt => opt.value);

      setFormData(prev => ({ ...prev, [name]: selected }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;

    if (fileList.length > 0) {
      setFiles(prev => ({ ...prev, [name]: fileList[0] }));
    } else {
      setFiles(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(item => formDataToSend.append(key, item));
      } else if (value !== '' && value !== null) {
        formDataToSend.append(key, value);
      }
    });

    Object.entries(files).forEach(([key, file]) => {
      if (file) {
        formDataToSend.append(key, file);
      }
    });

    try {
      const response = await fetch(`http://localhost:8000/api/projects/advld/${id}/`, {
        method: 'PUT',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Update failed');
      }

      navigate('/admin/prj');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading project data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='admin-main-bg'>
      <NavAdmin />
      <div className='box-margin'></div>

      <div className="single-project-up-admin admin-main-div">
        <h2>Valider la {formData.name}</h2>

        <form onSubmit={handleSubmit} encType="multipart/form-data">

          <div className='row'>
            <label>Address</label>
            <label>{formData.address}</label>
          </div>

          <div className='row'>
            <label>State</label>
            <label>{formData.state}</label>
          </div>

          <div className='row'>
            <label>Type</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="">-- Select Type --</option>
              {typeChoices.map(choice => (
                <option key={choice} value={choice}>{choice}</option>
              ))}
            </select>
          </div>

          <div className='row'>
            <label>Price</label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          {/* ✅ FIXED CATEGORIES */}
          <div className='row'>
            <label>Categories</label>
            <select
              name="categories"
              // multiple
              value={formData.categories}
              onChange={handleChange}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className='row'>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <button type="submit" disabled={submitting} className='click-btn2 main-btn'>
            {submitting ? 'Updating...' : 'Valider Project'}
          </button>

          {error && <div className="error">{error}</div>}
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default SingleProjectUpAdminAcp;