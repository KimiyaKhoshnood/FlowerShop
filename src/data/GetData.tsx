export const GetAllProducts = async () => {
  const allProducts = (await fetch("http://127.0.0.1:8000/products/")).json();
  return allProducts;
};

export const GetRequestedProducts = async (url: string) => {
  const requestedProducts = (await fetch(url)).json();
  return requestedProducts;
};

export const GetProductByID = async (id: string) => {
  const productByID = (
    await fetch(`http://127.0.0.1:8000/products/${id}/`)
  ).json();
  return productByID;
};
