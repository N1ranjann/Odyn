import React from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';

function getScoreColor(score) {
  if (score >= 80) return { stroke: 'var(--score-success)', bg: 'var(--score-success-bg)', glow: 'rgba(34, 197, 94, 0.5)' };
  if (score >= 60) return { stroke: 'var(--score-warning)', bg: 'var(--score-warning-bg)', glow: 'rgba(245, 158, 11, 0.5)' };
  return { stroke: 'var(--score-critical)', bg: 'var(--score-critical-bg)', glow: 'rgba(239, 68, 68, 0.5)' };
}

export default function CircularProgress({ score, size = 200, strokeWidth = 10, delay = 0, label }) {
  const [displayScore, setDisplayScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const colors = getScoreColor(score);

  useEffect(() => {
    const controls = animate(0, score, {
      duration: 1.5,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplayScore(Math.round(v)),
    });
    return () => controls.stop();
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
          className="text-brand-charcoal/[0.06]"
        />
        {/* Glow Layer (Blurred duplicate) */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (circumference * score) / 100 }}
          transition={{ duration: 1.5, delay, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: `blur(${strokeWidth}px)`, opacity: 0.4 }}
        />
        {/* Main Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (circumference * score) / 100 }}
          transition={{ duration: 1.5, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-brand-charcoal" style={{ fontSize: size * 0.28 }}>
          {displayScore}
        </span>
        {label && (
          <span className="text-brand-charcoal/50 text-xs font-medium mt-1">{label}</span>
        )}
      </div>
    </div>
  );
}

export { getScoreColor };
