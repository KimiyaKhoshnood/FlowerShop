"use client";
import { useShoppingItemsContext } from "@/context/context";
import ButtonUI from "./ButtonUI";

export const ProductQty = () => {
  const { shoppingItems } = useShoppingItemsContext();
  return (
    <span className="bg-red-500 rounded-full w-5 h-5 text-sm flex justify-center items-center">
      {shoppingItems.length}
    </span>
  );
};

const AddToCard = ({ id }: { id: string }) => {
  const { handleIncreaseProduct, handleDecreaseProduct, shoppingItems } =
    useShoppingItemsContext();

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
    <div className="h-fit">
      {handleProductQty() == 0 ? (
        <div
          onClick={() => handleIncreaseProduct(id)}
          className="w-fit rounded-3xl"
        >
          <ButtonUI
            text="Add Product"
            className="bg-(--Magenta) text-white text-nowrap"
          />
        </div>
      ) : (
        <div className="flex text-(--Burgundy) text-3xl gap-2">
          <button
            onClick={() => handleDecreaseProduct(id)}
            className="w-7 text-center cursor-pointer"
          >
            -
          </button>
          <span className="py-1">{handleProductQty()}</span>
          <button
            onClick={() => handleIncreaseProduct(id)}
            className="w-7 text-center cursor-pointer"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};

export default AddToCard;
