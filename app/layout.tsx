import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "YHEOLUX — Signature. Elegance in Every Detail.",
  description:
    "Handpicked, signature pieces delivered across Ghana. Order via WhatsApp, no online payment required.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-180.png",
  },
  openGraph: {
    title: "YHEOLUX — Signature. Elegance in Every Detail.",
    description:
      "Handpicked, signature pieces delivered across Ghana. Order via WhatsApp, no online payment required.",
    images: ["/logo-full.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#071F17",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-body bg-emerald-950 bg-emerald-texture min-h-screen antialiased overflow-x-hidden">
        <CartProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
