"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/app/wedding/wedding.module.css";

const SONG_SRC = "/wedding/wedding-music.mp3";

export default function WeddingMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const userStoppedRef = useRef(false);

  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(SONG_SRC);

    audio.loop = true;
    audio.volume = 0.5;
    audio.muted = false;
    audio.preload = "auto";

    audioRef.current = audio;

    async function tryPlayAudio() {
      if (userStoppedRef.current) {
        return;
      }

      try {
        audio.muted = false;
        audio.volume = 0.5;

        await audio.play();

        setIsMuted(false);
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    }

    void tryPlayAudio();

    function unlockAudio(event: Event) {
      const target = event.target;

      if (
        event.type !== "scroll" &&
        target instanceof Node &&
        buttonRef.current?.contains(target)
      ) {
        return;
      }

      void tryPlayAudio();
    }

    window.addEventListener("pointerdown", unlockAudio, { once: true });
    window.addEventListener("touchstart", unlockAudio, { once: true });
    window.addEventListener("keydown", unlockAudio, { once: true });
    window.addEventListener("scroll", unlockAudio, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("scroll", unlockAudio);

      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  async function toggleMute() {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (isPlaying && !isMuted) {
      userStoppedRef.current = true;
      audio.pause();
      audio.muted = true;
      setIsMuted(true);
      setIsPlaying(false);
      return;
    }

    try {
      userStoppedRef.current = false;
      audio.muted = false;
      audio.volume = 0.5;

      await audio.play();

      setIsMuted(false);
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
      setIsMuted(true);
    }
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={toggleMute}
      className={styles.musicBtn}
      title={isPlaying && !isMuted ? "Mute music" : "Play music"}
      aria-label={isPlaying && !isMuted ? "Mute music" : "Play music"}
    >
      {isPlaying && !isMuted ? (
        <span className={styles.musicBars} aria-hidden="true">
          <span className={styles.musicBar} />
          <span className={styles.musicBar} />
          <span className={styles.musicBar} />
          <span className={styles.musicBar} />
        </span>
      ) : (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </button>
  );
}