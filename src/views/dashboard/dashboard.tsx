"use client";
import OrderList from "@/components/OrderList";
import { baseUrl, endpoints } from "@/constants/endpoints";
import axios from "axios";
import Cookie from "js-cookie";
import { useEffect, useState } from "react";

type orderType = {
    id: string;
    items: { product: number; qty: number }[];
    discount: number | null;
};

const Dashboard = () => {
    const [orderList, setOrderList] = useState<orderType[]>();

    useEffect(() => {
        const token = Cookie.get("accessToken");


        if (token) {
            axios
                .get(`${baseUrl}${endpoints.orders}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    setOrderList(res.data);
                })
                .catch((error) => {
                    console.error("Error fetching orders:", error.response?.data);
                });
        } else {
            console.log("No token found");
        }
    }, []);

    return (
        <div className="flex flex-col gap-0 sm:px-5">
            <h2 className="text-center p-5 text-4xl">Sales Dashboard</h2>
            <div className="grid grid-cols-5 items-center bg-neutral-50 rounded-t-lg text-center sm:text-xl py-1">
                <div className="py-2">Row</div>
                <div className="py-2">Discount</div>
                <div className="py-2">Total QTY</div>
                <div className="py-2">Total Price</div>
                <div className="py-2">Details</div>
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
