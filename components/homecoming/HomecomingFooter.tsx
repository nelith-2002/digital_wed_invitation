import styles from "@/app/homecoming/homecoming.module.css";

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.footerPhoneIcon} aria-hidden="true">
      <path
        d="M7.4 4.8L9.6 9.4L7.9 10.8C9.1 13.2 10.9 15 13.2 16.1L14.7 14.4L19.2 16.6L18.4 20.1C18.2 20.8 17.6 21.2 16.9 21.1C8.9 20.2 3.8 15.1 2.9 7.1C2.8 6.4 3.2 5.8 3.9 5.6L7.4 4.8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.footerHeartIcon} aria-hidden="true">
      <path
        d="M12 20.5C12 20.5 4.5 16.2 4.5 9.8C4.5 6.8 6.6 4.6 9.3 4.6C10.9 4.6 11.9 5.4 12.5 6.4C13.1 5.4 14.1 4.6 15.7 4.6C18.4 4.6 20.5 6.8 20.5 9.8C20.5 16.2 12 20.5 12 20.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function HomecomingFooter() {
  return (
    <footer className={styles.footerSection}>
      <div className={styles.footerInner}>
        <div className={styles.footerLeft}>
          <p className={styles.footerEyebrow}>With Love,</p>

          <h2 className={styles.footerNames}>Lalisha &amp; Rahal</h2>

          <p className={styles.footerMeta}>
            September 05, 2026 · Cinnamon Life, Cumulus Ballroom
          </p>

          <div className={styles.footerButtons}>
            <a href="tel:+947XXXXXXXX" className={styles.footerCallButton}>
              <PhoneIcon />
              <span>Call Lalisha</span>
            </a>

            <a href="tel:+94773291127" className={styles.footerCallButton}>
              <PhoneIcon />
              <span>Call Rahal</span>
            </a>
          </div>
        </div>

        <div className={styles.footerDivider} />

        <div className={styles.footerRight}>
          <h3>Thank You</h3>

          <p>Thank you for stepping into our story!</p>

          <HeartIcon />
        </div>
      </div>
    </footer>
  );
}