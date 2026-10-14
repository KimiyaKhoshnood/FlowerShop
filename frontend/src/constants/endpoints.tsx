export const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

export const endpoints = {
    categories: "/api/categories",
    discounts: "/api/discounts",
    discountCode: "/api/discounts/?code={0}",
    orders: "/api/orders",
    products: "/api/products",
    productItem: "/api/products/{0}",
    ProductsByCategory: "/api/products/?category={0}",
    profile: "/api/profile",
    token: "/api/token",
    refreshToken: "/api/token/refresh",
    register: "/register",
}
