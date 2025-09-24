import { endpoints } from "@/constants/endpoints";
import { stringFormat } from "@/utils/utils";
import type { ICallback } from "./BaseService";
import { DeleteRequest, GetRequest, PatchRequest, PostRequest } from "./BaseService";
import { ICategory, IDiscount, IEachProduct, IOrder, IProfile } from "@/types/types";

// -------------------- Auth --------------------
export const PostTokenService = (data: { username: string; password: string }, callback: ICallback<{ access: string, refresh: string }>) =>
    PostRequest(`${endpoints.token}/`, data, callback, false);

export const PostRegisterService = (data: { email: string; password: string }, callback: ICallback<{ success: boolean }>) =>
    PostRequest(`${endpoints.register}/`, data, callback, false);

// -------------------- Products --------------------
export const GetProductsService = (callback: ICallback<IEachProduct[]>) =>
    GetRequest(`${endpoints.products}/`, callback);

export const GetProductService = (id: string, callback: ICallback<IEachProduct>) =>
    GetRequest(`${endpoints.products}/${id}/`, callback);

export const PostProductService = (data: Omit<IEachProduct, "id">, callback: ICallback<IEachProduct>) =>
    PostRequest(`${endpoints.products}/`, data, callback);

export const DeleteProductsService = (id: string, callback: ICallback<{ success: boolean }>) =>
    DeleteRequest(`${endpoints.products}/${id}/`, callback);

export const PatchProductsService = (data: Partial<IEachProduct>, id: string, callback: ICallback<IEachProduct>) =>
    PatchRequest(`${endpoints.products}/${id}/`, data, callback);

export const GetProductItemService = (productId: string, callback: ICallback<IEachProduct>) =>
    GetRequest(`${stringFormat(endpoints.productItem, productId)}/`, callback);

export const GetProductsByCategoryService = (category: string, callback: ICallback<IEachProduct[]>) =>
    GetRequest(stringFormat(endpoints.ProductsByCategory, category), callback);

// -------------------- Categories --------------------
export const GetCategoriesService = (callback: ICallback<ICategory[]>) =>
    GetRequest(`${endpoints.categories}/`, callback);

export const PostCategoriesService = (data: Omit<ICategory, "id">, callback: ICallback<ICategory>) =>
    PostRequest(`${endpoints.categories}/`, data, callback);

// -------------------- Orders --------------------
export const GetOrdersService = (callback: ICallback<IOrder[]>) =>
    GetRequest(`${endpoints.orders}/`, callback);

export const PostOrdersService = (data: IOrder, callback: ICallback<IOrder>) =>
    PostRequest(`${endpoints.orders}/`, data, callback);

// -------------------- Discounts --------------------
export const GetDiscountsService = (callback: ICallback<IDiscount[]>) =>
    GetRequest(`${endpoints.discounts}/`, callback);

export const GetDiscountCodeService = (discountCode: string, callback: ICallback<IDiscount[]>) =>
    GetRequest(`${stringFormat(endpoints.discountCode, discountCode)}/`, callback);

// -------------------- Profile --------------------
export const GetProfileService = (callback: ICallback<IProfile>) =>
    GetRequest(`${endpoints.profile}/`, callback);

export const PatchProfileService = (data: Partial<IProfile>, callback: ICallback<IProfile>) =>
    PatchRequest(`${endpoints.profile}/`, data, callback);
