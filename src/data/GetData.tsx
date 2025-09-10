import { baseUrl, endpoints } from "@/constants/endpoints";

export const GetAllProducts = async () => {
  const allProducts = (await fetch(`${baseUrl}${endpoints.products}/`)).json();
  return allProducts;
};

export const GetAllCategories = async () => {
  const allCategories = (await fetch(`${baseUrl}${endpoints.categories}/`)).json();
  return allCategories;
};

export const GetRequestedProducts = async (url: string) => {
  const requestedProducts = (await fetch(url)).json();
  return requestedProducts;
};

export const GetProductByID = async (id: string) => {
  const productByID = (
    await fetch(`${baseUrl}${endpoints.products}/${id}/`)
  ).json();
  return productByID;
};
