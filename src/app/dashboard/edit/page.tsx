import { EachProduct } from "@/app/store/page";
import ProductCard from "@/components/ui/ProductCard";
import { GetAllProducts } from "@/data/GetData";

const EditProduct = async () => {
  const allProducts: EachProduct[] = await GetAllProducts();
  return (
    <div>
      <h2 className="text-center p-5 text-4xl">Edit Product</h2>
      <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-5 pb-5">
        {allProducts.map((eachProduct) => {
          return (
            <ProductCard
              key={eachProduct.id}
              id={eachProduct.id}
              title={eachProduct.title}
              price={eachProduct.price}
              image={eachProduct.image}
              category={eachProduct.category}
              haveAddToCardSection={false}
              linkToUrl="/dashboard/edit/"
            />
          );
        })}
      </div>
    </div>
  );
};

export default EditProduct;
