// components/wedding/WeddingHero.tsx
import Image from "next/image";
import styles from "@/app/wedding/wedding.module.css";

export default function WeddingHero() {
  return (
    <section className={styles.heroSection}>



      {/* Left Floral */}
      <div className={styles.floralLeft}>
        <Image
          src="/wedding/floral-lotus.png"
          alt=""
          width={443}
          height={443}
          style={{ objectFit: "contain" }}
        />
      </div>

      {/* Right Floral */}
      <div className={styles.floralRight}>
        <Image
          src="/wedding/floral-lotus.png"
          alt=""
          width={443}
          height={443}
          style={{ objectFit: "contain" }}
        />
      </div>

      {/* Main Content */}
      <div className={styles.heroContent}>

        {/* TOP — Together with their families */}
        <div className={styles.heroTop}>
          <p className="tracking-[0.3em] text-[#b8912a] text-xs uppercase font-bold">
            Together with their families
          </p>
        </div>

        {/* MIDDLE — Floral Ring */}
        <div className={styles.heroMiddle}>
          <div className="relative flex items-center justify-center">
            <Image
              src="/wedding/hero-floral-ring.png"
              alt="Floral ring"
              width={300}
              height={345}
              className={styles.floralRing}
              style={{ objectFit: "contain" }}
            />
            <div className={`absolute flex flex-col items-center justify-center ${styles.coupleFont}`}>
              <span className="text-[#3b2a1a]" style={{ fontSize: "clamp(1.6rem, 4vw, 2.5rem)" }}>
                Lalisha
              </span>
              <span className="text-[#b8912a] font-sans font-light" style={{ fontSize: "clamp(1rem, 2.5vw, 1.5rem)" }}>
                &amp;
              </span>
              <span className="text-[#3b2a1a]" style={{ fontSize: "clamp(1.6rem, 4vw, 2.5rem)" }}>
                Rahal
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM — Invitation text + date */}
        <div className={styles.heroBottom}>
          <p className="text-[#5c4a3a] text-sm tracking-wide font-light max-w-sm text-center mb-3">
            request the honour of your presence at the celebration of their marriage
          </p>

          <p className="tracking-[0.4em] text-[#3b2a1a] text-sm uppercase font-semibold mb-3">
            August
          </p>

          <div className="flex items-center gap-4 mb-2">
            <div className="flex flex-col items-center">
              <div className="w-16 h-1 bg-[#b8912a] mb-1" />
              <p className="text-[#3b2a1a] text-xs tracking-widest uppercase">Friday</p>
              <div className="w-16 h-1 bg-[#b8912a] mt-1" />
            </div>

            <p className="text-[#3b2a1a] font-semibold" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)" }}>
              28
            </p>

            <div className="flex flex-col items-center">
              <div className="w-16 h-1 bg-[#b8912a] mb-1" />
              <p className="text-[#3b2a1a] text-xs tracking-widest uppercase">AT 9:30 AM</p>
              <div className="w-16 h-1 bg-[#b8912a] mt-1" />
            </div>
          </div>

          <p className="tracking-[0.3em] text-[#3b2a1a] text-sm">2026</p>
        </div>

      </div>
    </section>
  );
}