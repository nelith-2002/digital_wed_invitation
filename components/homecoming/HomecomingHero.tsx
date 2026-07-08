import Image from "next/image";
import styles from "@/app/homecoming/homecoming.module.css";

export default function HomecomingHero() {
  return (
    <section className={styles.heroSection}>
      <Image
        src="/homecoming/big_flower.png"
        alt=""
        width={520}
        height={520}
        className={styles.heroFlowerTopLeft}
        priority
      />

      <Image
        src="/homecoming/big_flower.png"
        alt=""
        width={520}
        height={520}
        className={styles.heroFlowerBottomRight}
        priority
      />

      <div className={styles.heroInner}>
        <p className={styles.heroTopText}>
          Please join us to celebrate
          <br />
          the homecoming of
        </p>

        <div className={styles.heroRingWrap}>
          <Image
            src="/homecoming/circle.png"
            alt=""
            width={620}
            height={620}
            className={styles.heroNameRing}
            priority
          />

          <h1 className={styles.heroCoupleNames}>
            <span>Lalisha</span>
            <span className={styles.heroAmpersand}>&</span>
            <span>Rahal</span>
          </h1>
        </div>

        <p className={styles.heroInviteText}>
          request the honour of your presence at the celebration of their
          homecoming
        </p>

        <p className={styles.heroMonth}>September</p>

        <div className={styles.heroDateGrid}>
          <div className={styles.heroDateSide}>
            <span className={styles.heroDateLine} />
            <span className={styles.heroDateLabel}>Saturday</span>
            <span className={styles.heroDateLine} />
          </div>

          <div className={styles.heroDateNumber}>05</div>

          <div className={styles.heroDateSide}>
            <span className={styles.heroDateLine} />
            <span className={styles.heroDateLabel}>From 06.30 PM</span>
            <span className={styles.heroDateLine} />
          </div>
        </div>

        <p className={styles.heroYear}>2026</p>

        <p className={styles.heroVenue}>
          At Cinnamon Life
          <br />
          Cumulus Ballroom
        </p>
      </div>
    </section>
  );
}