import React, { useEffect, useState } from "react";
import AddToCard from "./AddToCard";
import axios from "axios";
import { EachProduct } from "@/app/store/page";
import CardPrice from "./CardPrice";

const ShoppingBagCard = ({ id }: { id: string }) => {
  const [productDetails, setProductDetails] = useState<EachProduct|null>(null);
  
  useEffect(() => {
    axios(`http://localhost:3004/products/${id}`).then((res) => {
      setProductDetails(res.data);
    });
  }, [id]);

  return (
    <>
    {productDetails && <div className="">
      <div className="flex border p-2">
        <img className="w-40 px-5" src={productDetails.image} alt="" />
        <div className="py-5 px-10">
          <h2 className="text-2xl">{productDetails.title}</h2>
          <CardPrice price={productDetails.price}/>
          <AddToCard id={id} />
        </div>
      </div>
    </div>}
    </>
  );
};

export default ShoppingBagCard;
