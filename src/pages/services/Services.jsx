import React from 'react'
import './services.css'
import data from '../../data/data'
import { TiLink } from "react-icons/ti";
import { Link } from 'react-router-dom';
const Services = () => {
  return (
    <div className='sev' >
        <div className='containner' >
          <div className='header' >
            <h1>{data.services.title}</h1>
            <p>{data.services.p}</p>
          </div>
          <div className='element'>
            {data.services.element.map((item)=>{
              return(
                <div 
                className = {`card ${item.color === 1 ? 'aa' : item.color === 2 ? 'bb' : 'cc'}`}
                  key={item.id} >
                  <div className='txt-content' >
                    <div>
                    <h2
                    className = {item.color === 1 ? 'txt-aa' : item.color === 2 ? 'txt-bb' : 'txt-cc'}
                    >
                      {item.title1}
                      </h2>
                    {item.p &&<p>{item.p}</p>}
                    

                    </div>
                    
                  </div>
                  
                </div>
              )
            })}

          </div>
          <div className='footer' >
          <div className='card'>
                  <div className='txt-content' >
                    <div>
                    <h2>{data.services.footer.title}</h2>

                    </div>
                    <div>
                      <p>{data.services.footer.p}</p>
                    </div>
                    <div className='btn-cmp'>

                    {data.services.footer.btn.vzbl && (
                      <><div  >

                        </div>
                        <Link to={data.services.footer.path}>
                        <button className='btn click-btn'>{data.services.footer.btn.txt}</button>
                        </Link>
                        </>
                    )
                    }
                    </div>
                  </div>
                  {/* <div className='img-conntainner' >
                    <img src={data.services.footer.img} />
                  </div> */}
                </div>

          </div>
        </div>
    </div>
  )
}

export default Services