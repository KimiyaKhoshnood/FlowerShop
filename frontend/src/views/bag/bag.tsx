"use client"

import ButtonUI from "@/components/ButtonUI";
import ChangeDate from "@/components/ChangeDate";
import Discount from "@/components/Discount";
import ShoppingBagCard from "@/components/ShoppingBagCard";
import { Links } from "@/constants/links";
import { useShoppingItemsContext } from "@/context/context";
import { useLanguage } from "@/providers/LanguageProvider";
import { IWebServiceResult } from "@/services/BaseService";
import { GetProductsService, PostOrdersService } from "@/services/services";
import { IEachProduct } from "@/types/types";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";

const PAYMENT_METHODS = ["Paypal", "Visa", "Stripe", "Alipay"]

const Bag = () => {
    const { lang, dictionary } = useLanguage()
    const { shoppingItems, handleCleanProducts, discount, activeDiscount, deliveryDate } = useShoppingItemsContext();
    const [snackbar, setSnackbar] = useState<{ severity: "success" | "error", text: string } | null>(null);
    const [allProducts, setAllProducts] = useState<IEachProduct[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<string>();
    const [open, setOpen] = useState(false);

    const totalAmount = shoppingItems
        .reduce((total, item) => {
            const selectedProduct = allProducts.find((product) => product.id == item.id);
            return total + (Number(selectedProduct?.price) || 0) * item.qty * (100 - discount) / 100;
        }, 0)
        .toFixed(2)

    useEffect(() => {
        GetProductsService((resultData: IEachProduct[], result: IWebServiceResult) => {
            if (!result.hasError) {
                setAllProducts(resultData);
            }
        });
    }, []);

    const handleClose = () => setOpen(false);

    const OrdersServiceCallback = (_resultData: unknown, result: IWebServiceResult) => {
        if (!result.hasError) {
            setSnackbar({ severity: "success", text: dictionary?.bag?.success });
            handleCleanProducts();
        } else if (result.status == 401) {
            setSnackbar({ severity: "error", text: dictionary?.bag?.loginToOrder });
        } else {
            setSnackbar({ severity: "error", text: dictionary?.common?.error });
        }
    }

    const handleBuy = () => {
        handleClose()
        PostOrdersService({
            items: shoppingItems.map((item) => ({
                product: Number(item.id),
                qty: Number(item.qty),
            })),
            discount: activeDiscount?.id ?? null,
            delivery_date: deliveryDate,
        }, OrdersServiceCallback)
    };

    return (
        <>
            <Snackbar
                open={Boolean(snackbar)}
                autoHideDuration={4000}
                onClose={() => setSnackbar(null)}
            >
                <Alert onClose={() => setSnackbar(null)} severity={snackbar?.severity}>
                    {snackbar?.text}
                </Alert>
            </Snackbar>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="payment-dialog-title"
                sx={{
                    '.MuiDialog-paper': {
                        borderRadius: 4,
                    }
                }}
            >
                <DialogTitle id="payment-dialog-title" className="text-(--Burgundy) md:min-w-xl sm:min-w-md min-w-2xs">
                    {dictionary?.bag?.choosePayment}
                </DialogTitle>
                <DialogContent sx={{ paddingBottom: 3, alignContent: 'center' }}>
                    <div role="radiogroup" aria-labelledby="payment-dialog-title">
                        {PAYMENT_METHODS.map((method) => {
                            const isSelected = paymentMethod == method
                            return (
                                <button
                                    type="button"
                                    role="radio"
                                    aria-checked={isSelected}
                                    key={method}
                                    onClick={() => setPaymentMethod(method)}
                                    className={`${isSelected ? "border-(--Burgundy) text-(--Burgundy)" : "border-(--Burgundy)/20 text-(--Burgundy)/80"} w-full cursor-pointer border rounded-lg flex items-center gap-3 p-4 my-1`}>
                                    <span className={`${isSelected ? "bg-(--Burgundy) outline-(--Burgundy)" : "bg-(--Burgundy)/20 outline-(--Burgundy)/20"} w-3 h-3 rounded-full border-2 outline-2 border-white`}></span>
                                    <span>{method}</span>
                                </button>
                            )
                        })}
                    </div>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <Button
                        onClick={handleBuy}
                        disabled={!paymentMethod}
                        autoFocus
                        color="inherit"
                        variant="outlined"
                        sx={{ borderRadius: 3, width: '100%' }}
                    >
                        {dictionary?.bag?.pay} {totalAmount}$
                    </Button>
                </DialogActions>
            </Dialog>

            {shoppingItems.length == 0 ? (
                <div className="flex flex-col items-center justify-center gap-6 py-24 px-5 text-center text-(--Burgundy)">
                    <p className="text-xl">{dictionary?.bag?.empty}</p>
                    <ButtonUI text={dictionary?.bag?.goShopping} url={Links.store(lang)} className="bg-(--Magenta) text-white" />
                </div>
            ) : (
                <div className="lg:px-10 px-5 py-5 flex flex-col gap-5">
                    {shoppingItems.map((each) => <ShoppingBagCard key={each.id} id={each.id} />)}

                    <div className="flex flex-col gap-1">
                        <p>
                            {dictionary?.bag?.totalDiscount}:{" "}
                            <span className="text-(--Burgundy) font-bold">{discount}%</span>
                        </p>
                        <p>
                            {dictionary?.bag?.totalPrice}:{" "}
                            <span className="text-(--Burgundy) font-bold">{totalAmount} $</span>
                        </p>
                        <div className="py-2"><ChangeDate /></div>

                        <Discount />
                        <span className="text-yellow-600 text-xs">
                            {dictionary?.bag?.discountHint}
                        </span>
                    </div>

                    <ButtonUI onClick={() => setOpen(true)} text={dictionary?.bag?.buy} className="bg-(--Magenta) text-white w-full" />
                </div>
            )}
        </>
    )
}

export default Bag
