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
    duration: "24s",
    delay: "0s",
    opacity: "0.52",
    sway: "34px",
    rotate: "120deg",
  },
  {
    left: "22%",
    size: "25px",
    duration: "27s",
    delay: "6s",
    opacity: "0.44",
    sway: "-30px",
    rotate: "-95deg",
  },
  {
    left: "39%",
    size: "35px",
    duration: "26s",
    delay: "12s",
    opacity: "0.5",
    sway: "40px",
    rotate: "150deg",
  },
  {
    left: "57%",
    size: "27px",
    duration: "28s",
    delay: "4s",
    opacity: "0.45",
    sway: "-34px",
    rotate: "-120deg",
  },
  {
    left: "74%",
    size: "33px",
    duration: "25s",
    delay: "10s",
    opacity: "0.52",
    sway: "38px",
    rotate: "135deg",
  },
  {
    left: "91%",
    size: "26px",
    duration: "29s",
    delay: "17s",
    opacity: "0.44",
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