import React from 'react'
import Home from '../home/Home'
import Ads from '../ads/Ads'
import Services from '../services/Services'
import Case from '../case/Case'
import HomeTeam from '../team/HomeTeam'
import Contact from '../contact/Contact'
import Footer from '../footer/Footer'
import About from '../about/About'
import HomeWork from '../work/HomeWork'
import Nav from '../nav/Nav'

const Homepage = () => {
  return (
    <>
        <Home/>
        <Ads/>
        <About/>
        <Services/>
        <Case/>
        <HomeWork/>
        <HomeTeam/>
        <Contact/>
        
    </>
  )
}

export default Homepage