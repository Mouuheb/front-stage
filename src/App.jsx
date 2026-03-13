import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Nav from './pages/nav/Nav'
import Homepage from './pages/rooter/Homepage'
import Projects from './pages/rooter/projects'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Teampage from './pages/rooter/Teampage'
import Consultationpage from './pages/rooter/Consultationpage'
import SingleProjectPage from './pages/rooter/SingleProjectPage'
import Footer from './pages/footer/Footer'
import MainAdminPage from './admin/main/MainAdminPage'
import { useLocation } from 'react-router-dom';
import Work from './pages/work/Work'
import Project from './admin/project/Project'
import SingleProjectPageAdmin from './admin/project/SingleProjectPageAdmin'
import SingleProjectUpAdmin from './admin/project/SingleProjectUpAdmin'
import SingleProjectCrAdmin from './admin/project/SingleProjectCrAdmin'
import Cat from './admin/cat/Cat'
import CreateCatAdmin from './admin/cat/CreateCatAdmin'
import UpdateCatAdmin from './admin/cat/UpdateCatAdmin'
import Team from './pages/team/Team'
import { SiTelegram } from 'react-icons/si'
import TeamAdmin from './admin/team/TeamAdmin'
import SingleTemAdmin from './admin/team/SingleTemAdmin'
import UpdateSingleTeamAdmin from './admin/team/UpdateSingleTeamAdmin'
import CreateTeamAdmin from './admin/team/CreateTeamAdmin'
import Consult from './admin/consult/Consult'
import SingleCSAdmin from './admin/consult/SingleCSAdmin'
import UpdateCsAdmin from './admin/consult/UpdateCsAdmin'
import CreateCSAdmin from './admin/consult/CreateCSAdmin'
import EquipAdmin from './admin/equipment/EquipAdmin'
import SingleEquipAdmin from './admin/equipment/SingleEquipAdmin'
import UpdateEquipAdmin from './admin/equipment/UpdateEquipAdmin'
import CreateEquipAdmin from './admin/equipment/CreateEquipAdmin'
import NavAdmin from './admin/nav/NavAdmin'
import LocationFinder from './client/map/LocationFinder'
import MapWithPolygonDraw from './client/map/MapWithPolygonDraw'
import AreaMap from './client/map/AreaMap'
import Chat from './ai/Chat'
import Login from './auth/Login'
import CreateAcc from './auth/CreateAcc'
import Profile from './auth/Profile'
import ConversationList from './Messages/Conversation'
import ConversationDetail from './Messages/ConversationDetail'
import FileList from './potree/FileList'
import UploadZip from './potree/UploadZip'
// import EarthCanvas from './3d/Drone'

import './App.css'
import NavAuth from './auth/NavAuth'
import { Stars } from '@react-three/drei'
import StarsCanvas from './3d/stars'

function App() {
  const[open,setOpen]=useState(false);
  const location = useLocation();
  const hideNavPaths = ['/register', '/sgprj/'];
  // const hideNav = location.pathname.includes('/admin') || hideNavPaths.some(path => location.pathname.startsWith(path));
  const hideNav = location.pathname.includes('/admin') || hideNavPaths.some(path => location.pathname.startsWith(path));
  const hideNav2 = location.pathname.includes('/clt')
  // const hideNavPaths = ['/admin/', '/register', "/admin/prj", "/admin/cat","/sgprj/"]; // add paths where Nav should be hidden


  return (
    <>
    <StarsCanvas/>
    
    
      {/* {!hideNav.includes(location.pathname) ? <Nav /> : null} */}
      {/* {!hideNav &&!hideNav2 && } */}
      {/* {hideNav &&!hideNav2 && <NavAdmin />} */}
      <Nav />
      
      {!hideNav2 &&
      <div className='chat-cnt'>
        {open && <div className='chat-bx'><Chat/></div>}
        <p className='chat-btn-op click-btn2' onClick={()=>(setOpen(!open))}>Chat</p>
        
        
        

      </div>}

      <Routes>
        <Route path="/" element={<Homepage />}>
          <Route index element={<Homepage />} />

        </Route>
        <Route path="/prj" element={<Work/>} />
        <Route path="/sgprj/:id" element={<SingleProjectPage />} />
        <Route path="/tm" element={<Teampage />} />
        <Route path="/cs" element={<Consultationpage />} />
        <Route path="/prj/sgprj/:id" element={<SingleProjectPage />} />

        {/* admin */}
        <Route path="/admin" element={<MainAdminPage />}/>
        {/* project */}
        <Route path="/admin/prj" element={<Project />} />
        <Route path="/admin/sgprj/:id" element={<SingleProjectPageAdmin />} />
        <Route path="/admin/upsgprj/:id" element={<SingleProjectUpAdmin />} />
        <Route path="/admin/crtprj/" element={<SingleProjectCrAdmin />} />

        {/* cat */}
        <Route path="/admin/cat" element={<Cat />} />
        <Route path="/admin/upsgcat/:id" element={<UpdateCatAdmin />} />
        <Route path="/admin/crtcat" element={<CreateCatAdmin />} />

        {/* team */}
        <Route path="/admin/tm" element={<TeamAdmin />} />
        <Route path="/admin/sgtm/:id" element={<SingleTemAdmin />} />
        <Route path="/admin/upsgtm/:id" element={<UpdateSingleTeamAdmin />} />
        <Route path="/admin/crttm/" element={<CreateTeamAdmin />} />

        {/* consultation */}
        <Route path="/admin/cs" element={<Consult />} />
        <Route path="/admin/sgcs/:id" element={<SingleCSAdmin />} />
        <Route path="/admin/upsgcs/:id" element={<UpdateCsAdmin />} />
        <Route path="/admin/crtcs/" element={<CreateCSAdmin />} />

        {/* equipment */}
        <Route path="/admin/eq" element={<EquipAdmin />} />
        <Route path="/admin/sgeq/:id" element={<SingleEquipAdmin />} />
        <Route path="/admin/upsgeq/:id" element={<UpdateEquipAdmin />} />
        <Route path="/admin/creq/" element={<CreateEquipAdmin />} />

        {/* <Route path="/clt" element={<LocationFinder/>} /> */}
        {/* <Route path="/clt2" element={<MapWithPolygonDraw />} /> */}
        {/* <Route path="/clt3" element={<AreaMap />} /> */}
        <Route path="/chat" element={<Chat />} />


        {/* auth */}
        <Route path="/clt/login" element={<Login />} />
        <Route path="/clt/cracc" element={<CreateAcc />} />
        <Route path="/prfl" element={<Profile/>} />
        <Route path="/authset" element={<NavAuth/>} />

        {/* message */}
        <Route path="/allcnv" element={<ConversationList/>} />
        <Route path="/conversations/:id" element={<ConversationDetail />} />


        {/* potree */}
        <Route path="/uppotr" element={<UploadZip/>} />
        <Route path="/potr" element={<FileList/>} />

        
    


      </Routes>
      {!hideNav2 &&<Footer />}
    </>
  )
}

export default App
