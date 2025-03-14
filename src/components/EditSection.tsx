"use client"
import { useEffect, useState } from "react";
import axios from "axios";

const EditSection = () => {

    const [productDetails, setProductDetails] = useState()

    const id = 1

    useEffect(() => {
        axios(`http://localhost:3004/products/${id}`).then((res) => {
          setProductDetails(res.data);
        });
      }, []);

      const handleEdit = ((input:string) => {
        axios.patch(`http://localhost:3004/products/${id}`, {
          title: input
        })
        .then(() => console.log("Done"))
      })
      

  return (
    <>
      <div>
        <h2 className="text-center p-5 text-4xl">
          What do you want to change?
        </h2>
        <div className="flex justify-center gap-5 p-2">
          {productDetails && Object.keys(productDetails).filter(item => item !== "id").map((elem, i) => {
            return (
              <div
                key={i}
                className="bg-sky-200 px-10 py-7 rounded-xl cursor-pointer hover:bg-sky-900 hover:text-white hover:rotate-3 transition-colors duration-300 ease-linear"
              >
                {elem}
              </div>
            );
          })}
        </div>
        <div className="flex justify-center py-2">
          <input
            type="text"
            placeholder="Write Here"
            className="border border-gray-300 px-5 py-2"
          />
          <button onClick={()=>handleEdit("Product 1")} type="submit" className="bg-blue-500 p-2">
            Change
          </button>
        </div>
      </div>
    </>
  );
};

export default EditSection;
