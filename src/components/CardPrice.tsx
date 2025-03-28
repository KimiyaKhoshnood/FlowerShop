"use client"
import { useShoppingItemsContext } from '@/context/context';

const CardPrice = ({price, className}:{price:number, className?:string}) => {
  const { discount } = useShoppingItemsContext();
    
  return (
    <>
    {discount==0?<span className={`${className} text-2xl block text-nowrap`}>$ {price}</span>:
    <div className='flex flex-col'>
        <span className="text-xl text-nowrap">$ {price*(100-discount)/100}</span>
        <span className={`${className} text-sm text-gray-400 line-through text-nowrap`}>$ {price}</span>
    </div>}
    </>
  )
}

export default CardPrice