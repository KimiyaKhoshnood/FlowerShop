"use client";
import { useShoppingItemsContext } from "@/context/context";
import React from "react";


export const ProductQty = () => {
  const { shoppingItems } = useShoppingItemsContext()
  return <span className="bg-red-500 rounded-full px-1">{shoppingItems.length}</span>
}


const AddToCard = ({ id }: { id: string }) => {

  const { handleIncreaseProduct, handleDecreaseProduct, shoppingItems } = useShoppingItemsContext();

  const handleProductQty = () => {
    const findByID = shoppingItems.find(
      (shoppingItems) => shoppingItems.id == id
    );
    if (findByID == null) {
      return 0;
    } else {
      return findByID?.qty;
    }
  };


  return (
    <>
      {handleProductQty() == 0 ? (
        <button
          onClick={() => handleIncreaseProduct(id)}
          className="bg-amber-200 px-3 py-1 rounded-2xl"
        >
          Add +
        </button>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={() => handleIncreaseProduct(id)}
            className="bg-sky-200 w-7 text-center"
          >
            +
          </button>
          <span className="py-1">{handleProductQty()}</span>
          <button 
            onClick={() => handleDecreaseProduct(id)}
            className="bg-sky-200 w-7 text-center"
          >
            -
          </button>
        </div>
      )}
    </>
  );
};

export default AddToCard;
