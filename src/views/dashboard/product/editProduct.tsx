"use client";
import { baseUrl, endpoints } from "@/constants/endpoints";
import { capitalizeFirstLetter } from "@/utils/utils";
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
import axios from "axios";
import Cookie from "js-cookie";
import { redirect, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
    input: string;
};

const DashboardEditProduct = () => {
    const [productDetails, setProductDetails] = useState();
    const [selectedCategory, setSelectedCategory] = useState<string>("title");
    const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<Inputs>();

    useEffect(() => {
        reset()
    }, [selectedCategory])

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = () => {
        const token = Cookie.get("accessToken");
        axios.delete(`${baseUrl}${endpoints.products}/${id}/`, {
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
            `${baseUrl}${endpoints.products}/${id}/`
        ).then((res) => {
            setProductDetails(res.data);
        });
    }, [id]);

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        const token = Cookie.get("accessToken");
        axios
            .patch(
                `${baseUrl}${endpoints.products}/${id}/`,
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
                    <div className="grid grid-cols-5 rounded-t-lg w-full">
                        {productDetails &&
                            Object.keys(productDetails)
                                .filter((item) => item !== "id")
                                .map((elem) => {
                                    return (
                                        <div
                                            key={elem}
                                            onClick={() => setSelectedCategory(elem)}
                                            className={`flex justify-center py-2 cursor-pointer rounded-lg hover:bg-amber-50/50 ${selectedCategory == elem
                                                ? "border border-gray-300"
                                                : ""
                                                }`}
                                        >
                                            {capitalizeFirstLetter(elem)}
                                        </div>
                                    );
                                })}
                    </div>

                    <div className="w-full flex flex-col items-center gap-2 py-10">
                        <div className="min-w-80 w-full block text-center relative">
                            <input
                                type="text"
                                value={productDetails?.[selectedCategory]}
                                disabled
                                className="border border-gray-300 pr-10 pl-4 py-2 focus:outline-0 rounded-lg w-full bg-blue-50/50"
                            />
                            <button
                                onClick={() => navigator.clipboard.writeText(productDetails?.[selectedCategory] || "")}
                                className="absolute right-0 top-0 bottom-0 content-center text-xs text-gray-300 hover:text-gray-500 cursor-pointer py-0.5 px-2.5">
                                copy
                            </button>
                        </div>
                        <form
                            className="flex justify-center min-w-80 w-full"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <input
                                type="text"
                                placeholder={capitalizeFirstLetter(selectedCategory)}
                                className="border border-gray-300 px-4 py-2 focus:outline-0 rounded-l-lg w-full"
                                {...register("input", { required: "Field is Required!" })}
                            />
                            <button
                                type="submit"
                                className="bg-emerald-500/80 hover:bg-emerald-500 cursor-pointer text-white py-2 px-5 rounded-r-lg"
                            >
                                Change
                            </button>
                        </form>
                        {errors.input && (
                            <p className="text-center text-red-600">{errors.input.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center mt-10 gap-2">
                    <span className="text-xs">Want to delete this Product?</span>
                    <button
                        onClick={handleClickOpen}
                        className="text-red-500 hover:text-red-600 text-center text-xs cursor-pointer w-fit"
                    >
                        DELETE PRODUCT!
                    </button>
                </div>
            </div>
        </>
    );
};

export default DashboardEditProduct;
