"use client"

import { createContext, useContext } from "react";

interface LanguageContextType {
    lang: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dictionary: Record<string, any>;
}



const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};

export const LanguageProvider = ({
    children,
    lang,
    dictionary,
}: {
    children: React.ReactNode;
    lang: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dictionary: Record<string, any>;
}) => {
    return (
        <LanguageContext.Provider value={{ lang, dictionary }}>
            {children}
        </LanguageContext.Provider>
    );
};