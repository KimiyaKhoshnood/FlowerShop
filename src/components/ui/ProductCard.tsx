import { EachProduct } from "@/app/store/page";
import Link from "next/link";
import React from "react";
import AddRemove from "../AddToCard";

const ProductCard = ({ id, title, price, image }: EachProduct) => {
  return (
    <Link href={`/store/${id}`}>
      <div className="border border-gray-300 p-4">
        <div className="h-40 flex justify-center">
          <img className="h-full" src={image} alt="" />
        </div>

        <div className="p-4">
          <h2 className="text-xl">{title}</h2>
          <div className="flex justify-between py-2">
            <AddRemove id={id} />
            <span className="text-lg">{price} $</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
