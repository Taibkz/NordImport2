import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Cinzel } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NORD IMPORT | Importación de Coches Premium y Alta Gama",
  description:
    "Especialistas en importación y compraventa de vehículos de lujo y alta gama desde el norte de Europa (Alemania, Suecia) a España. Garantía total y servicio a la carta.",
  keywords: [
    "nord import",
    "importar coches de alemania",
    "coches de alta gama",
    "coches importacion madrid",
    "porsche importacion",
    "audi importacion",
    "compraventa coches premium",
  ],
  authors: [{ name: "NORD IMPORT Team" }],
  robots: "index, follow",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${cormorant.variable} ${cinzel.variable} scroll-smooth h-full antialiased`}
    >
      <body className="min-h-full flex flex-col selection:bg-accent-gold/30 selection:text-neutral-900 bg-white text-neutral-900">
        {children}
      </body>
    </html>
  );
}
