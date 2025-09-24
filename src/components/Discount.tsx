"use client";
import { useShoppingItemsContext } from "@/context/context";
import { useLanguage } from "@/providers/LanguageProvider";
import { GetDiscountCodeService } from "@/services/services";
import { Alert, Snackbar } from "@mui/material";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import ButtonUI from "./ButtonUI";
import { IDiscount } from "@/types/types";
import { IWebServiceResult } from "@/services/BaseService";

type Inputs = {
  discount: string;
};

const Discount = () => {
  const { dictionary } = useLanguage()
  const [isPendingDiscount, setIsPendingDiscount] = useState<
    "noDiscount" | "Process" | "Discount" | boolean
  >(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { setDiscount, discount } = useShoppingItemsContext();

  const { register, handleSubmit } = useForm<Inputs>();

  const DiscountCodeServiceCallback = (resultData: IDiscount[], result: IWebServiceResult) => {
    if (!result?.hasError) {
      if (resultData.length != 0) {
        setIsPendingDiscount(false);
        setDiscount(resultData[0].percent);
      } else {
        setIsPendingDiscount(false);
        setOpenSnackbar(true);
      }
    }
  }

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    GetDiscountCodeService(data.discount, DiscountCodeServiceCallback)
  };

  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="error">
          {dictionary?.bag?.discount?.wrongCode}
        </Alert>
      </Snackbar>

      <div className="py-3">
        {isPendingDiscount == false && discount == 0 ? (
          <span
            onClick={() => setIsPendingDiscount(true)}
            className="rounded-3xl"
          >
            <ButtonUI
              text={dictionary?.bag?.discount?.discountCodeQuestion}
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
              placeholder={dictionary?.bag?.discount?.code}
              className="border rounded-md py-1 px-3"
              {...register("discount", { required: true })}
            />
            <button type="submit" className="rounded-3xl">
              <ButtonUI
                text={dictionary?.bag?.discount?.check}
                className="bg-(--Burgundy)/10 text-(--Burgundy)"
              />
            </button>
          </form>
        ) : null}
        {isPendingDiscount == false && discount != 0 ? (
          <>
            <span className="py-2">{discount}{dictionary?.bag?.discount?.discountActive}</span>{" "}
            <span
              onClick={() => {
                setDiscount(0);
              }}
              className="rounded-3xl"
            >
              <ButtonUI
                text={dictionary?.bag?.discount?.disable}
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
