"use client"

import ButtonUI from "../ButtonUI";
import { Links } from "@/constants/links";
import { useLanguage } from "@/providers/LanguageProvider";

const HotDeals = () => {
  const { lang, dictionary } = useLanguage()

  return (
    <div className="bg-(--BabyPink) lg:px-20 p-10 relative overflow-hidden">
      <div>
        <div className="webkit-filter z-0 absolute w-60 h-60 -left-10 -bottom-28 bg-(--Burgundy)/10 shadow rounded-full"></div>
        <div className="webkit-filter z-0 absolute w-50 h-50 -top-10 right-20 bg-(--Burgundy)/10 shadow rounded-full"></div>
        <div className="webkit-filter z-0 absolute w-12 h-12 top-0 left-72 bg-(--Burgundy)/10 shadow rounded-full"></div>
        <div className="webkit-filter z-0 absolute w-20 h-20 top-10 right-96 bg-(--Burgundy)/10 shadow rounded-full"></div>
      </div>
      <div className="flex md:flex-row flex-col justify-between md:items-center md:gap-5 gap-8 z-10">
        <div className="text-(--Burgundy) md:text-6xl text-5xl font-bold">
          {dictionary?.hotDeals?.title}
        </div>
        <div className="text-(--Burgundy) flex flex-col gap-2">
          <span className="font-bold md:text-xl text-lg">
            {dictionary?.hotDeals?.headline.toUpperCase()}
          </span>
          <span className="text-sm">
            {dictionary?.hotDeals?.content}
          </span>
          <span className="text-xs">{dictionary?.hotDeals?.caption}</span>
        </div>
        <div className="md:pt-0 pt-5">
          <ButtonUI
            text={dictionary?.hotDeals?.button}
            className="bg-(--Burgundy) text-white md:w-fit w-full"
            url={Links.store(lang)}
          />
        </div>
      </div>
    </div>
  );
};

export default HotDeals;
