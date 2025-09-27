"use client"
import Link from "next/link"

const ButtonUI = ({ text, className, url }: { text: string, className?: string, url?: string }) => {
  return (
    url ? <Link className="rounded-3xl cursor-pointer" href={url || ""}>
      <button className={`${className} py-2 px-4 rounded-3xl cursor-pointer`}>
        {text.toUpperCase()}
      </button >
    </Link> : <button className={`${className} py-2 px-4 rounded-3xl cursor-pointer`}>
      {text.toUpperCase()}
    </button >
  )
}

export default ButtonUI