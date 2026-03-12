import React from 'react'
import './nav.css'
import data from '../../data/data'
import { PiStarFourFill } from "react-icons/pi";
import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <div className='nav invNav'>
        <div className='p1'>
            <div className='logo'>
                <div className='img-cnt' >
                    <img src={data.logo} />
                </div>
                <h1>{data.name}</h1>
            </div>
            
            <div className='p2'>
                {data.pageLink.map((link,index) =>{
                    return (
                        link.out === true ? (
                            <Link to={link.path} key={index} className='links'>
                                <label>{link.name}</label>
                            </Link>
                        ) : (
                            <a className='/links' key={index} href={link.path}>
                            {link.name}
                            </a>
                        )
                        )
                } )}
                
            </div>
        </div>

    </div>
  )
}

export default Nav