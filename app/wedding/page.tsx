import styles from "./wedding.module.css";
import WeddingHero from "@/components/wedding/WeddingHero";
import WeddingCountdown from "@/components/wedding/WeddingCountdown";
import WeddingLeafAnimation from "@/components/wedding/WeddingLeafAnimation";
import Image from "next/image";
import WeddingEvents from "@/components/wedding/WeddingEvents";
import WeddingStory from "@/components/wedding/WeddingStory";

export default function WeddingPage() {
  return (
    <main className={styles.weddingRoot}>

      {/* Global background for whole page */}
      <div className={styles.globalBg}>
        <Image
          src="/wedding/hero-bg.jpg"
          alt=""
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      <WeddingLeafAnimation />
      <WeddingHero />
      <WeddingCountdown />
      <WeddingEvents /> 
      <WeddingStory />

    </main>
  );
}