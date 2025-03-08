import { GetProductByID } from "@/data/GetData";
import { EachProduct } from "../page";
import AddRemove from "@/components/AddRemove";

type TPageProps = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{}>;
}

const page = async ({
  params,
}: TPageProps ) => {

  const resolvedParams = await params;
  const product : EachProduct = await GetProductByID(resolvedParams.id)
  
  return <div className="grid grid-cols-4">
    <div className="col-span-1">
        <img src={product.image} alt="" />
    </div>
    <div className="col-span-3 p-10">
        <h2 className="text-3xl py-2">{product.title}</h2>
        <p>{product?.description}</p>
        <span className="py-2 block text-xl">{product.price} $</span>
        <AddRemove/>
    </div>
  </div>;
};

export default page;
