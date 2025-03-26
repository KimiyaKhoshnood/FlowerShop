import React from "react";
import CardPrice from "./CardPrice";
import { EachProduct } from "@/app/store/page";
import ChartRadialBar from "./ui/ChartRadialBar";


const EachProductDetails = async ({
  id,
  title,
  price,
  image,
  description,
}: EachProduct) => {
  return (
    <div className="grid grid-cols-3">
      <div className="col-span-1">
        <img src={image} alt="" />
      </div>
      <div className="flex flex-col gap-3">
        <div className="bg-white/80 p-4 rounded-lg flex justify-between">
          <span>{"Colour".toUpperCase()}</span>
          <span className="text-(--Burgundy)">Purpleish Blue</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/80 p-4 rounded-lg flex flex-col justify-between gap-3">
            <span>{"Bloom Count".toUpperCase()}</span>  
            <span className="text-(--Burgundy) w-full text-end font-bold text-3xl">3</span>  
          </div>
          <div className="bg-white/80 p-4 rounded-lg flex flex-col justify-between gap-3">
            <span>{"Number of stems (Bunch)".toUpperCase()}</span>  
            <span className="text-(--Burgundy) w-full text-end font-bold text-3xl">10</span>  
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/80 p-4 rounded-lg flex flex-col justify-between">
            <span>{"Opening Speed".toUpperCase()}</span>  
            <ChartRadialBar data={[{ name: "Vase Life", value: 70, fill: "#4E0629" }]}/> 
            <div className="text-center text-(--Burgundy)">
            <span className="font-bold">2</span>
            <span>Days</span>
            </div>
          </div>
          <div className="bg-white/80 p-4 rounded-lg flex flex-col justify-between">
            <span>{"Vase Line".toUpperCase()}</span>  
            <ChartRadialBar data={[{ name: "Vase Life", value: 70, fill: "#4E0629" }]}/> 
            <div className="text-center text-(--Burgundy)">
            <span className="font-bold">5 - 7</span>
            <span>Days</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/80 p-4 rounded-lg flex flex-col justify-between gap-3">
            <span>{"Head Size".toUpperCase()}</span>  
            <div className="text-(--Burgundy) w-full text-end">
              <span className="font-bold text-xl">6 - 7</span> 
              {" "} 
              <span>cm</span>
            </div>
          </div>
          <div className="bg-white/80 p-4 rounded-lg flex flex-col justify-between gap-3">
            <span>{"Stem Size".toUpperCase()}</span> 
            <div className="text-(--Burgundy) w-full text-end">  
              <span className="font-bold text-xl">40 - 50</span>
              {" "} 
              <span>cm</span>
            </div>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default EachProductDetails;
