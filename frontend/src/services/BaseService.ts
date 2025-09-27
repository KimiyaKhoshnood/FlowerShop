import { baseUrl } from "@/constants/endpoints";
import { getAccessToken } from "@/utils/utils";
import axios, { AxiosRequestConfig, Method } from "axios";

export interface IWebServiceResult<T = unknown> {
    data: T;
    hasError: boolean;
    status: number;
    message?: string;
}

export type ICallback<T = unknown> = (
    resultData: T,
    result: IWebServiceResult<T>
) => void;

async function sendRequest<T>(
    method: Method,
    url: string,
    data: unknown | undefined,
    callback: ICallback<T>,
    withAuth: boolean = true
): Promise<void> {
    const token = withAuth ? getAccessToken() : null;

    const config: AxiosRequestConfig = {
        method,
        url: baseUrl + url,
        ...(data ? { data } : {}), // فقط وقتی data هست اضافه بشه
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    };

    try {
        const response = await axios<T>(config);

        const result: IWebServiceResult<T> = {
            data: response.data,
            hasError: false,
            status: response.status,
        };

        callback(response.data, result);
    } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response) {
            const result: IWebServiceResult<T> = {
                data: err.response.data as T,
                hasError: true,
                status: err.response.status,
                message: err.message,
            };
            callback(result.data, result);
        } else {
            const result: IWebServiceResult<T> = {
                data: {} as T,
                hasError: true,
                status: 500,
                message: (err as Error).message,
            };
            callback(result.data, result);
        }
    }
}

export const GetRequest = <T>(
    url: string,
    callback: ICallback<T>,
    withAuth: boolean = true
) => sendRequest<T>("GET", url, undefined, callback, withAuth);

export const PostRequest = <T, D = unknown>(
    url: string,
    data: D,
    callback: ICallback<T>,
    withAuth: boolean = true
) => sendRequest<T>("POST", url, data, callback, withAuth);

export const PutRequest = <T, D = unknown>(
    url: string,
    data: D,
    callback: ICallback<T>,
    withAuth: boolean = true
) => sendRequest<T>("PUT", url, data, callback, withAuth);

export const PatchRequest = <T, D = unknown>(
    url: string,
    data: D,
    callback: ICallback<T>,
    withAuth: boolean = true
) => sendRequest<T>("PATCH", url, data, callback, withAuth);

export const DeleteRequest = <T>(
    url: string,
    callback: ICallback<T>,
    withAuth: boolean = true
) => sendRequest<T>("DELETE", url, undefined, callback, withAuth);
