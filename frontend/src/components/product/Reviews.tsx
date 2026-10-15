"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ApiError, api } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { fill, href, useI18n } from "@/lib/i18n";
import { useSession } from "@/lib/session";
import { useToast } from "@/lib/toast";
import type { Review } from "@/lib/types";
import { Button, ButtonLink } from "../ui/Button";
import { Textarea } from "../ui/Field";
import { StarInput, Stars } from "../ui/Stars";

export const Reviews = ({ slug, initialReviews, rating, count }:
    { slug: string; initialReviews: Review[]; rating: number | null; count: number }) => {
    const { lang, t } = useI18n();
    const { user, ready } = useSession();
    const toast = useToast();
    const router = useRouter();
    const pathname = usePathname();
    const queryClient = useQueryClient();

    const { data: reviews = initialReviews } = useQuery({
        queryKey: ["reviews", slug],
        queryFn: () => api.products.reviews(slug),
        initialData: initialReviews,
        staleTime: 60_000,
    });

    const [stars, setStars] = useState(0);
    const [comment, setComment] = useState("");
    const mine = user ? reviews.find((review) => review.author === user.username) : undefined;

    const submit = useMutation({
        mutationFn: () => api.products.review(slug, { rating: stars, comment }),
        onSuccess: () => {
            toast.success(t.product.reviews.thanks);
            setStars(0);
            setComment("");
            queryClient.invalidateQueries({ queryKey: ["reviews", slug] });
            router.refresh(); // update the average shown by the server component
        },
        onError: (error) => toast.error(error instanceof ApiError ? error.message : t.common.error),
    });

    return (
        <section id="reviews" className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
            <div>
                <h2 className="heading-display text-3xl">{t.product.reviews.title}</h2>
                <div className="mt-4 flex items-center gap-3">
                    <span className="font-display text-5xl text-burgundy">{(rating ?? 0).toLocaleString(lang, { maximumFractionDigits: 1 })}</span>
                    <div className="flex flex-col gap-1">
                        <Stars value={rating} className="size-5" />
                        <span className="text-sm text-muted">{fill(t.product.reviews.count, count.toLocaleString(lang))}</span>
                    </div>
                </div>

                <div className="mt-8 card p-5">
                    {!ready ? null : user ? (
                        <form className="flex flex-col gap-4" onSubmit={(event) => { event.preventDefault(); submit.mutate(); }}>
                            <p className="font-medium">{mine ? t.product.reviews.update : t.product.reviews.write}</p>
                            <div className="flex flex-col gap-1.5">
                                <span className="text-sm text-muted">{t.product.reviews.yourRating}</span>
                                <StarInput value={stars} onChange={setStars} label={t.product.reviews.yourRating} />
                            </div>
                            <Textarea label={t.product.reviews.comment} value={comment} maxLength={1000}
                                onChange={(event) => setComment(event.target.value)} />
                            <Button type="submit" disabled={stars === 0} loading={submit.isPending} className="self-start">
                                {mine ? t.product.reviews.update : t.product.reviews.submit}
                            </Button>
                        </form>
                    ) : (
                        <ButtonLink href={`${href(lang, "/login")}?next=${encodeURIComponent(pathname)}`} variant="outline">
                            {t.product.reviews.loginToReview}
                        </ButtonLink>
                    )}
                </div>
            </div>

            <ul className="flex flex-col divide-y divide-line">
                {reviews.length === 0 && <li className="py-6 text-muted">{t.product.reviews.empty}</li>}
                {reviews.map((review) => (
                    <li key={review.id} className="flex flex-col gap-2 py-5 first:pt-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                                <span className="flex size-9 items-center justify-center rounded-full bg-blush font-semibold text-burgundy uppercase">
                                    {review.author.charAt(0)}
                                </span>
                                <span className="font-medium">{review.author}</span>
                            </div>
                            <span className="text-xs text-muted">{formatDate(review.created_at, lang)}</span>
                        </div>
                        <Stars value={review.rating} />
                        {review.comment && <p className="text-sm leading-relaxed text-ink/80">{review.comment}</p>}
                    </li>
                ))}
            </ul>
        </section>
    );
};
