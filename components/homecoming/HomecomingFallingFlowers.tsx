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
    size: "30px",
    duration: "32s",
    delay: "0s",
    opacity: "0.34",
    sway: "34px",
    rotate: "120deg",
  },
  {
    left: "22%",
    size: "24px",
    duration: "37s",
    delay: "8s",
    opacity: "0.28",
    sway: "-30px",
    rotate: "-95deg",
  },
  {
    left: "39%",
    size: "34px",
    duration: "35s",
    delay: "16s",
    opacity: "0.32",
    sway: "40px",
    rotate: "150deg",
  },
  {
    left: "57%",
    size: "26px",
    duration: "39s",
    delay: "5s",
    opacity: "0.29",
    sway: "-34px",
    rotate: "-120deg",
  },
  {
    left: "74%",
    size: "32px",
    duration: "34s",
    delay: "13s",
    opacity: "0.33",
    sway: "38px",
    rotate: "135deg",
  },
  {
    left: "91%",
    size: "25px",
    duration: "38s",
    delay: "22s",
    opacity: "0.28",
    sway: "-28px",
    rotate: "-90deg",
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