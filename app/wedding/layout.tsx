import { Montserrat, Cookie, Cinzel_Decorative, Cormorant_Garamond, Corinthia, Great_Vibes } from "next/font/google";
import "../globals.css";
import type { Metadata } from "next";
import styles from "./wedding.module.css";

export const metadata: Metadata = {
  title: "Wedding Invitation",
  description:
    "Rahal and Lalisha wedding invitation with event details, location, calendar, and RSVP.",
};

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-montserrat",
});

const cookie = Cookie({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-cookie",
});

const cinzelDecorative = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-cinzel",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
});

const corinthia = Corinthia({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-corinthia",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-great-vibes",
});

export default function WeddingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`
      ${montserrat.variable} 
      ${cookie.variable} 
      ${cinzelDecorative.variable} 
      ${cormorantGaramond.variable} 
      ${corinthia.variable} 
      ${greatVibes.variable}
      ${styles.weddingRoot}
    `}>
      {children}
    </div>
  );
}