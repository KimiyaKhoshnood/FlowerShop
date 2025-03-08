import Link from "next/link"

export const Header = () => {
    return <header className="py-3 px-8 shadow bg-sky-100 sticky top-0">
        <nav className="flex gap-8">
            <Link href={"/store"}>Store</Link>
            <Link href={"/bag"}>Shopping Bag</Link>
        </nav>
    </header>
}

export const TotalPrice = ({price}:{price:number}) => {
    return <div className="py-3 px-8 shadow bg-amber-100/80 sticky top-12">
        Price: {price} $
    </div>
}

export const Footer = () => {
    return <footer className="p-3 shadow bg-sky-100">
        footer
    </footer>
}