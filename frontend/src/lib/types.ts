export type Lang = "en" | "fa";

export type Paginated<T> = {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
};

export type Category = {
    id: number;
    slug: string;
    name: string;
    name_fa: string;
    description: string;
    description_fa: string;
    product_count?: number;
    image?: string | null;
};

export type Product = {
    id: number;
    slug: string;
    title: string;
    title_fa: string;
    description: string;
    description_fa: string;
    category: string | null;
    category_name: string | null;
    category_name_fa: string | null;
    image: string;
    price: string;
    compare_at_price: string | null;
    on_sale: boolean;
    stock: number;
    in_stock: boolean;
    is_active: boolean;
    is_featured: boolean;
    color: string;
    color_fa: string;
    stems_per_bunch: number;
    vase_life_days: number;
    stem_length_cm: number | null;
    head_size_cm: number | null;
    season_months: number[];
    rating: number | null;
    review_count: number;
    created_at: string;
    updated_at: string;
};

export type ProductInput = Omit<Product,
    "id" | "category_name" | "category_name_fa" | "on_sale" | "in_stock" | "rating" | "review_count" | "created_at" | "updated_at">;

export type Review = {
    id: number;
    author: string;
    rating: number;
    comment: string;
    created_at: string;
};

export type Discount = {
    id: number;
    code: string;
    percent: number;
    is_active: boolean;
    valid_until: string | null;
    min_order_amount: string;
    max_uses: number | null;
    used_count: number;
};

export type CartItem = { product: number; qty: number };

export type QuoteLine = {
    product: number;
    slug: string;
    title: string;
    title_fa: string;
    image: string;
    unit_price: string;
    qty: number;
    stock: number;
    line_total: string;
};

export type Quote = {
    lines: QuoteLine[];
    discount_code: string | null;
    discount_percent: number;
    subtotal: string;
    discount_amount: string;
    shipping_fee: string;
    total: string;
    problems: string[];
};

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";
export type PaymentMethod = "card" | "paypal" | "snapppay";

export type OrderItem = {
    id: number;
    product: number | null;
    product_slug: string | null;
    product_title: string;
    product_image: string;
    unit_price: string;
    qty: number;
    line_total: string;
};

export type Order = {
    id: string;
    number: string;
    status: OrderStatus;
    payment_method: PaymentMethod;
    discount_code: string | null;
    discount_percent: number;
    subtotal: string;
    discount_amount: string;
    shipping_fee: string;
    total: string;
    recipient_name: string;
    phone: string;
    city: string;
    address: string;
    postal_code: string;
    note: string;
    delivery_date: string | null;
    created_at: string;
    updated_at: string;
    items: OrderItem[];
    can_cancel: boolean;
    customer?: { username: string; email: string; name: string };
};

export type CheckoutInput = {
    items: CartItem[];
    discount_code?: string;
    payment_method: PaymentMethod;
    recipient_name: string;
    phone: string;
    city: string;
    address: string;
    postal_code?: string;
    note?: string;
    delivery_date: string;
};

export type Profile = {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
    date_joined: string;
};

export type Stats = {
    revenue: string;
    orders: number;
    average_order: string;
    customers: number;
    orders_by_status: Partial<Record<OrderStatus, number>>;
    sales_by_day: { date: string; revenue: string; orders: number }[];
    top_products: { title: string; sold: number; revenue: string }[];
    low_stock: { id: number; slug: string; title: string; stock: number }[];
};

export type ProductQuery = {
    q?: string;
    category?: string;
    min_price?: string;
    max_price?: string;
    in_stock?: string;
    on_sale?: string;
    featured?: string;
    sort?: string;
    page?: string;
    page_size?: string;
    ids?: string;
    all?: string;
};
