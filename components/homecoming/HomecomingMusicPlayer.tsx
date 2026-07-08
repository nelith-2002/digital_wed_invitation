"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/app/homecoming/homecoming.module.css";

const SONG_SRC = "/homecoming/homecoming-song.mp3";

function SpeakerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className={styles.musicSpeakerIcon}
      aria-hidden="true"
    >
      <path
        d="M4.5 9.5V14.5H8.2L13 18.2V5.8L8.2 9.5H4.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HomecomingMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userStoppedRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume = 0.42;
    audio.muted = false;

    async function tryPlayAudio() {
      if (!audio || userStoppedRef.current) {
        return;
      }

      try {
        audio.muted = false;
        audio.volume = 0.42;
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    }

    tryPlayAudio();

    const unlockAudio = () => {
      tryPlayAudio();
    };

    window.addEventListener("pointerdown", unlockAudio, { once: true });
    window.addEventListener("touchstart", unlockAudio, { once: true });
    window.addEventListener("keydown", unlockAudio, { once: true });
    window.addEventListener("scroll", unlockAudio, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("scroll", unlockAudio);
    };
  }, []);

  async function handleToggleMusic() {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (isPlaying) {
      userStoppedRef.current = true;
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      userStoppedRef.current = false;
      audio.muted = false;
      audio.volume = 0.42;
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }

  return (
    <>
      <audio ref={audioRef} src={SONG_SRC} loop preload="auto" autoPlay />

      <button
        type="button"
        className={`${styles.musicToggleButton} ${
          isPlaying ? styles.musicToggleActive : styles.musicToggleMuted
        }`}
        onClick={handleToggleMusic}
        aria-label={isPlaying ? "Stop music" : "Play music"}
        title={isPlaying ? "Stop music" : "Play music"}
      >
        <SpeakerIcon />

        {isPlaying ? (
          <span className={styles.musicEqualizer} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        ) : (
          <span className={styles.musicMutedMark} aria-hidden="true">
            ×
          </span>
        )}
      </button>
    </>
  );
}