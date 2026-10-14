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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { setActiveDiscount, discount } = useShoppingItemsContext();

  const { register, handleSubmit, reset } = useForm<Inputs>();

  const DiscountCodeServiceCallback = (resultData: IDiscount[], result: IWebServiceResult) => {
    if (!result?.hasError && resultData.length != 0) {
      setActiveDiscount(resultData[0]);
      setIsFormOpen(false);
      reset();
    } else {
      setOpenSnackbar(true);
    }
  }

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    GetDiscountCodeService(data.discount.trim(), DiscountCodeServiceCallback)
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
        {!isFormOpen && discount == 0 && (
          <ButtonUI
            onClick={() => setIsFormOpen(true)}
            text={dictionary?.bag?.discount?.discountCodeQuestion}
            className="bg-(--Burgundy)/10 text-(--Burgundy)"
          />
        )}
        {isFormOpen && (
          <form
            className="flex gap-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              type="text"
              placeholder={dictionary?.bag?.discount?.code}
              className="border rounded-md py-1 px-3"
              {...register("discount", { required: true })}
            />
            <ButtonUI
              type="submit"
              text={dictionary?.bag?.discount?.check}
              className="bg-(--Burgundy)/10 text-(--Burgundy)"
            />
          </form>
        )}
        {!isFormOpen && discount != 0 && (
          <div className="flex items-center gap-2">
            <span className="py-2">{discount}{dictionary?.bag?.discount?.discountActive}</span>
            <ButtonUI
              onClick={() => setActiveDiscount(null)}
              text={dictionary?.bag?.discount?.disable}
              className="bg-(--Burgundy)/10 text-(--Burgundy) text-sm"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Discount;
