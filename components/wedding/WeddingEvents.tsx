"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "@/app/wedding/wedding.module.css";

const eventDetails = {
  title: "Rahal & Lalisha Wedding",
  description:
    "Wedding celebration of Rahal and Lalisha at Cinnamon Grand Colombo.",
  location: "Cinnamon Grand Colombo, Colombo, Sri Lanka",

  googleStart: "20260828T040000Z",
  googleEnd: "20260828T070000Z",

  outlookStart: "2026-08-28T04:00:00Z",
  outlookEnd: "2026-08-28T07:00:00Z",

  icsStart: "20260828T093000",
  icsEnd: "20260828T123000",
};

function SaveDateIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="M12 14h.01M12 18h.01M8 14h.01M8 18h.01M16 14h.01" />
    </svg>
  );
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#5c4a3a"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {isOpen ? <path d="M18 15L12 9L6 15" /> : <path d="M6 9L12 15L18 9" />}
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#9b8c7d"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 18L15 12L9 6" />
    </svg>
  );
}

function GoogleCalendarLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 48 48" aria-hidden="true">
      <rect x="8" y="8" width="32" height="32" rx="4" fill="#ffffff" />
      <path fill="#4285F4" d="M8 8h32v9H8z" />
      <path fill="#34A853" d="M8 17h8v23h-4a4 4 0 0 1-4-4V17z" />
      <path fill="#FBBC04" d="M32 17h8v19a4 4 0 0 1-4 4h-4V17z" />
      <path fill="#EA4335" d="M16 17h16v23H16z" />
      <rect x="16" y="17" width="16" height="23" fill="#ffffff" />
      <text
        x="24"
        y="33"
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill="#4285F4"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        28
      </text>
    </svg>
  );
}

function AppleCalendarLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 48 48" aria-hidden="true">
      <rect x="7" y="7" width="34" height="34" rx="7" fill="#ffffff" />
      <rect x="7" y="7" width="34" height="12" rx="7" fill="#ff3b30" />
      <path d="M7 14h34v6H7z" fill="#ff3b30" />
      <text
        x="24"
        y="17"
        textAnchor="middle"
        fontSize="6"
        fontWeight="800"
        fill="#ffffff"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        AUG
      </text>
      <text
        x="24"
        y="35"
        textAnchor="middle"
        fontSize="18"
        fontWeight="700"
        fill="#111111"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        28
      </text>
      <rect
        x="7.5"
        y="7.5"
        width="33"
        height="33"
        rx="6.5"
        fill="none"
        stroke="#e5e5e5"
      />
    </svg>
  );
}

function OutlookCalendarLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 48 48" aria-hidden="true">
      <rect x="17" y="9" width="24" height="30" rx="3" fill="#1976d2" />
      <rect x="22" y="14" width="15" height="7" rx="1" fill="#ffffff" opacity="0.95" />
      <rect x="22" y="24" width="15" height="10" rx="1" fill="#ffffff" opacity="0.95" />
      <rect x="7" y="15" width="22" height="22" rx="3" fill="#0f5db8" />
      <circle cx="18" cy="26" r="6.6" fill="#ffffff" opacity="0.96" />
      <path
        d="M14.7 26c0-2.35 1.32-4 3.3-4s3.3 1.65 3.3 4-1.32 4-3.3 4-3.3-1.65-3.3-4Z"
        fill="#0f5db8"
      />
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

function createOutlookCalendarUrl() {
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: eventDetails.title,
    startdt: eventDetails.outlookStart,
    enddt: eventDetails.outlookEnd,
    body: eventDetails.description,
    location: eventDetails.location,
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function downloadAppleCalendarFile() {
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Rahal Lalisha Wedding//Digital Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VTIMEZONE",
    "TZID:Asia/Colombo",
    "BEGIN:STANDARD",
    "DTSTART:19700101T000000",
    "TZOFFSETFROM:+0530",
    "TZOFFSETTO:+0530",
    "TZNAME:IST",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    "UID:rahal-lalisha-wedding-20260828@digital-wed-invitation",
    "DTSTAMP:20260712T000000Z",
    `DTSTART;TZID=Asia/Colombo:${eventDetails.icsStart}`,
    `DTEND;TZID=Asia/Colombo:${eventDetails.icsEnd}`,
    `SUMMARY:${escapeIcsText(eventDetails.title)}`,
    `DESCRIPTION:${escapeIcsText(eventDetails.description)}`,
    `LOCATION:${escapeIcsText(eventDetails.location)}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([`${icsContent}\r\n`], {
    type: "text/calendar;charset=utf-8",
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "rahal-lalisha-wedding-apple-calendar.ics";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export default function WeddingEvents() {
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <section className={styles.eventsSection}>
      {/* Background Image */}
      <div className={styles.eventsBg}>
        <Image
          src="/wedding/hero-bg.jpg"
          alt=""
          fill
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Date */}
      <p className={styles.eventsDate}>Friday, August 28, 2026</p>

      {/* Title */}
      <h2 className={styles.eventsTitle}>THE DETAILS</h2>

      {/* Gold Divider Image */}
      <div className={styles.eventsDividerImg}>
        <Image
          src="/wedding/events-divider.png"
          alt="divider"
          width={400}
          height={40}
          style={{ objectFit: "contain", width: "100%", height: "auto" }}
        />
      </div>

      {/* Event Cards */}
      <div className={styles.eventsGrid}>
        <div className={styles.eventCardImg}>
          <Image
            src="/wedding/poruwa-ceremony-card.png"
            alt="Wedding Ceremony"
            width={300}
            height={320}
            style={{ objectFit: "contain", width: "100%", height: "auto" }}
          />
        </div>

        <div className={styles.eventCardImg}>
          <Image
            src="/wedding/event-reception.png"
            alt="Reception"
            width={300}
            height={320}
            style={{ objectFit: "contain", width: "100%", height: "auto" }}
          />
        </div>
      </div>

      {/* Save Our Date */}
      <div className={styles.saveOurDateWrapper}>
        {/* Main Button */}
        <button
          type="button"
          className={styles.saveOurDateBtn}
          onClick={() => setCalendarOpen((current) => !current)}
          aria-expanded={calendarOpen}
          aria-controls="wedding-calendar-options"
        >
          <div className={styles.saveOurDateLeft}>
            <div className={styles.saveOurDateIcon}>
              <SaveDateIcon />
            </div>

            <div>
              <p className={styles.saveOurDateTitle}>Save Our Date</p>
              <p className={styles.saveOurDateSub}>
                Add the wedding to your calendar
              </p>
            </div>
          </div>

          <div className={styles.saveOurDateChevron}>
            <ChevronIcon isOpen={calendarOpen} />
          </div>
        </button>

        {/* Dropdown */}
        {calendarOpen && (
          <div
            id="wedding-calendar-options"
            className={styles.calendarDropdown}
          >
            <a
              href={createGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.calendarLink}
            >
              <div className={styles.calendarLinkLeft}>
                <div className={styles.calendarIconBox}>
                  <GoogleCalendarLogo />
                </div>

                <span className={styles.calendarLinkText}>
                  Google Calendar
                </span>
              </div>

              <ChevronRightIcon />
            </a>

            <div className={styles.calendarDivider} />

            <button
              type="button"
              className={styles.calendarLink}
              onClick={downloadAppleCalendarFile}
            >
              <div className={styles.calendarLinkLeft}>
                <div className={styles.calendarIconBox}>
                  <AppleCalendarLogo />
                </div>

                <span className={styles.calendarLinkText}>
                  Apple Calendar
                </span>
              </div>

              <ChevronRightIcon />
            </button>

            <div className={styles.calendarDivider} />

            <a
              href={createOutlookCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.calendarLink}
            >
              <div className={styles.calendarLinkLeft}>
                <div className={styles.calendarIconBox}>
                  <OutlookCalendarLogo />
                </div>

                <span className={styles.calendarLinkText}>
                  Outlook Calendar
                </span>
              </div>

              <ChevronRightIcon />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}