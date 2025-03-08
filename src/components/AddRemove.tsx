"use client"
import React from 'react'

const AddRemove = () => {
    const num = 0
  return (
    <>
    {num==0?<div className='bg-amber-200 px-3 py-1 rounded-2xl'>Add +</div>:<div className='flex gap-3'>
        <div className='bg-sky-200 w-7 text-center'>+</div>
        <span>{num}</span>
        <div className='bg-sky-200 w-7 text-center'>-</div>
    </div>}
    </>
  )
}

export default AddRemove