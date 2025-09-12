"use client";
import { IEachProduct } from "@/types/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { default as Button, default as ButtonUI } from "./ButtonUI";
import ChartRadialBar from "./ChartRadialBar";
import Rate from "./Rate";

const EachProductDetails = ({
  title,
  image,
  description,
}: IEachProduct) => {
  const [showMore, setShowMore] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleChange = (e: MediaQueryListEvent) => setShowMore(e.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 gap-3">
      <div className="flex flex-col pt-5 justify-between items-center lg:bg-inherit bg-(--Burgundy)/10">
        <div className="w-full text-(--Burgundy) text-lg lg:block hidden">
          <Link href={"/store"} className="font-bold">
            {"< Back To Tulip Category"}
          </Link>
        </div>
        <img
          src={image}
          alt=""
          className="lg:w-full md:w-1/3 sm:w-1/2 w-full max-w-[500px] pr-5"
          width={500}
          height={500}
        />
      </div>
      <div className="lg:hidden p-5 flex flex-col gap-2">
        <h2 className="text-(--Burgundy) font-bold text-2xl">{title}</h2>
        <p className="text-sm text-wrap">{description}</p>
      </div>
      <div
        className={`${showMore ? "flex" : "hidden"} flex-col gap-3 lg:p-0 px-5`}
      >
        <div className="bg-white/80 border border-gray-200 px-4 lg:py-3 py-2 rounded-lg flex justify-between">
          <span>{"Colour".toUpperCase()}</span>
          <span className="text-(--Burgundy)">Purpleish Blue</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/80 border border-gray-200 px-4 lg:py-3 py-2 rounded-lg flex flex-col justify-between gap-3">
            <span>{"Bloom Count".toUpperCase()}</span>
            <span className="text-(--Burgundy) w-full text-end font-bold text-3xl">
              3
            </span>
          </div>
          <div className="bg-white/80 border border-gray-200 px-4 lg:py-3 py-2 rounded-lg flex flex-col justify-between gap-3">
            <span>{"Number of stems (Bunch)".toUpperCase()}</span>
            <span className="text-(--Burgundy) w-full text-end font-bold text-3xl">
              10
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/80 border border-gray-200 px-4 lg:py-3 py-2 rounded-lg flex flex-col justify-between">
            <span>{"Opening Speed".toUpperCase()}</span>
            <ChartRadialBar
              data={[{ name: "Vase Life", value: 70, fill: "#4E0629" }]}
            />
            <div className="text-center text-(--Burgundy)">
              <span className="font-bold">2</span> <span>Days</span>
            </div>
          </div>
          <div className="bg-white/80 border border-gray-200 px-4 lg:py-3 py-2 rounded-lg flex flex-col justify-between">
            <span>{"Vase Line".toUpperCase()}</span>
            <ChartRadialBar
              data={[{ name: "Vase Life", value: 70, fill: "#4E0629" }]}
            />
            <div className="text-center text-(--Burgundy)">
              <span className="font-bold">5 - 7</span> <span>Days</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 h-full">
          <div className="bg-white/80 border border-gray-200 px-4 lg:py-3 py-2 rounded-lg flex flex-col justify-between gap-3 h-full">
            <span>{"Head Size".toUpperCase()}</span>
            <div className="text-(--Burgundy) w-full text-end">
              <span className="font-bold text-xl">6 - 7</span> <span>cm</span>
            </div>
          </div>
          <div className="bg-white/80 border border-gray-200 px-4 lg:py-3 py-2 rounded-lg flex flex-col justify-between gap-3 h-full">
            <span>{"Stem Size".toUpperCase()}</span>
            <div className="text-(--Burgundy) w-full text-end">
              <span className="font-bold text-xl">40 - 50</span> <span>cm</span>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`${showMore ? "flex" : "hidden"
          } flex flex-col gap-3 lg:p-0 px-5`}
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/80 border border-gray-200 px-4 lg:py-3 py-2 rounded-lg flex flex-col justify-between gap-3">
            <span>{"Availability".toUpperCase()}</span>
            <div className="w-full text-sm grid grid-cols-3 gap-2">
              <span className="text-center rounded-lg p-1 bg-(--Burgundy) text-white">
                Jan
              </span>
              <span className="text-center rounded-lg p-1 bg-(--Burgundy) text-white">
                Feb
              </span>
              <span className="text-center rounded-lg p-1 bg-(--Burgundy) text-white">
                Mar
              </span>

              <span className="text-center rounded-lg p-1 bg-(--Burgundy) text-white">
                Apr
              </span>
              <span className="text-center rounded-lg p-1 bg-(--Burgundy) text-white">
                May
              </span>
              <span className="text-center rounded-lg p-1 bg-(--Burgundy)/10 text-(--Burgundy)">
                Jun
              </span>

              <span className="text-center rounded-lg p-1 bg-(--Burgundy)/10 text-(--Burgundy)">
                Jul
              </span>
              <span className="text-center rounded-lg p-1 bg-(--Burgundy)/10 text-(--Burgundy)">
                Aug
              </span>
              <span className="text-center rounded-lg p-1 bg-(--Burgundy)/10 text-(--Burgundy)">
                Sep
              </span>

              <span className="text-center rounded-lg p-1 bg-(--Burgundy) text-white">
                Oct
              </span>
              <span className="text-center rounded-lg p-1 bg-(--Burgundy) text-white">
                Nov
              </span>
              <span className="text-center rounded-lg p-1 bg-(--Burgundy) text-white">
                Dec
              </span>
            </div>
          </div>
          <div className="bg-white/80 border border-gray-200 px-4 lg:py-3 py-2 rounded-lg flex flex-col justify-between gap-3">
            <span>{"Reviews".toUpperCase()}</span>
            <div className=" w-full">
              <div className="text-center">
                <Rate />
              </div>
              <span className="text-sm">There are no reviews yet.</span>
              <div>
                <Button
                  text="Review"
                  className="bg-(--Burgundy)/10 text-(--Burgundy) w-full"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white/80 border border-gray-200 px-4 lg:py-3 py-2 p-4 rounded-lg flex flex-col justify-between h-full gap-5">
          <h3>{"Product Care".toUpperCase()}</h3>
          <div className="text-(--Burgundy) flex flex-col gap-3">
            <p>
              Cut stems on an angle and remove any foliage below the water
              level.
            </p>
            <p>
              Be sure to place them in a clean container with cool water and
              keep them away from direct sunlight, heat sources and/or air
              conditioners.
            </p>
            <p>
              Re-cut and change water every 2-3 days and your lilies will last
              7-14 days.
            </p>
          </div>
        </div>
      </div>
      <div
        onClick={() => setShowMore(!showMore)}
        className="text-(--Burgundy) lg:hidden block px-5 rounded-2xl"
      >
        <ButtonUI
          text={showMore ? "Show Less" : "Show More"}
          className="bg-(--Burgundy)/10 w-full"
        />
      </div>
    </div>
  );
};

export default EachProductDetails;
