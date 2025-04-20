"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Image from "next/image";

type OrderList = {
  id: string;
  title: string;
  qty: number;
  price: number;
  description: string;
  image: string;
};

const OrderList = ({
  shoppingItems,
  discount,
  row,
}: {
  shoppingItems: { id: string; qty: number }[];
  discount: number;
  row: number;
}) => {
  const [open, setOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderList[]>([]);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const fetchOrderDetails = async () => {
    try {
      const requests = shoppingItems.map((item) =>
        axios.get(`http://127.0.0.1:8000/products/${item.id}/`).then((res) => ({
          ...item,
          ...res.data,
        }))
      );
      const results = await Promise.all(requests);
      setOrderDetails(results);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  console.log("orderDetails: ", orderDetails);

  useEffect(() => {
    if (shoppingItems.length > 0) {
      fetchOrderDetails();
    }
  }, [shoppingItems]);

  const sumQty = () => {
    let qty = 0;
    orderDetails.map((elem) => {
      qty += elem.qty;
    });
    return qty;
  };

  const sumPrices = () => {
    let prices = 0;
    orderDetails.map((elem) => {
      prices += elem.price * elem.qty;
    });
    return prices;
  };

  const sumPricesWithDiscount = () => {
    return (sumPrices() * (100 - discount)) / 100;
  };

  return (
    <>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Row {row} Details:
        </DialogTitle>
        <DialogContent dividers>
          <div className="grid grid-cols-5 gap-5 bg-gray-100 p-2">
            <div className="text-center">Image</div>
            <div className="text-center">Title</div>
            <div className="text-center">QTY</div>
            <div className="text-center">Price</div>
            <div className="text-center">Total Price</div>
          </div>
          {orderDetails.map((elem, i) => {
            return (
              <div
                key={i}
                className={`grid grid-cols-5 items-center gap-5 px-2 ${
                  i % 2 ? "bg-gray-100" : ""
                }`}
              >
                <div className="flex justify-center">
                  <Image src={elem.image} alt="" width={56} height={56} />
                </div>
                <div className="text-center">{elem.title}</div>
                <div className="text-center">{elem.qty}</div>
                <div className="text-center">{elem.price}</div>
                <div className="text-center">
                  {(elem.price * elem.qty).toFixed(2)}
                </div>
              </div>
            );
          })}
          <div className="pt-4">Total Price: {sumPrices()}</div>
          <div className="">Discount: {discount}%</div>
          <div className="">
            Total Price with Discount: {sumPricesWithDiscount().toFixed(2)}
          </div>
          <div className="">Delivery Date: {"????"}</div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <div
        className={`grid grid-cols-5 divide-x py-2 ${
          row % 2 ? "bg-gray-100" : "bg-gray-50"
        }`}
      >
        <div className="text-center">{row}</div>
        <div className="text-center">{discount}%</div>
        <div className="text-center">{sumQty()}</div>
        <div className="text-center">{sumPricesWithDiscount().toFixed(2)}</div>
        <div className="flex justify-center">
          <button
            className="px-2 w-fit bg-emerald-600/50"
            onClick={handleClickOpen}
          >
            MORE
          </button>
        </div>
      </div>
    </>
  );
};

export default OrderList;
