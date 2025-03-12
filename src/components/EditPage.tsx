import React from 'react'
import EachProductDetails from './EachProductDetails'
import { EachProduct } from '@/app/store/page'

const EditPage = ({product, productFilteredItems}:{product:EachProduct, productFilteredItems:string[]}) => {
  return (
    <>
    <h2 className='text-center p-5 text-4xl'>What do you want to change?</h2>
        <div className="flex justify-center gap-5 p-2">
            {
                productFilteredItems.map((elem,i)=>{
                    return <div key={i} className="bg-sky-200 px-10 py-7 rounded-xl cursor-pointer hover:bg-sky-900 hover:text-white hover:rotate-3 transition-colors duration-300 ease-linear">{elem}</div>
                })
            }
        </div>
        <div className="flex justify-center py-2">
            <input type="text" placeholder="Write Here" className="border border-gray-300 px-5 py-2"/>
            <button type="submit" className="bg-blue-500 p-2">Change</button>
        </div>
        <div className="flex justify-center px-10">
          <EachProductDetails  id={ product.id} title={product.title} price={product.price} image={product.image} description={product.description}/>
        </div>
    </>
  )
}

export default EditPage