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

export type ICategory = {
    name: string
    id: number
}

export type IDiscount = {
    percent: number
}

export type IOrder = {
    id: string;
    items: { product: number; qty: number }[];
    discount?: number;
};

export type IProfile = {
    username: string,
    email: string,
    first_name: string,
    last_name: string
}