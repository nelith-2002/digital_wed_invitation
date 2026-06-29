"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, ChevronRight } from "lucide-react";
import styles from "@/app/wedding/wedding.module.css";

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
      <p className={styles.eventsDate}>
        Friday, August 28, 2026
      </p>

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
            src="/wedding/event-ceremony.png"
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
          className={styles.saveOurDateBtn}
          onClick={() => setCalendarOpen(!calendarOpen)}
        >
          <div className={styles.saveOurDateLeft}>
            <div className={styles.saveOurDateIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
                <path d="M12 14h.01M12 18h.01M8 14h.01M8 18h.01M16 14h.01"/>
              </svg>
            </div>
            <div>
              <p className={styles.saveOurDateTitle}>Save Our Date</p>
              <p className={styles.saveOurDateSub}>
                Add the wedding to your calendar
              </p>
            </div>
          </div>
          <div className={styles.saveOurDateChevron}>
            {calendarOpen ? (
              <ChevronUp size={18} color="#5c4a3a" />
            ) : (
              <ChevronDown size={18} color="#5c4a3a" />
            )}
          </div>
        </button>

        {/* Dropdown */}
        {calendarOpen && (
          <div className={styles.calendarDropdown}>

            {/* Google Calendar */}
            <a
              href="https://calendar.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.calendarLink}
            >
              <div className={styles.calendarLinkLeft}>
                <div className={styles.calendarIconBox}>
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <rect width="24" height="24" rx="4" fill="white"/>
                    <text x="12" y="17" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1a73e8">31</text>
                    <rect x="0" y="0" width="24" height="7" rx="4" fill="#1a73e8"/>
                    <rect x="0" y="4" width="24" height="3" fill="#1a73e8"/>
                  </svg>
                </div>
                <span className={styles.calendarLinkText}>Google Calendar</span>
              </div>
              <ChevronRight size={18} color="#9b8c7d" />
            </a>

            {/* Divider */}
            <div className={styles.calendarDivider} />

            {/* Apple / Outlook Calendar */}
            <a
              href="/wedding/wedding.ics"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.calendarLink}
            >
              <div className={styles.calendarLinkLeft}>
                <div className={styles.calendarIconBox}>
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <rect width="24" height="24" rx="4" fill="white" stroke="#e0e0e0" strokeWidth="1"/>
                    <rect x="0" y="0" width="24" height="7" rx="4" fill="#e74c3c"/>
                    <rect x="0" y="4" width="24" height="3" fill="#e74c3c"/>
                    <text x="12" y="18" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#2c3e50">17</text>
                    <text x="12" y="10" textAnchor="middle" fontSize="5" fontWeight="bold" fill="white">JUL</text>
                  </svg>
                </div>
                <span className={styles.calendarLinkText}>Apple Calendar / Outlook</span>
              </div>
              <ChevronRight size={18} color="#9b8c7d" />
            </a>

          </div>
        )}

      </div>

    </section>
  );
}
