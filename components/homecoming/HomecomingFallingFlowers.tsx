import type { CSSProperties } from "react";
import styles from "@/app/homecoming/homecoming.module.css";

type FlowerStyle = CSSProperties & {
  "--fall-left": string;
  "--fall-size": string;
  "--fall-duration": string;
  "--fall-delay": string;
  "--fall-opacity": string;
  "--fall-sway": string;
  "--fall-rotate": string;
};

const flowers = [
  {
    left: "7%",
    size: "31px",
    duration: "16s",
    delay: "-3s",
    opacity: "0.46",
    sway: "34px",
    rotate: "120deg",
  },
  {
    left: "16%",
    size: "23px",
    duration: "17s",
    delay: "-1s",
    opacity: "0.38",
    sway: "-26px",
    rotate: "-85deg",
  },
  {
    left: "22%",
    size: "25px",
    duration: "16.5s",
    delay: "1s",
    opacity: "0.4",
    sway: "-30px",
    rotate: "-95deg",
  },
  {
    left: "31%",
    size: "29px",
    duration: "15.5s",
    delay: "2.2s",
    opacity: "0.44",
    sway: "32px",
    rotate: "110deg",
  },
  {
    left: "39%",
    size: "35px",
    duration: "17s",
    delay: "-5s",
    opacity: "0.46",
    sway: "40px",
    rotate: "150deg",
  },
  {
    left: "48%",
    size: "24px",
    duration: "18s",
    delay: "0.5s",
    opacity: "0.38",
    sway: "-28px",
    rotate: "-105deg",
  },
  {
    left: "57%",
    size: "27px",
    duration: "16.8s",
    delay: "2.8s",
    opacity: "0.4",
    sway: "-34px",
    rotate: "-120deg",
  },
  {
    left: "66%",
    size: "30px",
    duration: "16s",
    delay: "-2s",
    opacity: "0.44",
    sway: "36px",
    rotate: "125deg",
  },
  {
    left: "74%",
    size: "33px",
    duration: "15.5s",
    delay: "1.8s",
    opacity: "0.46",
    sway: "38px",
    rotate: "135deg",
  },
  {
    left: "82%",
    size: "22px",
    duration: "18s",
    delay: "3.5s",
    opacity: "0.36",
    sway: "-24px",
    rotate: "-80deg",
  },
  {
    left: "91%",
    size: "26px",
    duration: "17s",
    delay: "-4s",
    opacity: "0.4",
    sway: "-28px",
    rotate: "-90deg",
  },
  {
    left: "96%",
    size: "28px",
    duration: "16.5s",
    delay: "4.5s",
    opacity: "0.41",
    sway: "30px",
    rotate: "100deg",
  },
];

export default function HomecomingFallingFlowers() {
  return (
    <div className={styles.fallingFlowersLayer} aria-hidden="true">
      {flowers.map((flower, index) => (
        <span
          key={`${flower.left}-${index}`}
          className={styles.fallingFlower}
          style={
            {
              "--fall-left": flower.left,
              "--fall-size": flower.size,
              "--fall-duration": flower.duration,
              "--fall-delay": flower.delay,
              "--fall-opacity": flower.opacity,
              "--fall-sway": flower.sway,
              "--fall-rotate": flower.rotate,
            } as FlowerStyle
          }
        />
      ))}
    </div>
  );
}