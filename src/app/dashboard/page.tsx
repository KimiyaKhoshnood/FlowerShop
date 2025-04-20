"use client";
import { useEffect, useState } from "react";
import axios from "axios";
<<<<<<< Updated upstream
=======
import Cookie from "js-cookie";
>>>>>>> Stashed changes
import OrderList from "@/components/OrderList";

type orderType = {
  id: string;
  items: { id: string; qty: number }[];
  discount: number | null;
};

const Dashboard = () => {
  const [orderList, setOrderList] = useState<orderType[]>();

  useEffect(() => {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    axios(`https://json-server-vercel-flower-shop.vercel.app/orders/`).then(
      (res) => {
        setOrderList(res.data);
      }
    );
=======
    const token = Cookie.get("accessToken");
    
    if (token) {
      axios
        .get("http://127.0.0.1:8000/orders/", {
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
>>>>>>> Stashed changes
  }, []);
=======
    const token = Cookie.get("accessToken");
>>>>>>> Stashed changes
=======
    const token = Cookie.get("accessToken");
>>>>>>> Stashed changes

    if (token) {
      axios
        .get("http://127.0.0.1:8000/orders/", {
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
      <div className="grid grid-cols-5 items-center bg-amber-300 divide-x text-center sm:text-xl py-1">
        <div>Row</div>
        <div>Discount</div>
        <div>Total QTY</div>
        <div>Total Price</div>
        <div>Details</div>
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
