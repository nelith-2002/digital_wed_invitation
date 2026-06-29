import styles from "./wedding.module.css";
import WeddingHero from "@/components/wedding/WeddingHero";
import WeddingLeafAnimation from "@/components/wedding/WeddingLeafAnimation";

export default function WeddingPage() {
  return (
    <main className={styles.weddingRoot}>
      <WeddingLeafAnimation />  {/* ← whole page overlay */}
      <WeddingHero />
      {/* more sections */}
    </main>
  );
}