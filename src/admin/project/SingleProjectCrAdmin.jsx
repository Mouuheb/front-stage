import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './singleProjectCrAdmin.css';
import '../admin.css'

const SingleProjectCrAdmin = () => {
  const navigate = useNavigate();

  // Form state (text fields only)
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    price: '',
    equipment: '',
    status: 'not_complete',
    address: '',
    state: '',
    location: '',
    folder: '',
    categories: [],
    assigned_members: [],
  });

  // Separate state for files
  const [files, setFiles] = useState({
    project_image: null,
    image_a: null,
    image_b: null,
    image_c: null,
    image_d: null,
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Options for dropdowns
  const [categories, setCategories] = useState([]);
  const [members, setMembers] = useState([]);

  // Type choices from the model (hardcoded)
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

  // Fetch categories and members
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [categoriesRes, membersRes] = await Promise.all([
          fetch('http://localhost:8000/api/categories/'),
          fetch('http://localhost:8000/api/members/'),
        ]);

        if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
        if (!membersRes.ok) throw new Error('Failed to fetch members');

        const categoriesData = await categoriesRes.json();
        const membersData = await membersRes.json();

        setCategories(categoriesData);
        setMembers(membersData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

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
    } else {
      setFiles(prev => ({ ...prev, [name]: null }));
    }
  };

  // Handle form submission with FormData
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formDataToSend = new FormData();

    // Append all text fields
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // For many-to-many fields, append each id separately
        value.forEach(item => formDataToSend.append(key, item));
      } else if (value !== '') {
        formDataToSend.append(key, value);
      }
    });

    // Append files (only if selected)
    Object.entries(files).forEach(([key, file]) => {
      if (file) {
        formDataToSend.append(key, file);
      }
    });

    try {
      const response = await fetch('http://localhost:8000/api/projects/create/', {
        method: 'POST',
        // Do NOT set Content-Type header; browser will set it with boundary
        //credentials: 'include', // if needed
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Creation failed');
      }

      navigate('/admin/prj');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading form options...</div>;
  if (error && !submitting) return <div>Error: {error}</div>;

  return (
    <div className="single-project-cr-admin">
      <h2>Create New Project</h2>
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

        {/* Image uploads */}
        <div className='row'>
          <label>Project Image</label>
          <input
            type="file"
            name="project_image"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className='row'>
          <label>Image A</label>
          <input
            type="file"
            name="image_a"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className='row'>
          <label>Image B</label>
          <input
            type="file"
            name="image_b"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className='row'>
          <label>Image C</label>
          <input
            type="file"
            name="image_c"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className='row'>
          <label>Image D</label>
          <input
            type="file"
            name="image_d"
            accept="image/*"
            onChange={handleFileChange}
          />
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
          {submitting ? 'Creating...' : 'Create Project'}
        </button>

        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default SingleProjectCrAdmin;