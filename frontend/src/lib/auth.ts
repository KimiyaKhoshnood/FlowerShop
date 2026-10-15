import Cookie from "js-cookie";

export const ACCESS_COOKIE = "accessToken";
export const REFRESH_COOKIE = "refreshToken";

export type TokenClaims = {
    user_id: number | string;
    username: string;
    is_staff: boolean;
    exp: number;
};

/** Read the (unverified) payload of a JWT. Only used for UI decisions; the API checks everything. */
export const decodeToken = (token?: string | null): TokenClaims | null => {
    if (!token) return null;
    try {
        const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        const json = typeof atob === "function"
            ? decodeURIComponent(Array.from(atob(payload), (c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0")).join(""))
            : Buffer.from(payload, "base64").toString("utf-8");
        return JSON.parse(json);
    } catch {
        return null;
    }
};

export const getAccessToken = () => Cookie.get(ACCESS_COOKIE);
export const getRefreshToken = () => Cookie.get(REFRESH_COOKIE);

export const saveTokens = ({ access, refresh }: { access: string; refresh?: string }) => {
    const secure = typeof window !== "undefined" && window.location.protocol === "https:";
    Cookie.set(ACCESS_COOKIE, access, { expires: 7, sameSite: "lax", secure });
    if (refresh) Cookie.set(REFRESH_COOKIE, refresh, { expires: 7, sameSite: "lax", secure });
};

export const clearTokens = () => {
    Cookie.remove(ACCESS_COOKIE);
    Cookie.remove(REFRESH_COOKIE);
};
