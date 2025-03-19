"use client";
import ShoppingBagCard from "@/components/ShoppingBagCard";
import { useShoppingItemsContext } from "@/context/context";
import React, { useEffect, useState } from "react";
import { EachProduct } from "../store/page";
import axios from "axios";
import Discount from "@/components/Discount";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from "@mui/material";
import { redirect } from "next/navigation";

const ShoppingBag = () => {
  const { shoppingItems, discount } = useShoppingItemsContext();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [allProducts, setAllProducts] = useState<EachProduct[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios(`http://localhost:3004/products/`).then((res) => {
      setAllProducts(res.data);
    });
  }, []);

  const handleClickOpen = () => setOpen(true)

  const handleClose = () => setOpen(false)

  const handleBuy = () => {
    if (shoppingItems[0]) {
      axios
        .post("http://localhost:3004/orders", {
          shoppingItems,
          discount: discount,
        })
        .then((res) => {
          console.log(res);
          if (res.status == 201) {
            setOpenSnackbar(true)
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

      <div className="px-10 py-2">
        {shoppingItems?.map((each) => {
          return <ShoppingBagCard key={each.id} id={each.id} />;
        })}

        {/* component for total price and discount and process */}
        <div className="border">
          <div className="p-3">
            <p>
              Total Discount: <span>{discount}%</span>
            </p>
            <span>Total Price: </span>{" "}
            <span>
              {shoppingItems
                ?.reduce((total, item) => {
                  let selectedProduct = allProducts.find(
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
          </div>
          <Discount />
        </div>

        {shoppingItems[0] && (
          <div className="flex justify-center p-10">
            <button
              onClick={handleClickOpen}
              className="bg-sky-200 px-10 py-1 rounded-2xl"
            >
              buy
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ShoppingBag;
