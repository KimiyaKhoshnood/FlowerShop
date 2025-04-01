"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import useDataClient from "@/data/GetDataClient";
import { EachProduct } from "@/app/store/page";
import Link from "next/link";
import ButtonUI from "../ui/ButtonUI";
import { useEffect, useState } from "react";
import Image from "next/image";

const ShopByCategory = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const allData: EachProduct[] =
    useDataClient("https://json-server-vercel-flower-shop.vercel.app/products")
      .data || [];

  useEffect(() => {
    if (allData.length > 0) {
      const uniqueCategories = [
        ...new Set(allData.map((item) => item.category)),
      ];
      setCategories(uniqueCategories);
    }
  }, [allData]);

  const categoryImages = categories.map((category) => {
    const foundItem = allData.find((item) => item.category === category);
    return { category, image: foundItem ? foundItem.image : "/default.jpg" };
  });

  return (
    <div className="md:px-10 px-5 py-10">
      <div className="flex justify-between lg:px-10">
        <h2 className="sm:text-4xl text-3xl text-(--Burgundy) font-bold">
          Shop by Category
        </h2>
        <div className="hidden sm:block">
          <Link href={"/categories"}>
            <ButtonUI
              text="All Categories"
              className="bg-(--BabyPink) text-(--Burgundy)"
            />
          </Link>
        </div>
      </div>
      <div className="py-7 lg:px-10">
        {categoryImages.length > 0 && (
          <Swiper
            slidesPerView={1}
            spaceBetween={5}
            navigation={true}
            breakpoints={{
              450: {
                slidesPerView: 2,
                spaceBetween: 5,
              },
              640: {
                slidesPerView: 3,
                spaceBetween: 5,
              },
              850: {
                slidesPerView: 4,
                spaceBetween: 5,
              },
              1150: {
                slidesPerView: 5,
                spaceBetween: 10,
              },
            }}
            modules={[Navigation]}
            className="mySwiper"
          >
            {categoryImages.map((product) => (
              <SwiperSlide key={product.category}>
                <div className="border border-gray-200 rounded-md p-4 flex flex-col gap-2 justify-center items-center">
                  <div className="sm:w-40 w-full sm:h-40 h-52 flex justify-center bg-(--BabyPink)">
                    <Image
                      alt={product.category}
                      src={product.image}
                      width={160}
                      height={160}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-lg text-(--Burgundy)">
                    {product.category}
                  </span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
      <div className="block md:hidden">
        <Link href={"/categories"}>
          <ButtonUI
            text="All Categories"
            className="bg-(--BabyPink) text-(--Burgundy) md:w-fit w-full"
          />
        </Link>
      </div>
    </div>
  );
};

export default ShopByCategory;
