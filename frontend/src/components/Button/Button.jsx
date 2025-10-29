import React from 'react'

export default function Button({children, onClick}){
  return (
    <button onClick={onClick} style={{padding:'8px 12px',borderRadius:6}}>{children}</button>
  )
}
