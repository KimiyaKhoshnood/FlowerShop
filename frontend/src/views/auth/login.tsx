"use client";
import ButtonUI from "@/components/ButtonUI";
import { Links } from "@/constants/links";
import { useLanguage } from "@/providers/LanguageProvider";
import { IWebServiceResult } from "@/services/BaseService";
import { PostTokenService } from "@/services/services";
import { saveTokens } from "@/utils/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
    username: string;
    password: string;
};

const Login = () => {
    const { lang, dictionary } = useLanguage()
    const router = useRouter()

    const { register, handleSubmit, formState: { isSubmitting } } = useForm<Inputs>();
    const [error, setError] = useState<string>()

    const onSubmit: SubmitHandler<Inputs> = (data) => new Promise<void>((resolve) => {
        const TokenServiceCallback = (resultData: { access: string, refresh: string }, result: IWebServiceResult) => {
            if (!result?.hasError) {
                saveTokens(resultData)
                router.push(Links.dashboard.base(lang));
                router.refresh();
            } else {
                setError(dictionary?.auth?.loginFailed)
            }
            resolve()
        }

        PostTokenService(data, TokenServiceCallback)
    });

    return (
        <>
            <div className="border border-gray-300 rounded-2xl sm:p-16 p-8 flex flex-col justify-between gap-5">
                <h1 className="text-4xl text-center pb-10">{dictionary?.auth?.login}</h1>
                <form
                    className="flex flex-col gap-3 items-center"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <input
                        type="text"
                        autoComplete="username"
                        placeholder={dictionary?.auth?.username}
                        className="border rounded-md py-2 px-4"
                        {...register("username", { required: true })}
                    />
                    <input
                        type="password"
                        autoComplete="current-password"
                        placeholder={dictionary?.auth?.password}
                        className="border rounded-md py-2 px-4"
                        {...register("password", { required: true })}
                    />
                    {error && <span className="text-red-600 text-sm">{error}</span>}
                    <ButtonUI type="submit" disabled={isSubmitting} text={dictionary?.auth?.check} className="bg-(--Magenta) text-white" />
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
