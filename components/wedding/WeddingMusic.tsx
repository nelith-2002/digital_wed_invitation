"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/app/wedding/wedding.module.css";

export default function WeddingMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio("/wedding/wedding-music.mp3");
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    // Auto play on load
    const playAudio = () => {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Browser blocked autoplay — user must click first
        setIsPlaying(false);
      });
    };

    playAudio();

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const toggleMute = () => {
    if (!audioRef.current) return;

    if (isMuted) {
      // Unmute — play
      audioRef.current.muted = false;
      audioRef.current.play();
      setIsMuted(false);
      setIsPlaying(true);
    } else {
      // Mute — pause
      audioRef.current.muted = true;
      setIsMuted(true);
      setIsPlaying(false);
    }
  };

  return (
    <button
      onClick={toggleMute}
      className={styles.musicBtn}
      title={isMuted ? "Play music" : "Mute music"}
    >
      {/* Animated music bars — show when playing */}
      {isPlaying && !isMuted ? (
        <span className={styles.musicBars}>
          <span className={styles.musicBar} />
          <span className={styles.musicBar} />
          <span className={styles.musicBar} />
          <span className={styles.musicBar} />
        </span>
      ) : (
        /* Muted icon */
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </button>
  );
}
