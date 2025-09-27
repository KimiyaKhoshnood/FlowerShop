"use client"
import { createContext, useContext, useEffect, useState } from "react";
import { ShoppingItems, TContextProvider } from "./contextType";

const ContextProvider = createContext({} as TContextProvider);

export const useShoppingItemsContext = () => { return useContext(ContextProvider) }

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

  const handleCleanProducts = () => {
    setShoppingItems([])
  }

  useEffect(()=>{
    const storedshoppingItems = localStorage.getItem("shoppingItems")
    if (storedshoppingItems) {
      setShoppingItems(JSON.parse(storedshoppingItems))
    }
  },[])

  useEffect(()=>{
    localStorage.setItem("shoppingItems", JSON.stringify(shoppingItems))
  },[shoppingItems])
  
  return (
    <ContextProvider.Provider value={{ shoppingItems, handleIncreaseProduct, handleDecreaseProduct, handleCleanProducts, discount, setDiscount }}>
      {children}
    </ContextProvider.Provider>
  );
}
