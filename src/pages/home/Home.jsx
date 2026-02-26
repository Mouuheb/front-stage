import React from 'react'
import './home.css'
import data from '../../data/data'
import { useNavigate } from 'react-router-dom';
import DroneCanvas from '../../3d/Drone';
const Home = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/');
        // or with state
        navigate('/cs', { state: { from: 'home' } });
    };
  return (
    <div className='home' >
        <div className='containner'>
            <div className='contnent-containner' >
                <h1>{data.header.title}</h1>
                <div className='image-containner-ph'>
                    <img src={data.header.img} />
                </div>
                <p>{data.header.p}</p>
                <div className='btn-cmp' >
                {data.header.btn.map((btn,index)=>{
                    return(
                        btn.vzbl && <button className='btn click-btn' key={index} onClick={handleClick} >
                            {btn.btnText}

                        </button>

                    )
                })}
                </div>
                

            </div>
            <div className='image-containner'>
                <DroneCanvas/>
                {/* <img src={data.header.img} /> */}
            </div>

        </div>
    </div>
  )
}

export default Home