"use client";
import { useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { clearTokens, decodeToken, getAccessToken, getRefreshToken, saveTokens, type TokenClaims } from "./auth";

type Session = {
    /** null while logged out; claims come from the JWT so no request is needed. */
    user: Pick<TokenClaims, "username" | "is_staff"> | null;
    /** false until the cookies have been read on the client. */
    ready: boolean;
    signIn: (tokens: { access: string; refresh: string }) => void;
    signOut: () => void;
};

const SessionContext = createContext<Session | null>(null);

const readUser = () => {
    const claims = decodeToken(getAccessToken()) ?? (getRefreshToken() ? decodeToken(getRefreshToken()) : null);
    // Tokens issued before the custom claims existed have no username; treat them as signed in anyway.
    return claims ? { username: claims.username ?? "", is_staff: Boolean(claims.is_staff) } : null;
};

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
    const queryClient = useQueryClient();
    const [user, setUser] = useState<Session["user"]>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        setUser(readUser());
        setReady(true);
    }, []);

    const signIn = useCallback((tokens: { access: string; refresh: string }) => {
        saveTokens(tokens);
        setUser(readUser());
        queryClient.clear();
    }, [queryClient]);

    const signOut = useCallback(() => {
        clearTokens();
        setUser(null);
        queryClient.clear();
    }, [queryClient]);

    return <SessionContext.Provider value={{ user, ready, signIn, signOut }}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) throw new Error("useSession must be used inside <SessionProvider>");
    return context;
};
