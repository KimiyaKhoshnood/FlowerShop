"use client";
import { useShoppingItemsContext } from "@/context/context";
import { Alert, Snackbar } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import ButtonUI from "./ui/ButtonUI";

type Inputs = {
  discount: string;
};

const Discount = () => {
  const [isPendingDiscount, setIsPendingDiscount] = useState<
    "noDiscount" | "Process" | "Discount" | boolean
  >(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { setDiscount, discount } = useShoppingItemsContext();

  const { register, handleSubmit } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    axios(
      `https://json-server-vercel-flower-shop.vercel.app/discounts?code=${data.discount}`
    ).then((res) => {
      if (res.data.length != 0) {
        setIsPendingDiscount(false);
        setDiscount(res.data[0].percent);
      } else {
        setIsPendingDiscount(false);
        setOpenSnackbar(true);
      }
    });
  };

  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="error">
          Wrong discount code!
        </Alert>
      </Snackbar>

      <div className="py-3">
        {isPendingDiscount == false && discount == 0 ? (
          <span
            onClick={() => setIsPendingDiscount(true)}
            className="rounded-3xl"
          >
            <ButtonUI
              text="Discount Code?"
              className="bg-(--Burgundy)/10 text-(--Burgundy)"
            />
          </span>
        ) : null}
        {isPendingDiscount == true ? (
          <form
            action=""
            className=" flex gap-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              type="text"
              placeholder="Code"
              className="border rounded-md py-1 px-3"
              {...register("discount", { required: true })}
            />
            <button type="submit" className="rounded-3xl">
              <ButtonUI
                text="Check"
                className="bg-(--Burgundy)/10 text-(--Burgundy)"
              />
            </button>
          </form>
        ) : null}
        {isPendingDiscount == false && discount != 0 ? (
          <>
            <span className="py-2">{discount}% discount is active</span>{" "}
            <span
              onClick={() => {
                setDiscount(0);
              }}
              className="rounded-3xl"
            >
              <ButtonUI
                text="Disable"
                className="bg-(--Burgundy)/10 text-(--Burgundy) text-sm"
              />
            </span>
          </>
        ) : null}
      </div>
    </>
  );
};

export default Discount;
