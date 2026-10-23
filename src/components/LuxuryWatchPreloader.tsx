import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface LuxuryWatchPreloaderProps {
  onComplete?: () => void;
  minDuration?: number; // 2000ms (2 seconds) smooth mechanical winding
}

export const LuxuryWatchPreloader: React.FC<LuxuryWatchPreloaderProps> = ({
  onComplete,
  minDuration = 2000,
}) => {
  const [progress, setProgress] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const startTime = performance.now();

    const updateFrame = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min((elapsed / minDuration) * 100, 100);
      
      // Luxurious ease-out mechanical winding curve
      const easedProgress = Math.min(Math.round(rawProgress), 100);
      setProgress(easedProgress);

      if (rawProgress < 100) {
        animFrameRef.current = requestAnimationFrame(updateFrame);
      } else {
        setIsFinishing(true);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 380);
      }
    };

    animFrameRef.current = requestAnimationFrame(updateFrame);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [minDuration, onComplete]);

  // Outer chronometer bezel progress ring calculations (radius = 124)
  const bezelRadius = 124;
  const circumference = 2 * Math.PI * bezelRadius;
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  // Mechanical watch hand rotations as the mainspring winds up
  const hourHandRotation = 30 + (progress / 100) * 330;
  const minuteHandRotation = 45 + (progress / 100) * 720;
  const secondsHandRotation = (progress / 100) * 1440;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(10px)' }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#020306] text-white select-none overflow-hidden cursor-pointer"
      onClick={() => {
        setProgress(100);
        setIsFinishing(true);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 120);
      }}
      title="Click anywhere to enter Atelier immediately"
    >
      {/* Ambient Velvet Lighting & Radial Warm Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.14)_0%,rgba(6,8,14,0.85)_55%,#020306_100%)] pointer-events-none" />
      
      {/* Soft golden optical atmosphere */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-[#C5A059]/10 blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute w-[280px] h-[280px] rounded-full bg-[#E2C775]/12 blur-[90px] pointer-events-none" />

      {/* Centerpiece: The High Horology Masterpiece Timepiece */}
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 15 }}
        animate={{ 
          scale: isFinishing ? 1.05 : 1, 
          opacity: 1, 
          y: 0 
        }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-72 h-84 sm:w-96 sm:h-110 drop-shadow-[0_35px_70px_rgba(0,0,0,0.98)]"
      >
        <svg
          viewBox="0 0 360 420"
          className="w-full h-full overflow-visible"
          aria-label="Aurelia Haute Horlogerie Grand Complication Timepiece"
        >
          <defs>
            {/* 18k Multi-Stop Swiss Gold Gradients */}
            <linearGradient id="gold-primary" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF9E6" />
              <stop offset="25%" stopColor="#E5C778" />
              <stop offset="50%" stopColor="#C5A059" />
              <stop offset="75%" stopColor="#8A6724" />
              <stop offset="100%" stopColor="#DFBF6D" />
            </linearGradient>

            <linearGradient id="gold-bevel" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#ECCF88" />
              <stop offset="70%" stopColor="#7E5C1B" />
              <stop offset="100%" stopColor="#C5A059" />
            </linearGradient>

            <linearGradient id="gold-dark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8A6724" />
              <stop offset="50%" stopColor="#573F10" />
              <stop offset="100%" stopColor="#2D1F05" />
            </linearGradient>

            {/* Deep Obsidian Sunray Dial Gradient */}
            <radialGradient id="dial-deep" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0F1422" />
              <stop offset="60%" stopColor="#080A11" />
              <stop offset="100%" stopColor="#020306" />
            </radialGradient>

            {/* Faceted 3D Hands Gradients */}
            <linearGradient id="hand-light" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#F7E6BD" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>

            <linearGradient id="hand-dark" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C5A059" />
              <stop offset="50%" stopColor="#7A5817" />
              <stop offset="100%" stopColor="#4A3408" />
            </linearGradient>

            {/* Flame-Blued Steel Gradient */}
            <linearGradient id="blued-steel" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4886E8" />
              <stop offset="50%" stopColor="#1E4799" />
              <stop offset="100%" stopColor="#0D2459" />
            </linearGradient>

            {/* Hand-Rolled Black Alligator Strap */}
            <linearGradient id="strap-matte" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#07080B" />
              <stop offset="20%" stopColor="#12151D" />
              <stop offset="50%" stopColor="#1A1E29" />
              <stop offset="80%" stopColor="#12151D" />
              <stop offset="100%" stopColor="#07080B" />
            </linearGradient>

            {/* Double Anti-Reflective Curved Sapphire Reflection */}
            <linearGradient id="sapphire-reflection" x1="15%" y1="0%" x2="85%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
              <stop offset="25%" stopColor="rgba(255,255,255,0.08)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0)" />
              <stop offset="75%" stopColor="rgba(255,255,255,0.04)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.18)" />
            </linearGradient>

            {/* Horological Glow Filter */}
            <filter id="watch-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Subtle Drop Shadow */}
            <filter id="hand-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="1" dy="4" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.85" />
            </filter>
          </defs>

          {/* ============================================================== */}
          {/* 1. HAND-STITCHED ALLIGATOR LEATHER STRAP (TOP & BOTTOM)        */}
          {/* ============================================================== */}
          {/* Top Strap with Taper and Scales */}
          <g>
            <path
              d="M 130 15 L 133 100 L 227 100 L 230 15 Z"
              fill="url(#strap-matte)"
              stroke="#040508"
              strokeWidth="1.5"
            />
            {/* Alligator Skin Scale Debossings */}
            <path d="M 136 30 Q 180 34 224 30" stroke="#0B0D13" strokeWidth="1.2" fill="none" opacity="0.8" />
            <path d="M 135 52 Q 180 56 225 52" stroke="#0B0D13" strokeWidth="1.2" fill="none" opacity="0.8" />
            <path d="M 134 74 Q 180 78 226 74" stroke="#0B0D13" strokeWidth="1.2" fill="none" opacity="0.8" />
            
            {/* Hand-Waxed Gold Saddle Stitching */}
            <line x1="137" y1="18" x2="139" y2="96" stroke="#C5A059" strokeWidth="1.2" strokeDasharray="3 3.5" opacity="0.75" />
            <line x1="223" y1="18" x2="221" y2="96" stroke="#C5A059" strokeWidth="1.2" strokeDasharray="3 3.5" opacity="0.75" />
          </g>

          {/* Bottom Strap */}
          <g>
            <path
              d="M 133 320 L 130 405 L 230 405 L 227 320 Z"
              fill="url(#strap-matte)"
              stroke="#040508"
              strokeWidth="1.5"
            />
            <path d="M 134 344 Q 180 340 226 344" stroke="#0B0D13" strokeWidth="1.2" fill="none" opacity="0.8" />
            <path d="M 133 366 Q 180 362 227 366" stroke="#0B0D13" strokeWidth="1.2" fill="none" opacity="0.8" />
            <path d="M 132 388 Q 180 384 228 388" stroke="#0B0D13" strokeWidth="1.2" fill="none" opacity="0.8" />
            
            <line x1="139" y1="324" x2="137" y2="402" stroke="#C5A059" strokeWidth="1.2" strokeDasharray="3 3.5" opacity="0.75" />
            <line x1="221" y1="324" x2="223" y2="402" stroke="#C5A059" strokeWidth="1.2" strokeDasharray="3 3.5" opacity="0.75" />
          </g>

          {/* ============================================================== */}
          {/* 2. SOLID 18K ROSE GOLD LUGS WITH POLISHED ANGLAGE BEVELS       */}
          {/* ============================================================== */}
          <g>
            {/* Top-Left Lug */}
            <path
              d="M 130 98 C 108 102, 92 124, 88 152 L 108 155 C 112 133, 122 112, 136 104 Z"
              fill="url(#gold-primary)"
              stroke="#684E1A"
              strokeWidth="1"
            />
            <path d="M 130 98 L 88 152" stroke="#FFF9E6" strokeWidth="1.2" opacity="0.85" />

            {/* Top-Right Lug */}
            <path
              d="M 230 98 C 252 102, 268 124, 272 152 L 252 155 C 248 133, 238 112, 224 104 Z"
              fill="url(#gold-primary)"
              stroke="#684E1A"
              strokeWidth="1"
            />
            <path d="M 230 98 L 272 152" stroke="#FFF9E6" strokeWidth="1.2" opacity="0.85" />

            {/* Bottom-Left Lug */}
            <path
              d="M 130 322 C 108 318, 92 296, 88 268 L 108 265 C 112 287, 122 308, 136 316 Z"
              fill="url(#gold-primary)"
              stroke="#684E1A"
              strokeWidth="1"
            />
            <path d="M 130 322 L 88 268" stroke="#684E1A" strokeWidth="1.2" opacity="0.85" />

            {/* Bottom-Right Lug */}
            <path
              d="M 230 322 C 252 318, 268 296, 272 268 L 252 265 C 248 287, 238 308, 224 316 Z"
              fill="url(#gold-primary)"
              stroke="#684E1A"
              strokeWidth="1"
            />
            <path d="M 230 322 L 272 268" stroke="#684E1A" strokeWidth="1.2" opacity="0.85" />
          </g>

          {/* ============================================================== */}
          {/* 3. FLUTED WINDING CROWN WITH NATURAL CABOCHON SAPPHIRE GEM     */}
          {/* ============================================================== */}
          <g transform="translate(303, 192)">
            {/* Crown Base & Flutes */}
            <rect x="0" y="3" width="16" height="30" rx="4" fill="url(#gold-bevel)" stroke="#684E1A" strokeWidth="1" />
            <line x1="4" y1="4" x2="4" y2="32" stroke="#684E1A" strokeWidth="1.4" />
            <line x1="8" y1="4" x2="8" y2="32" stroke="#684E1A" strokeWidth="1.4" />
            <line x1="12" y1="4" x2="12" y2="32" stroke="#684E1A" strokeWidth="1.4" />
            {/* Cabochon Sapphire Gem on Tip */}
            <circle cx="16" cy="18" r="5" fill="#0A1428" stroke="#C5A059" strokeWidth="0.9" />
            <circle cx="15.5" cy="17" r="2.2" fill="#4B77C2" opacity="0.95" />
          </g>

          {/* ============================================================== */}
          {/* 4. SOLID GOLD CASE, FLUTED STEPPED BEZEL & REHAUT RING        */}
          {/* ============================================================== */}
          {/* Outer Case Rim */}
          <circle cx="180" cy="210" r="128" fill="#040508" stroke="#000000" strokeWidth="8" opacity="0.6" />
          <circle cx="180" cy="210" r="126" fill="#070910" stroke="url(#gold-primary)" strokeWidth="5.5" />
          
          {/* Fluted Coin-Edge Ring with 60 Knurls */}
          {Array.from({ length: 60 }).map((_, i) => {
            const angle = (i * 360) / 60;
            const rad = (angle * Math.PI) / 180;
            const x1 = 180 + Math.cos(rad) * 121;
            const y1 = 210 + Math.sin(rad) * 121;
            const x2 = 180 + Math.cos(rad) * 124.5;
            const y2 = 210 + Math.sin(rad) * 124.5;
            return (
              <line
                key={`coin-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={i % 5 === 0 ? '#FFF9E6' : '#684E1A'}
                strokeWidth={i % 5 === 0 ? 1.4 : 0.8}
                opacity={i % 5 === 0 ? 0.95 : 0.45}
              />
            );
          })}

          {/* Inner Bezel Mirror Polished Step */}
          <circle cx="180" cy="210" r="111" fill="none" stroke="url(#gold-bevel)" strokeWidth="2.5" />

          {/* ============================================================== */}
          {/* 5. OBSIDIAN DIAL WITH CONCENTRIC GUILLOCHÉ SUNBURST GRAINING   */}
          {/* ============================================================== */}
          <circle cx="180" cy="210" r="109" fill="url(#dial-deep)" />

          {/* Clous de Paris Guilloché Concentric Geometry */}
          <circle cx="180" cy="210" r="97" fill="none" stroke="#C5A059" strokeWidth="0.45" strokeDasharray="3 3" opacity="0.35" />
          <circle cx="180" cy="210" r="83" fill="none" stroke="#C5A059" strokeWidth="0.4" opacity="0.25" />
          <circle cx="180" cy="210" r="67" fill="none" stroke="#C5A059" strokeWidth="0.35" strokeDasharray="2 3" opacity="0.25" />

          {/* 60-Second Perimeter Railway Track */}
          {Array.from({ length: 60 }).map((_, i) => {
            const isHour = i % 5 === 0;
            const angle = (i * 360) / 60 - 90;
            const rad = (angle * Math.PI) / 180;
            const rInner = isHour ? 95 : 101;
            const rOuter = 105;
            const x1 = 180 + Math.cos(rad) * rInner;
            const y1 = 210 + Math.sin(rad) * rInner;
            const x2 = 180 + Math.cos(rad) * rOuter;
            const y2 = 210 + Math.sin(rad) * rOuter;

            return (
              <line
                key={`track-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isHour ? '#FFF9E6' : '#8A6724'}
                strokeWidth={isHour ? 2.6 : 0.8}
                strokeLinecap="round"
                opacity={isHour ? 0.95 : 0.45}
              />
            );
          })}

          {/* 12 Hand-Applied Faceted 3D Gold Batons */}
          {Array.from({ length: 12 }).map((_, i) => {
            if (i === 6) return null; // Space reserved for Tourbillon at 6 o'clock
            const angle = (i * 360) / 12 - 90;
            const rad = (angle * Math.PI) / 180;
            const cx = 180 + Math.cos(rad) * 91;
            const cy = 210 + Math.sin(rad) * 91;
            const deg = (angle * 180) / Math.PI + 90;

            return (
              <g key={`marker-${i}`} transform={`translate(${cx}, ${cy}) rotate(${deg})`}>
                <rect x="-2" y="-7" width="4" height="14" rx="1" fill="url(#gold-primary)" stroke="#684E1A" strokeWidth="0.6" />
                <rect x="-0.8" y="-5.5" width="1.6" height="11" rx="0.5" fill="#E8F4F8" opacity="0.9" />
              </g>
            );
          })}

          {/* Roman Numerals */}
          <text x="180" y="132" textAnchor="middle" fill="#FFF9E6" fontSize="13.5" fontFamily="Cinzel, serif" fontWeight="bold" letterSpacing="1.2">
            XII
          </text>
          <text x="260" y="215" textAnchor="middle" fill="#FFF9E6" fontSize="12" fontFamily="Cinzel, serif" fontWeight="bold">
            III
          </text>
          <text x="100" y="215" textAnchor="middle" fill="#FFF9E6" fontSize="12" fontFamily="Cinzel, serif" fontWeight="bold">
            IX
          </text>

          {/* Maison Aurelia Brand Typography */}
          <text x="180" y="157" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily="Cinzel, serif" fontWeight="bold" letterSpacing="4">
            AURELIA
          </text>
          <text x="180" y="167" textAnchor="middle" fill="#C5A059" fontSize="5.5" fontFamily="monospace" letterSpacing="2.2" opacity="0.92">
            LE BRASSUS · 1892
          </text>

          {/* ============================================================== */}
          {/* 6. OPEN-HEART 60-SECOND FLYING TOURBILLON AT 6 O'CLOCK         */}
          {/* ============================================================== */}
          <g transform="translate(180, 266)">
            {/* Tourbillon Recessed Well */}
            <circle cx="0" cy="0" r="26.5" fill="#04060B" stroke="url(#gold-primary)" strokeWidth="2.2" />
            <circle cx="0" cy="0" r="23" fill="#080C16" stroke="#684E1A" strokeWidth="0.8" strokeDasharray="2 2" />

            {/* Fast Oscillating Balance Wheel (4 Hz / 28,800 vph) */}
            <motion.g
              animate={{ rotate: [-42, 42, -42] }}
              transition={{ repeat: Infinity, duration: 0.2, ease: 'easeInOut' }}
            >
              <circle cx="0" cy="0" r="18.5" fill="none" stroke="#FFF9E6" strokeWidth="1.6" />
              <line x1="0" y1="-18.5" x2="0" y2="18.5" stroke="#C5A059" strokeWidth="1.4" />
              <line x1="-16" y1="9.25" x2="16" y2="-9.25" stroke="#C5A059" strokeWidth="1.4" />
              <line x1="-16" y1="-9.25" x2="16" y2="9.25" stroke="#C5A059" strokeWidth="1.4" />
              
              {/* Platinum Micro-Inertia Weights on Rim */}
              <circle cx="0" cy="-18.5" r="1.3" fill="#FFFFFF" />
              <circle cx="0" cy="18.5" r="1.3" fill="#FFFFFF" />
              <circle cx="18.5" cy="0" r="1.3" fill="#FFFFFF" />
              <circle cx="-18.5" cy="0" r="1.3" fill="#FFFFFF" />
            </motion.g>

            {/* Synthetic Pigeon-Blood Ruby Pivot Jewel */}
            <circle cx="0" cy="0" r="4.2" fill="#D10043" stroke="#FFFFFF" strokeWidth="0.7" />
            <circle cx="-1.2" cy="-1.2" r="1.2" fill="#FF8CB2" />

            {/* Mirror-Polished Gold Tourbillon Bridge */}
            <path
              d="M -26.5 0 L -7.5 0 M 7.5 0 L 26.5 0"
              stroke="url(#gold-primary)"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </g>

          {/* Swiss Made Micro-Text */}
          <text x="180" y="306" textAnchor="middle" fill="#8A6724" fontSize="4.8" fontFamily="monospace" letterSpacing="1.4">
            SWISS · CHRONOMETER · MADE
          </text>

          {/* ============================================================== */}
          {/* 7. THREE-DIMENSIONAL DAUPHINE HANDS & FLAME-BLUED SECONDS HAND */}
          {/* ============================================================== */}
          {/* Hour Hand (Faceted Dual-Tone Gold) */}
          <g transform={`rotate(${hourHandRotation}, 180, 210)`} filter="url(#hand-shadow)">
            {/* Left Facet (Light Gold) */}
            <path
              d="M 180 219 L 176 210 L 178.5 152 L 180 144 Z"
              fill="url(#hand-light)"
            />
            {/* Right Facet (Shadow Gold) */}
            <path
              d="M 180 219 L 184 210 L 181.5 152 L 180 144 Z"
              fill="url(#hand-dark)"
            />
            <circle cx="180" cy="158" r="3.2" fill="#080A10" stroke="#FFF9E6" strokeWidth="0.8" />
          </g>

          {/* Minute Hand (Faceted Dual-Tone Gold) */}
          <g transform={`rotate(${minuteHandRotation}, 180, 210)`} filter="url(#hand-shadow)">
            {/* Left Facet (Light Gold) */}
            <path
              d="M 180 221 L 176 210 L 178.5 125 L 180 115 Z"
              fill="url(#hand-light)"
            />
            {/* Right Facet (Shadow Gold) */}
            <path
              d="M 180 221 L 184 210 L 181.5 125 L 180 115 Z"
              fill="url(#hand-dark)"
            />
            <circle cx="180" cy="132" r="3" fill="#080A10" stroke="#FFF9E6" strokeWidth="0.8" />
          </g>

          {/* Central Blued-Steel Seconds Hand with Teardrop Counterpoise */}
          <g transform={`rotate(${secondsHandRotation}, 180, 210)`} filter="url(#hand-shadow)">
            <line x1="180" y1="237" x2="180" y2="103" stroke="#D10043" strokeWidth="1.3" strokeLinecap="round" />
            <circle cx="180" cy="226" r="4.8" fill="none" stroke="#D10043" strokeWidth="1.4" />
            <polygon points="180,99 177.5,107 182.5,107" fill="#D10043" />
          </g>

          {/* Center Cannon Pinion Cap with Rose Cut Diamond Highlight */}
          <circle cx="180" cy="210" r="6.2" fill="url(#gold-primary)" stroke="#4A3408" strokeWidth="1.2" />
          <circle cx="180" cy="210" r="2.2" fill="#FFFFFF" opacity="0.9" />

          {/* ============================================================== */}
          {/* 8. SAPPHIRE CRYSTAL SPECULAR GLARE & LIGHT SWEEP               */}
          {/* ============================================================== */}
          <rect
            x="50"
            y="80"
            width="260"
            height="260"
            rx="130"
            fill="url(#sapphire-reflection)"
            pointerEvents="none"
            className="mix-blend-overlay"
          />

          {/* ============================================================== */}
          {/* 9. LUMINESCENT GOLD PROGRESS CHRONOMETER RING (0% -> 100%)    */}
          {/* ============================================================== */}
          <circle
            cx="180"
            cy="210"
            r={bezelRadius}
            fill="none"
            stroke="#E5C778"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 180 210)"
            filter="url(#watch-glow)"
            className="transition-all duration-75"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
};
