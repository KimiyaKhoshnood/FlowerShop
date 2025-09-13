"use client"
import Cookie from "js-cookie"
import Logout from "../../public/Logout.svg";
import Image from "next/image";

const LogoutButton = () => {

  const handleLogout = () => {
    Cookie.remove("accessToken")
    window.location.reload()
  }

  return (
    <div onClick={handleLogout} className="cursor-pointer"><Image alt="Profile" src={Logout} width={33} height={33} /></div>
  )
}

export default LogoutButton