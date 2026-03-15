import React from 'react'
import Project from '../project/Project'
import Cat from '../cat/Cat'
import TeamAdmin from '../team/TeamAdmin'
import Consult from '../consult/Consult'
import EquipAdmin from '../equipment/EquipAdmin'
import '../admin.css'
import NavAdmin from '../nav/NavAdmin'

const MainAdminPage = () => {
  return (
    <div>
      <NavAdmin/>
      
      <div className='admin-main-bg'>
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