import React from 'react'
import CardPrice from './CardPrice'
import { EachProduct } from '@/app/store/page'

const EachProductDetails = async({id, title, price,image, description}:EachProduct) => {
  return (
    <div className="grid grid-cols-4">
      <div className="col-span-1">
        <img src={image} alt="" />
      </div>
      <div className="col-span-3 px-10 py-5">
        <h2 className="text-3xl py-2">{title}</h2>
        <p>{description}</p>
        <CardPrice price={price}/>
      </div>
    </div>
  )
}

export default EachProductDetails