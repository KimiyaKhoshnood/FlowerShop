"use client";
import { Dialog } from "@mui/material";
import { STATUS_STYLES } from "@/lib/format";
import { fill, useI18n } from "@/lib/i18n";
import type { OrderStatus } from "@/lib/types";
import { Button } from "./Button";

export const StatusBadge = ({ status }: { status: OrderStatus }) => {
    const { t } = useI18n();
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}>
            {t.order.status[status]}
        </span>
    );
};

export const EmptyState = ({ title, text, action, icon = "/tulipSvg.svg" }:
    { title: string; text?: string; action?: React.ReactNode; icon?: string }) => (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <img src={icon} alt="" className="mb-2 size-16 opacity-70" />
        <p className="font-display text-xl text-burgundy">{title}</p>
        {text && <p className="max-w-sm text-sm text-muted">{text}</p>}
        {action && <div className="mt-3">{action}</div>}
    </div>
);

export const ErrorState = ({ message, onRetry }: { message?: string; onRetry?: () => void }) => {
    const { t } = useI18n();
    return (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-red-50 px-6 py-10 text-center">
            <p className="text-sm text-red-700">{message ?? t.common.error}</p>
            {onRetry && <Button size="sm" variant="outline" onClick={onRetry}>{t.common.retry}</Button>}
        </div>
    );
};

export const ConfirmDialog = ({ open, title, text, confirmLabel, onConfirm, onClose, loading, danger = true }: {
    open: boolean; title: string; text?: string; confirmLabel: string; onConfirm: () => void; onClose: () => void;
    loading?: boolean; danger?: boolean;
}) => {
    const { t, dir } = useI18n();
    return (
        <Dialog open={open} onClose={onClose} slotProps={{ paper: { sx: { borderRadius: "1.25rem" } } }}>
            <div className="flex max-w-md flex-col gap-3 p-6" dir={dir}>
                <h2 className="font-display text-xl text-burgundy">{title}</h2>
                {text && <p className="text-sm text-muted">{text}</p>}
                <div className="mt-3 flex justify-end gap-2">
                    <Button variant="ghost" onClick={onClose}>{t.common.cancel}</Button>
                    <Button variant={danger ? "danger" : "primary"} onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
                </div>
            </div>
        </Dialog>
    );
};

/** Previous / next pager for client-side lists. */
export const Pager = ({ page, count, pageSize = 12, onChange }:
    { page: number; count: number; pageSize?: number; onChange: (page: number) => void }) => {
    const { t, lang } = useI18n();
    const pages = Math.max(1, Math.ceil(count / pageSize));
    if (pages <= 1) return null;
    return (
        <div className="flex items-center justify-between gap-3 pt-4 text-sm text-muted">
            <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => onChange(page - 1)}>{t.common.previous}</Button>
            <span>{fill(t.common.page, page.toLocaleString(lang), pages.toLocaleString(lang))}</span>
            <Button size="sm" variant="outline" disabled={page >= pages} onClick={() => onChange(page + 1)}>{t.common.next}</Button>
        </div>
    );
};

export const SectionHeading = ({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) => (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
            <h2 className="heading-display text-3xl sm:text-4xl">{title}</h2>
            {subtitle && <p className="mt-2 text-muted">{subtitle}</p>}
        </div>
        {action}
    </div>
);
