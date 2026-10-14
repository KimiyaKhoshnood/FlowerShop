"use client";
import Link from "next/link";
import { ProductQty } from "./AddToCard";
import LogoutButton from "./LogoutButton";
import logo from "../../public/Logo.svg";
import Profile from "../../public/Profile.svg";
import Bag from "../../public/Bag.svg";
import HamMenuIcon from "../../public/HamMenuIcon.svg";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { usePathname } from "next/navigation";
import { Links } from "@/constants/links";
import { useLanguage } from "@/providers/LanguageProvider";
import { GetProfileService } from "@/services/services";
import { getAccessToken, switchLanguagePath } from "@/utils/utils";

/** Read the auth cookie after mount so server and client render the same markup. */
const useIsLoggedIn = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsLoggedIn(Boolean(getAccessToken()))
  }, [pathname])

  return isLoggedIn
}

export const Header = () => {
  const { lang, dictionary } = useLanguage()
  const pathname = usePathname()
  const isLoggedIn = useIsLoggedIn()

  const [openSidebar, setOpenSidebar] = useState(false)

  const toggleDrawer = (newOpen: boolean) => () => setOpenSidebar(newOpen)

  const navLinks = [
    { href: Links.home(lang), label: dictionary?.header?.home },
    { href: Links.store(lang), label: dictionary?.header?.products },
    { href: Links.categories(lang), label: dictionary?.header?.categories },
  ]

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {[...navLinks, { href: Links.dashboard.base(lang), label: dictionary?.header?.dashboard }].map((link) => (
          <ListItem key={link.href} disablePadding>
            <ListItemButton component={Link} href={link.href}>
              <ListItemText primary={link.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} href={switchLanguagePath(pathname, lang)}>
            <ListItemText primary={dictionary?.header?.switchLanguage} />
          </ListItemButton>
        </ListItem>
        {isLoggedIn ? (
          <ListItem disablePadding>
            <ListItemButton>
              <div className="w-full"><LogoutButton /></div>
            </ListItemButton>
          </ListItem>
        ) : (
          <ListItem disablePadding>
            <ListItemButton component={Link} href={Links.login(lang)}>
              <ListItemText primary={dictionary?.header?.login} />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  )

  return (
    <header className="py-3 md:px-8 px-4 shadow bg-(--background) sticky top-0 z-10">
      <nav className="flex justify-between">
        <div className="md:hidden flex items-center">
          <button type="button" aria-label="Menu" className="flex cursor-pointer" onClick={() => setOpenSidebar(!openSidebar)}>
            <Image alt="" src={HamMenuIcon} />
          </button>
          <Drawer anchor={lang == 'fa' ? 'right' : 'left'} open={openSidebar} onClose={toggleDrawer(false)}>{DrawerList}</Drawer>
        </div>
        <div className="flex gap-8 items-center">
          <Link href={Links.home(lang)}><Image alt="Flower Shop" src={logo} width={144} priority /></Link>
        </div>
        <div className="md:flex hidden gap-8 items-center text-(--Burgundy) font-bold">
          {navLinks.map((link) => (
            <Link key={link.href} className={pathname == link.href ? "border-b-2" : ""} href={link.href}>{link.label}</Link>
          ))}
        </div>
        <div className="flex gap-5 items-center">
          <Link
            href={switchLanguagePath(pathname, lang)}
            className="text-(--Burgundy) px-1.5 py-1.5 hover:bg-neutral-100 rounded-md cursor-pointer md:block hidden">
            {dictionary?.header?.switchLanguage}
          </Link>
          <Link href={Links.bag(lang)} className="flex relative" aria-label="Bag">
            <Image alt="" src={Bag} />
            <div className="flex items-end absolute -bottom-1 -right-2">
              <ProductQty />
            </div>
          </Link>
          <Link href={isLoggedIn ? Links.dashboard.base(lang) : Links.login(lang)} className="md:block hidden" aria-label={dictionary?.header?.dashboard}>
            <Image alt="" src={Profile} width={33} height={33} />
          </Link>
          {isLoggedIn && <div className="md:block hidden h-fit"><LogoutButton /></div>}
        </div>
      </nav>
    </header>
  );
};

export const DashboardHeader = () => {
  const { lang, dictionary } = useLanguage()
  const pathname = usePathname()
  const [isStaff, setIsStaff] = useState(false)

  useEffect(() => {
    GetProfileService((profile, result) => setIsStaff(!result.hasError && Boolean(profile.is_staff)))
  }, [])

  const links = [
    { href: Links.dashboard.base(lang), label: dictionary?.dashboard?.header?.orders },
    { href: Links.dashboard.profile(lang), label: dictionary?.dashboard?.header?.profile },
    // Managing the catalogue is only allowed for staff users by the API.
    ...(isStaff ? [
      { href: Links.dashboard.product(lang), label: dictionary?.dashboard?.header?.products },
      { href: Links.dashboard.category(lang), label: dictionary?.dashboard?.header?.categories },
    ] : []),
  ]

  return (
    <div className="py-2 sm:px-8 px-4 shadow bg-amber-100/80 sticky top-12">
      <nav className="flex sm:justify-start sm:gap-8 justify-between">
        {links.map((link) => (
          <Link
            key={link.href}
            className={pathname == link.href ? "border-b-2 border-b-amber-600" : ""}
            href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export const Footer = () => {
  const { dictionary } = useLanguage()

  return <footer className="shadow flex justify-between items-center gap-5 p-10">
    <p className="text-center text-xs text-(--Burgundy)">{dictionary?.footer}</p>
    <Image alt="" src={logo} />
  </footer>;
};
