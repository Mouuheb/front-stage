import React from 'react'
import Project from '../project/Project'
import Cat from '../cat/Cat'
import TeamAdmin from '../team/TeamAdmin'
import Consult from '../consult/Consult'
import EquipAdmin from '../equipment/EquipAdmin'
import '../admin.css'
// import LocationFinder from '../../client/map/LocationFinder'

const MainAdminPage = () => {
  return (
    <div>
      MainAdminPage
      {/* <LocationFinder/> */}
      <Project/>
      <Cat/>
      <TeamAdmin/>
      <Consult/>
      <EquipAdmin/>
    </div>
  )
}

export default MainAdminPage