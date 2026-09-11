import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

export const HackathonCountdown: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 7,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalMs: 7 * 24 * 60 * 60 * 1000,
  });

  useEffect(() => {
    // Persist or initialize a real 7-day countdown target in localStorage
    const STORAGE_KEY = 'techorbit_hiring_deadline_ts';
    let targetTimeStr = localStorage.getItem(STORAGE_KEY);
    let targetTime: number;

    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

    if (!targetTimeStr) {
      targetTime = Date.now() + SEVEN_DAYS_MS;
      localStorage.setItem(STORAGE_KEY, targetTime.toString());
    } else {
      targetTime = parseInt(targetTimeStr, 10);
      // If deadline has completely passed in a previous test, refresh to 7 days
      if (isNaN(targetTime) || targetTime <= Date.now()) {
        targetTime = Date.now() + SEVEN_DAYS_MS;
        localStorage.setItem(STORAGE_KEY, targetTime.toString());
      }
    }

    const updateTimer = () => {
      const now = Date.now();
      const difference = Math.max(0, targetTime - now);

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        totalMs: difference,
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  const format2 = (val: number) => String(val).padStart(2, '0');

  if (compact) {
    return (
      <div className="flex items-center gap-2 bg-[#091510] border border-emerald-500/50 px-3 py-1.5 rounded-lg shadow-[0_0_10px_rgba(255,184,0,0.15)]">
        <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span className="font-arcade text-[10px] text-amber-300">
          STAGE 1 CLOSES:
        </span>
        <span className="font-arcade text-xs text-amber-300 neon-text-gold tracking-wider">
          {timeLeft.days}D {format2(timeLeft.hours)}H:{format2(timeLeft.minutes)}M:{format2(timeLeft.seconds)}S
        </span>
      </div>
    );
  }

  return (
    <div
      id="hackathon-countdown-timer"
      className="relative bg-[#0b1411]/90 border-2 border-amber-500/60 rounded-2xl p-5 sm:p-7 shadow-[0_0_35px_rgba(255,140,0,0.3)] backdrop-blur-md max-w-2xl mx-auto overflow-hidden"
    >
      {/* Background scanline & glow */}
      <div className="absolute inset-0 crt-overlay pointer-events-none opacity-25" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#082016] border border-emerald-500/60 text-amber-300 font-arcade text-[10px]">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>STAGE 1: TEAM HIRING TERMINAL CLOSES IN</span>
        </div>

        {/* 4 Time Digit Cards */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-4 w-full">
          {[
            { label: 'DAYS', val: format2(timeLeft.days), color: 'text-[#FFD200]' },
            { label: 'HOURS', val: format2(timeLeft.hours), color: 'text-[#FF8A00]' },
            { label: 'MINUTES', val: format2(timeLeft.minutes), color: 'text-emerald-400' },
            { label: 'SECONDS', val: format2(timeLeft.seconds), color: 'text-amber-200' },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-[#050907] border border-amber-500/30 rounded-xl p-2.5 sm:p-4 text-center shadow-inner"
            >
              <div
                className={`font-arcade text-2xl sm:text-4xl font-bold ${item.color} tracking-tight`}
              >
                {item.val}
              </div>
              <div className="font-arcade text-[8px] sm:text-[10px] text-slate-400 mt-1">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
