"use client";
import { useShoppingItemsContext } from "@/context/context";
import ButtonUI from "./ButtonUI";
import { useLanguage } from "@/providers/LanguageProvider";

export const ProductQty = () => {
  const { shoppingItems } = useShoppingItemsContext();
  const totalQty = shoppingItems.reduce((total, item) => total + item.qty, 0);

  if (totalQty == 0) return null;

  return (
    <span className="bg-(--Magenta) text-white rounded-full min-w-5 h-5 px-1 text-xs flex justify-center items-center">
      {totalQty}
    </span>
  );
};

const AddToCard = ({ id }: { id: string }) => {
  const { dictionary } = useLanguage()
  const { handleIncreaseProduct, handleDecreaseProduct, shoppingItems } =
    useShoppingItemsContext();

  const qty = shoppingItems.find((item) => item.id == id)?.qty ?? 0;

  return (
    <div className="h-fit">
      {qty == 0 ? (
        <ButtonUI
          onClick={() => handleIncreaseProduct(id)}
          text={dictionary?.store?.addProduct}
          className="bg-(--Magenta) text-white text-nowrap"
        />
      ) : (
        <div className="flex text-(--Burgundy) text-3xl gap-2">
          <button
            type="button"
            aria-label="-1"
            onClick={() => handleDecreaseProduct(id)}
            className="w-7 text-center cursor-pointer"
          >
            -
          </button>
          <span className="py-1">{qty}</span>
          <button
            type="button"
            aria-label="+1"
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
