import React from 'react'

const Lang = (props) => {
  // console.log(props.index)
  return (
    <div className='lang-chip' style={{backgroundColor:props.bgColor, color:props.color}}>
      {props.name}
    </div>
  )
}

export default Lang
