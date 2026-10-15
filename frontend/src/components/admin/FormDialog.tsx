"use client";
import { Dialog } from "@mui/material";
import { useI18n } from "@/lib/i18n";
import { Button } from "../ui/Button";

/** Modal wrapper around a small create/edit form. */
export const FormDialog = ({ open, title, onClose, onSubmit, submitting, children }: {
    open: boolean; title: string; onClose: () => void; onSubmit: (event: React.FormEvent) => void;
    submitting?: boolean; children: React.ReactNode;
}) => {
    const { t, dir } = useI18n();
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" slotProps={{ paper: { sx: { borderRadius: "1.25rem" } } }}>
            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5 p-6" dir={dir}>
                <h2 className="font-display text-2xl text-burgundy">{title}</h2>
                {children}
                <div className="flex justify-end gap-2 pt-2">
                    <Button variant="ghost" onClick={onClose}>{t.common.cancel}</Button>
                    <Button type="submit" loading={submitting}>{t.common.save}</Button>
                </div>
            </form>
        </Dialog>
    );
};
