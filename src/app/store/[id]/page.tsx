import { GetProductByID } from "@/data/GetData";
import { EachProduct } from "../page";
import AddToCard from "@/components/AddToCard";
import CardPrice from "@/components/CardPrice";
import EachProductDetails from "@/components/EachProductDetails";
import HotDeals from "@/components/sections/HotDeals";
import HotProducts from "@/components/sections/HotProducts";

export type TPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{}>;
};

const page = async ({ params }: TPageProps) => {
  const resolvedParams = await params;
  const product: EachProduct = await GetProductByID(resolvedParams.id);

  return (
    <>
      <div className="bg-(--Burgundy)/10">
        <div className="lg:px-20 p-10">
          <EachProductDetails
            id={product.id}
            title={product.title}
            price={product.price}
            image={product.image}
            description={product.description}
          />
        </div>
      </div>
      <div className="lg:px-20 px-10 py-10 flex justify-between">
        <div className="text-(--Burgundy)">
          <h2 className="font-bold text-3xl">{product.title}</h2>
          <p className="text-xl">{product.description}</p>
        </div>
        <div className="flex flex-col gap-3 items-end">
          <div className="flex items-end gap-3">
            <CardPrice price={product.price} className="text-(--Burgundy) text-3xl" />
            <span className="text-(--Burgundy)">per flower</span>
          </div>
          <AddToCard id={resolvedParams.id} />
        </div>
      </div>
      <div className="text-gray-500 px-20 p-10"><hr /></div>
      <HotProducts/>
      <HotDeals/>
    </>
  );
};

export default page;
