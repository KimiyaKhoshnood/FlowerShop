"use client"
import Logout from "../../public/Logout.svg";
import Image from "next/image";
import { Links } from "@/constants/links";
import { useLanguage } from "@/providers/LanguageProvider";
import { clearTokens } from "@/utils/utils";

const LogoutButton = () => {
  const { lang, dictionary } = useLanguage()

  const handleLogout = () => {
    clearTokens()
    // Full reload so every client component forgets the old session.
    window.location.assign(Links.home(lang))
  }

  return (
    <button type="button" onClick={handleLogout} className="cursor-pointer" aria-label={dictionary?.header?.logout}>
      <Image className="md:block hidden" alt="" src={Logout} width={33} height={33} />
      <span className="md:hidden block">{dictionary?.header?.logout}</span>
    </button>
  )
}

export default LogoutButton
