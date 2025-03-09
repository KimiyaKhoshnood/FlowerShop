"use client"
import { useShoppingItemsContext } from "@/context/context";
import { Alert, Snackbar } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form"

type Inputs = {
  discount: string
}

const Discount = () => {

  const [isPendingDiscount, setIsPendingDiscount] = useState<
    "noDiscount" | "Process" | "Discount" | boolean
  >(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { setDiscount, discount } = useShoppingItemsContext();

  const {
    register,
    handleSubmit,
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    axios(`http://localhost:3004/discounts?code=${data.discount}`).then(res=>{
        if (res.data.length!=0) {
            setIsPendingDiscount(false)
            // setIsPendingDiscount("Discount")
            setDiscount(res.data[0].percent)
        } else {
            setIsPendingDiscount(false)
            // setIsPendingDiscount("noDiscount")
            setOpenSnackbar(true);
        }
    })
  }

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
    
    <div className="p-3">
      {(isPendingDiscount == false) && (discount==0) ? (
        <span
          onClick={() => setIsPendingDiscount(true)}
          className="py-2 px-4 bg-amber-200 rounded-2xl cursor-pointer"
        >
          Discount Code?
        </span>
      ) : null}
      {isPendingDiscount == true ? (
        <form action="" className=" flex gap-3" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="Code"
            className="border rounded-md py-1 px-3"
            {...register("discount", { required: true })}
          />
          <button
            type="submit"
            className="bg-lime-300 px-2 py-1 rounded-md"
          >
            Check
          </button>
        </form>
      ) : null}
      {(isPendingDiscount == false) && (discount!=0) ? (
        <>
          <span className="py-2">{discount}% discount is active</span>{" "}
          <span
            onClick={() => {
                setDiscount(0)
                // setIsPendingDiscount("noDiscount")
            }}
            className="py-2 px-4 bg-red-200 rounded-2xl cursor-pointer"
          >
            Disable
          </span>
        </>
      ) : null}
    </div>
    </>
  );
};

export default Discount;
