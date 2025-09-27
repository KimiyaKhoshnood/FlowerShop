"use client";
import { useLanguage } from "@/providers/LanguageProvider";
import { IWebServiceResult } from "@/services/BaseService";
import { GetProductService } from "@/services/services";
import { IEachProduct } from "@/types/types";
import { stringFormat } from "@/utils/utils";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";

type IOrderList = {
  id: string;
  title: string;
  qty: number;
  price: number;
  description?: string;
  image: string;
};

const OrderList = ({
  shoppingItems,
  discount,
  row,
}: {
  shoppingItems: { product: number, qty: number }[];
  discount: number;
  row: number;
}) => {
  const { dictionary } = useLanguage()
  const [open, setOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState<IOrderList[]>([]);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const fetchOrderDetails = async () => {
    try {
      const requests: Promise<IOrderList>[] = shoppingItems.map(
        (item) =>
          new Promise<IOrderList>((resolve, reject) => {
            GetProductService(item.product.toString(), (resultData: IEachProduct, result: IWebServiceResult) => {
              if (result.hasError) {
                reject(result.message);
              } else {
                resolve({
                  ...item,
                  ...resultData,
                });
              }
            });
          })
      );

      const results: IOrderList[] = await Promise.all(requests);
      setOrderDetails(results);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

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
          {stringFormat(dictionary?.dashboard?.orders?.detailsTitle, row.toString())}
        </DialogTitle>
        <DialogContent dividers>
          <div className="grid grid-cols-5 gap-5 bg-neutral-100 p-2">
            {
              dictionary?.dashboard?.orders?.detailsHeaders?.map((header: string) => (
                <div key={header} className="text-center">{header}</div>
              ))
            }
          </div>
          {orderDetails.map((elem, i) => {
            return (
              <div
                key={i}
                className={`grid grid-cols-5 items-center gap-5 px-2 ${i % 2 ? "bg-neutral-100" : ""
                  }`}
              >
                <div className="flex justify-center">
                  <img src={elem.image} alt="" width={56} height={56} />
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
          <div className="pt-4">{dictionary?.dashboard?.orders?.totalPrice}: {sumPrices()}</div>
          <div className="">{dictionary?.dashboard?.orders?.discount}: {discount}%</div>
          <div className="">
            {dictionary?.dashboard?.orders?.priceWithDiscount}: {sumPricesWithDiscount().toFixed(2)}
          </div>
          <div className="">{dictionary?.dashboard?.orders?.deliveryDate}: {"????"}</div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            {dictionary?.dashboard?.orders?.ok}
          </Button>
        </DialogActions>
      </Dialog>

      <div
        className={`grid grid-cols-5 py-1 ${row % 2 ? "bg-neutral-100" : "bg-neutral-50"}`}
      >
        <div className="text-center py-2">{row}</div>
        <div className="text-center py-2">{discount}%</div>
        <div className="text-center py-2">{sumQty()}</div>
        <div className="text-center py-2">{sumPricesWithDiscount().toFixed(2)}</div>
        <div className="flex justify-center items-center">
          <button
            className="px-2 py-0.5 w-fit h-fit bg-emerald-600/50 hover:bg-emerald-600/80 cursor-pointer rounded-sm"
            onClick={handleClickOpen}
          >
            {dictionary?.dashboard?.orders?.more}
          </button>
        </div>
      </div>
    </>
  );
};

export default OrderList;
