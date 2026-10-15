"use client";
import { Alert, Snackbar } from "@mui/material";
import { createContext, useCallback, useContext, useState } from "react";

type Severity = "success" | "error" | "info";
type Toast = { id: number; message: string; severity: Severity };

type Toaster = {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
};

const ToastContext = createContext<Toaster | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toast, setToast] = useState<Toast | null>(null);

    const show = useCallback((severity: Severity) => (message: string) =>
        setToast({ id: Date.now(), message, severity }), []);

    const [api] = useState<Toaster>(() => ({ success: show("success"), error: show("error"), info: show("info") }));

    return (
        <ToastContext.Provider value={api}>
            {children}
            <Snackbar
                key={toast?.id}
                open={Boolean(toast)}
                autoHideDuration={4000}
                onClose={(_, reason) => reason !== "clickaway" && setToast(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={() => setToast(null)} severity={toast?.severity ?? "info"} variant="filled"
                    sx={{ borderRadius: 3, alignItems: "center" }}>
                    {toast?.message}
                </Alert>
            </Snackbar>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used inside <ToastProvider>");
    return context;
};
