import { EachProduct } from "@/app/store/page"
import ProductCard from "@/components/ui/ProductCard"
import { GetAllProducts } from "@/data/GetData"

const EditProduct = async() => {
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
                  haveAddToCardSection={false}
                  linkToUrl="/dashboard/edit/"
                  />
            })
        }
    </div>
  )
}

export default EditProduct