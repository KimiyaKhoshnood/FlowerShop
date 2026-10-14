"use client"
import Link from "next/link"

type ButtonUIProps = {
  text: string
  className?: string
  /** When set, renders a link styled as a button instead of a <button>. */
  url?: string
  onClick?: () => void
  type?: "button" | "submit"
  disabled?: boolean
}

const ButtonUI = ({ text, className, url, onClick, type = "button", disabled }: ButtonUIProps) => {
  const classes = `${className ?? ""} inline-block text-center py-2 px-4 rounded-3xl cursor-pointer transition hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed`
  const label = text?.toUpperCase()

  return url
    ? <Link className={classes} href={url}>{label}</Link>
    : <button type={type} onClick={onClick} disabled={disabled} className={classes}>{label}</button>
}

export default ButtonUI
