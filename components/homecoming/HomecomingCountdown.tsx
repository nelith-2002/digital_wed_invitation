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

export default function HomecomingCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const countdownItems = [
    {
      label: "Days",
      value: timeLeft.days,
      displayValue: String(timeLeft.days),
    },
    {
      label: "Hours",
      value: timeLeft.hours,
      displayValue: formatNumber(timeLeft.hours),
    },
    {
      label: "Minutes",
      value: timeLeft.minutes,
      displayValue: formatNumber(timeLeft.minutes),
    },
    {
      label: "Seconds",
      value: timeLeft.seconds,
      displayValue: formatNumber(timeLeft.seconds),
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
                  <span
                    key={`${item.label}-${item.value}`}
                    className={styles.countdownValue}
                  >
                    {item.displayValue}
                  </span>
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

        <p className={styles.countdownDateText}>
          05 September 2026 · From 06.30 PM onwards
        </p>
      </div>
    </section>
  );
}