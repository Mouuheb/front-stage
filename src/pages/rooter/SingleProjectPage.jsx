import React, { useState } from 'react'
import SingleProject from '../singleProject/SingleProject'
import { useParams } from 'react-router-dom';
import Nav from '../nav/Nav';
import Footer from '../footer/Footer';

const SingleProjectPage = () => {
  const { id } = useParams(); // id = the value from URL
  // console.log("----")
  // console.log(id)
  const [proj, setproject] = useState(id)
  // console.log("2:"+ proj)
  return (
    <>
    <Nav/>
    <div className='box-margin'></div>
    <SingleProject id={proj}/>
    <Footer/>
    </>
  )
}

export default SingleProjectPage