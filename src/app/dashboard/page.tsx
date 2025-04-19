"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import OrderList from "@/components/OrderList";
import Cookie from "js-cookie";

type orderType = {
  id: string;
  shoppingItems: { id: string; qty: number }[];
  discount: number;
};

const Dashboard = () => {
  const [orderList, setOrderList] = useState<orderType[]>([]);

  useEffect(() => {
    const token = Cookie.get("accessToken");
    
    // if (token) {
    //   axios
    //     .get("http://127.0.0.1:8000/orders/", {
    //       headers: {
    //         Authorization: `Bearer ${token}`, 
    //       },
    //     })
    //     .then((res) => {
    //       setOrderList(res.data);
    //     })
    //     .catch((error) => {
    //       console.error("Error fetching orders:", error.response?.data);
    //     });
    // } else {
    //   console.log("No token found");
    // }
  }, []);
console.log(orderList);

  return (
    <div className="flex flex-col gap-0 sm:px-5">
      <h2 className="text-center p-5 text-4xl">Sales Dashboard</h2>
      <div className="grid grid-cols-5 items-center bg-amber-300 divide-x text-center sm:text-xl py-1">
        <div>Row</div>
        <div>Discount</div>
        <div>Total QTY</div>
        <div>Total Price</div>
        <div>Details</div>
      </div>
      {orderList.map((elem, i) => {
        return (
          <div key={elem.id}>
            <OrderList
              row={i + 1}
              discount={elem.discount}
              shoppingItems={elem.shoppingItems}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Dashboard;
