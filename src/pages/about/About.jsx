import React from 'react'
import data from '../../data/data'
import './about.css'

const About = () => {
  return (
    <div className='about-cmp'>

        <div className='img-cmp'>
            <img src={data.about.img} />
        </div>

        <div className='txt-cmp' >
            <h1>
                {data.about.titre}
            </h1>
            <h3>
                {data.about.titre2}
            </h3>
            <p>
                {data.about.p}
            </p>
        </div>
        

    </div>
  )
}

export default About