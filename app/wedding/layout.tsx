import { Montserrat, Cookie, Cinzel_Decorative, Cormorant_Garamond, Corinthia} from "next/font/google";
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
      ${styles.weddingRoot}
    `}>
      {children}
    </div>
  );
}