"use client";
import ButtonUI from "@/components/ButtonUI";
import { Links } from "@/constants/links";
import { useLanguage } from "@/providers/LanguageProvider";
import { IWebServiceResult } from "@/services/BaseService";
import { PostRegisterService, PostTokenService } from "@/services/services";
import { getApiErrorMessage, saveTokens } from "@/utils/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

const inputClassName = "border rounded-md py-1 px-4"

const Register = () => {
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
                router.push(Links.login(lang));
            }
            resolve()
        }

        const RegisterServiceCallback = (resultData: unknown, result: IWebServiceResult) => {
            if (!result?.hasError) {
                setError(undefined)
                PostTokenService({ username: data.username, password: data.password }, TokenServiceCallback)
            } else {
                setError(getApiErrorMessage(resultData, dictionary?.auth?.registerFailed))
                resolve()
            }
        }

        PostRegisterService(data, RegisterServiceCallback)
    });

    return (
        <>
            <div className="border border-gray-300 rounded-2xl py-10 sm:px-16 px-8 flex flex-col justify-between gap-5">
                <h1 className="text-4xl text-center pb-10">{dictionary?.auth?.register}</h1>
                <form
                    className="flex flex-col gap-2 items-center"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <input type="text" autoComplete="username" placeholder={dictionary?.auth?.username}
                        className={inputClassName} {...register("username", { required: true })} />
                    <input type="password" autoComplete="new-password" placeholder={dictionary?.auth?.password}
                        className={inputClassName} {...register("password", { required: true })} />
                    <input type="password" autoComplete="new-password" placeholder={dictionary?.auth?.repeatPassword}
                        className={inputClassName} {...register("password2", { required: true })} />
                    <input type="email" autoComplete="email" placeholder={dictionary?.auth?.email}
                        className={inputClassName} {...register("email", { required: true })} />
                    <input type="text" autoComplete="given-name" placeholder={dictionary?.auth?.firstName}
                        className={inputClassName} {...register("first_name", { required: true })} />
                    <input type="text" autoComplete="family-name" placeholder={dictionary?.auth?.lastName}
                        className={inputClassName} {...register("last_name", { required: true })} />
                    {error && <span className="text-red-600 text-sm max-w-64 text-center">{error}</span>}
                    <ButtonUI type="submit" disabled={isSubmitting} text={dictionary?.auth?.check} className="bg-(--Magenta) text-white" />
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
