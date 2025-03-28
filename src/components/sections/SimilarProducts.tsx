"use client";
import Button from "../ui/ButtonUI";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import useDataClient from "@/data/GetDataClient";
import { EachProduct } from "@/app/store/page";
import Link from "next/link";
import CardPrice from "../CardPrice";

const SimilarProducts = () => {
  const { data, loading, error } = useDataClient(
    "http://localhost:3004/products"
  );

  return (
    <div className="md:px-10 px-5 py-10">
      <div className="flex justify-between lg:px-10">
        <h2 className="sm:text-4xl text-3xl text-(--Burgundy) font-bold">
          You may also like
        </h2>
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
            {data.map((product: EachProduct) => {
              return (
                <SwiperSlide>
                  <Link
                    href={`/store/${product.id}`}
                    className="border border-gray-200 rounded-md p-4 flex flex-col gap-2 justify-center items-center"
                  >
                    <div className="sm:w-40 w-full sm:h-40 h-52 flex justify-center bg-(--BabyPink)">
                      <img alt="" src={product.image} />
                    </div>
                    <div className="w-full flex justify-between text-(--Burgundy)">
                      <span className="text-lg">{product.title}</span>
                      <CardPrice price={product.price} />
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default SimilarProducts;
