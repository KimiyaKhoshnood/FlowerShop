import { IDiscount } from "@/types/types";

export type ShoppingItems = {
  id: string;
  qty: number;
};

export type TContextProvider = {
  shoppingItems: ShoppingItems[];
  handleIncreaseProduct: (id: string) => void;
  handleDecreaseProduct: (id: string) => void;
  handleCleanProducts: () => void;
  /** Active discount percent, 0 when no code is applied. */
  discount: number;
  activeDiscount: IDiscount | null;
  setActiveDiscount: (discount: IDiscount | null) => void;
  /** Delivery date as YYYY-MM-DD, or null when not picked yet. */
  deliveryDate: string | null;
  setDeliveryDate: (date: string | null) => void;
};
