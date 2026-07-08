"use client";

import { useState } from "react";
import styles from "@/app/wedding/wedding.module.css";

export default function WeddingRSVP() {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<"yes" | "no" | "">("");
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!attending) {
      setError("Please select whether you will attend.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  const decreaseGuests = () => {
    if (guests > 1) setGuests(guests - 1);
  };

  const increaseGuests = () => {
    if (guests < 10) setGuests(guests + 1);
  };

  if (submitted) {
    return (
      <section className={styles.rsvpSection}>
        <div className={styles.rsvpSuccessBox}>
          <p className={styles.rsvpSuccessIcon}>💍</p>
          <h3 className={styles.rsvpSuccessTitle}>
            Thank You, {name}!
          </h3>
          <p className={styles.rsvpSuccessText}>
            {attending === "yes"
              ? "We are so excited to celebrate with you! See you on August 28th, 2026."
              : "We will miss you dearly. Thank you for letting us know."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.rsvpSection}>

      {/* Content */}
      <div className={styles.rsvpContent}>

        {/* Titles */}
        <div className={styles.rsvpTitleWrapper}>
          <p className={styles.rsvpSubtitle}>Kindly Reply</p>
          <h2 className={styles.rsvpTitle}>TWO HEARTS, ONE JOURNEY</h2>
          <p className={styles.rsvpDesc}>
            We would be honoured by your presence. Kindly let us know if you can join us.
          </p>
          <p className={styles.rsvpDeadline}>
            Kindly respond by 28th August 2026
          </p>
        </div>

        {/* RSVP Card */}
        <div className={styles.rsvpCard}>

          {/* Corner decorations */}
          <span className={`${styles.corner} ${styles.cornerTL}`} />
          <span className={`${styles.corner} ${styles.cornerTR}`} />
          <span className={`${styles.corner} ${styles.cornerBL}`} />
          <span className={`${styles.corner} ${styles.cornerBR}`} />

          {/* Name Field */}
          <div className={styles.rsvpField}>
            <label className={styles.rsvpLabel}>Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.rsvpInput}
            />
          </div>

          {/* Attending Buttons */}
          <div className={styles.rsvpField}>
            <label className={styles.rsvpLabel}>Will you be attending?</label>
            <div className={styles.rsvpAttendRow}>
              <button
                onClick={() => setAttending("yes")}
                className={`${styles.rsvpAttendBtn} ${attending === "yes" ? styles.rsvpAttendActive : ""}`}
              >
                Joyfully Accept
              </button>
              <button
                onClick={() => setAttending("no")}
                className={`${styles.rsvpAttendBtn} ${attending === "no" ? styles.rsvpAttendActive : ""}`}
              >
                Regretfully Decline
              </button>
            </div>
          </div>

          {/* Number of Guests */}
          {attending === "yes" && (
            <div className={styles.rsvpField}>
              <label className={styles.rsvpLabel}>Number of Guests</label>
              <div className={styles.rsvpGuestRow}>
                <button
                  onClick={decreaseGuests}
                  className={styles.rsvpGuestBtn}
                >
                  −
                </button>
                <span className={styles.rsvpGuestCount}>{guests}</span>
                <button
                  onClick={increaseGuests}
                  className={styles.rsvpGuestBtn}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Optional Message */}
          <div className={styles.rsvpField}>
            <label className={styles.rsvpLabel}>Message (Optional)</label>
            <textarea
              placeholder="Leave a message for the couple..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={styles.rsvpTextarea}
              rows={3}
            />
          </div>

          {/* Error */}
          {error && (
            <p className={styles.rsvpError}>{error}</p>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className={styles.rsvpSubmitBtn}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            SEND RSVP
          </button>

        </div>

      </div>

    </section>
  );
}
