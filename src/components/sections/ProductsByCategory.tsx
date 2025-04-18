"use client";

import { EachProduct } from "@/app/store/page";
import useDataClient from "@/data/GetDataClient";
import ProductCard from "../ui/ProductCard";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const ProductsByCategory = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [url, setUrl] = useState(searchParams.get("category") || "");

  const { loading } = useDataClient(
    "https://json-server-vercel-flower-shop.vercel.app/products"
  );
  const allProducts: EachProduct[] =
    useDataClient(`https://json-server-vercel-flower-shop.vercel.app/products`)
      .data || [];
  const finalProducts: EachProduct[] =
    useDataClient(
      `https://json-server-vercel-flower-shop.vercel.app/products${
        url == "" ? "" : "?category=" + url
      }`
    ).data || [];
  const uniqueCategories: string[] = [
    ...new Set(allProducts.map((item) => item.category)),
  ];

  const handleCategorySelect = (category?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("category", category);
      router.push(`/store?${params.toString()}`);
      setUrl(category);
    } else {
      params.delete("category");
      router.push(`?${params.toString()}`);
      setUrl("");
    }
  };

  return (
    <>
      <div className="lg:px-20 px-10 w-full grid md:grid-cols-4 grid-cols-1">
        <div className="py-5 pr-5">
          <div className="flex flex-col gap-2">
            <span
              onClick={() => handleCategorySelect()}
              className={`block w-full text-center border rounded-3xl py-1 text-(--Burgundy) hover:bg-(--Burgundy) hover:text-white cursor-pointer ${
                url == "" ? "bg-(--Burgundy) text-white" : ""
              }`}
            >
              Show All
            </span>
            <h3 className="text-(--Burgundy) font-bold text-lg">Category</h3>
            <div className="flex flex-wrap gap-2 text-(--Burgundy)">
              {loading && <span className="text-3xl">Loading...</span>}
              {uniqueCategories.map((elem, i) => {
                return (
                  <span
                    key={i}
                    onClick={() => handleCategorySelect(elem)}
                    className={`block w-fit border rounded-3xl py-1 px-2 text-sm hover:bg-(--Burgundy) hover:text-white cursor-pointer ${
                      url == elem ? "bg-(--Burgundy) text-white" : ""
                    }`}
                  >
                    {elem}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <div className="md:col-span-3 grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 py-4 w-full">
          {finalProducts.map((eachProduct) => {
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
      {/* <div className="lg:px-20 px-10 py-5 flex justify-end gap-2 text-(--Burgundy)">
          <span>{"<"}</span>
          <span>1</span>
          <span className="font-bold">2</span>
          <span>3</span>
          <span>{">"}</span>
        </div> */}
    </>
  );
};

export default ProductsByCategory;
