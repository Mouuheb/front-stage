import React, { useState } from 'react'
import SingleProjectAdmin from './SingleProjectAdmin';
import { useParams } from 'react-router-dom';
import '../admin.css'
import NavAdmin from '../nav/NavAdmin';
import Footer from '../../pages/footer/FooterAdmin';

const SingleProjectPageAdmin = () => {
  const { id } = useParams();
  const [proj, setproject] = useState(id)
  return (
    <div className='admin-main-bg'>
      <NavAdmin/>
      <div className='box-margin' ></div>
      <SingleProjectAdmin id={proj}/>
      <Footer/>
    </div>
  )
}

export default SingleProjectPageAdmin