"use client";
import ShoppingBagCard from "@/components/ShoppingBagCard";
import { useShoppingItemsContext } from "@/context/context";
import React, { useEffect, useState } from "react";
import { EachProduct } from "../store/page";
import axios from "axios";
import Discount from "@/components/Discount";
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
import ButtonUI from "@/components/ui/ButtonUI";

const ShoppingBag = () => {
  const { shoppingItems, handleCleanProducts, discount } =
    useShoppingItemsContext();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [allProducts, setAllProducts] = useState<EachProduct[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios(`http://127.0.0.1:8000/api/products/`).then((res) => {
      setAllProducts(res.data);
    });
  }, []);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleBuy = () => {
    if (shoppingItems[0]) {
      axios
        .post("http://127.0.0.1:8000/api/orders/", {
          shoppingItems,
          discount: discount,
        })
        .then((res) => {
          console.log(res);
          if (res.status == 201) {
            setOpenSnackbar(true);
            handleCleanProducts();
          }
        });
    } else {
      console.log("Empty Bag!");
    }
  };

  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          You Bought The Products!
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
            If you want to continue buying product, click buy.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleClose();
              handleBuy();
            }}
            autoFocus
            color="info"
          >
            BUY
          </Button>
        </DialogActions>
      </Dialog>

      <div className="lg:px-10 px-5 py-5 flex flex-col gap-5">
        {shoppingItems?.map((each) => {
          return <ShoppingBagCard key={each.id} id={each.id} />;
        })}

        <div className="">
          <p>
            Total Discount:{" "}
            <span className="text-(--Burgundy) font-bold">{discount}%</span>
          </p>
          <p>
            Total Price:{" "}
            <span className="text-(--Burgundy) font-bold">
              {shoppingItems
                ?.reduce((total, item) => {
                  const selectedProduct = allProducts.find(
                    (product) => product.id == item.id
                  );
                  return (
                    total +
                    ((selectedProduct?.price || 0) *
                      item.qty *
                      (100 - discount)) /
                      100
                  );
                }, 0)
                .toFixed(2)}{" "}
              $
            </span>
          </p>
          <p>
            Delivery Date:{" "}
            <span className="text-(--Burgundy) font-bold">{"???"}</span>
          </p>

          <Discount />
          <span className="text-yellow-500 text-xs">
            {"(Hint: use OFF5 or OFF10 or OFF15)"}
          </span>
        </div>

        {shoppingItems[0] && (
          <div className="w-full" onClick={handleClickOpen}>
            <ButtonUI text="Buy" className="bg-(--Magenta) text-white w-full" />
          </div>
        )}
      </div>
    </>
  );
};

export default ShoppingBag;
