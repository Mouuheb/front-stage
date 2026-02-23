import React from 'react'
import Home from '../home/Home'
import Ads from '../ads/Ads'
import Services from '../services/Services'
import Case from '../case/Case'
import Work from '../work/Work'
import Team from '../team/Team'
import Contact from '../contact/Contact'
import Footer from '../footer/Footer'
import About from '../about/About'
import Consultation from '../consultation/Consultation'

const Homepage = () => {
  return (
    <>
    
        <Home/>
        <Ads/>
        <About/>
        <Services/>
        <Case/>
        <Work show={true} />
        <Team/>
        {/* <Contact/> */}
        <Consultation/>
        
    </>
  )
}

export default Homepage