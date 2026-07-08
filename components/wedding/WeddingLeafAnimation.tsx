"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Leaf {
  id: number;
  left: string;
  animationDuration: string;
  animationDelay: string;
  size: number;
  rotation: number;
}

// Fixed values — no Math.random() on server
const LEAF_DATA: Leaf[] = [
  { id: 0,  left: "5%",   animationDuration: "8s",  animationDelay: "0s",   size: 24, rotation: 45  },
  { id: 1,  left: "15%",  animationDuration: "10s", animationDelay: "2s",   size: 28, rotation: 120 },
  { id: 2,  left: "25%",  animationDuration: "7s",  animationDelay: "4s",   size: 20, rotation: 200 },
  { id: 3,  left: "35%",  animationDuration: "9s",  animationDelay: "1s",   size: 32, rotation: 90  },
  { id: 4,  left: "45%",  animationDuration: "11s", animationDelay: "3s",   size: 22, rotation: 270 },
  { id: 5,  left: "55%",  animationDuration: "8s",  animationDelay: "5s",   size: 26, rotation: 150 },
  { id: 6,  left: "65%",  animationDuration: "10s", animationDelay: "0.5s", size: 30, rotation: 320 },
  { id: 7,  left: "75%",  animationDuration: "7s",  animationDelay: "2.5s", size: 24, rotation: 60  },
  { id: 8,  left: "85%",  animationDuration: "9s",  animationDelay: "4.5s", size: 28, rotation: 180 },
  { id: 9,  left: "10%",  animationDuration: "11s", animationDelay: "1.5s", size: 20, rotation: 240 },
  { id: 10, left: "50%",  animationDuration: "8s",  animationDelay: "6s",   size: 34, rotation: 30  },
  { id: 11, left: "90%",  animationDuration: "10s", animationDelay: "3.5s", size: 22, rotation: 300 },
];

export default function WeddingLeafAnimation() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render on server — only after client mounts
  if (!mounted) return null;

  return (
    <>
      <style>{`
        @keyframes leafFall {
          0%   { transform: translateY(-60px) rotate(0deg); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes leafSway {
          0%   { margin-left: 0px; }
          25%  { margin-left: 20px; }
          50%  { margin-left: -20px; }
          75%  { margin-left: 15px; }
          100% { margin-left: 0px; }
        }
        .leaf {
          position: fixed;
          top: -60px;
          z-index: 50;
          pointer-events: none;
          animation: leafFall linear infinite, leafSway ease-in-out infinite;
        }
      `}</style>

      {LEAF_DATA.map((leaf) => (
        <div
          key={leaf.id}
          className="leaf"
          style={{
            left: leaf.left,
            animationDuration: `${leaf.animationDuration}, ${parseFloat(leaf.animationDuration) * 0.6}s`,
            animationDelay: `${leaf.animationDelay}, ${leaf.animationDelay}`,
          }}
        >
          <Image
            src="/wedding/your-new-image.png"
            alt=""
            width={leaf.size}
            height={leaf.size}
            style={{
              transform: `rotate(${leaf.rotation}deg)`,
              opacity: 0.7,
            }}
          />
        </div>
      ))}
    </>
  );
}