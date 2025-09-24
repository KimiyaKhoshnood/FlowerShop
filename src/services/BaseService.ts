import axios, { AxiosRequestConfig, Method } from "axios";
import { baseUrl } from "@/constants/endpoints";
import { getAccessToken } from "@/utils/utils";

export interface IWebServiceResult<T = any> {
    data: T;
    hasError: boolean;
    status: number;
    message?: string;
}

export type ICallback<T = any> = (resultData: T, result: IWebServiceResult<T>) => void;

async function sendRequest<T>(
    method: Method,
    url: string,
    data: any,
    callback: ICallback<T>,
    withAuth: boolean = true
) {
    const token = withAuth ? getAccessToken() : null;

    const config: AxiosRequestConfig = {
        method,
        url: baseUrl + url,
        data,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    };

    try {
        const response = await axios(config);

        const result: IWebServiceResult<T> = {
            data: response.data,
            hasError: false,
            status: response.status,
        };

        callback(response.data, result);
    } catch (error: any) {
        const result: IWebServiceResult = {
            data: error.response?.data,
            hasError: true,
            status: error.response?.status || 500,
            message: error.message,
        };

        callback(result.data, result);
    }
}

export const GetRequest = <T>(url: string, callback: ICallback<T>, withAuth: boolean = true) =>
    sendRequest<T>("GET", url, {}, callback, withAuth);

export const PostRequest = <T>(url: string, data: any, callback: ICallback<T>, withAuth: boolean = true) =>
    sendRequest<T>("POST", url, data, callback, withAuth);

export const PutRequest = <T>(url: string, data: any, callback: ICallback<T>, withAuth: boolean = true) =>
    sendRequest<T>("PUT", url, data, callback, withAuth);

export const PatchRequest = <T>(url: string, data: any, callback: ICallback<T>, withAuth: boolean = true) =>
    sendRequest<T>("PATCH", url, data, callback, withAuth);

export const DeleteRequest = <T>(url: string, callback: ICallback<T>, withAuth: boolean = true) =>
    sendRequest<T>("DELETE", url, {}, callback, withAuth);
