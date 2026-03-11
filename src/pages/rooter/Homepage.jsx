import React from 'react'
import Home from '../home/Home'
import Ads from '../ads/Ads'
import Services from '../services/Services'
import Case from '../case/Case'
import Team from '../team/Team'
import Contact from '../contact/Contact'
import Footer from '../footer/Footer'
import About from '../about/About'
import HomeWork from '../work/HomeWork'

const Homepage = () => {
  return (
    <>
    
        <Home/>
        <Ads/>
        <About/>
        <Services/>
        <Case/>
        <HomeWork/>
        <Team/>
        <Contact/>
        
    </>
  )
}

export default Homepage