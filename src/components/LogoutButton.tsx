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
    <div onClick={handleLogout} className="cursor-pointer">
      <Image className="md:block hidden" alt="Profile" src={Logout} width={33} height={33} />
      <div className="md:hidden block">Log Out</div>
    </div>
  )
}

export default LogoutButton