"use client"
import Cookie from "js-cookie"

const LogoutButton = () => {

    const handleLogout = () => {
        Cookie.remove("accessToken")
    }

  return (
    <button onClick={handleLogout}>Log Out</button>
  )
}

export default LogoutButton