"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { redirect, useParams } from "next/navigation";
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    axios.delete(`http://localhost:3004/products/${id}`).then((res) => {
      console.log("Done", res);
      if (res.status == 200) {
        redirect("/dashboard/edit");
      }
    });
  };

  const id = useParams().id;

  useEffect(() => {
    axios(`http://localhost:3004/products/${id}`).then((res) => {
      setProductDetails(res.data);
    });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    axios
      .patch(`http://localhost:3004/products/${id}`, {
        [selectedCategory]: data.input,
      })
      .then((res) => {
        console.log("Done", res);
        if (res.status == 200) {
          setOpenSuccessSnackbar(true);
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
            This action can't be undone and it will be deleted permenantly.
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
          <div className="grid grid-cols-4 bg-gray-200 rounded-t-lg w-full">
            {productDetails &&
              Object.keys(productDetails)
                .filter((item) => item !== "id")
                .map((elem) => {
                  return (
                    <div
                      key={elem}
                      onClick={() => setSelectedCategory(elem)}
                      className={`flex justify-center py-2 cursor-pointer ${
                        selectedCategory == elem
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

        <div className="flex justify-center w-full">
          <button
            onClick={handleClickOpen}
            className="bg-red-800 py-2 px-5 text-center w-fit"
          >
            DELETE PRODUCT
          </button>
        </div>
      </div>
    </>
  );
};

export default EditSection;
