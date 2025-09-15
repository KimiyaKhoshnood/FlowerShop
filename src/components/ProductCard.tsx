import { IProductCardType } from "@/types/types";
import Link from "next/link";
import AddToCard from "./AddToCard";
import CardPrice from "./CardPrice";

const ProductCard = ({
  id,
  title,
  price,
  image,
  haveAddToCardSection,
  linkToUrl,
}: IProductCardType) => {
  return (
    <>
      <Link
        href={`${linkToUrl}/${id}`}
        className="border border-gray-200 rounded-md p-4 flex flex-col gap-2  items-center"
      >
        <div className="sm:w-40 w-full sm:h-40 h-52 flex justify-center bg-(--BabyPink)">
          <img alt="" src={image} width={160} height={160} />
        </div>
        <div className="w-full flex flex-col items-center text-(--Burgundy)">
          <span className="text-lg">{title}</span>
          <CardPrice price={price} justify="items-center" />
        </div>
        {haveAddToCardSection && <div className="flex items-center justify-between py-2">
          <AddToCard id={id} />
        </div>}
      </Link>
      {/* <Link href={`${linkToUrl}${id}`}>
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
    </Link> */}
    </>
  );
};

export default ProductCard;
