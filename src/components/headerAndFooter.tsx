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
  const [openSidebar, setOpenSidebar] = useState(false)

  const toggleDrawer = (newOpen: boolean) => () => setOpenSidebar(newOpen)

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {['Home', 'All Products', 'Categories', 'Dashboard'].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton href={
              text=="Home"?"/"
              :text=="All Products"?"/store"
              :text=="Dashboard"?"/dashboard"
              :text=="Categories"?"/categories"
              :""
              }>
              {/* <ListItemIcon>
              </ListItemIcon> */}
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {
          Cookie.get("token") ?(
          <ListItem disablePadding>
          <ListItemButton>
            <LogoutButton />
          </ListItemButton>
        </ListItem>
          ):(
        <ListItem disablePadding>
          <ListItemButton href="/login">
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
          <div className="flex relative" onClick={()=>setOpenSidebar(!openSidebar)}>
            <Image alt="HamMenuIcon" src={HamMenuIcon} className="cursor-pointer"/>
            <Drawer open={openSidebar} onClose={toggleDrawer(false)}>{DrawerList}</Drawer>
          </div>
        </div>
        <div className="flex gap-8 items-center">
          <Link href={"/"}><Image alt="logo" src={logo} width={144} /></Link>
        </div>
        <div className="md:flex hidden gap-8 items-center text-(--Burgundy) font-bold">
          <Link href={"/store"}>All Products</Link>
          <Link href={"/dashboard"}>Dashboard</Link>
          <Link href={"/categories"}>Categories</Link>
        </div>
        <div className="flex gap-8 items-center">
          <Link href={"/bag"} className="flex relative">
            <Image alt="Bag" src={Bag} />{" "}
            <div className="flex items-end absolute -bottom-1 -right-2">
              <ProductQty />
            </div>
          </Link>
          <div className="md:block hidden">
            {Cookie.get("token") ? (
              <LogoutButton />
            ) : (
              <Link href={"/login"}><Image alt="Profile" src={Profile} /></Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export const DashboardHeader = () => {
  return (
    <div className="py-2 sm:px-8 px-4 shadow bg-amber-100/80 sticky top-12">
      <nav className="flex sm:justify-start sm:gap-8 justify-between">
        <Link href={"/dashboard"}>Dashboard</Link>
        <Link href={"/dashboard/add"}>Add Product</Link>
        <Link href={"/dashboard/edit"}>Edit Product</Link>
      </nav>
    </div>
  );
};

export const Footer = () => {
  return <footer className="shadow flex justify-between items-center gap-5 p-10">
    <p className="text-center text-xs text-(--Burgundy)">Developed By Kimia Khoshnood As A Test Project.</p>
    <Image alt="" src={logo}/>
  </footer>;
};
