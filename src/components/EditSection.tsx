"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import { SubmitHandler, useForm } from "react-hook-form";
import { redirect, useParams, useRouter } from "next/navigation";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import { capitalizeFirstLetter } from "@/utils/utils";

type Inputs = {
  input: string;
};

const EditSection = () => {
  const [productDetails, setProductDetails] = useState();
  const [selectedCategory, setSelectedCategory] = useState<string>("title");
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter()

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    const token = Cookie.get("accessToken");
    axios.delete(`http://127.0.0.1:8000/api/products/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      console.log("Done", res);
      if (res.status == 200) {
        redirect("/dashboard/product");
      }
    }).catch((error) => {
      console.error("خطا در حذف:", error?.response?.data || error.message);
    });
  };

  const id = useParams().id;

  useEffect(() => {
    axios(
      `http://127.0.0.1:8000/api/products/${id}/`
    ).then((res) => {
      setProductDetails(res.data);
    });
  }, [id]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const token = Cookie.get("accessToken");
    axios
      .patch(
        `http://127.0.0.1:8000/api/products/${id}/`,
        {
          [selectedCategory]: data.input,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("Done", res);
        if (res.status == 200) {
          setOpenSuccessSnackbar(true);
          router.push("/dashboard/product")
        }
      });
  };

  return (
    <>
      <Snackbar
        open={openSuccessSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSuccessSnackbar(false)}
      >
        <Alert onClose={() => setOpenSuccessSnackbar(false)} severity="success">
          Edited!
        </Alert>
      </Snackbar>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are You Sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {"This action can't be undone and it will be deleted permenantly."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleClose();
              handleDelete();
            }}
            autoFocus
            color="error"
          >
            DELETE
          </Button>
        </DialogActions>
      </Dialog>

      <div className="px-10 py-2">
        <h2 className="text-center p-5 text-4xl">
          What do you want to change?
        </h2>

        <div className="py-2">
          <div className="grid grid-cols-5 bg-gray-200 rounded-t-lg w-full">
            {productDetails &&
              Object.keys(productDetails)
                .filter((item) => item !== "id")
                .map((elem) => {
                  return (
                    <div
                      key={elem}
                      onClick={() => setSelectedCategory(elem)}
                      className={`flex justify-center py-2 cursor-pointer ${selectedCategory == elem
                        ? "bg-gray-50 rounded-t-lg border-t border-x border-gray-300"
                        : "bg-gray-200"
                        }`}
                    >
                      {capitalizeFirstLetter(elem)}
                    </div>
                  );
                })}
          </div>

          <div className="bg-gray-50 border-b border-x border-gray-300 py-10 w-full">
            <form
              className="flex justify-center"
              onSubmit={handleSubmit(onSubmit)}
            >
              <input
                type="text"
                placeholder={capitalizeFirstLetter(selectedCategory)}
                className="border border-gray-300 px-5 py-2 focus:outline-0"
                {...register("input", { required: "Field is Required!" })}
              />
              <button
                type="submit"
                className="bg-gray-700 text-white py-2 px-5"
              >
                Change
              </button>
            </form>
            {errors.input && (
              <p className="text-center text-red-700">{errors.input.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center mt-10 gap-2">
          <span className="text-xs">Want to delete this Product?</span>
          <button
            onClick={handleClickOpen}
            className="text-red-500 text-center text-xs cursor-pointer w-fit"
          >
            DELETE PRODUCT!
          </button>
        </div>
      </div>
    </>
  );
};

export default EditSection;
