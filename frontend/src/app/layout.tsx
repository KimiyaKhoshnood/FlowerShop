import "./globals.css";

// The real root layout (with <html> and <body>) lives in app/[lang]/layout.tsx,
// so the document can carry the right `lang` and `dir` for each language.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
