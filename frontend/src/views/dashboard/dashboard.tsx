"use client";
import OrderList from "@/components/OrderList";
import { useLanguage } from "@/providers/LanguageProvider";
import { IWebServiceResult } from "@/services/BaseService";
import { GetOrdersService } from "@/services/services";
import { IOrder } from "@/types/types";
import { useEffect, useState } from "react";

const Dashboard = () => {
    const { dictionary } = useLanguage()
    const [orderList, setOrderList] = useState<IOrder[]>();

    useEffect(() => {
        GetOrdersService(OrdersServiceCallback)
    }, []);

    const OrdersServiceCallback = (resultData: IOrder[], result: IWebServiceResult) => {
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
