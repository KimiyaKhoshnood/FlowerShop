"use client";
import { Alert, Snackbar } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Cookie from "js-cookie";

type Inputs = {
  title: string;
  price: string;
  image: string;
  category:string;
  description: string;
};

const FormPostToJson = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    const token = Cookie.get("accessToken")
    axios({
      method: "POST",
<<<<<<< Updated upstream
      url: "https://json-server-vercel-flower-shop.vercel.app/products",
=======
      url: "http://127.0.0.1:8000/products/",
      headers: {
        Authorization: `Bearer ${token}`,
      },
>>>>>>> Stashed changes
      data: { ...data, price: parseInt(data.price) },
    }).then((res) => {
      console.log(res);
      if (res.status == 201) {
        setOpenSnackbar(true);
      }
    }).catch((err) => {
      console.error("Error creating product:", err.response?.data || err.message);
    });;
  };

  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          Created!
        </Alert>
      </Snackbar>

      <form
        action=""
        className=" flex flex-col gap-3 p-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          type="text"
          placeholder="Title"
          className="border rounded-md py-1 px-3"
          {...register("title", { required: true })}
        />
        <input
          type="text"
          placeholder="Price"
          className="border rounded-md py-1 px-3"
          {...register("price", {
            required: true,
            pattern: {
              value: /^[0-9]+$/, // Only numbers allowed
              message: "Only numbers are allowed!",
            },
          })}
        />
        {errors.price && (
          <span className="text-red-600">{errors.price.message}</span>
        )}
        <input
          type="text"
          placeholder="Image"
          className="border rounded-md py-1 px-3"
          {...register("image", { required: true })}
        />
        <input
          type="text"
          placeholder="Category"
          className="border rounded-md py-1 px-3"
          {...register("category", { required: true })}
        />
        <input
          type="text"
          placeholder="Description"
          className="border rounded-md py-1 px-3"
          {...register("description", { required: true })}
        />
        <button type="submit" className="bg-(--Magenta) px-2 py-1 rounded-md">
          Check
        </button>
      </form>
    </>
  );
};

export default FormPostToJson;
