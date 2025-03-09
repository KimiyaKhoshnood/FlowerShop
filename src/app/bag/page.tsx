"use client";
import ShoppingBagCard from "@/components/ShoppingBagCard";
import { useShoppingItemsContext } from "@/context/context";
import React, { useEffect, useState } from "react";
import { EachProduct } from "../store/page";
import axios from "axios";
import Discount from "@/components/Discount";

const ShoppingBag = () => {
  const { shoppingItems, discount } = useShoppingItemsContext();

  const [allProducts, setAllProducts] = useState<EachProduct[]>([]);
  useEffect(() => {
    axios(`http://localhost:3004/products/`).then((res) => {
      setAllProducts(res.data);
    });
  }, []);

  return (
    <div className="px-10 py-2">
      {shoppingItems?.map((each) => {
        return <ShoppingBagCard key={each.id} id={each.id} />;
      })}

      {/* component for discount and process and total price */}
      <div className="border">
        <div className="p-3">
          <p>Total Discount: <span>{discount}%</span></p>
          <span>Total Price: </span>{" "}
          <span>
            {shoppingItems
              ?.reduce((total, item) => {
                let selectedProduct = allProducts.find(
                  (product) => product.id == item.id
                );
                return total + (selectedProduct?.price || 0) * item.qty * (100-discount)/100;
              }, 0)
              .toFixed(2)}{" "}
            $
          </span>
        </div>
        <Discount/>
      </div>

      <div className="flex justify-center p-10"><button className="bg-sky-200 px-10 py-1 rounded-2xl">buy</button></div>
    </div>
  );
};

export default ShoppingBag;
