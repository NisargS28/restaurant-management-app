import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RestoPOS - Restaurant Point of Sale System",
    template: "%s | RestoPOS",
  },
  description: "Simple and powerful POS system for small restaurants and cafes. Manage orders, products, and view sales reports.",
  keywords: ["POS", "Restaurant", "Point of Sale", "Order Management", "Kitchen Display"],
  authors: [{ name: "RestoPOS" }],
  creator: "RestoPOS",
  publisher: "RestoPOS",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
