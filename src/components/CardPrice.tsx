"use client"
import { useShoppingItemsContext } from '@/context/context';
import React from 'react'

const CardPrice = ({price}:{price:number}) => {
  const { discount } = useShoppingItemsContext();
    
  return (
    <>
    {discount==0?<span className="text-lg">{price} $</span>:
    <div className='flex flex-col text-end'>
        <span className="text-sm text-gray-400 line-through">{price} $</span>
        <span className="text-lg">{price*(100-discount)/100} $</span>
    </div>}
    </>
  )
}

export default CardPrice