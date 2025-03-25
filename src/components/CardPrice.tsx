"use client"
import { useShoppingItemsContext } from '@/context/context';

const CardPrice = ({price, className}:{price:number, className?:string}) => {
  const { discount } = useShoppingItemsContext();
    
  return (
    <>
    {discount==0?<span className="text-lg block">{price} $</span>:
    <div className='flex flex-col'>
        <span className="text-xl">{price*(100-discount)/100} $</span>
        <span className="text-sm text-gray-400 line-through">{price} $</span>
    </div>}
    </>
  )
}

export default CardPrice