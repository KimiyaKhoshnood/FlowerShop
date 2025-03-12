import FormPostToJson from '@/components/FormPostToJson'
import React from 'react'

const Dashboard = () => {
  return (
    <div className='py-5'>
        <h2 className='text-center p-5 text-4xl'>Add Product</h2>
        <FormPostToJson/>
    </div>
  )
}

export default Dashboard