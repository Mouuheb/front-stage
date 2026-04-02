import React, { useEffect, useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import '../admin.css'
import './consul.css'
import data from '../data/data';
import NavAdmin from '../nav/NavAdmin';
import Footer from '../../pages/footer/FooterAdmin';

const AllFile = () => {
  const navigate = useNavigate();
  const API_BASE = "http://localhost:8000/folder/files";
  const [model, setModel] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`http://localhost:8000/folder/files/`)
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
  }, []);
  // console.log


  // Delete file
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/clt/login");
        return;
      }

      const response = await fetch(`${API_BASE}/${id}/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to delete file (status: ${response.status})`
        );
      }

      alert("File deleted successfully ✅");
      navigate("/admin/allfile"); // route list of files
    } catch (err) {
      alert(err.message);
    }
  };
  if (loading) return <p>Loading...</p>;

  return (
    <div className='admin-main-bg'>
      <NavAdmin />
      <div className='box-margin ' ></div>

      <div className='admin-model admin-main-div' >
        <h2>{data.model.title} :</h2>
        <div className='btn-cnt' >
          <Link to="/admin/upladfile/" >
            <label className='click-btn2 main-btn'>{data.model.crt}</label>

          </Link>

        </div>


        {model.map((itm) => (

          <div key={itm.id} className='card'>
            <h3>{itm.name}</h3>
            {/* Delete file */}
            <div className="btn-cnt" onClick={() => handleDelete(itm.id)}>
              <label className="main-btn click-btn2">
                {data.model.btnDelete}
              </label>
            </div>
          </div>
          // 
        ))}
      </div>
      <Footer/>
    </div>
  );
};

export default AllFile;