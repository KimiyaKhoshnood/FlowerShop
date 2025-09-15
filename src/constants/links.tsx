export const Links = {
    home: (lang: string) => `/${lang}/`,
    store: (lang: string) => `/${lang}/store`,
    categories: (lang: string) => `/${lang}/categories`,
    login: (lang: string) => `/${lang}/login`,
    register: (lang: string) => `/${lang}/register`,
    bag: (lang: string) => `/${lang}/bag`,
    dashboard: {
        base: (lang: string) => `/${lang}/dashboard`,
        profile: (lang: string) => `/${lang}/dashboard/profile`,
        product: (lang: string) => `/${lang}/dashboard/product`,
        addProduct: (lang: string) => `/${lang}/dashboard/addProduct`,
        category: (lang: string) => `/${lang}/dashboard/category`,
        discounts: (lang: string) => `/${lang}/dashboard/discounts`,
    },
}