"use client"

import axios from 'axios';
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import Cookie from "js-cookie";
import { Alert, Snackbar } from '@mui/material';
import { baseUrl, endpoints } from '@/constants/endpoints';

type Inputs = {
    categoryName: string;
};

const NewCategoryForm = () => {
    const {
        register,
        handleSubmit,
        // formState: { errors },
    } = useForm<Inputs>();

    const [openSnackbar, setOpenSnackbar] = useState(false);

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data);
        const token = Cookie.get("accessToken")
        axios({
            method: "POST",
            url: `${baseUrl}${endpoints.categories}/`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: { name: data.categoryName },
        }).then((res) => {
            console.log(res);
            if (res.status == 201) {
                setOpenSnackbar(true);
                window.location.reload()
            }
        }).catch((err) => {
            console.error("Error creating product:", err.response?.data || err.message);

        });;
    };

    return (
        <div className='w-full flex justify-center'>
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
                className="flex gap-3 p-3 mx-auto"
                onSubmit={handleSubmit(onSubmit)}
            >
                <input
                    type="text"
                    placeholder="Name"
                    className="border rounded-md py-1 px-3"
                    {...register("categoryName", { required: true })}
                />
                <button type="submit" className="bg-(--Magenta) px-2 py-1 rounded-md">
                    Add
                </button>
            </form>
        </div>
    )
}

export default NewCategoryForm