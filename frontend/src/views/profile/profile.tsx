"use client"

import { useLanguage } from "@/providers/LanguageProvider";
import { IWebServiceResult } from "@/services/BaseService";
import { GetProfileService, PatchProfileService } from "@/services/services";
import { Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

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
        GetProfileService(GetProfileServiceCallback)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { dictionary } = useLanguage()
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const GetProfileServiceCallback = (resultData: Inputs, result: IWebServiceResult) => {
        if (!result.hasError) {
            reset({
                first_name: resultData.first_name,
                last_name: resultData.last_name,
                email: resultData.email,
                username: resultData.username,
            });
        } else {
            console.error("Error fetching profile");
        }
    }

    const PatchProfileServiceCallback = (_resultData: unknown, result: IWebServiceResult) => {
        if (!result.hasError) {
            setOpenSnackbar(true);
        } else {
            console.error("Error saving profile");
        }
    }

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        PatchProfileService(data, PatchProfileServiceCallback)
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
                className="flex flex-col w-full max-w-96 mx-auto gap-1 p-3"
                onSubmit={handleSubmit(onSubmit)}
            >
                <label htmlFor="first_name">{dictionary?.dashboard?.profile?.firstName}:<span className="text-red-500">*</span></label>
                <input
                    type="text"
                    placeholder={dictionary?.dashboard?.profile?.firstName}
                    className="border rounded-md py-1 px-3 mb-2"
                    id="first_name"
                    {...register("first_name", { required: true })}
                />
                <label htmlFor="last_name">{dictionary?.dashboard?.profile?.lastName}:<span className="text-red-500">*</span></label>
                <input
                    type="text"
                    placeholder={dictionary?.dashboard?.profile?.lastName}
                    className="border rounded-md py-1 px-3 mb-2"
                    id="last_name"
                    {...register("last_name", { required: true })}
                />
                <label htmlFor="username">{dictionary?.dashboard?.profile?.username}:<span className="text-red-500">*</span></label>
                <input
                    type="text"
                    placeholder={dictionary?.dashboard?.profile?.username}
                    className="border rounded-md py-1 px-3 mb-2"
                    id="username"
                    {...register("username", { required: true })}
                />
                <label htmlFor="email">{dictionary?.dashboard?.profile?.email}:</label>
                <input
                    type="email"
                    placeholder={dictionary?.dashboard?.profile?.email}
                    className="border rounded-md py-1 px-3 mb-2"
                    id="email"
                    {...register("email")}
                />
                <button type="submit" className="bg-(--Magenta) text-white px-2 py-1 rounded-md cursor-pointer">
                    {dictionary?.dashboard?.profile?.save}
                </button>
            </form>
        </>
    )
}

export default Profile