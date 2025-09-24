"use client";
import ButtonUI from "@/components/ButtonUI";
import { Links } from "@/constants/links";
import { useLanguage } from "@/providers/LanguageProvider";
import { IWebServiceResult } from "@/services/BaseService";
import { PostTokenService } from "@/services/services";
import Cookie from "js-cookie";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
    username: string;
    password: string;
};

const Login = () => {
    const { lang, dictionary } = useLanguage()

    const { register, handleSubmit } = useForm<Inputs>();
    const [error, setError] = useState<{ hasError: boolean, errorText?: string }>({ hasError: false })

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const TokenServiceCallback = (resultData: { access: string, refresh: string }, result: IWebServiceResult) => {
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

        PostTokenService(data, TokenServiceCallback)
    };

    return (
        <>
            <div className="border border-gray-300 rounded-2xl p-16 flex flex-col justify-between gap-5">
                <h1 className="text-4xl text-center pb-10">{dictionary?.auth?.login}</h1>
                <form
                    action=""
                    className="flex flex-col gap-3 items-center"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <input
                        type="text"
                        placeholder={dictionary?.auth?.username}
                        className="border rounded-md py-2 px-4"
                        {...register("username", { required: true })}
                    />
                    <input
                        type="text"
                        placeholder={dictionary?.auth?.password}
                        className="border rounded-md py-2 px-4"
                        {...register("password", { required: true })}
                    />
                    {error.hasError && <span className="text-red-600 text-sm">{error.errorText}</span>}
                    <ButtonUI text={dictionary?.auth?.check} className="bg-(--Magenta)" />
                </form>
            </div>
            <p>
                {dictionary?.auth?.loginToRegister}{" "}
                <span className="text-blue-500 hover:text-blue-600">
                    <Link href={Links.register(lang)}>{dictionary?.auth?.register}!</Link>
                </span>
            </p>
        </>
    );
};

export default Login;
