import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Generátor protokolů měření hluku",
  description: "Aplikace pro vytváření protokolů o měření hluku z tepelných čerpadel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body className="antialiased bg-gray-50">
        {children}
      </body>
    </html>
  );
}
