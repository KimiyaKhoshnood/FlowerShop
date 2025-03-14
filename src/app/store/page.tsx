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

export type ProductCardType = EachProduct & {
    haveAddToCardSection: boolean
    linkToUrl: string
}

const page = async() => {

  const allProducts : EachProduct[] = await GetAllProducts()

  return (
    <div className='grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 p-5'>
        {
            allProducts.map(eachProduct=>{
                return <ProductCard 
                  key={eachProduct.id} 
                  id={eachProduct.id}
                  title={eachProduct.title}
                  price={eachProduct.price}
                  image={eachProduct.image}
                  haveAddToCardSection={true}
                  linkToUrl={`/store/`}
                  />
            })
        }
    </div>
  )
}

export default page