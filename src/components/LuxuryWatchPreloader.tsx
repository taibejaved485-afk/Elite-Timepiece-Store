import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LuxuryWatchPreloaderProps {
  onComplete?: () => void;
  minDuration?: number; // 1600ms optimized speed
}

export const LuxuryWatchPreloader: React.FC<LuxuryWatchPreloaderProps> = ({
  onComplete,
  minDuration = 1600,
}) => {
  const [progress, setProgress] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const intervalTime = 20; // 50 fps smooth progression

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(Math.round((elapsed / minDuration) * 100), 100);

      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsFinishing(true);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 350);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [minDuration, onComplete]);

  // Bezel progress ring calculation (radius = 120)
  const bezelRadius = 120;
  const circumference = 2 * Math.PI * bezelRadius;
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  // Watch hands rotation calculations
  const minuteHandRotation = (progress / 100) * 540 + 45;
  const hourHandRotation = (progress / 100) * 280;
  const secondsHandRotation = (progress / 100) * 1080;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#030407] text-white select-none overflow-hidden cursor-pointer"
      onClick={() => {
        setProgress(100);
        setIsFinishing(true);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 150);
      }}
    >
      {/* Radiant ambient gold radial lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12)_0%,rgba(3,4,7,0.92)_65%,#030407_100%)] pointer-events-none" />

      {/* Floating golden sparkle particles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C5A059]/15 rounded-full blur-[110px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Center Watch Assembly Container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* The Exquisite SVG Mechanical Timepiece */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: isFinishing ? 1.04 : 1, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-72 h-80 sm:w-88 sm:h-96 drop-shadow-[0_30px_60px_rgba(0,0,0,0.98)]"
        >
          <svg
            viewBox="0 0 360 400"
            className="w-full h-full overflow-visible"
            aria-label="Aurelia Haute Horlogerie Watch Preloader"
          >
            <defs>
              {/* Premium Multi-Stop Gold Gradients */}
              <linearGradient id="gold-shimmer" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF4D8" />
                <stop offset="20%" stopColor="#E2C775" />
                <stop offset="45%" stopColor="#C5A059" />
                <stop offset="70%" stopColor="#8A6724" />
                <stop offset="100%" stopColor="#D4AF37" />
              </linearGradient>

              <radialGradient id="dial-gradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0E121D" />
                <stop offset="70%" stopColor="#07090F" />
                <stop offset="100%" stopColor="#020305" />
              </radialGradient>

              <linearGradient id="hand-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="40%" stopColor="#F5E4B8" />
                <stop offset="80%" stopColor="#C5A059" />
                <stop offset="100%" stopColor="#684E1A" />
              </linearGradient>

              <linearGradient id="strap-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#08090D" />
                <stop offset="50%" stopColor="#151821" />
                <stop offset="100%" stopColor="#08090D" />
              </linearGradient>

              <radialGradient id="sapphire-reflection" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
                <stop offset="40%" stopColor="rgba(255,255,255,0.05)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>

              <filter id="glow-effect" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* --- TOP ALLIGATOR LEATHER STRAP --- */}
            <path
              d="M 132 10 L 134 92 L 226 92 L 228 10 Z"
              fill="url(#strap-gradient)"
              stroke="#040507"
              strokeWidth="2"
            />
            <line x1="139" y1="14" x2="141" y2="88" stroke="#C5A059" strokeWidth="1.2" strokeDasharray="3 4" opacity="0.7" />
            <line x1="221" y1="14" x2="219" y2="88" stroke="#C5A059" strokeWidth="1.2" strokeDasharray="3 4" opacity="0.7" />

            {/* --- BOTTOM ALLIGATOR LEATHER STRAP --- */}
            <path
              d="M 134 308 L 132 390 L 228 390 L 226 308 Z"
              fill="url(#strap-gradient)"
              stroke="#040507"
              strokeWidth="2"
            />
            <line x1="141" y1="312" x2="139" y2="386" stroke="#C5A059" strokeWidth="1.2" strokeDasharray="3 4" opacity="0.7" />
            <line x1="219" y1="312" x2="221" y2="386" stroke="#C5A059" strokeWidth="1.2" strokeDasharray="3 4" opacity="0.7" />

            {/* --- 4 SCULPTED GOLD LUGS --- */}
            <path d="M 132 90 C 110 94, 96 116, 92 142 L 110 145 C 114 125, 122 104, 138 96 Z" fill="url(#gold-shimmer)" stroke="#684E1A" strokeWidth="1" />
            <path d="M 228 90 C 250 94, 264 116, 268 142 L 250 145 C 246 125, 238 104, 222 96 Z" fill="url(#gold-shimmer)" stroke="#684E1A" strokeWidth="1" />
            <path d="M 132 310 C 110 306, 96 284, 92 258 L 110 255 C 114 275, 122 296, 138 304 Z" fill="url(#gold-shimmer)" stroke="#684E1A" strokeWidth="1" />
            <path d="M 228 310 C 250 306, 264 284, 268 258 L 250 255 C 246 275, 238 296, 222 304 Z" fill="url(#gold-shimmer)" stroke="#684E1A" strokeWidth="1" />

            {/* --- FLUTED CROWN WITH SAPPHIRE GEM --- */}
            <g transform="translate(298, 190)">
              <rect x="0" y="2" width="16" height="32" rx="5" fill="url(#gold-shimmer)" stroke="#684E1A" strokeWidth="1" />
              <line x1="4" y1="3" x2="4" y2="33" stroke="#684E1A" strokeWidth="1.5" />
              <line x1="8" y1="3" x2="8" y2="33" stroke="#684E1A" strokeWidth="1.5" />
              <line x1="12" y1="3" x2="12" y2="33" stroke="#684E1A" strokeWidth="1.5" />
              <circle cx="16" cy="18" r="5" fill="#0C1527" stroke="#C5A059" strokeWidth="1" />
              <circle cx="15.5" cy="17" r="2" fill="#5C82C1" opacity="0.9" />
            </g>

            {/* --- OUTER GOLD CASE & COIN-EDGE BEZEL --- */}
            <circle cx="180" cy="200" r="124" fill="none" stroke="#000" strokeWidth="10" opacity="0.7" />
            <circle cx="180" cy="200" r="122" fill="#080B12" stroke="url(#gold-shimmer)" strokeWidth="6" />

            {/* Coin Edge Notches (60) */}
            {Array.from({ length: 60 }).map((_, i) => {
              const angle = (i * 360) / 60;
              const rad = (angle * Math.PI) / 180;
              const x1 = 180 + Math.cos(rad) * 117;
              const y1 = 200 + Math.sin(rad) * 117;
              const x2 = 180 + Math.cos(rad) * 120;
              const y2 = 200 + Math.sin(rad) * 120;
              return (
                <line
                  key={`coin-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#684E1A"
                  strokeWidth="0.9"
                  opacity={i % 5 === 0 ? 0.95 : 0.45}
                />
              );
            })}

            {/* Inner Rehaut Ring */}
            <circle cx="180" cy="200" r="106" fill="none" stroke="url(#gold-shimmer)" strokeWidth="1.8" />

            {/* --- DIAL FACE --- */}
            <circle cx="180" cy="200" r="104" fill="url(#dial-gradient)" />

            {/* Guilloché Sunburst Patterns */}
            <circle cx="180" cy="200" r="92" fill="none" stroke="#C5A059" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
            <circle cx="180" cy="200" r="78" fill="none" stroke="#C5A059" strokeWidth="0.4" opacity="0.25" />
            <circle cx="180" cy="200" r="62" fill="none" stroke="#C5A059" strokeWidth="0.3" strokeDasharray="2 2" opacity="0.2" />

            {/* 60 Minute Track with 12 Gold Hour Markers */}
            {Array.from({ length: 60 }).map((_, i) => {
              const isHour = i % 5 === 0;
              const angle = (i * 360) / 60 - 90;
              const rad = (angle * Math.PI) / 180;
              const rInner = isHour ? 90 : 96;
              const rOuter = 100;
              const x1 = 180 + Math.cos(rad) * rInner;
              const y1 = 200 + Math.sin(rad) * rInner;
              const x2 = 180 + Math.cos(rad) * rOuter;
              const y2 = 200 + Math.sin(rad) * rOuter;

              return (
                <line
                  key={`track-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isHour ? '#FFF4D8' : '#8A6724'}
                  strokeWidth={isHour ? 2.5 : 0.9}
                  strokeLinecap="round"
                  opacity={isHour ? 0.95 : 0.5}
                />
              );
            })}

            {/* Roman Numerals */}
            <text x="180" y="126" textAnchor="middle" fill="#FFF4D8" fontSize="13" fontFamily="Cinzel, serif" fontWeight="bold" letterSpacing="1">
              XII
            </text>
            <text x="256" y="205" textAnchor="middle" fill="#FFF4D8" fontSize="12" fontFamily="Cinzel, serif" fontWeight="bold">
              III
            </text>
            <text x="104" y="205" textAnchor="middle" fill="#FFF4D8" fontSize="12" fontFamily="Cinzel, serif" fontWeight="bold">
              IX
            </text>

            {/* Brand Typography */}
            <text x="180" y="150" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontFamily="Cinzel, serif" fontWeight="bold" letterSpacing="3.5">
              AURELIA
            </text>
            <text x="180" y="160" textAnchor="middle" fill="#C5A059" fontSize="5.5" fontFamily="monospace" letterSpacing="2" opacity="0.9">
              HAUTE HORLOGERIE
            </text>

            {/* --- OPEN-HEART TOURBILLON AT 6 O'CLOCK --- */}
            <g transform="translate(180, 252)">
              <circle cx="0" cy="0" r="25" fill="#04060A" stroke="url(#gold-shimmer)" strokeWidth="2" />
              <circle cx="0" cy="0" r="21" fill="#070A12" stroke="#8A6724" strokeWidth="0.8" strokeDasharray="2 2" />

              {/* Fast Oscillating Balance Wheel */}
              <motion.g
                animate={{ rotate: [-40, 40, -40] }}
                transition={{ repeat: Infinity, duration: 0.22, ease: 'easeInOut' }}
              >
                <circle cx="0" cy="0" r="17" fill="none" stroke="#FFF4D8" strokeWidth="1.5" />
                <line x1="0" y1="-17" x2="0" y2="17" stroke="#C5A059" strokeWidth="1.3" />
                <line x1="-15" y1="8.5" x2="15" y2="-8.5" stroke="#C5A059" strokeWidth="1.3" />
                <line x1="-15" y1="-8.5" x2="15" y2="8.5" stroke="#C5A059" strokeWidth="1.3" />
                <circle cx="0" cy="-17" r="1.1" fill="#FFFFFF" />
                <circle cx="0" cy="17" r="1.1" fill="#FFFFFF" />
                <circle cx="17" cy="0" r="1.1" fill="#FFFFFF" />
                <circle cx="-17" cy="0" r="1.1" fill="#FFFFFF" />
              </motion.g>

              {/* Synthetic Ruby Jewel */}
              <circle cx="0" cy="0" r="3.5" fill="#E0115F" stroke="#FFFFFF" strokeWidth="0.7" />
              <circle cx="-1" cy="-1" r="1" fill="#FFA5C7" />

              {/* Bridge */}
              <path d="M -25 0 L -7 0 M 7 0 L 25 0" stroke="url(#gold-shimmer)" strokeWidth="1.8" strokeLinecap="round" />
            </g>

            {/* Swiss Made Note */}
            <text x="180" y="292" textAnchor="middle" fill="#8A6724" fontSize="4.5" fontFamily="monospace" letterSpacing="1.2">
              SWISS · 1892 · MANUFACTURE
            </text>

            {/* --- WATCH HANDS --- */}
            {/* Hour Hand */}
            <g transform={`rotate(${hourHandRotation}, 180, 200)`}>
              <path
                d="M 180 208 L 176.5 200 L 178.5 150 L 180 142 L 181.5 150 L 183.5 200 Z"
                fill="url(#hand-gold)"
                stroke="#684E1A"
                strokeWidth="0.8"
                filter="drop-shadow(0px 3px 6px rgba(0,0,0,0.8))"
              />
              <circle cx="180" cy="156" r="3.8" fill="#0A0D14" stroke="#FFF4D8" strokeWidth="1" />
            </g>

            {/* Minute Hand */}
            <g transform={`rotate(${minuteHandRotation}, 180, 200)`}>
              <path
                d="M 180 210 L 176.5 200 L 178.5 124 L 180 114 L 181.5 124 L 183.5 200 Z"
                fill="url(#hand-gold)"
                stroke="#684E1A"
                strokeWidth="0.8"
                filter="drop-shadow(0px 4px 8px rgba(0,0,0,0.9))"
              />
              <circle cx="180" cy="132" r="3.2" fill="#0A0D14" stroke="#FFF4D8" strokeWidth="0.9" />
            </g>

            {/* Seconds Hand */}
            <g transform={`rotate(${secondsHandRotation}, 180, 200)`}>
              <line x1="180" y1="226" x2="180" y2="102" stroke="#FFF4D8" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="180" cy="216" r="4.8" fill="none" stroke="#FFF4D8" strokeWidth="1.3" />
              <polygon points="180,98 178,106 182,106" fill="#E0115F" />
            </g>

            {/* Central Cannon Pinion */}
            <circle cx="180" cy="200" r="6" fill="url(#gold-shimmer)" stroke="#4A350E" strokeWidth="1" />
            <circle cx="180" cy="200" r="2.2" fill="#FFFFFF" opacity="0.85" />

            {/* --- SAPPHIRE CRYSTAL REFLECTION --- */}
            <rect
              x="50"
              y="70"
              width="260"
              height="260"
              rx="130"
              fill="url(#sapphire-reflection)"
              pointerEvents="none"
              className="mix-blend-overlay"
            />

            {/* --- GOLD PROGRESS BEZEL RING (0-100%) --- */}
            <circle
              cx="180"
              cy="200"
              r={bezelRadius}
              fill="none"
              stroke="#D4AF37"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 180 200)"
              filter="url(#glow-effect)"
              className="transition-all duration-75"
            />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
};
