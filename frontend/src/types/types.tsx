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
    id: number
    code: string
    percent: number
}

export type IOrder = {
    id?: string;
    items: { product: number; qty: number }[];
    discount?: number | null;
    discount_percent?: number | null;
    delivery_date?: string | null;
    created_at?: string;
};

export type IProfile = {
    username: string,
    email: string,
    first_name: string,
    last_name: string,
    is_staff?: boolean
}
