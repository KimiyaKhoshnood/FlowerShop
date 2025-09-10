"use client";
import ButtonUI from "@/components/ui/ButtonUI";
import { baseUrl, endpoints } from "@/constants/endpoints";
import axios from "axios";
import Cookie from "js-cookie";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
    username: string;
    password: string;
    password2: string,
    email: string,
    first_name: string,
    last_name: string
};

const Register = () => {
    const { register, handleSubmit } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
        try {
            const res = await axios.post(`${baseUrl}${endpoints.register}/`, data);
            console.log("res: ", res);

            const loginRes = await axios.post(`${baseUrl}${endpoints.token}/`, {
                username: data.username,
                password: data.password,
            });

            const access = loginRes.data.access;
            const refresh = loginRes.data.refresh;

            Cookie.set("accessToken", access, { expires: 1 });
            Cookie.set("refreshToken", refresh, { expires: 2 });

        } catch (err: any) {
            console.error("خطا در ثبت‌نام یا ورود:", err.response?.data || err.message);
        }

        redirect("/dashboard");

    };


    return (
        <>
            <div className="border border-gray-300 rounded-2xl py-10 px-16 flex flex-col justify-between gap-5">
                <h1 className="text-4xl text-center pb-10">Register</h1>
                <form
                    action=""
                    className="flex flex-col gap-2 items-center"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <input
                        type="text"
                        placeholder="Username"
                        className="border rounded-md py-1 px-4"
                        {...register("username", { required: true })}
                    />
                    <input
                        type="text"
                        placeholder="Password"
                        className="border rounded-md py-1 px-4"
                        {...register("password", { required: true })}
                    />
                    <input
                        type="text"
                        placeholder="Password 2"
                        className="border rounded-md py-1 px-4"
                        {...register("password2", { required: true })}
                    />
                    <input
                        type="text"
                        placeholder="Email"
                        className="border rounded-md py-1 px-4"
                        {...register("email", { required: true })}
                    />
                    <input
                        type="text"
                        placeholder="First Name"
                        className="border rounded-md py-1 px-4"
                        {...register("first_name", { required: true })}
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        className="border rounded-md py-1 px-4"
                        {...register("last_name", { required: true })}
                    />
                    <ButtonUI text="Check" className="bg-(--Magenta)" />
                </form>
            </div>
            <p>
                New User?{" "}
                <span className="text-blue-500 hover:text-blue-600">
                    <Link href={"/login"}>Login!</Link>
                </span>
            </p>
        </>
    );
};

export default Register;
