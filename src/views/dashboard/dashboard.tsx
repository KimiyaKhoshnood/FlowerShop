"use client";
import OrderList from "@/components/OrderList";
import { useLanguage } from "@/providers/LanguageProvider";
import { GetOrdersService } from "@/services/services";
import { useEffect, useState } from "react";

type orderType = {
    id: string;
    items: { product: number; qty: number }[];
    discount: number | null;
};

const Dashboard = () => {
    const { dictionary } = useLanguage()
    const [orderList, setOrderList] = useState<orderType[]>();

    useEffect(() => {
        GetOrdersService(OrdersServiceCallback)
    }, []);

    const OrdersServiceCallback = (resultData: any, result: any) => {
        if (!result?.hasError) {
            setOrderList(resultData)
        } else {
            console.log(resultData)
        }
    }

    return (
        <div className="flex flex-col gap-0 sm:px-5">
            <h2 className="text-center p-5 text-4xl">{dictionary?.dashboard?.orders?.title}</h2>
            <div className="grid grid-cols-5 items-center bg-neutral-50 rounded-t-lg text-center sm:text-xl py-1">
                {dictionary?.dashboard?.orders?.headers?.map((header: string) => (
                    <div key={header} className="py-2">{header}</div>
                ))}
            </div>
            {orderList && orderList.map((elem, i) => {
                return (
                    <div key={elem.id}>
                        <OrderList
                            row={i + 1}
                            discount={elem.discount || 0}
                            shoppingItems={elem.items || []}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default Dashboard;
