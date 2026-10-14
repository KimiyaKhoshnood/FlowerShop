"use client"
import { IDiscount } from "@/types/types";
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
  const [activeDiscount, setActiveDiscount] = useState<IDiscount | null>(null);
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null);
  const [hasLoadedBag, setHasLoadedBag] = useState(false);

  const handleIncreaseProduct = (id: string) => {
    setShoppingItems((current) => {
      if (!current.some((item) => item.id == id)) {
        return [...current, { id: id, qty: 1 }]
      }
      return current.map((item) => item.id == id ? { ...item, qty: item.qty + 1 } : item)
    })
  }

  const handleDecreaseProduct = (id: string) => {
    setShoppingItems((current) => current
      .map((item) => item.id == id ? { ...item, qty: item.qty - 1 } : item)
      .filter((item) => item.qty > 0))
  }

  const handleCleanProducts = () => {
    setShoppingItems([])
    setActiveDiscount(null)
  }

  useEffect(() => {
    try {
      const storedShoppingItems = localStorage.getItem("shoppingItems")
      if (storedShoppingItems) {
        setShoppingItems(JSON.parse(storedShoppingItems))
      }
    } catch {
      // Broken or blocked storage just means an empty bag.
    }
    setHasLoadedBag(true)
  }, [])

  useEffect(() => {
    if (!hasLoadedBag) return
    try {
      localStorage.setItem("shoppingItems", JSON.stringify(shoppingItems))
    } catch { }
  }, [shoppingItems, hasLoadedBag])

  return (
    <ContextProvider.Provider value={{
      shoppingItems, handleIncreaseProduct, handleDecreaseProduct, handleCleanProducts,
      discount: activeDiscount?.percent ?? 0, activeDiscount, setActiveDiscount,
      deliveryDate, setDeliveryDate,
    }}>
      {children}
    </ContextProvider.Provider>
  );
}
