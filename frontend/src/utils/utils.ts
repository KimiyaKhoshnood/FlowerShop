import Cookie from "js-cookie";

export const capitalizeFirstLetter = (val: string) => {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export const stringFormat = (pattern: string, ...params: Array<string>): string => {
    let outputString = pattern
    for (let i = 0; i < params.length; i++) {
        outputString = outputString.replace("{" + (i) + "}", params[i]);
    }
    return outputString
}

export const getAccessToken = () => {
    return Cookie.get("accessToken")
}

export const saveTokens = (tokens: { access: string, refresh: string }) => {
    Cookie.set("accessToken", tokens.access, { expires: 1, sameSite: "lax" })
    Cookie.set("refreshToken", tokens.refresh, { expires: 2, sameSite: "lax" })
}

export const clearTokens = () => {
    Cookie.remove("accessToken")
    Cookie.remove("refreshToken")
}

/** Swap the leading /en or /fa segment of a path for the other language. */
export const switchLanguagePath = (pathname: string, lang: string) => {
    const target = lang === "fa" ? "en" : "fa"
    return pathname.replace(/^\/(en|fa)(?=\/|$)/, `/${target}`)
}

/** Turn a DRF error body ({field: ["msg"]} or {detail: "msg"}) into one readable line. */
export const getApiErrorMessage = (data: unknown, fallback: string) => {
    if (!data || typeof data !== "object") return fallback
    const messages = Object.values(data as Record<string, unknown>)
        .flat()
        .filter((message): message is string => typeof message === "string")
    return messages.length ? messages.join(" ") : fallback
}
