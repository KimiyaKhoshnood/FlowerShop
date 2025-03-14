"use client"
import Link from "next/link";
import { ProductQty } from "./AddToCard";
import LogoutButton from "./LogoutButton";
import Cookie from "js-cookie"

export const Header = () => {
  console.log(Cookie.get("token"));
  
  return (
    <header className="py-3 px-8 shadow bg-sky-100 sticky top-0">
      <nav className="flex gap-8">
        <Link href={"/store"}>Store</Link>
        <Link href={"/dashboard"}>Dashboard</Link>
        <Link href={"/bag"}>
          Shopping Bags <ProductQty />
        </Link>
        {Cookie.get("token") ? <LogoutButton/> : <Link href={"/login"}>Login</Link>}
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
