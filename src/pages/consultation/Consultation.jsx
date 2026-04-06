import React, { useEffect, useState } from 'react';
import './consultation.css';
import data from '../../data/data';
import { redirect, useNavigate } from 'react-router-dom';
import LocationFinder from '../../client/map/LocationFinder';



const Consultation = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [tel, setTel] = useState(null);
    const [doc, setDoc] = useState(null);
    const [mess, setMess] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [dis, setDis] = useState(null);
    const [area, setArea] = useState(null);
    const [loc, setLoc] = useState(null);
    const [showMap, setShowMap] = useState(false);


    const [note, setNote] = useState('');
    const token = localStorage.getItem("access_token") || null;
    const user = localStorage.getItem("user") || null;
    const [locationDetais, setLocationDetais] = useState(null);
    const [address, setAddress] = useState('');
    const [state, setState] = useState('');
    const [crUser, setCrUser] = useState();

    useEffect(() => {
    // Side effect code here
    if (user) {
            try {
                const parsedUser = JSON.parse(user);
                setCrUser(parsedUser);
                console.log("Parsed user:", parsedUser);
            } catch (error) {
                console.error("Error parsing user:", error);
            }
        }
    }, [user]);


    useEffect(() => {
        if (crUser) {
            console.log("Setting form fields for:", crUser.username);
            console.log("User full_name:", crUser.full_name);
            console.log("User email:", crUser.email);
            console.log("User phone:", crUser.phone_number);
            
            // Set form fields with user data
            setName(crUser.full_name || '');     // ✅ Use variable, not string
            setEmail(crUser.email || '');
            setTel(crUser.phone_number || '');
            
            console.log("After setting - Name:", crUser.full_name);
        }
    }, [crUser]); // Runs when crUser changes
    
    
    


    

    const handleAreaDisChange = (prarea, prdis, point,deta) => {
        console.log(deta)
        setAddress('');
        setState('');

        if (deta.address && deta.state){
            setAddress(deta.address) || '';
            setState(deta.state) || '';

        }
        
        setArea(prarea);
        setDis(prdis);
        setLoc(point)
        // console.log('parent' + prarea + ' ' + prdis + ' ', point)
        setNote('adress = '+ address +' state = '+ state +' location ~= ' + point + ' , area ~= ' + prarea + 'm², distance ~= ' + prdis + 'km, price ~= ' + ((prarea / 10000 * 2000) + (prdis / 100 * 60)) + ' dt');
        // setNote(' location ~= ' + point + ' , area ~= ' + prarea + 'm², distance ~= ' + prdis + 'km, price ~= ' + ((prarea / 10000 * 2000) + (prdis / 100 * 60)) + ' dt');
    };


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
        formData.append('notes', note);

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

            if (token && showMap){
                console.log(token)
                try {
                    const formDataToSend = new FormData();

                    formDataToSend.append('name', `proposition project de ${name} contact ${tel}`);
                    console.log(area+' '+dis+' '+((area / 5) + (dis / 1.6)).toFixed(2))
                    // formDataToSend.append('price', `${((area / 5) + (dis / 1.6)).toFixed(2)}`) ;
                    formDataToSend.append('area', area) ;
                    formDataToSend.append('distance', dis) ;
                    formDataToSend.append('status', 'idea');
                    formDataToSend.append('description', `project ${dis} m away area of ${area} cote ${((area / 5) + (dis / 1.6)).toFixed(2)}`);
                    // console.log(loc)
                    formDataToSend.append('location', `${[loc[1],loc[0]]}`);
                    formDataToSend.append('address', `${address}`);
                    formDataToSend.append('state', `${state}`);

                    const response = await fetch('http://localhost:8000/api/projects/cs/create/', {
                        method: 'POST',
                        headers: {
                            // "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`, // or your auth type
                        },
                        body: formDataToSend,
                    });

                    if (!response.ok) {
                        console.log("BACKEND ERROR 👉", response);
                        throw new Error(JSON.stringify(response));
                    }

                    console.log("project created ✅");

                } catch (err) {
                    console.error(err);
                    setError(err.message);
                }
            }
            setSuccess(true);

            // Reset form
            setName('');
            setEmail('');
            setTel(null);
            setDoc(null);
            setMess('');
            setArea(0);
            setDis(0);
            setArea(null)
            setDis(null)

            // Reset file input
            e.target.reset();

        } catch (error) {
            // console.error('Error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='cs main-cnt-div'>
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
                            <div className='radio'>
                                <input type='radio' name='r1' className='custom-radio' onClick={() => (setShowMap(false))} /><label>formation</label>
                            </div>
                            <div>
                                {/* <input type='radio' name='r1' className='custom-radio' /><label>Consultation</label> */}
                                <div>
                                    <input type='radio' name='r1' className='custom-radio' onClick={() => (setShowMap(true))} /><label>Musure</label>
                                </div>
                            </div>
                        </div>

                        {/* <p>Name</p> */}
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}

                            placeholder='Name'
                            className='txt'
                            required
                        />

                        {/* <p>Email</p> */}
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Email'
                            className='txt'

                        />

                        {/* <p>Tel (Optional)</p> */}
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
                        {/* {tel === null && (
                            <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                                No number provided (optional)
                            </small>
                        )}
                        {tel !== null && (
                            <small style={{ color: '#4CAF50', display: 'block', marginTop: '5px' }}>
                                Number: {tel}
                            </small>
                        )} */}

                        {/* <p>Message</p> */}
                        <textarea
                            value={mess}
                            onChange={(e) => setMess(e.target.value)}
                            placeholder='Message'
                            required
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
                                className='btn click-btn2 main-btn'
                                disabled={loading}
                                style={{ opacity: loading ? 0.7 : 1 }}
                            >
                                {loading ? 'Submitting...' : data.Contact.btn.txt}
                            </button>
                        )}
                    </div>
                    {showMap && <div className='p2'>
                        <div>
                            <p>choisie votre area :</p>
                            <br />
                        </div>
                        <div className='map-cnt'>
                            <LocationFinder setinfo={handleAreaDisChange} />
                        </div>
                    </div>}
                </div>
            </form>
        </div>
    );
};

export default Consultation;