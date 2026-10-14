"use client";
import { IEachProduct } from "@/types/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import ButtonUI from "./ButtonUI";
import ChartRadialBar from "./ChartRadialBar";
import Rate from "./Rate";
import { Links } from "@/constants/links";
import { useLanguage } from "@/providers/LanguageProvider";
import { stringFormat } from "@/utils/utils";

const EachProductDetails = ({
  title,
  image,
  description,
  category
}: IEachProduct) => {
  const { lang, dictionary } = useLanguage()
  const [showMore, setShowMore] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    setShowMore(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setShowMore(e.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 gap-3">
      <div className="flex flex-col pt-5 justify-between items-center lg:bg-inherit bg-(--Burgundy)/10">
        <div className="w-full text-(--Burgundy) text-lg lg:block hidden">
          <Link href={Links.store(lang)} className="font-bold">
            {'<'} {stringFormat(dictionary?.store?.backButton, category)}
          </Link>
        </div>
        <img
          src={image}
          alt={title}
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
          <span>{dictionary?.store?.details?.colour?.toUpperCase()}</span>
          <span className="text-(--Burgundy)">Purpleish Blue</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/80 border border-gray-200 px-4 lg:py-3 py-2 rounded-lg flex flex-col justify-between gap-3">
            <span>{dictionary?.store?.details?.bloomCount?.toUpperCase()}</span>
            <span className="text-(--Burgundy) w-full text-end font-bold text-3xl">
              3
            </span>
          </div>
          <div className="bg-white/80 border border-gray-200 px-4 lg:py-3 py-2 rounded-lg flex flex-col justify-between gap-3">
            <span>{dictionary?.store?.details?.stemsNumber?.toUpperCase()}</span>
            <span className="text-(--Burgundy) w-full text-end font-bold text-3xl">
              10
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/80 border border-gray-200 px-4 lg:py-3 py-2 rounded-lg flex flex-col justify-between">
            <span>{dictionary?.store?.details?.openingSpeed?.toUpperCase()}</span>
            <ChartRadialBar
              data={[{ name: "Vase Life", value: 70, fill: "#4E0629" }]}
            />
            <div className="text-center text-(--Burgundy)">
              <span className="font-bold">2</span> <span>{dictionary?.store?.days}</span>
            </div>
          </div>
          <div className="bg-white/80 border border-gray-200 px-4 lg:py-3 py-2 rounded-lg flex flex-col justify-between">
            <span>{dictionary?.store?.details?.vaseLine?.toUpperCase()}</span>
            <ChartRadialBar
              data={[{ name: "Vase Life", value: 70, fill: "#4E0629" }]}
            />
            <div className="text-center text-(--Burgundy)">
              <span className="font-bold">5 - 7</span> <span>{dictionary?.store?.days}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 h-full">
          <div className="bg-white/80 border border-gray-200 px-4 lg:py-3 py-2 rounded-lg flex flex-col justify-between gap-3 h-full">
            <span>{dictionary?.store?.details?.headSize?.toUpperCase()}</span>
            <div className="text-(--Burgundy) w-full text-end">
              <span className="font-bold text-xl">6 - 7</span> <span>cm</span>
            </div>
          </div>
          <div className="bg-white/80 border border-gray-200 px-4 lg:py-3 py-2 rounded-lg flex flex-col justify-between gap-3 h-full">
            <span>{dictionary?.store?.details?.stemSize?.toUpperCase()}</span>
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
            <span>{dictionary?.store?.details?.availability?.toUpperCase()}</span>
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
            <span>{dictionary?.store?.details?.reviews?.toUpperCase()}</span>
            <div className=" w-full">
              <div className="text-center">
                <Rate />
              </div>
              <span className="text-sm">{dictionary?.store?.noReviews}</span>
              <div>
                <ButtonUI
                  text={dictionary?.store?.review}
                  className="bg-(--Burgundy)/10 text-(--Burgundy) w-full"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white/80 border border-gray-200 px-4 lg:py-3 py-2 p-4 rounded-lg flex flex-col justify-between h-full gap-5">
          <h3>{dictionary?.store?.details?.productCare?.toUpperCase()}</h3>
          <div className="text-(--Burgundy) flex flex-col gap-3">
            {dictionary?.store?.careTips?.map((tip: string) => <p key={tip}>{tip}</p>)}
          </div>
        </div>
      </div>
      <div className="text-(--Burgundy) lg:hidden block px-5">
        <ButtonUI
          onClick={() => setShowMore(!showMore)}
          text={showMore ? dictionary?.store?.showLess : dictionary?.store?.showMore}
          className="bg-(--Burgundy)/10 w-full"
        />
      </div>
    </div>
  );
};

export default EachProductDetails;
