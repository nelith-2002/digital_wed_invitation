import type { ReactNode } from "react";
import {
  Cookie,
  Cormorant_Garamond,
  Cinzel_Decorative,
  Corinthia,
} from "next/font/google";

const cookie = Cookie({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cookie",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const cinzelDecorative = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-cinzel-decorative",
});

const corinthia = Corinthia({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-corinthia",
});

type HomecomingLayoutProps = {
  children: ReactNode;
};

export default function HomecomingLayout({
  children,
}: HomecomingLayoutProps) {
  return (
    <div
      className={`${cookie.variable} ${cormorant.variable} ${cinzelDecorative.variable} ${corinthia.variable}`}
    >
      {children}
    </div>
  );
}