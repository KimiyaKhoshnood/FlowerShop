import { forwardRef, useId } from "react";

const controlClasses = (invalid?: boolean) =>
    `w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 transition
     focus:outline-none focus:ring-2 focus:ring-magenta/30 focus:border-magenta
     disabled:bg-neutral-50 disabled:text-muted
     ${invalid ? "border-red-400" : "border-line"}`;

type FieldShellProps = {
    label?: string;
    hint?: string;
    error?: string;
    id: string;
    children: React.ReactNode;
    className?: string;
};

const FieldShell = ({ label, hint, error, id, children, className = "" }: FieldShellProps) => (
    <div className={`flex flex-col gap-1.5 ${className}`}>
        {label && <label htmlFor={id} className="text-sm font-medium text-ink">{label}</label>}
        {children}
        {error ? <p id={`${id}-error`} className="text-xs text-red-600">{error}</p>
            : hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
);

type BaseProps = { label?: string; hint?: string; error?: string; containerClassName?: string };

export const Input = forwardRef<HTMLInputElement, BaseProps & React.InputHTMLAttributes<HTMLInputElement>>(
    ({ label, hint, error, containerClassName, className = "", id, ...props }, ref) => {
        const autoId = useId();
        const fieldId = id ?? autoId;
        return (
            <FieldShell label={label} hint={hint} error={error} id={fieldId} className={containerClassName}>
                <input ref={ref} id={fieldId} aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${fieldId}-error` : undefined}
                    className={`${controlClasses(Boolean(error))} ${className}`} {...props} />
            </FieldShell>
        );
    },
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
    ({ label, hint, error, containerClassName, className = "", id, ...props }, ref) => {
        const autoId = useId();
        const fieldId = id ?? autoId;
        return (
            <FieldShell label={label} hint={hint} error={error} id={fieldId} className={containerClassName}>
                <textarea ref={ref} id={fieldId} aria-invalid={Boolean(error)} rows={3}
                    className={`${controlClasses(Boolean(error))} ${className}`} {...props} />
            </FieldShell>
        );
    },
);
Textarea.displayName = "Textarea";

export const Select = forwardRef<HTMLSelectElement, BaseProps & React.SelectHTMLAttributes<HTMLSelectElement>>(
    ({ label, hint, error, containerClassName, className = "", id, children, ...props }, ref) => {
        const autoId = useId();
        const fieldId = id ?? autoId;
        return (
            <FieldShell label={label} hint={hint} error={error} id={fieldId} className={containerClassName}>
                <select ref={ref} id={fieldId} aria-invalid={Boolean(error)}
                    className={`${controlClasses(Boolean(error))} cursor-pointer ${className}`} {...props}>
                    {children}
                </select>
            </FieldShell>
        );
    },
);
Select.displayName = "Select";

export const Checkbox = forwardRef<HTMLInputElement, { label: string } & React.InputHTMLAttributes<HTMLInputElement>>(
    ({ label, className = "", ...props }, ref) => (
        <label className={`flex cursor-pointer items-center gap-2.5 text-sm text-ink ${className}`}>
            <input ref={ref} type="checkbox" className="size-4 cursor-pointer rounded accent-magenta" {...props} />
            {label}
        </label>
    ),
);
Checkbox.displayName = "Checkbox";
