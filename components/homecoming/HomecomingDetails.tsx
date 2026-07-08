import styles from "@/app/homecoming/homecoming.module.css";

function RingsIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      className={styles.detailsSvgIcon}
      aria-hidden="true"
    >
      <path
        d="M32 17.5C29.5 13.5 23 13.8 23 19.2C23 24.5 32 29 32 29C32 29 41 24.5 41 19.2C41 13.8 34.5 13.5 32 17.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="26"
        cy="40"
        r="13"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <circle
        cx="38"
        cy="40"
        r="13"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
    </svg>
  );
}

function CutleryIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      className={styles.detailsSvgIcon}
      aria-hidden="true"
    >
      <path
        d="M18 10V31"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M11 10V26C11 30 14 33 18 33C22 33 25 30 25 26V10"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 33V54"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M43 10C38 15 36 22 36 31C36 37 39 40 43 40V54"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M43 10V54"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className={styles.detailsLocationIcon}
      aria-hidden="true"
    >
      <path
        d="M12 21C12 21 5.5 14.9 5.5 9.8C5.5 6.2 8.4 3.5 12 3.5C15.6 3.5 18.5 6.2 18.5 9.8C18.5 14.9 12 21 12 21Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="9.8"
        r="2.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
      />
    </svg>
  );
}

const details = [
  {
    icon: <RingsIcon />,
    title: "Homecoming Celebration",
    date: "05 Sep 2026",
    time: "From 06.30 PM",
    venue: "Cinnamon Life, Cumulus Ballroom",
  },
  {
    icon: <CutleryIcon />,
    title: "Dinner Reception",
    date: "05 Sep 2026",
    time: "06.30 PM Onwards",
    venue: "Cinnamon Life, Colombo",
  },
];

export default function HomecomingDetails() {
  return (
    <section className={styles.detailsSection}>
      <div className={styles.detailsInner}>
        {/* <p className={styles.detailsDate}>Saturday, September 05, 2026</p> */}

        <h2 className={styles.detailsTitle}>The Details</h2>

        <div className={styles.detailsArchRow}>
          <div className={styles.detailsItem}>
            <div className={styles.detailsArch}>
              <div className={styles.detailsIconCircle}>{details[0].icon}</div>
            </div>

            <div className={styles.detailsText}>
              <h3>{details[0].title}</h3>
              <p>{details[0].date}</p>
              <p>{details[0].time}</p>

              <div className={styles.detailsVenue}>
                <LocationIcon />
                <span>{details[0].venue}</span>
              </div>
            </div>
          </div>

          <span className={styles.detailsConnector} />

          <div className={styles.detailsItem}>
            <div className={styles.detailsArch}>
              <div className={styles.detailsIconCircle}>{details[1].icon}</div>
            </div>

            <div className={styles.detailsText}>
              <h3>{details[1].title}</h3>
              <p>{details[1].date}</p>
              <p>{details[1].time}</p>

              <div className={styles.detailsVenue}>
                <LocationIcon />
                <span>{details[1].venue}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}