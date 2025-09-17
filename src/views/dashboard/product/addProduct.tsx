"use client"

import { baseUrl, endpoints } from "@/constants/endpoints";
import { useLanguage } from "@/providers/LanguageProvider";
import { Alert, Snackbar } from "@mui/material";
import axios from "axios";
import Cookie from "js-cookie";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
    title: string;
    price: string;
    image: string;
    category: string;
    description: string;
};

const DashboardAddProduct = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<Inputs>();
    const value = watch()

    const { dictionary } = useLanguage()
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [categories, setCategories] = useState<{ id: number, name: string }[]>();

    useEffect(() => {
        axios(
            `${baseUrl}${endpoints.categories}/`
        ).then((res) => {
            setCategories(res.data);
        });
    }, []);

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data);
        const token = Cookie.get("accessToken")
        axios({
            method: "POST",
            url: `${baseUrl}${endpoints.products}/`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
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
        <div>
            <h2 className='text-center p-5 text-4xl'>{dictionary?.dashboard?.product?.addProduct}</h2>

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
                    placeholder={dictionary?.dashboard?.product?.title}
                    className="border rounded-md py-1.5 px-3"
                    {...register("title", { required: true })}
                />
                <input
                    type="text"
                    placeholder={dictionary?.dashboard?.product?.price}
                    className="border rounded-md py-1.5 px-3"
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
                    placeholder={dictionary?.dashboard?.product?.image}
                    className="border rounded-md py-1 px-3"
                    {...register("image", { required: true })}
                />
                <select defaultValue="" {...register("category", { required: true })} className={`border rounded-md py-2 px-3 transition-all duration-200 ${value.category=="" && "text-neutral-500 focus:text-neutral-950"}`}>
                    <option value="" disabled className="text-neutral-900">
                        {dictionary?.dashboard?.product?.category}
                    </option>
                    {categories?.map((category) => (
                        <option key={category.id} value={category.name}>{category.name}</option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder={dictionary?.dashboard?.product?.description}
                    className="border rounded-md py-1.5 px-3"
                    {...register("description", { required: true })}
                />
                <button type="submit" className="bg-(--Magenta) px-2 py-1 rounded-md">
                    {dictionary?.common?.check}
                </button>
            </form>
        </div>
    )
}

export default DashboardAddProduct