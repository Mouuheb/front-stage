import React from 'react'
import data from '../../data/data'
import './contact.css'

const Contact = () => {
  return (
    <div className='contact' id="contact" >
        <div className='header' >
            <div className='title' >
                <h1>{data.Contact.title}</h1>
            </div>
            <p>{data.Contact.p}</p>
        </div>
        <div className='form' >
            <div className='p1' >
                <div className='radios' >
                <div className='radio'>
                <input type='radio' name='r1' className='custom-radio' /><label>Say Hi</label>
                </div>
                <div>
                <input type='radio' name='r1' className='custom-radio' /><label>Get a quote</label>
                
                </div>

                </div>
                
                <p>Name</p>
                <input placeholder='name' className='txt' />
                <p>Email</p>
                <input placeholder='Email' className='txt' />
                <p>Message</p>
                <textarea placeholder='message' >
            
                

                </textarea>
                <br/>
                { data.Contact.btn.vzbl &&<button className='btn'>{data.Contact.btn.txt}</button>}
                

            </div>
            <div className='p2' >
                {/* <img src={data.Contact.img} /> */}
            </div>

        </div>
    </div>
  )
}

export default Contact