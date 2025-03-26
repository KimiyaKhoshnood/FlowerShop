import CardPrice from "@/components/CardPrice";
import HotDeals from "@/components/sections/HotDeals";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/ui/ProductCard";
import { GetAllProducts } from "@/data/GetData";
import Link from "next/link";
import React from "react";

export type EachProduct = {
  id: string;
  title: string;
  price: number;
  image: string;
  description?: string;
};

export type ProductCardType = EachProduct & {
  haveAddToCardSection: boolean;
  linkToUrl: string;
};

const page = async () => {
  const allProducts: EachProduct[] = await GetAllProducts();

  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <>
    <div className="py-10">
      <div className="text-(--Burgundy) flex justify-between lg:px-20 px-10">
        <h1 className="sm:text-4xl text-3xl font-bold">Shop All Flowers</h1>
        <div className="bg-(--BabyPink) py-2 px-4 rounded-3xl w-fit flex items-center gap-2">
          <span>{"Delivery Date: "}</span>
          <span className="font-bold">{formattedDate}</span>
          <Button
            text="Change"
            className="bg-(--Burgundy) text-(--BabyPink) text-xs font-bold"
          />
        </div>
      </div>
      <div className="lg:px-20 px-10 flex w-full">
        {/* <div>FILTER</div> */}
        {/* dont forget filter */}
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 py-4 w-full">
          {allProducts.map((eachProduct) => {
            return (
              <ProductCard
                key={eachProduct.id}
                id={eachProduct.id}
                title={eachProduct.title}
                price={eachProduct.price}
                image={eachProduct.image}
                haveAddToCardSection={false}
                linkToUrl={`/store/`}
              />
            );
          })}
        </div>
      </div>
      <div className="lg:px-20 px-10 flex justify-end gap-2  text-(--Burgundy)">
        <span>{"<"}</span>
        <span>1</span>
        <span className="font-bold">2</span>
        <span>3</span>
        <span>{">"}</span>
      </div>
    </div>
    <HotDeals/>
    </>
  );
};

export default page;
