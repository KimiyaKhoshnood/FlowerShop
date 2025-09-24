import { baseUrl, endpoints } from "@/constants/endpoints";

export const GetAllProducts = async () => {
  const res = await fetch(`${baseUrl}${endpoints.products}/`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

export const GetAllCategories = async () => {
  const res = await fetch(`${baseUrl}${endpoints.categories}/`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};

export const GetProductByID = async (id: string) => {
  const productByID = (
    await fetch(`${baseUrl}${endpoints.products}/${id}/`)
  ).json();
  return productByID;
};
