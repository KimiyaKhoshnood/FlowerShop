"use client";
import { useState } from "react";

const Star = ({ fill, className = "size-4" }: { fill: number; className?: string }) => (
    <span className={`relative inline-block ${className}`} aria-hidden="true">
        <svg viewBox="0 0 20 20" className="absolute inset-0 size-full text-blush-200" fill="currentColor">
            <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
        </svg>
        <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
            <svg viewBox="0 0 20 20" className={`${className} max-w-none text-amber-400`} fill="currentColor">
                <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
            </svg>
        </span>
    </span>
);

/** Read-only star rating, e.g. 4.3 → four and a third stars. */
export const Stars = ({ value, className = "size-4", label }: { value: number | null; className?: string; label?: string }) => (
    <span className="inline-flex items-center gap-0.5" dir="ltr" role="img" aria-label={label ?? `${(value ?? 0).toFixed(1)} / 5`}>
        {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className={className} fill={Math.max(0, Math.min(1, (value ?? 0) - star + 1))} />
        ))}
    </span>
);

export const StarInput = ({ value, onChange, label }: { value: number; onChange: (value: number) => void; label: string }) => {
    const [hover, setHover] = useState(0);
    return (
        <div role="radiogroup" aria-label={label} className="inline-flex gap-1" dir="ltr" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" role="radio" aria-checked={value === star} aria-label={`${star}`}
                    onMouseEnter={() => setHover(star)} onClick={() => onChange(star)}
                    className="cursor-pointer rounded transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-magenta">
                    <Star className="size-7" fill={(hover || value) >= star ? 1 : 0} />
                </button>
            ))}
        </div>
    );
};
