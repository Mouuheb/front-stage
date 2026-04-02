// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import "../admin.css";
// import data from "../data/data";
// import NavAdmin from "../nav/NavAdmin";

// const SingleFileAdmin = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const API_BASE = "http://localhost:8000/folder/files"; // endpoint backend

//   // Fetch single file by ID
//   useEffect(() => {
//     const fetchFile = async () => {
//       try {
//         const token = localStorage.getItem("access_token");
//         if (!token) {
//           navigate("/clt/login");
//           return;
//         }

//         const res = await fetch(`${API_BASE}/${id}`, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!res.ok) {
//           throw new Error(`Failed to fetch file (status: ${res.status})`);
//         }

//         const data = await res.json();
//         setFile(data);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchFile();
//   }, [id, navigate]);

//   // Delete file
//   const handleDelete = async () => {
//     if (!window.confirm("Are you sure you want to delete this file?")) return;

//     try {
//       const token = localStorage.getItem("access_token");
//       if (!token) {
//         navigate("/clt/login");
//         return;
//       }

//       const response = await fetch(`${API_BASE}/${id}/delete`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(
//           `Failed to delete file (status: ${response.status})`
//         );
//       }

//       alert("File deleted successfully ✅");
//       navigate("/admin/allfile"); // route list of files
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;
//   if (!file) return <p>No file found</p>;

//   return (
//     <div className="admin-main-bg">
//       <NavAdmin />
//       <div className="box-margin"></div>

//       <div className="single-file-admin admin-main-div">
//         <h2>{data.consult.sngl}</h2>
//         <div className="cnt">
//           <h3>{file.name}</h3>

//           <div className="btns-cnt">
//             {/* Open 3D HTML file */}
//             <div className="btn-cmp">
//               <a
//                 href={`http://localhost:8000/media/${file.file_unzip}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <label className="main-btn click-btn2">{data.model.btn}</label>
//               </a>
//             </div>

//             {/* Delete file */}
//             <div className="btn-cnt" onClick={handleDelete}>
//               <label className="main-btn click-btn2">
//                 {data.model.btnDelete}
//               </label>
//             </div>

//             {/* Link to update */}
//             <div className="btn-cnt">
//               <Link to={`/admin/update/${id}`}>
//                 <label className="main-btn click-btn2">
//                   {data.model.btnUpdate}
//                 </label>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SingleFileAdmin;