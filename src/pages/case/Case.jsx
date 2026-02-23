import React from 'react'
import './case.css'
import { TiLink } from "react-icons/ti";
import data from '../../data/data'
const Case = () => {
  return (
    <div className='case'>
        <div className='header' >
            <div className='title' >
                <h1>{data.CaseStudies.title}</h1>
            </div>
            <p>{data.CaseStudies.p}</p>
        </div>
        <div className='element' >
            {data.CaseStudies.cases.map((item,index)=>{
                return(
                    <ul className='card' key={index} >
                        <li>
                            {item.l1}
                        </li>
                        <li>
                            {item.l2}
                        </li>
                        {item.l3&&<li>
                            {item.l3}
                        </li>}
                    </ul>


                )
            })}

        </div>
    </div>
  )
}

export default Case