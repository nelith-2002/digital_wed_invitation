import styles from "./wedding.module.css";
import WeddingHero from "@/components/wedding/WeddingHero";
import WeddingCountdown from "@/components/wedding/WeddingCountdown";
import WeddingLeafAnimation from "@/components/wedding/WeddingLeafAnimation";
import WeddingGsapAnimations from "@/components/wedding/WeddingGsapAnimations";
import Image from "next/image";
import WeddingEvents from "@/components/wedding/WeddingEvents";
import WeddingStory from "@/components/wedding/WeddingStory";
import WeddingMusic from "@/components/wedding/WeddingMusic";
import WeddingLocation from "@/components/wedding/WeddingLocation";
import WeddingRSVP from "@/components/wedding/WeddingRSVP";
import WeddingFooter from "@/components/wedding/WeddingFooter";

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

      <WeddingMusic />
      <WeddingLeafAnimation />
      <WeddingGsapAnimations />

      <WeddingHero />
      <WeddingCountdown />
      <WeddingEvents />
      <WeddingStory />
      <WeddingLocation />
      <WeddingRSVP />
      <WeddingFooter />
    </main>
  );
}