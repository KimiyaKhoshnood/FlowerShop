"use client";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useI18n } from "@/lib/i18n";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

/** A horizontally scrolling row of product cards. */
export const ProductRail = ({ products }: { products: Product[] }) => {
    const { dir } = useI18n();
    return (
        <Swiper
            key={dir}
            dir={dir}
            modules={[Navigation]}
            navigation
            spaceBetween={16}
            slidesPerView={1.6}
            breakpoints={{ 640: { slidesPerView: 2.5 }, 900: { slidesPerView: 3.5 }, 1200: { slidesPerView: 4 } }}
            className="!pb-2"
        >
            {products.map((product) => (
                <SwiperSlide key={product.id} className="!h-auto">
                    <ProductCard product={product} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};
