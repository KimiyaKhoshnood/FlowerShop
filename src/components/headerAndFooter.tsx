"use client";
import Link from "next/link";
import { ProductQty } from "./AddToCard";
import LogoutButton from "./LogoutButton";
import Cookie from "js-cookie";
import logo from "../../public/Logo.svg";
import Profile from "../../public/Profile.svg";
import Bag from "../../public/Bag.svg";
import HamMenuIcon from "../../public/HamMenuIcon.svg";
import Image from "next/image";

// export const Header = () => {
//   return (
//     <header className="py-3 px-8 shadow bg-sky-100 sticky top-0">
//       <nav className="flex gap-8">
//         <Link href={"/store"}>Store</Link>
//         <Link href={"/bag"} className="flex">
//           Shopping Bags <ProductQty />
//         </Link>
//         <Link href={"/dashboard"}>Dashboard</Link>
//         {Cookie.get("token") ? (
//           <LogoutButton />
//         ) : (
//           <Link href={"/login"}>Login</Link>
//         )}
//       </nav>
//     </header>
//   );
// };

export const Header = () => {
  return (
    <header className="py-3 md:px-8 px-4 shadow bg-(--background) sticky top-0 z-10">
      <nav className="flex justify-between">
        <div className="md:hidden block">
          <div className="flex relative">
            <Image alt="HamMenuIcon" src={HamMenuIcon} />
          </div>
        </div>
        <div className="flex gap-8 items-center">
          <Link href={"/"}><Image alt="logo" src={logo} width={144} /></Link>
        </div>
        <div className="md:flex hidden gap-8 items-center text-(--Burgundy) font-bold">
          <Link href={"/store"}>All Products</Link>
          <Link href={"/dashboard"}>Dashboard</Link>
        </div>
        <div className="flex gap-8 items-center">
          <Link href={"/bag"} className="flex relative">
            <Image alt="Bag" src={Bag} />{" "}
            <div className="flex items-end absolute -bottom-1 -right-2">
              <ProductQty />
            </div>
          </Link>
          <Link href={"/login"} className="md:block hidden">
            {Cookie.get("token") ? (
              <LogoutButton />
            ) : (
              <Image alt="Profile" src={Profile} />
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
};

export const DashboardHeader = () => {
  return (
    <div className="py-2 px-8 shadow bg-amber-100/80 sticky top-12">
      <nav className="flex gap-8">
        <Link href={"/dashboard"}>Dashboard</Link>
        <Link href={"/dashboard/add"}>Add Product</Link>
        <Link href={"/dashboard/edit"}>Edit Product</Link>
      </nav>
    </div>
  );
};

export const Footer = () => {
  return <footer className="p-3 shadow bg-sky-100">footer</footer>;
};
