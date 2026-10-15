import Link from "next/link";
import { forwardRef } from "react";
import { Spinner } from "./Spinner";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
    primary: "bg-magenta text-white hover:bg-magenta-600 shadow-sm",
    secondary: "bg-burgundy text-white hover:bg-burgundy-700",
    outline: "border border-burgundy/25 text-burgundy hover:border-burgundy hover:bg-blush",
    ghost: "text-burgundy hover:bg-blush",
    danger: "bg-red-600 text-white hover:bg-red-700",
};

const SIZES: Record<Size, string> = {
    sm: "h-9 px-3.5 text-sm",
    md: "h-11 px-5 text-sm",
    lg: "h-13 px-7 text-base",
};

type CommonProps = {
    variant?: Variant;
    size?: Size;
    className?: string;
    children: React.ReactNode;
};

export const buttonClasses = ({ variant = "primary", size = "md", className = "" }: Partial<CommonProps>) =>
    `inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors
     focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta
     disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer whitespace-nowrap
     ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

type ButtonProps = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant, size, className, loading, disabled, children, type = "button", ...props }, ref) => (
        <button ref={ref} type={type} disabled={disabled || loading}
            className={buttonClasses({ variant, size, className })} {...props}>
            {loading && <Spinner className="size-4" />}
            {children}
        </button>
    ),
);
Button.displayName = "Button";

export const ButtonLink = ({ href, variant, size, className, children, ...props }:
    CommonProps & { href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) => (
    <Link href={href} className={buttonClasses({ variant, size, className })} {...props}>
        {children}
    </Link>
);
