export type ShoppingItems = {
  id: string;
  qty: number;
};

export type TContextProvider = {
  shoppingItems: ShoppingItems[];
  handleIncreaseProduct: (id: string) => void;
  handleDecreaseProduct: (id: string) => void;
  handleCleanProducts: () => void;
  discount: number;
  setDiscount: (discount: number) => void;
};
