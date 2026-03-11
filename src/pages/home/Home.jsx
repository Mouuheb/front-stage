import React from 'react'
import './home.css'
import data from '../../data/data'
import { useNavigate } from 'react-router-dom';
import DroneCanvas from '../../3d/Drone';
const Home = () => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/cs', { state: { from: 'home' } });
    };
  return (
    <div className='home' >
        <div className='containner'>
            <div className='contnent-containner main-cnt-div' >
                <h1>{data.header.title}</h1>
                
                <p>{data.header.p}</p>
                <div className='btn-cmp' >
                    <button className='btn click-btn main-btn' onClick={handleClick} >
                            {data.header.btn[0].btnText}

                    </button>
                    <a className='btn click-btn main-btn' href='#contact' >
                            {data.header.btn[1].btnText}
                    </a>
                </div>
            </div>
            <div className='model-cmp'>
                <DroneCanvas/>
            </div>

        </div>
    </div>
  )
}

export default Home