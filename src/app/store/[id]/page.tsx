import { GetProductByID } from "@/data/GetData";
import { EachProduct } from "../page";
import AddToCard from "@/components/AddToCard";
import CardPrice from "@/components/CardPrice";
import EachProductDetails from "@/components/EachProductDetails";

export type TPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{}>;
};

const page = async ({ params }: TPageProps) => {
  const resolvedParams = await params;
  const product: EachProduct = await GetProductByID(resolvedParams.id);

  return (
    <div className="py-10">
      <EachProductDetails id={ product.id} title={product.title} price={product.price} image={product.image} description={product.description}/>
      <div className="px-10 flex justify-center"><AddToCard id={resolvedParams.id} /></div>
    </div>
  );
};

export default page;
