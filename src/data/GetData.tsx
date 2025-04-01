export const GetAllProducts = async () => {
  const allProducts = (
    await fetch("https://json-server-vercel-flower-shop.vercel.app/products")
  ).json();
  return allProducts;
};

export const GetRequestedProducts = async (url: string) => {
  const requestedProducts = (await fetch(url)).json();
  return requestedProducts;
};

export const GetProductByID = async (id: string) => {
  const productByID = (
    await fetch(
      `https://json-server-vercel-flower-shop.vercel.app/products/${id}`
    )
  ).json();
  return productByID;
};
