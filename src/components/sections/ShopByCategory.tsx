"use client";
import { IEachProduct } from "@/types/types";
import useDataClient from "@/data/GetDataClient";
import Link from "next/link";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ButtonUI from "../ButtonUI";
import { baseUrl, endpoints } from "@/constants/endpoints";
import { Links } from "@/constants/links";

const ShopByCategory = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const allData: IEachProduct[] =
    useDataClient(`${baseUrl}${endpoints.products}/`).data || [];

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
          <Link href={Links.categories}>
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
                <Link
                  href={`/store?category=${product.category}`}
                  className="border border-gray-200 rounded-md p-4 flex flex-col gap-2 justify-center items-center"
                >
                    <div className="flex sm:flex-col items-center gap-2 relative">
                      <div className="sm:w-40 sm:h-40 h-16 w-16 flex justify-center sm:bg-(--BabyPink)">
                        <img alt="" src={product.image} width={160} height={160} />
                      </div>
                      <span className="absolute left-0 right-0 bottom-0 top-0 flex items-center justify-center backdrop-blur-sm bg-(--BabyPink)/50 hover:bg-(--BabyPink)/0 text-lg text-(--Burgundy) text-nowrap">
                        {product.category}
                      </span>
                    </div>
                    <span className="sm:hidden">{">"}</span>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
      <div className="block md:hidden">
        <Link href={Links.categories}>
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
