import Link from "next/link";

// Only reached for URLs outside /en and /fa; the styled page is app/[lang]/not-found.tsx.
export default function NotFound() {
    return (
        <html lang="en">
            <body className="flex min-h-screen flex-col items-center justify-center gap-6 bg-cream p-6 text-center">
                <img src="/404.svg" alt="" width={360} height={194} />
                <p className="font-display text-2xl text-burgundy">This page has wilted.</p>
                <Link href="/en" className="rounded-full bg-magenta px-6 py-3 text-sm font-medium text-white">Back to the shop</Link>
            </body>
        </html>
    );
}
