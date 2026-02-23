import React from 'react'
import './ads.css'
import data from '../../data/data'

const Ads = () => {
  return (
    <div className='ads'>
        <div className='containner' >
            <div className='ad-list'>
                {data.slider.item.map((item)=>{
                    return(
                        <div className='add' key={item.id} >
                            <img src={item.img} />
                        </div>
                    )
                })}
            </div>

            <div className='ad-list-2'>
                {data.slider.item.map((item)=>{
                    return(
                        <div className='add' key={item.id} >
                            <img src={item.img} />
                        </div>
                    )
                })}
            </div>
        </div>
    </div>
  )
}

export default Ads