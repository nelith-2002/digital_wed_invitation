import Image from "next/image";
import styles from "@/app/homecoming/homecoming.module.css";

export default function HomecomingStory() {
  return (
    <section className={styles.storySection}>
      <div className={styles.storyInner}>
        <h2 className={styles.storyTitle}>Two Hearts, One Journey</h2>

        <p className={styles.storyText}>
          From a chance meeting to a beautiful friendship, and now to a lifetime
          together. We are blessed to begin this new chapter of our lives and
          can&apos;t wait to celebrate with you.
        </p>

        <div className={styles.storyImageWrap}>
          <Image
            src="/homecoming/AI-Couple.png"
            alt="Illustration of the couple"
            width={620}
            height={780}
            className={styles.storyImage}
          />
        </div>
      </div>
    </section>
  );
}