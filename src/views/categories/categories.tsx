"use client"

import HotDeals from "@/components/sections/HotDeals";
import ButtonUI from "@/components/ButtonUI";
import { baseUrl, endpoints } from "@/constants/endpoints";
import useDataClient from "@/data/GetDataClient";
import { IEachProduct } from "@/types/types";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const Categories = () => {
    const { loading } = useDataClient(`${baseUrl}${endpoints.products}/`);
    const [categories, setCategories] = useState<string[]>([]);

    const { data } = useDataClient(`${baseUrl}${endpoints.products}/`);

    const allProducts: IEachProduct[] = useMemo(() => {
        return data || [];
    }, [data]);

    useEffect(() => {
        if (allProducts) {
            const uniqueCategories = [
                ...new Set(allProducts.map((item) => item.category)),
            ];
            setCategories(uniqueCategories);
        }
    }, [allProducts]);

    const categoryImages = categories.map((category) => {
        const foundItem = allProducts.find((item) => item.category === category);
        return { category, image: foundItem ? foundItem.image : "/default.jpg" };
    });

    return (
        <>
            <div className="flex flex-col gap-5 py-5">
                <div className="lg:px-20 sm:px-10 px-5 flex justify-between">
                    <h1 className="font-bold text-(--Burgundy) text-3xl text-center">
                        Shop by Category
                    </h1>
                    <Link href={"/store"} className="sm:block hidden">
                        <ButtonUI
                            text="All products"
                            className="bg-(--Burgundy)/10 text-(--Burgundy)"
                        />
                    </Link>
                </div>
                {loading && <div className="overflow-hidden">
                    <div className='h-32 w-full flex justify-center items-center animate-ping'>
                        <img alt="logo" src="/Logo.svg" width={50} height={150} />
                    </div>
                </div>}
                <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 lg:px-20 sm:px-10 px-5 sm:gap-5 gap-2">
                    {categoryImages.map((elem) => {
                        return (
                            <Link
                                href={`/store?category=${elem.category}`}
                                key={elem.category}
                            >
                                <div className="border border-gray-200 rounded-md sm:p-4 px-4 flex sm:flex-col gap-2 justify-between items-center">
                                    <div className="flex sm:flex-col items-center gap-2 relative">
                                        <div className="sm:w-40 sm:h-40 h-16 w-16 flex justify-center sm:bg-(--BabyPink)">
                                            <img alt="" src={elem.image} width={160} height={160} />
                                        </div>
                                        <span className="absolute left-0 right-0 bottom-0 top-0 flex items-center justify-center backdrop-blur-sm bg-(--BabyPink)/50 hover:bg-(--BabyPink)/0 text-lg text-(--Burgundy) text-nowrap">
                                            {elem.category}
                                        </span>
                                    </div>
                                    <span className="sm:hidden">{">"}</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
                <Link href={"/store"} className="sm:hidden lg:px-20 sm:px-10 px-5">
                    <ButtonUI
                        text="All products"
                        className="bg-(--Burgundy)/10 text-(--Burgundy) w-full"
                    />
                </Link>
            </div>

            <HotDeals />
        </>
    )
}

export default Categories