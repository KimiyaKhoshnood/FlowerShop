import ChangeDate from "@/components/ChangeDate";
import HotDeals from "@/components/sections/HotDeals";
import ProductCard from "@/components/ui/ProductCard";
import { GetAllProducts, GetRequestedProducts } from "@/data/GetData";
import React from "react";

export type EachProduct = {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  description?: string;
};

export type ProductCardType = EachProduct & {
  haveAddToCardSection: boolean;
  linkToUrl: string;
};

const page = async () => {
  const allProducts: EachProduct[] = await GetAllProducts();
  const requestedProducts: EachProduct[] = await GetRequestedProducts("http://localhost:3004/products?category=Tulips");
  console.log("requestedProducts: ", requestedProducts);
  
  const uniqueCategories = [...new Set(allProducts.map((item) => item.category))];

  return (
    <>
      <div className="md:py-10">
        <div className="text-(--Burgundy) flex justify-between md:flex-row flex-col-reverse lg:px-20 md:px-10">
          <h1 className="sm:text-4xl text-3xl font-bold md:p-0 py-5 px-10">
            Shop All Flowers
          </h1>
          <ChangeDate/>
        </div>
        <div className="lg:px-20 px-10 w-full grid grid-cols-4">
          <div className="py-5">
            <div className="flex flex-col gap-2">
              <h3 className="text-(--Burgundy) font-bold text-lg">Category</h3>
              <div className="flex flex-wrap gap-2 text-(--Burgundy)">
                {
                  uniqueCategories.map((elem)=>{
                    return <span className="block w-fit border rounded-3xl py-1 px-2 text-sm hover:bg-(--Burgundy) hover:text-white cursor-pointer">{elem}</span>
                  })
                }
              </div>
            </div>
          </div>
          {/* dont forget filter */}
          <div className="col-span-3 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 py-4 w-full">
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
                  linkToUrl={`/store/`}
                />
              );
            })}
          </div>
        </div>
        <div className="lg:px-20 px-10 py-5 flex justify-end gap-2 text-(--Burgundy)">
          <span>{"<"}</span>
          <span>1</span>
          <span className="font-bold">2</span>
          <span>3</span>
          <span>{">"}</span>
        </div>
      </div>
      <HotDeals />
    </>
  );
};

export default page;
