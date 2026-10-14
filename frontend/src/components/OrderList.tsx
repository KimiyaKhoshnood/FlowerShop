"use client";
import { useLanguage } from "@/providers/LanguageProvider";
import { IEachProduct, IOrder } from "@/types/types";
import { stringFormat } from "@/utils/utils";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";

type IOrderLine = IEachProduct & { qty: number };

const OrderList = ({
  order,
  products,
  row,
}: {
  order: IOrder;
  products: IEachProduct[];
  row: number;
}) => {
  const { lang, dictionary } = useLanguage()
  const [open, setOpen] = useState(false);

  const discount = order.discount_percent ?? 0;
  const orderLines: IOrderLine[] = order.items.flatMap((item) => {
    const product = products.find((product) => Number(product.id) == item.product);
    return product ? [{ ...product, qty: item.qty }] : [];
  });

  const totalQty = order.items.reduce((total, item) => total + item.qty, 0);
  const totalPrice = orderLines.reduce((total, line) => total + Number(line.price) * line.qty, 0);
  const totalWithDiscount = (totalPrice * (100 - discount)) / 100;

  const formatDate = (date?: string | null) => date
    ? dayjs(date).toDate().toLocaleDateString(lang == "fa" ? "fa-IR" : "en-US", { year: "numeric", month: "short", day: "numeric" })
    : "—";

  return (
    <>
      <Dialog
        onClose={() => setOpen(false)}
        aria-labelledby={`order-${row}-title`}
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id={`order-${row}-title`}>
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
          {orderLines.map((line, i) => (
            <div
              key={line.id}
              className={`grid grid-cols-5 items-center gap-5 px-2 ${i % 2 ? "bg-neutral-100" : ""}`}
            >
              <div className="flex justify-center">
                <img src={line.image} alt="" width={56} height={56} />
              </div>
              <div className="text-center">{line.title}</div>
              <div className="text-center">{line.qty}</div>
              <div className="text-center">{line.price}</div>
              <div className="text-center">
                {(Number(line.price) * line.qty).toFixed(2)}
              </div>
            </div>
          ))}
          <div className="pt-4">{dictionary?.dashboard?.orders?.totalPrice}: {totalPrice.toFixed(2)}</div>
          <div>{dictionary?.dashboard?.orders?.discount}: {discount}%</div>
          <div>{dictionary?.dashboard?.orders?.priceWithDiscount}: {totalWithDiscount.toFixed(2)}</div>
          <div>{dictionary?.dashboard?.orders?.date}: {formatDate(order.created_at)}</div>
          <div>{dictionary?.dashboard?.orders?.deliveryDate}: {formatDate(order.delivery_date)}</div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setOpen(false)}>
            {dictionary?.dashboard?.orders?.ok}
          </Button>
        </DialogActions>
      </Dialog>

      <div
        className={`grid grid-cols-5 py-1 ${row % 2 ? "bg-neutral-100" : "bg-neutral-50"}`}
      >
        <div className="text-center py-2">{row}</div>
        <div className="text-center py-2">{discount}%</div>
        <div className="text-center py-2">{totalQty}</div>
        <div className="text-center py-2">{totalWithDiscount.toFixed(2)}</div>
        <div className="flex justify-center items-center">
          <button
            type="button"
            className="px-2 py-0.5 w-fit h-fit bg-emerald-600/50 hover:bg-emerald-600/80 cursor-pointer rounded-sm"
            onClick={() => setOpen(true)}
          >
            {dictionary?.dashboard?.orders?.more}
          </button>
        </div>
      </div>
    </>
  );
};

export default OrderList;
