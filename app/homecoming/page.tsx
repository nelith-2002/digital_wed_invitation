import HomecomingHero from "@/components/homecoming/HomecomingHero";
import HomecomingCountdown from "@/components/homecoming/HomecomingCountdown";
import HomecomingDetails from "@/components/homecoming/HomecomingDetails";
import HomecomingStory from "@/components/homecoming/HomecomingStory";
import HomecomingLocationCalendar from "@/components/homecoming/HomecomingLocationCalendar";
import HomecomingRSVP from "@/components/homecoming/HomecomingRSVP";
import HomecomingFooter from "@/components/homecoming/HomecomingFooter";
import HomecomingFallingFlowers from "@/components/homecoming/HomecomingFallingFlowers";
import styles from "./homecoming.module.css";

export default function HomecomingPage() {
  return (
    <main className={styles.homecomingBackground}>
      <HomecomingFallingFlowers />

      <div className={styles.homecomingContent}>
        <HomecomingHero />
        <HomecomingCountdown />
        <HomecomingDetails />
        <HomecomingStory />
        <HomecomingLocationCalendar />
        <HomecomingRSVP />
        <HomecomingFooter />
      </div>
    </main>
  );
}