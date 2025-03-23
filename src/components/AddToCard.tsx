"use client";
import { useShoppingItemsContext } from "@/context/context";


export const ProductQty = () => {
  const { shoppingItems } = useShoppingItemsContext()
  return <span className="bg-red-500 rounded-full w-5 h-5 text-sm flex justify-center items-center">{shoppingItems.length}</span>
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
    <div className="h-fit">
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
    </div>
  );
};

export default AddToCard;
