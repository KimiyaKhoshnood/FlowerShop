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