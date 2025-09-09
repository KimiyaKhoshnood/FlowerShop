import { IEachProduct } from "@/types/types";
import { GetProductByID } from "@/data/GetData";
import ProductView from "@/views/productView/productView";

type TPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<object>;
};

const page = async ({ params }: TPageProps) => {
  const resolvedParams = await params;
  const product: IEachProduct = await GetProductByID(resolvedParams.id);

  return (<ProductView product={product} resolvedParams={resolvedParams} />);
};

export default page;
