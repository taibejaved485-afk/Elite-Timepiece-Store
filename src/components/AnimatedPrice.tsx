import React, { useEffect, useState, useRef } from 'react';
import { CurrencyCode } from '../types/watch';
import { convertPrice, formatConvertedPrice, FormatPriceOptions } from '../utils/currency';

export interface AnimatedPriceProps {
  amountUSD: number;
  currency: CurrencyCode;
  duration?: number; // duration in ms, default 1350ms
  options?: FormatPriceOptions;
  className?: string;
  startOnView?: boolean;
  prefix?: string;
  suffix?: string;
  replayOnHover?: boolean;
}

/**
 * AnimatedPrice Component
 * Smoothly animates watch prices from zero (0) up to their maximum calculated amount
 * using mechanical-precision easing (quartic ease-out) when scrolling into view or on mount.
 */
export const AnimatedPrice: React.FC<AnimatedPriceProps> = ({
  amountUSD,
  currency,
  duration = 1350,
  options,
  className = '',
  startOnView = true,
  prefix = '',
  suffix = '',
  replayOnHover = false,
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const targetValue = Math.round(convertPrice(amountUSD, currency));
  const [displayValue, setDisplayValue] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState(!startOnView);
  const animFrameRef = useRef<number | null>(null);
  const startValRef = useRef<number>(0);

  // Trigger from 0 whenever currency or amount changes
  useEffect(() => {
    startValRef.current = 0;
    setDisplayValue(0);
  }, [currency, amountUSD]);

  // Intersection observer to start animation when element scrolls into view
  useEffect(() => {
    if (!startOnView) {
      setHasStarted(true);
      return;
    }

    const node = containerRef.current;
    if (!node) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setHasStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasStarted(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: '30px' }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [startOnView]);

  // Run the count-up animation from 0 to maximum target number
  useEffect(() => {
    if (!hasStarted) {
      setDisplayValue(0);
      return;
    }

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    const startVal = startValRef.current;
    const endVal = targetValue;
    const diff = endVal - startVal;

    // Quartic ease-out creates high-end watch dial fluidity: swift initial roll, subtle deceleration
    const easeOutQuart = (x: number): number => 1 - Math.pow(1 - x, 4);

    let startTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);

      const current = Math.round(startVal + diff * easedProgress);
      setDisplayValue(current);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        setDisplayValue(endVal);
        startValRef.current = endVal;
        animFrameRef.current = null;
      }
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [hasStarted, targetValue, duration, currency]);

  // Optional replay on hover
  const handleMouseEnter = () => {
    if (!replayOnHover) return;
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setDisplayValue(0);
    const endVal = targetValue;
    const easeOutQuart = (x: number): number => 1 - Math.pow(1 - x, 4);
    let startTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const current = Math.round(endVal * easedProgress);
      setDisplayValue(current);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        setDisplayValue(endVal);
        animFrameRef.current = null;
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  };

  return (
    <span
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      className={`tabular-nums inline-block font-mono tracking-tight ${className}`}
      title={formatConvertedPrice(targetValue, currency, options)}
    >
      {prefix}
      {formatConvertedPrice(displayValue, currency, options)}
      {suffix}
    </span>
  );
};
