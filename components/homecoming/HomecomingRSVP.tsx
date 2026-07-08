"use client";

import { FormEvent, useState } from "react";
import styles from "@/app/homecoming/homecoming.module.css";

type AttendanceStatus = "accept" | "decline" | null;

function PaperPlaneIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.rsvpButtonIcon} aria-hidden="true">
      <path
        d="M21 3L9.7 14.3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M21 3L14 21L9.7 14.3L3 10L21 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.rsvpSuccessIcon} aria-hidden="true">
      <path
        d="M12 20.5C12 20.5 4.5 16.1 4.5 9.7C4.5 6.7 6.7 4.5 9.4 4.5C11 4.5 12 5.4 12.6 6.3C13.2 5.4 14.2 4.5 15.8 4.5C18.5 4.5 20.5 6.7 20.5 9.7C20.5 16.1 12 20.5 12 20.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function HomecomingRSVP() {
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<AttendanceStatus>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function decreaseGuests() {
    setGuestCount((current) => Math.max(1, current - 1));
  }

  function increaseGuests() {
    setGuestCount((current) => Math.min(10, current + 1));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!attendance) {
      setError("Please select whether you will attend.");
      return;
    }

    setError("");
    setSubmitted(true);
  }

  if (submitted) {
  return (
    <section className={styles.rsvpSection}>
      <div className={styles.rsvpSuccessCard}>
        <HeartIcon />

        <h2>RSVP Sent</h2>

        {attendance === "accept" ? (
          <>
            <p className={styles.rsvpSuccessMain}>
              We look forward to celebrating with you.
            </p>

            <p className={styles.rsvpSuccessSub}>
              Thank you, {name.trim()}. Your RSVP has been noted for{" "}
              {guestCount} {guestCount === 1 ? "guest" : "guests"}.
            </p>
          </>
        ) : (
          <>
            <p className={styles.rsvpSuccessMain}>
              Thank you for letting us know.
            </p>

            <p className={styles.rsvpSuccessSub}>
              You will be missed, but we truly appreciate your response.
            </p>
          </>
        )}
      </div>
    </section>
  );
}

  return (
    <section className={styles.rsvpSection}>
      <div className={styles.rsvpIntro}>
        <h2>Will You Join Us</h2>

        <p>
          Your presence is the greatest gift. Please let us know if you will be
          joining us.
        </p>

        <span>Kindly respond by the 20th of August 2026</span>
      </div>

      <form className={styles.rsvpFormCard} onSubmit={handleSubmit}>
        <div className={styles.rsvpFieldGroup}>
          <label htmlFor="guestName">Full Name</label>
          <input
            id="guestName"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your Name"
          />
        </div>

        <div className={styles.rsvpFieldGroup}>
          <label>Will You Attend?</label>

          <div className={styles.rsvpChoiceGrid}>
            <button
              type="button"
              className={`${styles.rsvpChoiceButton} ${
                attendance === "accept" ? styles.rsvpChoiceActive : ""
              }`}
              onClick={() => {
                setAttendance("accept");
                setError("");
              }}
            >
              Joyfully Accepts
            </button>

            <button
              type="button"
              className={`${styles.rsvpChoiceButton} ${
                attendance === "decline" ? styles.rsvpChoiceActive : ""
              }`}
              onClick={() => {
                setAttendance("decline");
                setError("");
              }}
            >
              Regretfully Declines
            </button>
          </div>
        </div>

        {attendance !== "decline" && (
          <div className={styles.rsvpFieldGroup}>
            <label>Number of Guests</label>

            <div className={styles.rsvpGuestCounter}>
              <button type="button" onClick={decreaseGuests} aria-label="Decrease guests">
                -
              </button>

              <span>{guestCount}</span>

              <button type="button" onClick={increaseGuests} aria-label="Increase guests">
                +
              </button>
            </div>
          </div>
        )}

        {error && <p className={styles.rsvpError}>{error}</p>}

        <button type="submit" className={styles.rsvpSubmitButton}>
          <PaperPlaneIcon />
          Send Our RSVP
        </button>
      </form>
    </section>
  );
}