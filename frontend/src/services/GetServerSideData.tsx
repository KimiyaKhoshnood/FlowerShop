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

/** Returns null when the product does not exist, so the page can show a 404. */
export const GetProductByID = async (id: string) => {
  const res = await fetch(`${baseUrl}${endpoints.products}/${encodeURIComponent(id)}/`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
};
