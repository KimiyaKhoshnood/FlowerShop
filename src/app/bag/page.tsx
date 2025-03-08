import AddRemove from '@/components/AddRemove'
import React from 'react'

const ShoppingBag = () => {
    const products= [
        {
          "id": "1",
          "title": "Product 1",
          "price": 10.99,
          "image": "https://www.imageskincare.de/media/amasty/webp/catalog/product/cache/1e1e9baf02c2daa40c835fad34d48eeb/2/5/25_3_png.webp",
          "description": "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquam atque possimus repellendus recusandae, quam similique, dolorem ducimus, ipsum blanditiis explicabo necessitatibus quibusdam cumque obcaecati quo sunt."
        },
        {
          "id": "2",
          "title": "Product 2",
          "price": 10,
          "image": "https://www.imageskincare.de/media/amasty/webp/catalog/product/cache/1e1e9baf02c2daa40c835fad34d48eeb/3/3/33_3_png.webp",
          "description": "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquam atque possimus repellendus recusandae, quam similique, dolorem ducimus, ipsum blanditiis explicabo necessitatibus quibusdam cumque obcaecati quo sunt."
        },
        {
          "id": "3",
          "title": "Product 3",
          "price": 19,
          "image": "https://www.imageskincare.de/media/amasty/webp/catalog/product/cache/1e1e9baf02c2daa40c835fad34d48eeb/2/5/25_3_png.webp",
          "description": "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquam atque possimus repellendus recusandae, quam similique, dolorem ducimus, ipsum blanditiis explicabo necessitatibus quibusdam cumque obcaecati quo sunt."
        },
        {
          "id": "4",
          "title": "Product 4",
          "price": 9,
          "image": "https://www.imageskincare.de/media/amasty/webp/catalog/product/cache/1e1e9baf02c2daa40c835fad34d48eeb/3/3/33_3_png.webp",
          "description": "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquam atque possimus repellendus recusandae, quam similique, dolorem ducimus, ipsum blanditiis explicabo necessitatibus quibusdam cumque obcaecati quo sunt."
        }
      ]
  return (
    <div>
        {products.map((each)=>{
            return <div className='px-10 py-2'>
                <div className='flex border p-2'>
                    <img className='w-40 px-5' src={each.image} alt="" />
                    <div className='py-5 px-10'>
                        <h2 className='text-2xl'>{each.title}</h2>
                        <p className='py-1 text-lg'>{each.price} $</p>
                        <AddRemove/>
                    </div>
                </div>
            </div>
        })}
    </div>
  )
}

export default ShoppingBag