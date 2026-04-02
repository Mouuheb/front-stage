import React from 'react'
import Team from '../team/Team'
import Nav from '../nav/Nav'
import Footer from '../footer/Footer'

const Teampage = () => {
  return (
    <div>
      <Nav/>
      <div className='box-margin'></div>
      <Team/>
      <Footer/>
    </div>
  )
}

export default Teampage