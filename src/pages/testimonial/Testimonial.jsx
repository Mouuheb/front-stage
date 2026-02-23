import React from 'react';
import './testimonial.css'
import data from '../../data/data';
data

const Testimonial = () => {
  return (
    <div className='testimonial' >
        <div className='header' >
            <div className='title' >
                <h1>{data.testimonials.title}</h1>
            </div>
            <p>{data.testimonials.p}</p>
        </div>

        <div className='element' >
            {data.testimonials.comment.map((item)=>{
                return(
                    <div className='card' key={item.id} >
                        <div className='comment' >
                            
                            <p className='txt'>{item.txt}</p>
                            <h2>{item.auther}</h2>
                            <p className='sub'>{item.post}</p>
                        </div>

                    </div>
                )
            })}

        </div>
    </div>
  )
}

export default Testimonial