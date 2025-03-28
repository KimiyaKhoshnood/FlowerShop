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
    {productDetails && <div className="border border-gray-300 rounded-lg p-2 bg-(--Burgundy)/5 flex justify-between items-center">
      <div className="flex md:gap-10 gap-2">
        <img className="md:w-40 w-28 " src={productDetails.image} alt="" />
        <div className="py-5">
          <h2 className="md:text-2xl text-lg">{productDetails.title}</h2>
          <CardPrice price={productDetails.price} />
          {/* <AddToCard id={id} /> */}
        </div>
      </div>
      <AddToCard id={id} />
    </div>}
    </>
  );
};

export default ShoppingBagCard;
