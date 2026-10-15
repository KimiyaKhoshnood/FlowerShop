/** Fill "{0}", "{1}" … placeholders. */
export const fill = (template: string, ...values: (string | number)[]) =>
    values.reduce<string>((text, value, i) => text.replaceAll(`{${i}}`, String(value)), template);

/** Build a link inside the current language, e.g. href(lang, "/shop"). */
export const href = (lang: string, path = "") => `/${lang}${path === "/" ? "" : path}`;
