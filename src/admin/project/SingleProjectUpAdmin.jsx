import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './singleProjectUpAdmin.css';
import '../admin.css'

const SingleProjectUpAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form state for text fields
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
  });

  // Separate state for files (new uploads)
  const [files, setFiles] = useState({
    project_image: null,
    image_a: null,
    image_b: null,
    image_c: null,
    image_d: null,
  });

  // Store existing image URLs for preview
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

  // Options for dropdowns
  const [categories, setCategories] = useState([]);
  const [members, setMembers] = useState([]);

  // Type choices from the model
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

  // Status choices from the model
  const statusChoices = [
    { value: 'complete', label: 'Complete' },
    { value: 'not_complete', label: 'Not Complete' },
    { value: 'in_process', label: 'In Process' },
    { value: 'idea', label: 'Idea' },
  ];

  // Fetch project data, categories, members
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch project details
        const projectRes = await fetch(`http://localhost:8000/api/projects/${id}/`);
        if (!projectRes.ok) throw new Error('Failed to fetch project');
        const projectData = await projectRes.json();

        // Fetch all categories
        const categoriesRes = await fetch('http://localhost:8000/api/categories/');
        if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
        const categoriesData = await categoriesRes.json();

        // Fetch all members
        const membersRes = await fetch('http://localhost:8000/api/members/');
        if (!membersRes.ok) throw new Error('Failed to fetch members');
        const membersData = await membersRes.json();

        // Set form data with existing project values
        setFormData({
          type: projectData.type || '',
          name: projectData.name || '',
          description: projectData.description || '',
          start_date: projectData.start_date || '',
          end_date: projectData.end_date || '',
          price: projectData.price || '',
          equipment: projectData.equipment || '',
          status: projectData.status || 'not_complete',
          folder: projectData.folder || '',
          address: projectData.address || '',
          state: projectData.state || '',
          location: projectData.location || '',
          categories: projectData.categories || [],
          assigned_members: projectData.assigned_members || [],
        });

        // Store existing image URLs for preview
        setExistingImages({
          project_image: projectData.project_image || '',
          image_a: projectData.image_a || '',
          image_b: projectData.image_b || '',
          image_c: projectData.image_c || '',
          image_d: projectData.image_d || '',
        });

        setCategories(categoriesData);
        setMembers(membersData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle text/select changes
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

  // Handle file input changes
  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    if (fileList.length > 0) {
      setFiles(prev => ({ ...prev, [name]: fileList[0] }));
      // Optionally show a local preview for the new file (can be added later)
    } else {
      setFiles(prev => ({ ...prev, [name]: null }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formDataToSend = new FormData();

    // Append all text fields (including folder)
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // For many-to-many, append each id individually
        value.forEach(item => formDataToSend.append(key, item));
      } else if (value !== '') {
        formDataToSend.append(key, value);
      }
    });

    // Append files only if a new file was selected
    Object.entries(files).forEach(([key, file]) => {
      if (file) {
        formDataToSend.append(key, file);
      }
    });

    try {
      const response = await fetch(`http://localhost:8000/api/projects/${id}/update/`, {
        method: 'PUT', // or 'PATCH' if your API supports partial updates
        // Do NOT set Content-Type header; browser sets it with boundary
        // credentials: 'include', // uncomment if needed
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Update failed');
      }

      navigate('/admin/prj'); // adjust to your route
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading project data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (

    <div className="single-project-up-admin">
      <h2>Update Project</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Basic fields */}
        <div className='row'>
          <label>Name </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
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
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className='row'>
          <label>Start Date</label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
          />
        </div>

        <div className='row'>
          <label>End Date</label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
          />
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

        <div className='row'>
          <label>Equipment</label>
          <textarea
            name="equipment"
            value={formData.equipment}
            onChange={handleChange}
            rows="3"
            placeholder="List equipment separated by commas or new lines"
          />
        </div>

        <div className='row'>
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            {statusChoices.map(choice => (
              <option key={choice.value} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </select>
        </div>

        <div className='row'>
          <label>Folder (URL or path)</label>
          <input
            type="text"
            name="folder"
            value={formData.folder}
            onChange={handleChange}
            placeholder="e.g., https://... or /path/to/folder"
          />
        </div>

        <div className='row'>
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className='row'>
          <label>State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
          />
        </div>

        <div className='row'>
          <label>Location (lat,lng)</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., 35.237513, 11.131123"
          />
        </div>

        {/* Image fields with previews */}
        <div className='row' >
          <label>Project Image</label>
          {existingImages.project_image && (
            <div className="image-preview">
              <img src={existingImages.project_image} alt="Current project" width="100" />
              {/* <p>Current image</p> */}
            </div>
          )}
          <input
            type="file"
            name="project_image"
            accept="image/*"
            onChange={handleFileChange}
          />
          {/* <small>Leave empty to keep current image</small> */}
        </div>

        <div className='row'>
          <label>Image A</label>
          {existingImages.image_a && (
            <div className="image-preview">
              <img src={existingImages.image_a} alt="Current image A" width="100" />
              {/* <p>Current image</p> */}
            </div>
          )}
          <input
            type="file"
            name="image_a"
            accept="image/*"
            onChange={handleFileChange}
          />
          {/* <small>Leave empty to keep current image</small> */}
        </div>

        <div className='row'> 
          <label>Image B</label>
          {existingImages.image_b && (
            <div className="image-preview">
              <img src={existingImages.image_b} alt="Current image B" width="100" />
              {/* <p>Current image</p> */}
            </div>
          )}
          <input
            type="file"
            name="image_b"
            accept="image/*"
            onChange={handleFileChange}
          />
          {/* <small>Leave empty to keep current image</small> */}
        </div>

        <div className='row'>
          <label>Image C</label>
          {existingImages.image_c && (
            <div className="image-preview">
              <img src={existingImages.image_c} alt="Current image C" width="100" />
              {/* <p>Current image</p> */}
            </div>
          )}
          <input
            type="file"
            name="image_c"
            accept="image/*"
            onChange={handleFileChange}
          />
          {/* <small>Leave empty to keep current image</small> */}
        </div>

        <div className='row'>
          <label>Image D</label>
          {existingImages.image_d && (
            <div className="image-preview">
              <img src={existingImages.image_d} alt="Current image D" width="100" />
              {/* <p>Current image</p> */}
            </div>
          )}
          <input
            type="file"
            name="image_d"
            accept="image/*"
            onChange={handleFileChange}
          />
          {/* <small>Leave empty to keep current image</small> */}
        </div>

        {/* Categories multi-select */}
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
          {/* <small>Hold Ctrl (Cmd) to select multiple</small> */}
        </div>

        {/* Assigned members multi-select */}
        <div className='row'>
          <label>Assigned Members</label>
          <select
            name="assigned_members"
            // multiple
            value={formData.assigned_members}
            onChange={handleChange}
          >
            {members.map(member => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
          {/* <small>Hold Ctrl (Cmd) to select multiple</small> */}
        </div>

        <button type="submit" disabled={submitting} className='click-btn'>
          {submitting ? 'Updating...' : 'Update Project'}
        </button>

        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default SingleProjectUpAdmin;