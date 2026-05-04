import React from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';

function getScoreColor(score) {
  if (score >= 75) return { stroke: '#6B8F71', bg: 'rgba(107, 143, 113, 0.1)', glow: 'rgba(107, 143, 113, 0.5)' };
  if (score >= 50) return { stroke: '#D97706', bg: 'rgba(217, 119, 6, 0.1)', glow: 'rgba(217, 119, 6, 0.5)' };
  return { stroke: '#C1440E', bg: 'rgba(193, 68, 14, 0.1)', glow: 'rgba(193, 68, 14, 0.5)' };
}

export default function CircularProgress({ score, size = 200, strokeWidth = 10, delay = 0, label }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const colors = getScoreColor(score);

  useEffect(() => {
    const animation = animate(count, score, {
      duration: 1.2,
      delay,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.round(latest))
    });
    return () => animation.stop();
  }, [score, delay]);

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90 overflow-visible">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeOpacity={0.08}
          className="text-brand-charcoal dark:text-brand-cream"
        />
        {/* Main Progress Arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: score / 100, opacity: 1 }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
          style={{ originX: "50%", originY: "50%" }}
        />
        {/* Subtle Glow */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: score / 100, opacity: 0.3 }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
          style={{ filter: `blur(${strokeWidth * 0.8}px)`, originX: "50%", originY: "50%" }}
        />
      </svg>
      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-brand-charcoal dark:text-brand-cream" style={{ fontSize: size * 0.28 }}>
          {displayValue}
        </span>
        {label && (
          <span className="text-brand-charcoal/50 dark:text-brand-cream/50 text-xs font-medium mt-1">{label}</span>
        )}
      </div>
    </div>
  );
}

export { getScoreColor };
