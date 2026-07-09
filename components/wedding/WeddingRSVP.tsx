"use client";

import { FormEvent, useState } from "react";
import styles from "@/app/wedding/wedding.module.css";

export default function WeddingRSVP() {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<"yes" | "no" | "">("");
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }

    if (!attending) {
      setError("Please select whether you will attend.");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventType: "wedding",
          name: trimmedName,
          attendance: attending === "yes" ? "Accept" : "Decline",
          guestCount: attending === "yes" ? guests : 0,
          message: message.trim(),
          page: "/wedding",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Unable to send RSVP. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Unable to send RSVP. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function decreaseGuests() {
    setGuests((current) => Math.max(1, current - 1));
  }

  function increaseGuests() {
    setGuests((current) => Math.min(10, current + 1));
  }

  if (submitted) {
    return (
      <section className={styles.rsvpSection}>
        <div className={styles.rsvpSuccessBox}>
          <p className={styles.rsvpSuccessIcon}>💍</p>

          <h3 className={styles.rsvpSuccessTitle}>Thank You, {name.trim()}!</h3>

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
      <div className={styles.rsvpContent}>
        <div className={styles.rsvpTitleWrapper}>
          <p className={styles.rsvpSubtitle}>Kindly Reply</p>

          <h2 className={styles.rsvpTitle}>TWO HEARTS, ONE JOURNEY</h2>

          <p className={styles.rsvpDesc}>
            We would be honoured by your presence. Kindly let us know if you can
            join us.
          </p>

          <p className={styles.rsvpDeadline}>
            Kindly respond by 28th August 2026
          </p>
        </div>

        <form className={styles.rsvpCard} onSubmit={handleSubmit}>
          <span className={`${styles.corner} ${styles.cornerTL}`} />
          <span className={`${styles.corner} ${styles.cornerTR}`} />
          <span className={`${styles.corner} ${styles.cornerBL}`} />
          <span className={`${styles.corner} ${styles.cornerBR}`} />

          <div className={styles.rsvpField}>
            <label className={styles.rsvpLabel} htmlFor="weddingGuestName">
              Name
            </label>

            <input
              id="weddingGuestName"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={styles.rsvpInput}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.rsvpField}>
            <label className={styles.rsvpLabel}>Will you be attending?</label>

            <div className={styles.rsvpAttendRow}>
              <button
                type="button"
                onClick={() => {
                  setAttending("yes");
                  setError("");
                }}
                className={`${styles.rsvpAttendBtn} ${
                  attending === "yes" ? styles.rsvpAttendActive : ""
                }`}
                disabled={isSubmitting}
              >
                Joyfully Accept
              </button>

              <button
                type="button"
                onClick={() => {
                  setAttending("no");
                  setGuests(1);
                  setError("");
                }}
                className={`${styles.rsvpAttendBtn} ${
                  attending === "no" ? styles.rsvpAttendActive : ""
                }`}
                disabled={isSubmitting}
              >
                Regretfully Decline
              </button>
            </div>
          </div>

          {attending === "yes" && (
            <div className={styles.rsvpField}>
              <label className={styles.rsvpLabel}>Number of Guests</label>

              <div className={styles.rsvpGuestRow}>
                <button
                  type="button"
                  onClick={decreaseGuests}
                  className={styles.rsvpGuestBtn}
                  aria-label="Decrease guests"
                  disabled={isSubmitting}
                >
                  −
                </button>

                <span className={styles.rsvpGuestCount}>{guests}</span>

                <button
                  type="button"
                  onClick={increaseGuests}
                  className={styles.rsvpGuestBtn}
                  aria-label="Increase guests"
                  disabled={isSubmitting}
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className={styles.rsvpField}>
            <label className={styles.rsvpLabel} htmlFor="weddingGuestMessage">
              Message (Optional)
            </label>

            <textarea
              id="weddingGuestMessage"
              placeholder="Leave a message for the couple..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className={styles.rsvpTextarea}
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          {error && <p className={styles.rsvpError}>{error}</p>}

          <button
            type="submit"
            className={styles.rsvpSubmitBtn}
            disabled={isSubmitting}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            {isSubmitting ? "SENDING RSVP..." : "SEND RSVP"}
          </button>
        </form>
      </div>
    </section>
  );
}