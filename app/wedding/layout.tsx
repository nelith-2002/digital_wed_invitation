import { Montserrat, Cookie } from "next/font/google";
import "../globals.css";
import styles from "./wedding.module.css";

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

export default function WeddingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${montserrat.variable} ${cookie.variable} ${styles.weddingRoot}`}>
      {children}
    </div>
  );
}