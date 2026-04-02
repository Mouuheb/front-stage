import React from 'react'
import data from '../../data/data'
import './footer.css'
import { PiStarFourFill } from "react-icons/pi";
import { FaLinkedinIn, FaFacebook, FaInstagram } from "react-icons/fa6";

const Footer = () => {
  return (
    // <div className='footer-bg'>
    <div className='footer-page main-cnt-div' >
        <div className='p1' >
            <div className='logo'>
                <div className='img-cnt' >
                    <img src={data.logo} />
                </div>
                {/* <h1>{data.name}</h1> */}
            </div>
            
            <div className='p2'>
                {data.pageLink.map((link,index) =>{
                    return(
                        <a key={index} href={link.path} >{link.name}</a>
                    )
                } )}
                <a href='/admin' >admin</a>
            </div>
            
            <div className='social' >
                <a className='click-btn2'><FaLinkedinIn className='icon'/></a>
                <a className='click-btn2'><FaFacebook className='icon'/></a>
                <a className='click-btn2'><FaInstagram className='icon'/></a>
                
                

            </div>
        </div>
        <div className='p2-0'>
            <div className='p2-1'>
                <h2>{data.footer.title}</h2>
                {data.footer.info.map((item,index)=>{
                    return(
                        <p key={index} >{item}</p>
                    )
                })}
            </div>
            <div className='p2-2' >
                <div className='conponment' >
                    <input placeholder='Email' />
                    <button className='main-btn click-btn2'>{data.footer.button}</button>
                </div>
            </div>
        </div>
        <hr/>
        <div className='p3'>
            <label>{data.footer.copyRaight}</label>
            <label>{data.footer.privecy}</label>
        </div>
    </div>
    // </div>
  )
}

export default Footer