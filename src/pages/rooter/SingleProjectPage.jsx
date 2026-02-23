import React, { useState } from 'react'
import SingleProject from '../singleProject/SingleProject'
import { useParams } from 'react-router-dom';

const SingleProjectPage = () => {
  const { id } = useParams(); // id = the value from URL
  console.log("----")
  console.log(id)
  const [proj, setproject] = useState(id)
  console.log("2:"+ proj)
  return (
    <>
    <SingleProject id={proj}/>
    </>
  )
}

export default SingleProjectPage