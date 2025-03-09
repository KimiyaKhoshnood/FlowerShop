"use client"
import AddRemove from "@/components/AddToCard";
import ShoppingBagCard from "@/components/ShoppingBagCard";
import { useShoppingItemsContext } from "@/context/context";
import { GetProductByID } from "@/data/GetData";
import axios from "axios";
import React, { useEffect, useState } from "react";

const ShoppingBag = () => {
  const products = [
    {
      id: "1",
      title: "Product 1",
      price: 10.99,
      image:
        "https://www.imageskincare.de/media/amasty/webp/catalog/product/cache/1e1e9baf02c2daa40c835fad34d48eeb/2/5/25_3_png.webp",
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquam atque possimus repellendus recusandae, quam similique, dolorem ducimus, ipsum blanditiis explicabo necessitatibus quibusdam cumque obcaecati quo sunt.",
    },
    {
      id: "2",
      title: "Product 2",
      price: 10,
      image:
        "https://www.imageskincare.de/media/amasty/webp/catalog/product/cache/1e1e9baf02c2daa40c835fad34d48eeb/3/3/33_3_png.webp",
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquam atque possimus repellendus recusandae, quam similique, dolorem ducimus, ipsum blanditiis explicabo necessitatibus quibusdam cumque obcaecati quo sunt.",
    },
    {
      id: "3",
      title: "Product 3",
      price: 19,
      image:
        "https://www.imageskincare.de/media/amasty/webp/catalog/product/cache/1e1e9baf02c2daa40c835fad34d48eeb/2/5/25_3_png.webp",
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquam atque possimus repellendus recusandae, quam similique, dolorem ducimus, ipsum blanditiis explicabo necessitatibus quibusdam cumque obcaecati quo sunt.",
    },
    {
      id: "4",
      title: "Product 4",
      price: 9,
      image:
        "https://www.imageskincare.de/media/amasty/webp/catalog/product/cache/1e1e9baf02c2daa40c835fad34d48eeb/3/3/33_3_png.webp",
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquam atque possimus repellendus recusandae, quam similique, dolorem ducimus, ipsum blanditiis explicabo necessitatibus quibusdam cumque obcaecati quo sunt.",
    },
  ];

  const { shoppingItems } = useShoppingItemsContext();

  return (
    <div>
      {shoppingItems?.map((each) => {
        return (
          <ShoppingBagCard key={each.id} id={each.id}/>
        );
      })}
    </div>
  );
};

export default ShoppingBag;
