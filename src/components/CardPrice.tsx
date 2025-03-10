"use client"
import { useShoppingItemsContext } from '@/context/context';

const CardPrice = ({price}:{price:number}) => {
  const { discount } = useShoppingItemsContext();
    
  return (
    <>
    {discount==0?<span className="text-lg py-2 block">{price} $</span>:
    <div className='flex flex-col py-2'>
        <span className="text-sm text-gray-400 line-through">{price} $</span>
        <span className="text-2xl">{price*(100-discount)/100} $</span>
    </div>}
    </>
  )
}

export default CardPrice