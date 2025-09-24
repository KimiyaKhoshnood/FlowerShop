"use client"

import ButtonUI from "@/components/ButtonUI";
import Discount from "@/components/Discount";
import ShoppingBagCard from "@/components/ShoppingBagCard";
import { useShoppingItemsContext } from "@/context/context";
import { useLanguage } from "@/providers/LanguageProvider";
import { IWebServiceResult } from "@/services/BaseService";
import { GetProductsService, PostOrdersService } from "@/services/services";
import { IEachProduct } from "@/types/types";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";

const Bag = () => {
    const { dictionary } = useLanguage()
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

    const ProductsServiceCallback = (resultData: IEachProduct[], result: IWebServiceResult) => {
        if (!result.hasError) {
            setAllProducts(resultData);
        }
    }

    useEffect(() => {
        GetProductsService(ProductsServiceCallback);
    }, []);

    const handleClickOpen = () => setOpen(true);

    const handleClose = () => setOpen(false);

    const OrdersServiceCallback = (_resultData: unknown, result: IWebServiceResult) => {
        if (!result.hasError) {
            setOpenSnackbar(true);
            handleCleanProducts();
        }
    }

    const handleBuy = () => {
        handleClose()

        if (shoppingItems[0]) {
            PostOrdersService({
                items: shoppingItems?.map((item) => ({
                    product: Number(item.id),
                    qty: Number(item.qty),
                })),
                id: "1",
            }, OrdersServiceCallback)
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
                            className={`${paymentMethod == "Paypal" ? "border-(--Burgundy) text-(--Burgundy)" : "border-(--Burgundy)/20 text-(--Burgundy)/80"} cursor-pointer border rounded-lg flex items-center gap-3 p-4 my-1`}>
                            <div className={`${paymentMethod == "Paypal" ? "bg-(--Burgundy) outline-(--Burgundy)" : "bg-(--Burgundy)/20 outline-(--Burgundy)/20"}  w-3 h-3 rounded-full border-2 outline-2 border-white`}></div>
                            <div>Paypal</div>
                        </div>
                        <div
                            onClick={() => setPaymentMethod("Visa")}
                            className={`${paymentMethod == "Visa" ? "border-(--Burgundy) text-(--Burgundy)" : "border-(--Burgundy)/20 text-(--Burgundy)/80"} cursor-pointer border rounded-lg flex items-center gap-3 p-4 my-1`}>
                            <div className={`${paymentMethod == "Visa" ? "bg-(--Burgundy) outline-(--Burgundy)" : "bg-(--Burgundy)/20 outline-(--Burgundy)/20"}  w-3 h-3 rounded-full border-2 outline-2 border-white`}></div>
                            <div>Visa</div>
                        </div>
                        <div
                            onClick={() => setPaymentMethod("Stripe")}
                            className={`${paymentMethod == "Stripe" ? "border-(--Burgundy) text-(--Burgundy)" : "border-(--Burgundy)/20 text-(--Burgundy)/80"} cursor-pointer border rounded-lg flex items-center gap-3 p-4 my-1`}>
                            <div className={`${paymentMethod == "Stripe" ? "bg-(--Burgundy) outline-(--Burgundy)" : "bg-(--Burgundy)/20 outline-(--Burgundy)/20"}  w-3 h-3 rounded-full border-2 outline-2 border-white`}></div>
                            <div>Stripe</div>
                        </div>
                        <div
                            onClick={() => setPaymentMethod("Alipay")}
                            className={`${paymentMethod == "Alipay" ? "border-(--Burgundy) text-(--Burgundy)" : "border-(--Burgundy)/20 text-(--Burgundy)/80"} cursor-pointer border rounded-lg flex items-center gap-3 p-4 my-1`}>
                            <div className={`${paymentMethod == "Alipay" ? "bg-(--Burgundy) outline-(--Burgundy)" : "bg-(--Burgundy)/20 outline-(--Burgundy)/20"}  w-3 h-3 rounded-full border-2 outline-2 border-white`}></div>
                            <div>Alipay</div>
                        </div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <Button
                        onClick={() => paymentMethod && handleBuy()}
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
                        {dictionary?.bag?.totalDiscount}:{" "}
                        <span className="text-(--Burgundy) font-bold">{discount}%</span>
                    </p>
                    <p>
                        {dictionary?.bag?.totalPrice}:{" "}
                        <span className="text-(--Burgundy) font-bold">
                            {totalAmount}{" "}$
                        </span>
                    </p>
                    <p>
                        {dictionary?.bag?.deliveryDate}:{" "}
                        <span className="text-(--Burgundy) font-bold">{"???"}</span>
                    </p>

                    <Discount />
                    <span className="text-yellow-500 text-xs">
                        {dictionary?.bag?.discountHint}
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