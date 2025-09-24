"use client";
import ButtonUI from "@/components/ButtonUI";
import { Links } from "@/constants/links";
import { useLanguage } from "@/providers/LanguageProvider";
import { PostRegisterService, PostTokenService } from "@/services/services";
import Cookie from "js-cookie";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
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
    const { lang, dictionary } = useLanguage()

    const { register, handleSubmit } = useForm<Inputs>();
    const [error, setError] = useState<{ hasError: boolean, errorText?: string }>({ hasError: false })

    const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {

        const RegisterServiceCallback = (resultData: any, result: any) => {
            if (!result?.hasError) {
                PostTokenService({
                    username: data.username,
                    password: data.password,
                }, TokenServiceCallback)

                setError({ hasError: false })
            } else {
                setError({ hasError: true, errorText: "Some Error Happened" })
                console.log(resultData)
            }
        }

        PostRegisterService(data, RegisterServiceCallback)

        const TokenServiceCallback = (resultData: any, result: any) => {
            if (!result?.hasError) {
                const access = resultData.access;
                const refresh = resultData.refresh;

                Cookie.set("accessToken", access, { expires: 1 });
                Cookie.set("refreshToken", refresh, { expires: 2 });

                setError({ hasError: false })
            } else {
                setError({ hasError: true, errorText: "Some Error Happened" })
                console.log(resultData)
            }

            redirect(Links.dashboard.base(lang));
        }
    };


    return (
        <>
            <div className="border border-gray-300 rounded-2xl py-10 px-16 flex flex-col justify-between gap-5">
                <h1 className="text-4xl text-center pb-10">{dictionary?.auth?.register}</h1>
                <form
                    action=""
                    className="flex flex-col gap-2 items-center"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <input
                        type="text"
                        placeholder={dictionary?.auth?.username}
                        className="border rounded-md py-1 px-4"
                        {...register("username", { required: true })}
                    />
                    <input
                        type="text"
                        placeholder={dictionary?.auth?.password}
                        className="border rounded-md py-1 px-4"
                        {...register("password", { required: true })}
                    />
                    <input
                        type="text"
                        placeholder={dictionary?.auth?.repeatPassword}
                        className="border rounded-md py-1 px-4"
                        {...register("password2", { required: true })}
                    />
                    <input
                        type="text"
                        placeholder={dictionary?.auth?.email}
                        className="border rounded-md py-1 px-4"
                        {...register("email", { required: true })}
                    />
                    <input
                        type="text"
                        placeholder={dictionary?.auth?.firstName}
                        className="border rounded-md py-1 px-4"
                        {...register("first_name", { required: true })}
                    />
                    <input
                        type="text"
                        placeholder={dictionary?.auth?.lastName}
                        className="border rounded-md py-1 px-4"
                        {...register("last_name", { required: true })}
                    />
                    {error.hasError && <span className="text-red-600 text-sm">{error.errorText}</span>}
                    <ButtonUI text={dictionary?.auth?.check} className="bg-(--Magenta)" />
                </form>
            </div>
            <p>
                {dictionary?.auth?.registerToLogin}{" "}
                <span className="text-blue-500 hover:text-blue-600">
                    <Link href={Links.login(lang)}>{dictionary?.auth?.login}!</Link>
                </span>
            </p>
        </>
    );
};

export default Register;
