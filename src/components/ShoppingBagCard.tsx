import { IEachProduct } from "@/types/types";
import axios from "axios";
import { useEffect, useState } from "react";
import AddToCard from "./AddToCard";
import CardPrice from "./CardPrice";
import { baseUrl, endpoints } from "@/constants/endpoints";

const ShoppingBagCard = ({ id }: { id: string }) => {
  const [productDetails, setProductDetails] = useState<IEachProduct | null>(
    null
  );

  useEffect(() => {
    axios(`${baseUrl}${endpoints.products}/${id}/`).then((res) => {
      setProductDetails(res.data);
    });
  }, [id]);

  return (
    <>
      {productDetails && (
        <div className="border border-gray-300 rounded-lg p-2 bg-(--Burgundy)/5 flex justify-between items-center">
          <div className="flex md:gap-10 gap-2">
            <img
              className="md:w-40 w-28 "
              width={160}
              height={160}
              src={productDetails.image}
              alt=""
            />
            <div className="py-5">
              <h2 className="md:text-2xl text-lg">{productDetails.title}</h2>
              <CardPrice price={productDetails.price} justify="items-start" />
              {/* <AddToCard id={id} /> */}
            </div>
          </div>
          <AddToCard id={id} />
        </div>
      )}
    </>
  );
};

export default ShoppingBagCard;
