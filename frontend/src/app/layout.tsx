import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flower Shop",
  description: "A bilingual flower shop built with Next.js and Django REST Framework.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
