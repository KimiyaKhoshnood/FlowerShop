export type IEachProduct = {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  description?: string;
};

export type IProductCardType = IEachProduct & {
  haveAddToCardSection: boolean;
  linkToUrl: string;
};