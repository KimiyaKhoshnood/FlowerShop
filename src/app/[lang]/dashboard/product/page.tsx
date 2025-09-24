import { GetAllProducts } from "@/services/GetServerSideData";
import { IEachProduct } from "@/types/types";
import DashboardProducts from "@/views/dashboard/product/product";

const EditProduct = async () => {
  const allProducts: IEachProduct[] = await GetAllProducts();
  return <DashboardProducts allProducts={allProducts} />;
};

export default EditProduct;
