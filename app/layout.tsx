// app/layout.tsx
import type { Metadata } from "next";
import {
  Cinzel,
  Cormorant_Garamond,
  EB_Garamond,
  Great_Vibes,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  weight: "400",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel-font",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  weight: ["300", "400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shoaib & Roshni — 19 June 2026",
  description:
    "Wedding invitation for Shoaib Islam Junayed and Dr. Fouzia Afrin Roshni",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={`${greatVibes.variable} ${cinzel.variable} ${playfairDisplay.variable} ${cormorantGaramond.variable} ${ebGaramond.variable}`}>
      <body className='font-cormorant bg-[#0d0608] overflow-x-hidden'>
        {children}
      </body>
    </html>
  );
}
