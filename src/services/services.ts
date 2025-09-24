import { stringFormat } from "@/utils/utils";
import { DeleteRequest, GetRequest, PatchRequest, PostRequest } from "./BaseService";
import { endpoints } from "@/constants/endpoints";

// export const GetRegisterEmailService = (callback: any) => {
//     GetRequest(endpoints.register, callback);
// };

// export const PostRegisterEmailService = (data: any, callback: any) => {
//     PostRequest(endpoints.register, data, callback, false);
// };

// export const PostVerifyEmailService = (data: any, publicId: string, callback: any) => {
//     PostRequest(stringFormat(endpoints.register, publicId), data, callback, false);
// };

// export const PostRegisterPasswordService = (data: any, callback: any) => {
//     PostRequest(endpoints.register, data, callback, false);
// };

export const PostTokenService = (data: any, callback: any) => {
    PostRequest((endpoints.token + "/"), data, callback, false);
};

export const PostRegisterService = (data: any, callback: any) => {
    PostRequest((endpoints.register + "/"), data, callback, false);
};

export const GetProductsService = (callback: any) => {
    GetRequest(endpoints.products + "/", callback);
};

export const GetProductService = (id: string, callback: any) => {
    GetRequest(endpoints.products + `/${id}/`, callback);
};

export const PostProductService = (data: any, callback: any) => {
    PostRequest(endpoints.products + "/", data, callback);
};

export const DeleteProductsService = (id: string, callback: any) => {
    DeleteRequest(endpoints.products + `/${id}/`, callback);
};

export const PatchProductsService = (data: any, id: string, callback: any) => {
    PatchRequest(endpoints.products + `/${id}/`, data, callback);
};

export const GetProductItemService = (productId: string, callback: any) => {
    GetRequest(stringFormat(endpoints.productItem, productId) + "/", callback);
};

export const GetProductsByCategoryService = (category: string, callback: any) => {
    GetRequest(stringFormat(endpoints.ProductsByCategory, category), callback);
};

export const GetCategoriesService = (callback: any) => {
    GetRequest(endpoints.categories + "/", callback);
};

export const PostCategoriesService = (data: any, callback: any) => {
    PostRequest(endpoints.categories + "/", data, callback);
};

export const GetOrdersService = (callback: any) => {
    GetRequest(endpoints.orders + "/", callback);
};

export const PostOrdersService = (data: any, callback: any) => {
    PostRequest(endpoints.orders + "/", data, callback);
};

export const GetDiscountsService = (callback: any) => {
    GetRequest(endpoints.discounts + "/", callback);
};

export const GetDiscountCodeService = (discountCode: string, callback: any) => {
    GetRequest(stringFormat(endpoints.discountCode, discountCode) + "/", callback);
};

export const GetProfileService = (callback: any) => {
    GetRequest(endpoints.profile + "/", callback);
};

export const PatchProfileService = (data:any, callback: any) => {
    PatchRequest(endpoints.profile + "/", data, callback);
};