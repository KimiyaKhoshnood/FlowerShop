export const Spinner = ({ className = "size-5" }: { className?: string }) => (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
        <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
);

export const Skeleton = ({ className = "" }: { className?: string }) => (
    <div className={`animate-pulse rounded-xl bg-blush/80 ${className}`} />
);

export const PageSpinner = () => (
    <div className="flex min-h-[40vh] items-center justify-center text-magenta">
        <Spinner className="size-8" />
    </div>
);
