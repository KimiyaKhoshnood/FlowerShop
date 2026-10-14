"use client";
import OrderList from "@/components/OrderList";
import { useLanguage } from "@/providers/LanguageProvider";
import { IWebServiceResult } from "@/services/BaseService";
import { GetOrdersService, GetProductsService } from "@/services/services";
import { IEachProduct, IOrder } from "@/types/types";
import { useEffect, useState } from "react";

const Dashboard = () => {
    const { dictionary } = useLanguage()
    const [orderList, setOrderList] = useState<IOrder[]>();
    const [products, setProducts] = useState<IEachProduct[]>([]);

    useEffect(() => {
        GetOrdersService((resultData: IOrder[], result: IWebServiceResult) => {
            setOrderList(result.hasError ? [] : resultData)
        })
        // One request for the whole catalogue instead of one per order line.
        GetProductsService((resultData: IEachProduct[], result: IWebServiceResult) => {
            if (!result.hasError) setProducts(resultData)
        })
    }, []);

    return (
        <div className="flex flex-col gap-0 sm:px-5">
            <h2 className="text-center p-5 text-4xl">{dictionary?.dashboard?.orders?.title}</h2>
            <div className="grid grid-cols-5 items-center bg-neutral-50 rounded-t-lg text-center sm:text-xl py-1">
                {dictionary?.dashboard?.orders?.headers?.map((header: string) => (
                    <div key={header} className="py-2">{header}</div>
                ))}
            </div>
            {orderList?.length === 0 && (
                <p className="text-center text-neutral-500 py-10">{dictionary?.dashboard?.orders?.empty}</p>
            )}
            {orderList?.map((order, i) => (
                <OrderList key={order.id} row={i + 1} order={order} products={products} />
            ))}
        </div>
    );
};

export default Dashboard;
