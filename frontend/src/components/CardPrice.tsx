"use client"
import { useShoppingItemsContext } from '@/context/context';

const CardPrice = ({price, className, justify}:{price:number, className?:string, justify?:"items-center"|"items-end"|"items-start"}) => {
  const { discount } = useShoppingItemsContext();
    
  return (
    <>
    {discount==0?<span className={`${className} text-2xl block text-nowrap`}>$ {price}</span>:
    <div className={`flex flex-col ${justify}`}>
        <span className="text-xl text-nowrap">$ {(price*(100-discount)/100).toFixed(2)}</span>
        <span className={`${className} text-sm text-gray-400 line-through text-nowrap`}>$ {price}</span>
    </div>}
    </>
  )
}

export default CardPrice