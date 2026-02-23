import React from 'react'
import Project from '../project/Project'
import Cat from '../cat/Cat'
import TeamAdmin from '../team/TeamAdmin'
import Consult from '../consult/Consult'
import EquipAdmin from '../equipment/EquipAdmin'
import '../admin.css'

const MainAdminPage = () => {
  return (
    <div>
      MainAdminPage
      <Project/>
      <Cat/>
      <TeamAdmin/>
      <Consult/>
      <EquipAdmin/>
    </div>
  )
}

export default MainAdminPage