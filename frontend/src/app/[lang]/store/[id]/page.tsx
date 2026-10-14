import { GetProductByID } from "@/services/GetServerSideData";
import { IEachProduct } from "@/types/types";
import ProductView from "@/views/productView/productView";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type TPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<object>;
};

export async function generateMetadata({ params }: TPageProps): Promise<Metadata> {
  const product: IEachProduct | null = await GetProductByID((await params).id);
  return { title: product?.title, description: product?.description };
}

const page = async ({ params }: TPageProps) => {
  const resolvedParams = await params;
  const product: IEachProduct | null = await GetProductByID(resolvedParams.id);
  if (!product) notFound();

  return (<ProductView product={product} resolvedParams={resolvedParams} />);
};

export default page;
