"use client"

import Discount from "@/components/Discount";
import ShoppingBagCard from "@/components/ShoppingBagCard";
import ButtonUI from "@/components/ButtonUI";
import { baseUrl, endpoints } from "@/constants/endpoints";
import { useShoppingItemsContext } from "@/context/context";
import { IEachProduct } from "@/types/types";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from "@mui/material";
import axios from "axios";
import Cookie from "js-cookie";
import { useEffect, useState } from "react";

const Bag = () => {
    const { shoppingItems, handleCleanProducts, discount } = useShoppingItemsContext();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [allProducts, setAllProducts] = useState<IEachProduct[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<string>();
    const [open, setOpen] = useState(false);

    const totalAmount = shoppingItems
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
        .toFixed(2)

    useEffect(() => {
        axios(`${baseUrl}${endpoints.products}/`).then((res) => {
            setAllProducts(res.data);
        });
    }, []);

    const handleClickOpen = () => setOpen(true);

    const handleClose = () => setOpen(false);

    const handleBuy = () => {
        handleClose()
        const token = Cookie.get("accessToken");

        if (shoppingItems[0]) {
            axios
                .post(`${baseUrl}${endpoints.orders}/`, {
                    items: shoppingItems?.map((item) => ({
                        product: Number(item.id),
                        qty: Number(item.qty),
                    })),
                    id: 1,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
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
                sx={{
                    '.MuiDialog-paper': {
                        borderRadius: 4,
                    }
                }}
            >
                <DialogTitle id="alert-dialog-title" className="text-(--Burgundy) md:min-w-xl sm:min-w-md min-w-2xs">Choose Your Payment Method:</DialogTitle>
                <DialogContent sx={{ paddingBottom: 3, alignContent: 'center' }}>
                    <DialogContentText id="alert-dialog-description">
                        <div
                            onClick={() => setPaymentMethod("Paypal")}
                            className={`${paymentMethod=="Paypal" ? "border-(--Burgundy) text-(--Burgundy)" : "border-(--Burgundy)/20 text-(--Burgundy)/80"} cursor-pointer border rounded-lg flex items-center gap-3 p-4 my-1`}>
                            <div className={`${paymentMethod=="Paypal" ? "bg-(--Burgundy) outline-(--Burgundy)" : "bg-(--Burgundy)/20 outline-(--Burgundy)/20"}  w-3 h-3 rounded-full border-2 outline-2 border-white`}></div>
                            <div>Paypal</div>
                        </div>
                        <div
                            onClick={() => setPaymentMethod("Visa")}
                            className={`${paymentMethod=="Visa" ? "border-(--Burgundy) text-(--Burgundy)" : "border-(--Burgundy)/20 text-(--Burgundy)/80"} cursor-pointer border rounded-lg flex items-center gap-3 p-4 my-1`}>
                            <div className={`${paymentMethod=="Visa" ? "bg-(--Burgundy) outline-(--Burgundy)" : "bg-(--Burgundy)/20 outline-(--Burgundy)/20"}  w-3 h-3 rounded-full border-2 outline-2 border-white`}></div>
                            <div>Visa</div>
                        </div>
                        <div
                            onClick={() => setPaymentMethod("Stripe")}
                            className={`${paymentMethod=="Stripe" ? "border-(--Burgundy) text-(--Burgundy)" : "border-(--Burgundy)/20 text-(--Burgundy)/80"} cursor-pointer border rounded-lg flex items-center gap-3 p-4 my-1`}>
                            <div className={`${paymentMethod=="Stripe" ? "bg-(--Burgundy) outline-(--Burgundy)" : "bg-(--Burgundy)/20 outline-(--Burgundy)/20"}  w-3 h-3 rounded-full border-2 outline-2 border-white`}></div>
                            <div>Stripe</div>
                        </div>
                        <div
                            onClick={() => setPaymentMethod("Alipay")}
                            className={`${paymentMethod=="Alipay" ? "border-(--Burgundy) text-(--Burgundy)" : "border-(--Burgundy)/20 text-(--Burgundy)/80"} cursor-pointer border rounded-lg flex items-center gap-3 p-4 my-1`}>
                            <div className={`${paymentMethod=="Alipay" ? "bg-(--Burgundy) outline-(--Burgundy)" : "bg-(--Burgundy)/20 outline-(--Burgundy)/20"}  w-3 h-3 rounded-full border-2 outline-2 border-white`}></div>
                            <div>Alipay</div>
                        </div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <Button
                        onClick={() => {paymentMethod && handleBuy()}}
                        disabled={!paymentMethod}
                        autoFocus
                        color="inherit"
                        variant="outlined"
                        sx={{ borderRadius: 3, width: '100%' }}
                    >
                        Pay {totalAmount}$
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
                            {totalAmount}{" "}$
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
    )
}

export default Bag