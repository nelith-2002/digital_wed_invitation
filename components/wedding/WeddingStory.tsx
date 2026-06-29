import Image from "next/image";
import styles from "@/app/wedding/wedding.module.css";

export default function WeddingStory() {
  return (
    <section className={styles.storySection}>

      {/* Background Image */}
      <div className={styles.storyBg}>
        <Image
          src="/wedding/hero-bg.jpg"
          alt=""
          fill
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Content */}
      <div className={styles.storyContent}>

        {/* Title */}
        <h2 className={styles.storyTitle}>
          TWO HEARTS, ONE JOURNEY
        </h2>

        {/* Story Text */}
        <p className={styles.storyText}>
          From a chance meeting to a beautiful friendship, and now to a lifetime
          together. We are blessed to begin this new chapter of our lives and
          can&apos;t wait to celebrate with you.
        </p>

        {/* Floral Frame with Couple Image */}
        <div className={styles.storyFrameWrapper}>

          {/* Gold Floral Frame */}
          <div className={styles.storyFrame}>
            <Image
              src="/wedding/story-floral-frame-new.png"
              alt="Floral frame"
              width={420}
              height={480}
              style={{ objectFit: "contain", width: "100%", height: "auto" }}
            />
          </div>

          {/* Couple Image — centered inside frame */}
          <div className={styles.storyCoupleImg}>
            <Image
              src="/wedding/story-couple.png"
              alt="Rahal and Lalisha"
              width={280}
              height={320}
              style={{ objectFit: "contain", width: "100%", height: "auto" }}
            />
          </div>

        </div>

      </div>

    </section>
  );
}
