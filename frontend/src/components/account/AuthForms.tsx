"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ApiError, api } from "@/lib/api";
import { href, useI18n } from "@/lib/i18n";
import { useSession } from "@/lib/session";
import { Button } from "../ui/Button";
import { Input } from "../ui/Field";

/** Only follow ?next= links that stay on this site. */
const useNextUrl = () => {
    const { lang } = useI18n();
    const next = useSearchParams().get("next");
    return next && next.startsWith("/") && !next.startsWith("//") ? next : href(lang, "/account");
};

const AuthCard = ({ title, subtitle, children, footer }:
    { title: string; subtitle: string; children: React.ReactNode; footer: React.ReactNode }) => (
    <div className="flex flex-col gap-8">
        <div>
            <h1 className="heading-display text-4xl">{title}</h1>
            <p className="mt-2 text-muted">{subtitle}</p>
        </div>
        {children}
        <p className="text-sm text-muted">{footer}</p>
    </div>
);

export const LoginForm = () => {
    const { lang, t } = useI18n();
    const router = useRouter();
    const nextUrl = useNextUrl();
    const { signIn } = useSession();
    const [error, setError] = useState<string>();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ username: string; password: string }>();

    const onSubmit = handleSubmit(async ({ username, password }) => {
        setError(undefined);
        try {
            signIn(await api.auth.login(username, password));
            router.replace(nextUrl);
            router.refresh();
        } catch (err) {
            setError(err instanceof ApiError && err.status === 401 ? t.auth.loginFailed : err instanceof Error ? err.message : t.common.error);
        }
    });

    return (
        <AuthCard title={t.auth.loginTitle} subtitle={t.auth.loginSubtitle}
            footer={<>{t.auth.noAccount} <Link className="font-medium text-magenta hover:underline" href={`${href(lang, "/register")}${nextUrl !== href(lang, "/account") ? `?next=${encodeURIComponent(nextUrl)}` : ""}`}>{t.nav.register}</Link></>}>
            <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
                <Input label={t.auth.username} autoComplete="username" autoFocus error={errors.username?.message}
                    {...register("username", { required: t.common.required })} />
                <Input label={t.auth.password} type="password" autoComplete="current-password" error={errors.password?.message}
                    {...register("password", { required: t.common.required })} />
                {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
                <Button type="submit" size="lg" loading={isSubmitting} className="mt-2">{t.auth.login}</Button>
                <p className="rounded-xl bg-blush/70 px-4 py-2.5 text-center text-xs text-burgundy" dir="ltr">{t.auth.demoHint}</p>
            </form>
        </AuthCard>
    );
};

type RegisterInput = { username: string; email: string; first_name: string; last_name: string; password: string; password2: string };

export const RegisterForm = () => {
    const { lang, t } = useI18n();
    const router = useRouter();
    const nextUrl = useNextUrl();
    const { signIn } = useSession();
    const [error, setError] = useState<string>();
    const { register, handleSubmit, setError: setFieldError, formState: { errors, isSubmitting } } = useForm<RegisterInput>();

    const onSubmit = handleSubmit(async (data) => {
        setError(undefined);
        try {
            await api.auth.register(data);
            signIn(await api.auth.login(data.username, data.password));
            router.replace(nextUrl);
            router.refresh();
        } catch (err) {
            if (err instanceof ApiError && Object.keys(err.fields).length) {
                Object.entries(err.fields).forEach(([field, message]) => setFieldError(field as keyof RegisterInput, { message }));
            } else {
                setError(err instanceof Error ? err.message : t.common.error);
            }
        }
    });

    const required = { required: t.common.required };

    return (
        <AuthCard title={t.auth.registerTitle} subtitle={t.auth.registerSubtitle}
            footer={<>{t.auth.haveAccount} <Link className="font-medium text-magenta hover:underline" href={href(lang, "/login")}>{t.nav.login}</Link></>}>
            <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2" noValidate>
                <Input label={t.auth.firstName} autoComplete="given-name" error={errors.first_name?.message} {...register("first_name", required)} />
                <Input label={t.auth.lastName} autoComplete="family-name" error={errors.last_name?.message} {...register("last_name", required)} />
                <Input label={t.auth.username} autoComplete="username" dir="ltr" error={errors.username?.message} {...register("username", required)} />
                <Input label={t.auth.email} type="email" autoComplete="email" dir="ltr" error={errors.email?.message} {...register("email", required)} />
                <Input label={t.auth.password} type="password" autoComplete="new-password" error={errors.password?.message} {...register("password", required)} />
                <Input label={t.auth.password2} type="password" autoComplete="new-password" error={errors.password2?.message} {...register("password2", required)} />
                {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2">{error}</p>}
                <Button type="submit" size="lg" loading={isSubmitting} className="mt-2 sm:col-span-2">{t.auth.register}</Button>
            </form>
        </AuthCard>
    );
};
