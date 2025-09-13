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
import { useState } from "react";
import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { usePathname } from "next/navigation";
import { Links } from "@/constants/links";

export const Header = () => {
  const pathname = usePathname()

  const [openSidebar, setOpenSidebar] = useState(false)

  const toggleDrawer = (newOpen: boolean) => () => setOpenSidebar(newOpen)

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {['Home', 'All Products', 'Categories', 'Dashboard'].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton href={
              text == "Home" ? Links.home
                : text == "All Products" ? Links.store
                  : text == "Dashboard" ? Links.dashboard.base
                    : text == "Categories" ? Links.categories
                      : ""
            }>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {
          Cookie.get("accessToken") ? (
            <ListItem disablePadding>
              <ListItemButton>
                <LogoutButton />
              </ListItemButton>
            </ListItem>
          ) : (
            <ListItem disablePadding>
              <ListItemButton href={Links.login}>
                {/* <ListItemIcon>
            </ListItemIcon> */}
                <ListItemText primary={"Login"} />
              </ListItemButton>
            </ListItem>
          )}
      </List>
    </Box>
  )


  return (
    <header className="py-3 md:px-8 px-4 shadow bg-(--background) sticky top-0 z-10">
      <nav className="flex justify-between">
        <div className="md:hidden block">
          <div className="flex relative" onClick={() => setOpenSidebar(!openSidebar)}>
            <Image alt="HamMenuIcon" src={HamMenuIcon} className="cursor-pointer" />
            <Drawer open={openSidebar} onClose={toggleDrawer(false)}>{DrawerList}</Drawer>
          </div>
        </div>
        <div className="flex gap-8 items-center">
          <Link href={Links.home}><Image alt="logo" src={logo} width={144} /></Link>
        </div>
        <div className="md:flex hidden gap-8 items-center text-(--Burgundy) font-bold">
          <Link className={pathname == Links.home ? "border-b-2" : ""} href={Links.home}>Home</Link>
          <Link className={pathname == Links.store ? "border-b-2" : ""} href={Links.store}>Products</Link>
          <Link className={pathname == Links.categories ? "border-b-2" : ""} href={Links.categories}>Categories</Link>
          <Link className={pathname == Links.dashboard.base ? "border-b-2" : ""} href={Links.dashboard.base}>Dashboard</Link>
        </div>
        <div className="flex gap-5 items-center">
          <Link href={Links.bag} className="flex relative">
            <Image alt="Bag" src={Bag} />{" "}
            <div className="flex items-end absolute -bottom-1 -right-2">
              <ProductQty />
            </div>
          </Link>
          {Cookie.get("accessToken") ? (
            <Link href={Links.dashboard.base} className="md:block hidden"><Image alt="Profile" src={Profile} width={33} height={33} /></Link>
          ) : (
            <Link href={Links.login} className="md:block hidden"><Image alt="Profile" src={Profile} width={33} height={33} /></Link>
          )}
          {Cookie.get("accessToken") ? (
            <div className="md:block hidden h-fit"><LogoutButton /></div>
          ) : (
            <></>
          )}
        </div>
      </nav>
    </header>
  );
};

export const DashboardHeader = () => {
  const pathname = usePathname()

  return (
    <div className="py-2 sm:px-8 px-4 shadow bg-amber-100/80 sticky top-12">
      <nav className="flex sm:justify-start sm:gap-8 justify-between">
        <Link
          className={pathname == Links.dashboard.base ? "border-b-2 border-b-amber-600" : ""}
          href={Links.dashboard.base}>
          Dashboard
        </Link>
        <Link
          className={pathname == Links.dashboard.profile ? "border-b-2 border-b-amber-600" : ""}
          href={Links.dashboard.profile}>
          Profile
        </Link>
        <Link
          className={pathname == Links.dashboard.product ? "border-b-2 border-b-amber-600" : ""}
          href={Links.dashboard.product}>
          Products
        </Link>
        <Link
          className={pathname == Links.dashboard.addProduct ? "border-b-2 border-b-amber-600" : ""}
          href={Links.dashboard.addProduct}>
          Add Product
        </Link>
        <Link
          className={pathname == Links.dashboard.category ? "border-b-2 border-b-amber-600" : ""}
          href={Links.dashboard.category}>
          Categories
        </Link>
      </nav>
    </div>
  );
};

export const Footer = () => {
  return <footer className="shadow flex justify-between items-center gap-5 p-10">
    <p className="text-center text-xs text-(--Burgundy)">Developed By Kimia Khoshnood As A Test Project.</p>
    <Image alt="" src={logo} />
  </footer>;
};
