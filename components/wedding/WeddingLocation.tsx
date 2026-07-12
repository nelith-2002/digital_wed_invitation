import styles from "@/app/wedding/wedding.module.css";
import Image from "next/image";

export default function WeddingLocation() {
  const venueQuery = "Cinnamon Grand Colombo, Colombo, Sri Lanka";

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    venueQuery
  )}`;

  const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    venueQuery
  )}&output=embed`;

  return (
    <section className={styles.locationSection}>
      {/* Background */}
      <div className={styles.locationBg}>
        <Image
          src="/wedding/hero-bg.jpg"
          alt=""
          fill
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Content */}
      <div className={styles.locationContent}>
        {/* Title */}
        <div className={styles.locationTitleWrapper}>
          <p className={styles.locationSubtitle}>The Setting</p>
          <h2 className={styles.locationTitle}>THE VENUE</h2>
        </div>

        {/* Card + Map Row */}
        <div className={styles.locationRow}>
          {/* Left — Venue Card */}
          <div className={styles.venueCard}>
            {/* Corner decorations */}
            <span className={`${styles.corner} ${styles.cornerTL}`} />
            <span className={`${styles.corner} ${styles.cornerTR}`} />
            <span className={`${styles.corner} ${styles.cornerBL}`} />
            <span className={`${styles.corner} ${styles.cornerBR}`} />

            {/* Pin Icon */}
            <div className={styles.venueIconCircle}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#b8912a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>

            {/* Venue Name */}
            <h3 className={styles.venueName}>Cinnamon Grand</h3>
            <p className={styles.venueAddress}>Colombo, Sri Lanka</p>

            {/* Get Directions Button */}
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.directionsBtn}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              GET DIRECTIONS
            </a>
          </div>

          {/* Right — Google Map */}
          <div className={styles.mapWrapper}>
            <iframe
              src={embedUrl}
              width="100%"
              height="350"
              style={{
                border: 0,
                borderRadius: "12px",
                display: "block",
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Cinnamon Grand Colombo"
            />
          </div>
        </div>
      </div>
    </section>
  );
}