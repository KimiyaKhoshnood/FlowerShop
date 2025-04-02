import { GetProductByID } from "@/data/GetData";
import { EachProduct } from "../page";
import AddToCard from "@/components/AddToCard";
import CardPrice from "@/components/CardPrice";
import EachProductDetails from "@/components/EachProductDetails";
import HotDeals from "@/components/sections/HotDeals";
import SimilarProducts from "@/components/sections/SimilarProducts";

export type TPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<object>;
};

const page = async ({ params }: TPageProps) => {
  const resolvedParams = await params;
  const product: EachProduct = await GetProductByID(resolvedParams.id);

  return (
    <>
      <div className="lg:bg-(--Burgundy)/10">
        <div className="lg:px-20 lg:pb-10 lg:pt-20">
          <EachProductDetails
            category={product.id}
            id={product.id}
            title={product.title}
            price={product.price}
            image={product.image}
            description={product.description}
          />
        </div>
      </div>
      <div className="lg:px-20 px-10 lg:py-14 py-7 flex lg:flex-row flex-col gap-5 lg:justify-between justify-center">
        <div className="text-(--Burgundy) lg:block hidden">
          <h2 className="font-bold text-3xl">{product.title}</h2>
          <p className="text-xl text-wrap">{product.description}</p>
        </div>
        <div className="flex flex-col gap-6 lg:items-end items-center">
          <div className="flex items-end lg:gap-10 gap-5">
            <CardPrice
              price={product.price}
              className="text-(--Burgundy) text-3xl"
              justify="items-center"
            />
            <span className="text-(--Burgundy) text-nowrap">per flower</span>
          </div>
          <AddToCard id={resolvedParams.id} />
        </div>
      </div>
      <div className="text-gray-300 lg:px-20 px-10">
        <hr />
      </div>
      <SimilarProducts />
      <HotDeals />
    </>
  );
};

export default page;
