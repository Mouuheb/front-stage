// import React,{useState,useEffect} from 'react'
// import './consultation.css'
// import data from '../../data/data'
// import { redirect } from 'react-router-dom';

// const Consultation = () => {

//     const [name, setName] = useState('');
//     const [email, setEmail] = useState(null);
//     const [tel, setTel] = useState(null);
//     const [doc, setDoc] = useState(null);
//     const [mess, setMess] = useState('');


//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         // const formData = new FormData();
//         // formData.append('document', doc) ||null; // Append the file


//         try {
//             const response = await fetch('http://localhost:8000/api/consultations/create/', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ 'nom':name, "sujet":mess, "phone_number":tel, "email":email, "document":doc }),
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to create user');
//             }

//             const data = await response.json();
//             console.log('data:', data);

//         } catch (error) {
//             console.error('Error:', error);
//         }
//     };






















//     return (
//         <div className='cs'>
//             <div className='header' >
//                 <div className='title' >
//                     <h1>{data.consultation.title}</h1>
//                 </div>
//                 <p>{data.consultation.p}</p>
//             </div>
//             <form onSubmit={handleSubmit}>
//             <div className='form' >
//                 <div className='p1' >
//                     <div className='radios' >
//                         <div className='radio'>
//                             <input type='radio' name='r1' className='custom-radio' /><label>Say Hi</label>
//                         </div>
//                         <div>
//                             <input type='radio' name='r1' className='custom-radio' /><label>Get a quote</label>

//                         </div>

//                     </div>

//                     <p>Name</p>
//                     <input
//                     onChange={(e) => setName(e.target.value)}
//                      placeholder='name' className='txt' />
//                     <p>Email</p>
//                     <input
//                     onChange={(e) => setEmail(e.target.value)}
//                      placeholder='Email' className='txt' />
//                     <p>Tel</p>
//                     <input
//                     onChange={(e) => setTel(e.target.value)}
//                      placeholder='Tel' className='txt' />
//                     <p>Message</p>
//                     <textarea
//                     onChange={(e) => setMess(e.target.value)}
//                      placeholder='message' >
//                     </textarea>
//                     <p>doc</p>
//                     <input
//                     onChange={(e) => setDoc(e.target.files[0])}
//                     // setDoc(e.target.files[0])|| null;
//                      type="file" className='doc' />
//                     <br />
//                     {data.Contact.btn.vzbl && <button type="submit" className='btn'>{data.Contact.btn.txt}</button>}


//                 </div>
//                 <div className='p2' >
//                     {/* <img src={data.Contact.img} /> */}
//                 </div>

//             </div>
//             </form>
//         </div>
//     )
// }

// export default Consultation

//--------------------------------------------

// import React, { useState, useEffect } from 'react';
// import './consultation.css';
// import data from '../../data/data';
// 

// const Consultation = () => {
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [tel, setTel] = useState(null);
//     const [doc, setDoc] = useState(null);
//     const [mess, setMess] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [success, setSuccess] = useState(false);
//     const [error, setError] = useState('');

//     const handleFileChange = (e) => {
//         setDoc(e.target.files[0])|| null; // Get the actual file object
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');
//         setSuccess(false);

//         // Create FormData object
//         const formData = new FormData();
//         formData.append('nom', name);
//         formData.append('sujet', mess);
//         formData.append('phone_number', tel);
//         formData.append('email', email);
//         formData.append('document', doc); // Append the file

//         try {
//             const response = await fetch('http://localhost:8000/api/consultations/create/', {
//                 method: 'POST',
//                 // DON'T set Content-Type header - browser will set it automatically with boundary
//                 body: formData,
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to submit consultation');
//             }

//             const data = await response.json();
//             console.log('Success:', data);
//             setSuccess(true);

//             // Reset form
//             setName('');
//             setEmail('');
//             setTel('');
//             setDoc(null);
//             setMess('');

//             // Reset file input
//             e.target.reset();

//         } catch (error) {
//             console.error('Error:', error);
//             setError(error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className='cs'>
//             <div className='header'>
//                 <div className='title'>
//                     <h1>{data?.consultation?.title}</h1>
//                 </div>
//                 <p>{data?.consultation?.p}</p>
//             </div>

//             {/* Success Message */}
//             {success && redirect('/')}

//             {/* Error Message */}
//             {error && (
//                 <div className="error-message">
//                     Error: {error}
//                 </div>
//             )}

//             <form onSubmit={handleSubmit} encType="multipart/form-data">
//                 <div className='form'>
//                     <div className='p1'>
//                         <div className='radios'>
//                             <div className='radio'>
//                                 <input type='radio' name='r1' className='custom-radio' />
//                                 <label>Say Hi</label>
//                             </div>
//                             <div>
//                                 <input type='radio' name='r1' className='custom-radio' />
//                                 <label>Get a quote</label>
//                             </div>
//                         </div>

//                         <p>Name</p>
//                         <input
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             placeholder='Name'
//                             className='txt'
//                             required
//                         />

//                         <p>Email</p>
//                         <input
//                             type="email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             placeholder='Email'
//                             className='txt'
//                             // required
//                         />

//                         <p>Tel</p>
//                         <input
//                             type="tel"
//                             value={tel}
//                             onChange={(e) => setTel(e.target.value)}
//                             placeholder='Tel'
//                             className='txt'
//                             // required
//                         />

//                         <p>Message</p>
//                         <textarea
//                             value={mess}
//                             onChange={(e) => setMess(e.target.value)}
//                             placeholder='Message'
//                             required
//                         />

//                         <p>Document</p>
//                         <input

//                             onChange={handleFileChange} // Changed to handleFileChange
//                             type="file"
//                             className='doc'
//                             accept=".pdf,.doc,.docx,.jpg,.png" // Specify accepted file types
//                         />
//                         {doc && (
//                             <small>Selected file: {doc.name}</small>
//                         )}
//                         <br />

//                         {data?.Contact?.btn?.vzbl && (
//                             <button 
//                                 type="submit" 
//                                 className='btn' 
//                                 disabled={loading}
//                             >
//                                 {loading ? 'Submitting...' : data.Contact.btn.txt}
//                             </button>
//                         )}
//                     </div>
//                     <div className='p2'>
//                         {/* <img src={data.Contact.img} alt="contact" /> */}
//                     </div>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default Consultation;

//-----------------------------------------------------------


import React, { useState } from 'react';
import './consultation.css';
import data from '../../data/data';
import { redirect, useNavigate } from 'react-router-dom';
import LocationFinder from '../../client/map/LocationFinder';

const Consultation = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [tel, setTel] = useState(null); // Number, initialized as null
    const [doc, setDoc] = useState(null);
    const [mess, setMess] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null;
        setDoc(file);
    };

    const handleTelChange = (e) => {
        const value = e.target.value;
        // Convert to number or null if empty
        if (value === '') {
            setTel(null);
        } else {
            // Remove non-numeric characters and convert to number
            const numericValue = value.replace(/\D/g, '');
            setTel(numericValue ? Number(numericValue) : null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        // Create FormData for file upload
        const formData = new FormData();
        formData.append('nom', name);
        formData.append('sujet', mess);

        // Handle tel - send as number or null
        if (tel !== null && !isNaN(tel)) {
            formData.append('phone_number', tel);
        } else {
            formData.append('phone_number', '');
        }

        formData.append('email', email);

        // Only append document if it exists
        if (doc) {
            formData.append('document', doc);
        }

        try {
            const response = await fetch('http://localhost:8000/api/consultations/create/', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to submit consultation');
            }

            const responseData = await response.json();
            console.log('Success:', responseData);

            setSuccess(true);

            // Reset form
            setName('');
            setEmail('');
            setTel(null); // Reset to null
            setDoc(null);
            setMess('');

            // Reset file input
            e.target.reset();

        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='cs'>
            <div className='header'>
                <div className='title'>
                    <h1>{data?.consultation?.title}</h1>
                </div>
                <p>{data?.consultation?.p}</p>
            </div>

            {/* Success Message */}
            {success && (

                <div className="success-message" style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    padding: '10px',
                    marginBottom: '20px',
                    borderRadius: '5px'
                }}>
                    Consultation submitted successfully!
                </div>


            )
            }

            {/* Error Message */}
            {error && (
                <div className="error-message" style={{
                    backgroundColor: '#f44336',
                    color: 'white',
                    padding: '10px',
                    marginBottom: '20px',
                    borderRadius: '5px'
                }}>
                    Error: {error}
                </div>
            )}

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className='form'>
                    <div className='p1'>
                        <div className='radios'>
                            {/* <div className='radio'>
                                <input type='radio' name='r1' className='custom-radio' />
                                <label>Say Hi</label>
                            </div>
                            <div>
                                <input type='radio' name='r1' className='custom-radio' />
                                <label>Get a quote</label>
                            </div> */}
                            <div className='radio'>
                                <input type='radio' name='r1' className='custom-radio' /><label>formation</label>
                            </div>
                            <div>
                                {/* <input type='radio' name='r1' className='custom-radio' /><label>Consultation</label> */}
                                <div>
                                    <input type='radio' name='r1' className='custom-radio' /><label>Musure</label>
                                </div>
                            </div>
                        </div>

                        <p>Name</p>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder='Name'
                            className='txt'
                            required
                        />

                        <p>Email</p>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Email'
                            className='txt'

                        />

                        <p>Tel (Optional)</p>
                        <input
                            type="tel"
                            value={tel === null ? '' : tel}
                            onChange={handleTelChange}
                            placeholder='Telephone number'
                            className='txt'
                            pattern="[0-9]*"
                            inputMode="numeric"
                            required
                        />
                        {tel === null && (
                            <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                                No number provided (optional)
                            </small>
                        )}
                        {tel !== null && (
                            <small style={{ color: '#4CAF50', display: 'block', marginTop: '5px' }}>
                                Number: {tel}
                            </small>
                        )}

                        <p>Message</p>
                        <textarea
                            value={mess}
                            onChange={(e) => setMess(e.target.value)}
                            placeholder='Message'
                        />

                        <p>Document (Optional)</p>
                        <input
                            onChange={handleFileChange}
                            type="file"
                            className='doc'
                            accept=".pdf,.doc,.docx,.jpg,.png,.jpeg"
                        />

                        {/* Show selected file name */}
                        {doc && (
                            <div style={{
                                marginTop: '8px',
                                padding: '5px',
                                backgroundColor: '#f5f5f5',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}>
                                <span>📎 {doc.name}</span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setDoc(null);
                                        const fileInput = document.querySelector('input[type="file"]');
                                        if (fileInput) fileInput.value = '';
                                    }}
                                    style={{
                                        marginLeft: '10px',
                                        background: 'none',
                                        border: 'none',
                                        color: 'red',
                                        cursor: 'pointer',
                                        fontSize: '16px'
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        {/* Show hint when no file selected */}
                        {!doc && (
                            <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                                No file selected (optional)
                            </small>
                        )}

                        <br />

                        {data?.Contact?.btn?.vzbl && (
                            <button
                                type="submit"
                                className='btn click-btn'
                                disabled={loading}
                                style={{ opacity: loading ? 0.7 : 1 }}
                            >
                                {loading ? 'Submitting...' : data.Contact.btn.txt}
                            </button>
                        )}
                    </div>
                    <div className='p2'>
                        <div>
                            <p>choisie votre area :</p>
                            <br/>
                        </div>
                        <div className='map-cnt'>
                        <LocationFinder/>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Consultation;