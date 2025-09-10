"use client";
import { IEachProduct } from "@/types/types";
import useDataClient from "@/data/GetDataClient";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import CardPrice from "../CardPrice";
import ButtonUI from "../ui/ButtonUI";
import { baseUrl, endpoints } from "@/constants/endpoints";

const HotProducts = () => {
  const data: IEachProduct[] =
    useDataClient(`${baseUrl}${endpoints.products}/`)
      .data || [];

  return (
    <div className="md:px-10 px-5 py-10">
      <div className="flex justify-between lg:px-10">
        <h2 className="sm:text-4xl text-3xl text-(--Burgundy) font-bold">
          Hot Products
        </h2>
        <div className="hidden sm:block">
          <Link href={"/store"}>
            <ButtonUI
              text="All Hot Products"
              className="bg-(--BabyPink) text-(--Burgundy)"
            />
          </Link>
        </div>
      </div>
      <div className="py-7 lg:px-10">
        {data && (
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
            {data.map((product: IEachProduct) => {
              return (
                <SwiperSlide key={product.id}>
                  <Link
                    href={`/store/${product.id}`}
                    className="border border-gray-200 rounded-md p-4 flex flex-col gap-2 justify-center items-center"
                  >
                    <div className="sm:w-40 w-full sm:h-40 h-52 flex justify-center bg-(--BabyPink)">
                      <img
                        alt=""
                        src={product.image}
                        width={160}
                        height={160}
                      />
                    </div>
                    <div className="w-full flex flex-col items-center text-(--Burgundy)">
                      <span className="text-lg">{product.title}</span>
                      <CardPrice price={product.price} justify="items-center" />
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>
      <div className="block md:hidden">
        <Link href={"/store"}>
          <ButtonUI
            text="All Categories"
            className="bg-(--BabyPink) text-(--Burgundy) md:w-fit w-full"
          />
        </Link>
      </div>
    </div>
  );
};

export default HotProducts;
