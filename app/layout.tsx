import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-iconix",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

export const metadata = {
  title: {
    default: "Rahal & Lalisha Invitations",
    template: "%s | Rahal & Lalisha",
  },
  description:
    "Digital wedding and homecoming invitation website for Rahal and Lalisha.",
  icons: {
    icon: "/brand/lr-favicon.png",
    apple: "/brand/lr-favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
