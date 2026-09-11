import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { APPLICATION_DEADLINE_ISO, APPLICATION_DEADLINE_LABEL, isApplicationsOpen } from '../deadline';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  closed: boolean;
}

// Everyone counts down to the SAME global deadline (no per-device clock).
const TARGET_TIME = Date.parse(APPLICATION_DEADLINE_ISO);

export const HackathonCountdown: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(() => {
    const difference = Math.max(0, TARGET_TIME - Date.now());
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      totalMs: difference,
      closed: !isApplicationsOpen(),
    };
  });

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const difference = Math.max(0, TARGET_TIME - now);

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        totalMs: difference,
        closed: !isApplicationsOpen(now),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  const format2 = (val: number) => String(val).padStart(2, '0');

  if (timeLeft.closed) {
    return (
      <div
        id="hackathon-countdown-timer"
        className="relative bg-[#0b1411]/90 border-2 border-red-500/60 rounded-2xl p-5 sm:p-7 shadow-[0_0_35px_rgba(255,0,0,0.3)] backdrop-blur-md max-w-2xl mx-auto overflow-hidden"
      >
        <div className="absolute inset-0 crt-overlay pointer-events-none opacity-25" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#200808] border border-red-500/60 text-red-300 font-arcade text-[10px]">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span>STAGE 1: TEAM HIRING TERMINAL CLOSED</span>
          </div>

          <div className="font-arcade text-lg sm:text-2xl text-red-300 tracking-wide">
            APPLICATIONS CLOSED
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            The Stage 1 hiring window has ended. Stay tuned for results.
          </p>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 bg-[#091510] border border-emerald-500/50 px-3 py-1.5 rounded-lg shadow-[0_0_10px_rgba(255,184,0,0.15)]">
        <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span className="font-arcade text-[10px] text-amber-300">
          {timeLeft.closed ? 'STAGE 1 CLOSED' : 'STAGE 1 CLOSES:'}
        </span>
        {!timeLeft.closed && (
          <span className="font-arcade text-xs text-amber-300 neon-text-gold tracking-wider">
            {timeLeft.days}D {format2(timeLeft.hours)}H:{format2(timeLeft.minutes)}M:
            {format2(timeLeft.seconds)}S
          </span>
        )}
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
        <div className="font-arcade text-[10px] sm:text-xs text-slate-400 tracking-wider">
          CLOSES {APPLICATION_DEADLINE_LABEL}
        </div>
      </div>
    </div>
  );
};
