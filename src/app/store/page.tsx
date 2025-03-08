import ProductCard from '@/components/ui/ProductCard'
import { GetAllProducts } from '@/data/GetData';
import React from 'react'

export type EachProduct = {
    id: string
    title: string
    price: number
    image: string
    description?: string
  }

const page = async() => {

    const allProducts : EachProduct[] = await GetAllProducts()

  return (
    <div className='grid grid-cols-4 gap-5 p-5'>
        {
            allProducts.map(eachProduct=>{
                return <ProductCard 
                  key={eachProduct.id} 
                  id={eachProduct.id}
                  title={eachProduct.title}
                  price={eachProduct.price}
                  image={eachProduct.image}
                  />
            })
        }
    </div>
  )
}

export default page