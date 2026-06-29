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

export default function WeddingLeafAnimation() {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    const generated: Leaf[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${6 + Math.random() * 6}s`,   // 6s–12s fall speed
      animationDelay: `${Math.random() * 8}s`,           // staggered start
      size: 20 + Math.random() * 20,                     // 20px–40px
      rotation: Math.random() * 360,                     // random rotation
    }));
    setLeaves(generated);
  }, []);

  return (
    <>
      <style>{`
        @keyframes leafFall {
          0% {
            transform: translateY(-60px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
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

      {leaves.map((leaf) => (
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
            src="/wedding/gold-leaf.png"
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