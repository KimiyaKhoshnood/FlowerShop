import { createContext, useContext, useState } from "react";

type ShopingItems = {
    id: number;
    qty: number;
}

type TContextProvider = {
    shopingItems: ShopingItems[]
}

const ContextProvider = createContext({} as TContextProvider)

export const useShopingItemsContext = () => {
    return useContext(ContextProvider)
}

export default function RootLayout({
  children,
}: { children: React.ReactNode}) {

    const [shopingItems, setShopingItems] = useState<ShopingItems[]>([])

  return (
    <ContextProvider.Provider value={{shopingItems}}>
      {children}
    </ContextProvider.Provider>
  );
}
