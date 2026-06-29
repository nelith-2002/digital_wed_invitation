"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "@/app/wedding/wedding.module.css";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(): TimeLeft {
  const weddingDate = new Date("2026-08-28T09:30:00+05:30");
  const now = new Date();
  const difference = weddingDate.getTime() - now.getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export default function WeddingCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <section className={styles.countdownSection}>

      {/* Background Image */}
      <div className={styles.countdownBg}>
        <Image
          src="/wedding/countdown-bg.jpg"
          alt="Countdown background"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Inner rectangle border */}
      <div className={styles.countdownBorder}>

        {/* Title */}
        <div className={styles.countdownTitle}>
          <p className={styles.countdownSubtitle}>WE ARE GETTING</p>
          <h2 className={styles.countdownHeading}>MARRIED</h2>
        </div>

        {/* Countdown — boxes row + labels row separate */}
        <div className={styles.countdownWrapper}>

          {/* Top row: box : box : box : box */}
          <div className={styles.countdownBoxRow}>
            {units.map((unit, index) => (
              <div key={unit.label} className={styles.countdownBoxGroup}>
                <div className={styles.countdownBox}>
                  <span className={styles.countdownNumber}>
                    {String(unit.value).padStart(2, "0")}
                  </span>
                </div>
                {index < units.length - 1 && (
                  <span className={styles.countdownColon}>:</span>
                )}
              </div>
            ))}
          </div>

          {/* Bottom row: labels aligned under each box */}
          <div className={styles.countdownLabelRow}>
            {units.map((unit) => (
              <p key={unit.label} className={styles.countdownLabel}>
                {unit.label}
              </p>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}