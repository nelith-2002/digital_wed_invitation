import styles from "@/app/wedding/wedding.module.css";

export default function WeddingFooter() {
  return (
    <footer className={styles.footerSection}>

      {/* Top Divider Line with Icon */}
      <div className={styles.footerTopDivider}>
        <div className={styles.footerDividerLine} />
        <div className={styles.footerCalendarIcon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b8912a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <div className={styles.footerDividerLine} />
      </div>

      {/* Couple Names */}
      <h2 className={styles.footerNames}>Lalisha & Rahal</h2>

      {/* Call Buttons */}
      <div className={styles.footerCallRow}>
        <a
          href="tel:+94715533551"
          className={styles.footerCallBtn}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          Call Lalisha
        </a>

        <a
          href="tel:+94773291127"
          className={styles.footerCallBtn}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          Call Rahal
        </a>
      </div>

      {/* Thank You Text */}
      <p className={styles.footerThankYou}>
        Thank you for being part of our story.
      </p>

      {/* Bottom Divider Line */}
      <div className={styles.footerBottomDivider} />

    </footer>
  );
}
