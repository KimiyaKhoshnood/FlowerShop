import { GetAllProducts } from "@/data/GetData";
import { IEachProduct } from "@/types/types";
import DashboardProducts from "@/views/dashboard/product/product";


const EditProduct = async ({ params }: { params: Promise<{ lang: string }> }) => {
  const resolvedParams = await params
  const allProducts: IEachProduct[] = await GetAllProducts();
  return <DashboardProducts allProducts={allProducts} />;
};

export default EditProduct;
