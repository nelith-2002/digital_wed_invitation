"use client";

import { useState } from "react";
import styles from "@/app/homecoming/homecoming.module.css";

const eventDetails = {
  title: "Rahal & Lalisha Homecoming",
  description: "Homecoming celebration of Rahal and Lalisha.",
  location: "Cinnamon Life, Colombo 03, Sri Lanka",

  googleStart: "20260905T130000Z",
  googleEnd: "20260905T180000Z",

  icsStart: "20260905T183000",
  icsEnd: "20260905T233000",
};

const mapQuery = encodeURIComponent(eventDetails.location);

function LocationPinIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.locationPinIcon} aria-hidden>
      <path
        d="M12 21C12 21 5.5 14.8 5.5 9.8C5.5 6.2 8.4 3.5 12 3.5C15.6 3.5 18.5 6.2 18.5 9.8C18.5 14.8 12 21 12 21Z"
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

function MainCalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.calendarMainIcon} aria-hidden>
      <rect
        x="4"
        y="5.5"
        width="16"
        height="15"
        rx="2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M7.5 3.5V7.5M16.5 3.5V7.5M4 10H20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 13H9.5M11.25 13H12.75M14.5 13H16M8 16H9.5M11.25 16H12.75M14.5 16H16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${styles.calendarChevron} ${
        isOpen ? styles.calendarChevronOpen : ""
      }`}
      aria-hidden
    >
      <path
        d="M6.5 9L12 14.5L17.5 9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GoogleCalendarLogo() {
  return (
    <svg viewBox="0 0 48 48" className={styles.calendarProviderIcon} aria-hidden>
      <path fill="#ffffff" d="M8 8h32v32H8z" />
      <path fill="#4285F4" d="M8 8h32v8H8z" />
      <path fill="#34A853" d="M8 32h32v8H8z" />
      <path fill="#FBBC04" d="M32 16h8v16h-8z" />
      <path fill="#EA4335" d="M8 16h8v16H8z" />
      <path fill="#ffffff" d="M16 16h16v16H16z" />
      <text
        x="24"
        y="29"
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill="#4285F4"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        31
      </text>
    </svg>
  );
}

function AppleCalendarLogo() {
  return (
    <svg viewBox="0 0 48 48" className={styles.calendarProviderIcon} aria-hidden>
      <rect x="6" y="6" width="36" height="36" rx="7" fill="#ffffff" />
      <path
        d="M6 13C6 9.1 9.1 6 13 6H35C38.9 6 42 9.1 42 13V17H6V13Z"
        fill="#FF3B30"
      />
      <text
        x="24"
        y="15"
        textAnchor="middle"
        fontSize="5"
        fontWeight="800"
        fill="#ffffff"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        SEP
      </text>
      <text
        x="24"
        y="34"
        textAnchor="middle"
        fontSize="18"
        fontWeight="700"
        fill="#111111"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        05
      </text>
    </svg>
  );
}

function OutlookLogo() {
  return (
    <svg viewBox="0 0 48 48" className={styles.calendarProviderIcon} aria-hidden>
      <rect x="6" y="10" width="28" height="28" rx="3" fill="#0078D4" />
      <path d="M34 15H43V36H34V15Z" fill="#28A8EA" />
      <path d="M34 18L43 24L34 30V18Z" fill="#50D9FF" />
      <path d="M34 15L43 21H34V15Z" fill="#0364B8" />
      <text
        x="20"
        y="30"
        textAnchor="middle"
        fontSize="17"
        fontWeight="800"
        fill="#ffffff"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        O
      </text>
    </svg>
  );
}

function createGoogleCalendarUrl() {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: eventDetails.title,
    dates: `${eventDetails.googleStart}/${eventDetails.googleEnd}`,
    details: eventDetails.description,
    location: eventDetails.location,
    ctz: "Asia/Colombo",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function downloadIcsFile(calendarType: "apple" | "outlook") {
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Rahal Lalisha Homecoming//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:rahal-lalisha-homecoming-20260905@homecoming-invitation",
    "DTSTAMP:20260707T000000Z",
    `DTSTART;TZID=Asia/Colombo:${eventDetails.icsStart}`,
    `DTEND;TZID=Asia/Colombo:${eventDetails.icsEnd}`,
    `SUMMARY:${escapeIcsText(eventDetails.title)}`,
    `DESCRIPTION:${escapeIcsText(eventDetails.description)}`,
    `LOCATION:${escapeIcsText(eventDetails.location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], {
    type: "text/calendar;charset=utf-8",
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download =
    calendarType === "apple"
      ? "rahal-lalisha-homecoming-apple-calendar.ics"
      : "rahal-lalisha-homecoming-outlook-calendar.ics";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export default function HomecomingLocationCalendar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className={styles.locationCalendarSection}>
      <div className={styles.locationCalendarInner}>
        <p className={styles.locationEyebrow}>The Location</p>

          <div className={styles.locationAddress}>
    <div className={styles.locationAddressMainRow}>
      <LocationPinIcon />
      <span>Cinnamon Life, Colombo</span>
    </div>

    <p className={styles.locationAddressSub}>Colombo 03, Sri Lanka</p>
  </div>

        <div className={styles.locationCalendarGrid}>
          <div className={styles.mapCard}>
            <iframe
              title="Cinnamon Life Colombo location map"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              className={styles.mapFrame}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
              target="_blank"
              rel="noreferrer"
              className={styles.openMapButton}
            >
              Open Map
              <span>↗</span>
            </a>
          </div>

          <div className={styles.calendarCard}>
            <button
              type="button"
              className={styles.calendarHeader}
              onClick={() => setIsOpen((current) => !current)}
              aria-expanded={isOpen}
            >
              <span className={styles.calendarIconWrap}>
                <MainCalendarIcon />
              </span>

              <span className={styles.calendarHeaderText}>
                <strong>Add to Calendar</strong>
                <small>Save the date to your calendar</small>
              </span>

              <span className={styles.calendarChevronWrap}>
                <ChevronIcon isOpen={isOpen} />
              </span>
            </button>

            {isOpen && (
              <div className={styles.calendarOptions}>
                <a
                  href={createGoogleCalendarUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.calendarOption}
                >
                  <GoogleCalendarLogo />
                  <span>Google Calendar</span>
                  <strong>›</strong>
                </a>

                <button
                  type="button"
                  className={styles.calendarOption}
                  onClick={() => downloadIcsFile("apple")}
                >
                  <AppleCalendarLogo />
                  <span>Apple Calendar</span>
                  <strong>›</strong>
                </button>

                <button
                  type="button"
                  className={styles.calendarOption}
                  onClick={() => downloadIcsFile("outlook")}
                >
                  <OutlookLogo />
                  <span>Outlook Calendar</span>
                  <strong>›</strong>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}