"use client"
import { createContext, useContext, useState } from "react";

type ShoppingItems = {
  id: string;
  qty: number;
};

type TContextProvider = {
  shoppingItems: ShoppingItems[];
  handleIncreaseProduct: (id:string) => void
  handleDecreaseProduct: (id:string) => void
  discount: number
  setDiscount: (discount: number) => void
};

const ContextProvider = createContext({} as TContextProvider);

export const useShoppingItemsContext = () => {
  return useContext(ContextProvider);
};


export default function ContextProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {  

  const [shoppingItems, setShoppingItems] = useState<ShoppingItems[]>([]);
  const [discount, setDiscount] = useState<number>(0);

  const handleIncreaseProduct = (id:string) => {
    setShoppingItems((current:ShoppingItems[])=>{
      const notInShoppingBag = current.find((item)=>item.id==id) == null

      if (notInShoppingBag) {
        return [...shoppingItems, { id: id, qty: 1 }]
      }
      else {
        return current.map((item)=>{
          if (item.id == id) {
            return { ...item, qty: item.qty + 1 }
          } else {
            return item
          }
        }) 
      }
    })
  }

  const handleDecreaseProduct = (id:string) => {
    setShoppingItems((current:ShoppingItems[])=>{
      const findByID = current.find((item)=>item.id==id)
    if (findByID) {
      if (findByID?.qty==1) {
        return current.filter((item)=>item.id!=id)
      } else {
        return current.map((item)=>{
          if (item.id == id) {
            return { ...item, qty: item.qty - 1 }
          } else {
            return item
          }
        }) 
      }
    } else {
      return current
    }
    })
  }
  
  return (
    <ContextProvider.Provider value={{ shoppingItems, handleIncreaseProduct, handleDecreaseProduct, discount, setDiscount }}>
      {children}
    </ContextProvider.Provider>
  );
}
