"use client";
import { Links } from "@/constants/links";
import { useLanguage } from "@/providers/LanguageProvider";
import { IWebServiceResult } from "@/services/BaseService";
import { DeleteProductsService, GetCategoriesService, GetProductService, PatchProductsService } from "@/services/services";
import { ICategory, IEachProduct } from "@/types/types";
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
import { redirect, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
    input: string;
};

const DashboardEditProduct = () => {
    const { lang, dictionary } = useLanguage()
    const [productDetails, setProductDetails] = useState<IEachProduct>();
    const [selectedCategory, setSelectedCategory] = useState<keyof IEachProduct>("title");
    const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState<{ id: number, name: string }[]>();
    const router = useRouter()

    const id = useParams().id;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<Inputs>();

    useEffect(() => {
        reset()
    }, [selectedCategory])

    const handleClickOpen = () => setOpen(true)

    const handleClose = () => setOpen(false)

    const handleDelete = () => {
        if (typeof (id) === 'string') {
            DeleteProductsService(id, DeleteProductsServiceCallback)
        }
    };

    useEffect(() => {
        if (typeof (id) === 'string') {
            GetProductService(id, ProductsServiceCallback)
        }
    }, [id]);

    useEffect(() => {
        GetCategoriesService(CategoriesServiceCallback)
    }, []);

    const PatchProductsServiceCallback = (_resultData: unknown, result: IWebServiceResult) => {
        if (!result.hasError) {
            setOpenSuccessSnackbar(true);
            router.push(Links.dashboard.product(lang))
        }
    }

    const DeleteProductsServiceCallback = (_resultData: unknown, result: IWebServiceResult) => {
        if (!result.hasError) {
            redirect(Links.dashboard.product(lang));
        }
    }

    const ProductsServiceCallback = (resultData: IEachProduct, result: IWebServiceResult) => {
        if (!result?.hasError) {
            setProductDetails(resultData)
        }
    }

    const CategoriesServiceCallback = (resultData: ICategory[], result: IWebServiceResult) => {
        if (!result?.hasError) {
            setCategories(resultData)
        }
    }

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        if (typeof (id) === 'string') {
            PatchProductsService({ [selectedCategory]: data.input }, id, PatchProductsServiceCallback)
        }
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
                <DialogTitle id="alert-dialog-title">{dictionary?.dashboard?.product?.deleteModalTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {dictionary?.dashboard?.product?.deleteModalContent}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="inherit">
                        {dictionary?.common?.cancel?.toUpperCase()}
                    </Button>
                    <Button
                        onClick={() => {
                            handleClose();
                            handleDelete();
                        }}
                        autoFocus
                        color="error"
                    >
                        {dictionary?.dashboard?.product?.delete?.toUpperCase()}
                    </Button>
                </DialogActions>
            </Dialog>

            <div className="px-10 py-2">
                <h2 className="text-center p-5 text-4xl">
                    {dictionary?.dashboard?.product?.editProductTitle}
                </h2>

                <div className="py-2">
                    <div className="grid grid-cols-5 rounded-t-lg w-full">
                        {productDetails &&
                            Object.keys(productDetails).map((elem) => {
                                if (elem === "id") return null;
                                return (
                                    <div
                                        key={elem}
                                        onClick={() => setSelectedCategory(elem as keyof IEachProduct)}
                                        className={`flex justify-center py-2 cursor-pointer rounded-lg hover:bg-amber-50/50 ${selectedCategory === elem ? "border border-gray-300" : ""
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
                                onClick={() => navigator.clipboard.writeText(productDetails?.[selectedCategory]?.toString() || "")}
                                className="absolute right-0 top-0 bottom-0 content-center text-xs text-gray-300 hover:text-gray-500 cursor-pointer py-0.5 px-2.5">
                                {dictionary?.dashboard?.product?.copy}
                            </button>
                        </div>
                        <form
                            className="flex justify-center min-w-80 w-full"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            {selectedCategory == "category"
                                ? <select
                                    {...register("input", { required: dictionary?.dashboard?.product?.fieldRequired })}
                                    className={`border border-gray-300 px-4 py-2 focus:outline-0 w-full ${lang == 'fa' ? "rounded-r-lg" : "rounded-l-lg"}`}
                                >
                                    {categories?.map((category) => (
                                        <option key={category.id} value={category.name}>{category.name}</option>
                                    ))}
                                </select>
                                : <input
                                    type="text"
                                    placeholder={capitalizeFirstLetter(selectedCategory)}
                                    className={`border border-gray-300 px-4 py-2 focus:outline-0 w-full ${lang == 'fa' ? "rounded-r-lg" : "rounded-l-lg"}`}
                                    {...register("input", { required: dictionary?.dashboard?.product?.fieldRequired })}
                                />}
                            <button
                                type="submit"
                                className={`bg-emerald-500/80 hover:bg-emerald-500 cursor-pointer text-white py-2 px-5 ${lang == 'fa' ? "rounded-l-lg" : "rounded-r-lg"}`}
                            >
                                {dictionary?.dashboard?.product?.change}
                            </button>
                        </form>
                        {errors.input && (
                            <p className="text-center text-red-600">{errors.input.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center mt-10 gap-2">
                    <span className="text-xs">{dictionary?.dashboard?.product?.deleteProductQuestion}</span>
                    <button
                        onClick={handleClickOpen}
                        className="text-red-500 hover:text-red-600 text-center text-xs cursor-pointer w-fit"
                    >
                        {dictionary?.dashboard?.product?.deleteProduct?.toUpperCase()}
                    </button>
                </div>
            </div>
        </>
    );
};

export default DashboardEditProduct;
