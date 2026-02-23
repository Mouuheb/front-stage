import React, { useState } from 'react'
import SingleProjectAdmin from './SingleProjectAdmin';
import { useParams } from 'react-router-dom';
import '../admin.css'

const SingleProjectPageAdmin = () => {
  const { id } = useParams(); // id = the value from URL
  console.log("----")
  console.log(id)
  const [proj, setproject] = useState(id)
  console.log("2:"+ proj)
  return (
    <>
    <SingleProjectAdmin id={proj}/>
    </>
  )
}

export default SingleProjectPageAdmin