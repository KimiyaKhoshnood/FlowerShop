import { ProductCardType } from "@/app/store/page";
import Link from "next/link";
import AddToCard from "../AddToCard";
import CardPrice from "../CardPrice";

const ProductCard = ({ id, title, price, image, haveAddToCardSection, linkToUrl }: ProductCardType) => {
  return (
    <Link href={`${linkToUrl}${id}`}>
      <div className="border border-gray-300 p-4">

        <div className="h-40 flex justify-center">
          <img className="h-full" src={image} alt="" />
        </div>

        <div className="p-4">
          <h2 className="text-xl">{title}</h2>
          {haveAddToCardSection && <div className="flex items-center justify-between py-2">
            <AddToCard id={id} />
            <div className="text-end"><CardPrice price={price}/></div>
          </div>}
        </div>

      </div>
    </Link>
  );
};

export default ProductCard;
