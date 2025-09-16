"use client"

import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Cookie from "js-cookie";
import axios from "axios";
import { Alert, Snackbar } from "@mui/material";
import { baseUrl, endpoints } from "@/constants/endpoints";
import { useLanguage } from "@/providers/LanguageProvider";

type Inputs = {
    username: string,
    email: string,
    first_name: string,
    last_name: string
};

const Profile = () => {
    const {
        register,
        handleSubmit,
        // formState: { errors },
        reset
    } = useForm<Inputs>();

    useEffect(() => {
        const token = Cookie.get("accessToken");

        if (token) {
            axios
                .get(`${baseUrl}${endpoints.profile}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    console.log(res.data);

                    reset({
                        first_name: res.data.first_name,
                        last_name: res.data.last_name,
                        email: res.data.email,
                        username: res.data.username,
                    });
                })
                .catch((error) => {
                    console.error("Error fetching orders:", error.response?.data);
                });
        } else {
            console.log("No token found");
        }
    }, [reset]);

    const { dictionary } = useLanguage()
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data);
        const token = Cookie.get("accessToken")
        axios({
            method: "PATCH",
            url: `${baseUrl}${endpoints.profile}/`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: data,
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
        <>
            <h2 className="text-center p-5 text-4xl">{dictionary?.dashboard?.profile?.title}</h2>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity="success">
                    {dictionary?.dashboard?.profile?.created}!
                </Alert>
            </Snackbar>

            <form
                action=""
                className=" flex flex-col w-96 mx-auto gap-1 p-3"
                onSubmit={handleSubmit(onSubmit)}
            >
                <label htmlFor="first_name">{dictionary?.dashboard?.profile?.firstName}:<span className="text-red-500">*</span></label>
                <input
                    type="text"
                    placeholder={dictionary?.dashboard?.profile?.firstName}
                    className="border rounded-md py-1 px-3 mb-2"
                    {...register("first_name")}
                />
                <label htmlFor="last_name">{dictionary?.dashboard?.profile?.lastName}:<span className="text-red-500">*</span></label>
                <input
                    type="text"
                    placeholder={dictionary?.dashboard?.profile?.lastName}
                    className="border rounded-md py-1 px-3 mb-2"
                    {...register("last_name")}
                />
                <label htmlFor="username">{dictionary?.dashboard?.profile?.username}:<span className="text-red-500">*</span></label>
                <input
                    type="text"
                    placeholder={dictionary?.dashboard?.profile?.username}
                    className="border rounded-md py-1 px-3 mb-2"
                    {...register("username", { required: true })}
                />
                <label htmlFor="email">{dictionary?.dashboard?.profile?.email}:</label>
                <input
                    type="text"
                    placeholder={dictionary?.dashboard?.profile?.email}
                    className="border rounded-md py-1 px-3 mb-2"
                    {...register("email")}
                />
                <button type="submit" className="bg-(--Magenta) px-2 py-1 rounded-md">
                    {dictionary?.dashboard?.profile?.save}
                </button>
            </form>
        </>
    )
}

export default Profile