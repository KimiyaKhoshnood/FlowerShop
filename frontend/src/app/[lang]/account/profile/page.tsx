"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { ErrorState } from "@/components/ui/misc";
import { PageSpinner } from "@/components/ui/Spinner";
import { ApiError, api } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { fill, useI18n } from "@/lib/i18n";
import { useToast } from "@/lib/toast";
import type { Profile } from "@/lib/types";

type ProfileForm = Pick<Profile, "first_name" | "last_name" | "email" | "username">;
type PasswordForm = { current_password: string; new_password: string };

/** Copy DRF field errors onto react-hook-form fields; returns false when there were none. */
const applyFieldErrors = <T extends object>(error: unknown, setError: (field: keyof T, e: { message: string }) => void) => {
  if (!(error instanceof ApiError) || !Object.keys(error.fields).length) return false;
  Object.entries(error.fields).forEach(([field, message]) => setError(field as keyof T, { message }));
  return true;
};

export default function ProfilePage() {
  const { lang, t } = useI18n();
  const toast = useToast();
  const queryClient = useQueryClient();
  const me = useQuery({ queryKey: ["me"], queryFn: api.auth.me });

  const profileForm = useForm<ProfileForm>();
  const passwordForm = useForm<PasswordForm>();

  useEffect(() => {
    if (me.data) profileForm.reset(me.data);
  }, [me.data, profileForm]);

  if (me.isPending) return <PageSpinner />;
  if (me.isError) return <ErrorState onRetry={() => me.refetch()} />;

  const saveProfile = profileForm.handleSubmit(async (data) => {
    try {
      queryClient.setQueryData(["me"], await api.auth.updateMe(data));
      toast.success(t.account.profileSaved);
    } catch (error) {
      if (!applyFieldErrors<ProfileForm>(error, profileForm.setError)) toast.error(t.common.error);
    }
  });

  const changePassword = passwordForm.handleSubmit(async ({ current_password, new_password }) => {
    try {
      await api.auth.changePassword(current_password, new_password);
      passwordForm.reset({ current_password: "", new_password: "" });
      toast.success(t.account.passwordChanged);
    } catch (error) {
      if (!applyFieldErrors<PasswordForm>(error, passwordForm.setError)) toast.error(t.common.error);
    }
  });

  const required = { required: t.common.required };
  const { errors } = profileForm.formState;
  const passwordErrors = passwordForm.formState.errors;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={saveProfile} className="card flex flex-col gap-4 p-6" noValidate>
        <div>
          <h2 className="font-display text-xl text-burgundy">{t.account.profile}</h2>
          <p className="text-xs text-muted">{fill(t.account.memberSince, formatDate(me.data.date_joined, lang))}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label={t.auth.firstName} error={errors.first_name?.message} {...profileForm.register("first_name", required)} />
          <Input label={t.auth.lastName} error={errors.last_name?.message} {...profileForm.register("last_name", required)} />
        </div>
        <Input label={t.auth.username} dir="ltr" error={errors.username?.message} {...profileForm.register("username", required)} />
        <Input label={t.auth.email} type="email" dir="ltr" error={errors.email?.message} {...profileForm.register("email", required)} />
        <Button type="submit" className="self-start" loading={profileForm.formState.isSubmitting}>{t.common.save}</Button>
      </form>

      <form onSubmit={changePassword} className="card flex flex-col gap-4 self-start p-6" noValidate>
        <h2 className="font-display text-xl text-burgundy">{t.account.changePassword}</h2>
        <Input label={t.account.currentPassword} type="password" autoComplete="current-password"
          error={passwordErrors.current_password?.message} {...passwordForm.register("current_password", required)} />
        <Input label={t.account.newPassword} type="password" autoComplete="new-password"
          error={passwordErrors.new_password?.message} {...passwordForm.register("new_password", required)} />
        <Button type="submit" variant="secondary" className="self-start" loading={passwordForm.formState.isSubmitting}>
          {t.account.changePassword}
        </Button>
      </form>
    </div>
  );
}
