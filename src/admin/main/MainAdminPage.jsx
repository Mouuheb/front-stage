import React from 'react'
import Project from '../project/Project'
import Cat from '../cat/Cat'
import TeamAdmin from '../team/TeamAdmin'
import Consult from '../consult/Consult'
import EquipAdmin from '../equipment/EquipAdmin'
import '../admin.css'
import NavAdmin from '../nav/NavAdmin'
import News from '../news/News'
import SimpleLineChart from '../../chart/Chart'
import TodayDeadline from './TodayDeadline'
import ProjectMap from './ProjectMap'
import Footer from '../../pages/footer/FooterAdmin'
import Best from './Best'

const MainAdminPage = () => {
  return (
    <div>
      <NavAdmin/>
      <div className='box-margin'></div>
      
      <div className='admin-main-bg'>
        <News/>
        <TodayDeadline/>
        <Best/>
        <SimpleLineChart/>
        <ProjectMap/>
        <Footer/>
        
        {/* <Project/> */}
        {/* <Cat/> */}
        {/* <TeamAdmin/> */}
        {/* <Consult/> */}
        {/* <EquipAdmin/> */}
      </div>
    </div>
  )
}

export default MainAdminPage