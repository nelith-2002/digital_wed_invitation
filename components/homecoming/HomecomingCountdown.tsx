"use client";

import { Fragment, useEffect, useState } from "react";
import styles from "@/app/homecoming/homecoming.module.css";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const homecomingDate = new Date("2026-09-05T18:30:00+05:30").getTime();

function getTimeLeft(): TimeLeft {
  const now = new Date().getTime();
  const difference = homecomingDate - now;

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function formatNumber(value: number) {
  return String(value).padStart(2, "0");
}

function CountdownDigits({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <span className={styles.countdownValue} aria-label={value}>
      {value.split("").map((digit, index) => (
        <span
          key={`${label}-${index}-${digit}`}
          className={styles.countdownDigit}
          aria-hidden="true"
        >
          {digit}
        </span>
      ))}
    </span>
  );
}

export default function HomecomingCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
  const initialTimer = window.setTimeout(() => {
    setTimeLeft(getTimeLeft());
  }, 0);

  const intervalTimer = window.setInterval(() => {
    setTimeLeft(getTimeLeft());
  }, 1000);

  return () => {
    window.clearTimeout(initialTimer);
    window.clearInterval(intervalTimer);
  };
}, []);

  const countdownItems = [
    {
      label: "Days",
      displayValue: timeLeft ? String(timeLeft.days) : "00",
    },
    {
      label: "Hours",
      displayValue: timeLeft ? formatNumber(timeLeft.hours) : "00",
    },
    {
      label: "Minutes",
      displayValue: timeLeft ? formatNumber(timeLeft.minutes) : "00",
    },
    {
      label: "Seconds",
      displayValue: timeLeft ? formatNumber(timeLeft.seconds) : "00",
    },
  ];

  return (
    <section className={styles.countdownSection}>
      <div className={styles.countdownDecorTop} />
      <div className={styles.countdownDecorBottom} />

      <div className={styles.countdownPanel}>
        <div className={styles.countdownDivider}>
          <span />
          <strong>◇</strong>
          <span />
        </div>

        <p className={styles.countdownSmallText}>
          Counting Down To The Homecoming
        </p>

        <div className={styles.countdownGrid}>
          {countdownItems.map((item, index) => (
            <Fragment key={item.label}>
              <div className={styles.countdownItemWrap}>
                <div className={styles.countdownBox}>
                  <CountdownDigits
                    value={item.displayValue}
                    label={item.label}
                  />
                </div>

                <p className={styles.countdownLabel}>{item.label}</p>
              </div>

              {index < countdownItems.length - 1 && (
                <span className={styles.countdownColon}>:</span>
              )}
            </Fragment>
          ))}
        </div>

        <div className={styles.countdownDividerBottom}>
          <span />
          <strong>◇</strong>
          <span />
        </div>
      </div>
    </section>
  );
}