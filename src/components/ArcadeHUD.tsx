import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Coins, CheckCircle2 } from 'lucide-react';
import { arcadeAudio } from '../utils/audio';
import { HackathonCountdown } from './HackathonCountdown';

interface ArcadeHUDProps {
  currentStage: number;
  onOpenApply: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  credits?: number;
  onAddCredit?: () => void;
}

export const ArcadeHUD: React.FC<ArcadeHUDProps> = ({
  currentStage,
  onOpenApply,
  soundEnabled,
  onToggleSound,
  credits: externalCredits,
  onAddCredit,
}) => {
  const [internalCredits, setInternalCredits] = useState<number>(99);
  const credits = externalCredits !== undefined ? externalCredits : internalCredits;

  const stageLabels = [
    'STAGE 0: PLANNING & APPROVAL [✔ APPROVED]',
    'STAGE 1: HIRING [7-DAY WINDOW ACTIVE]',
    'STAGE 2: EXECUTION [HACKATHON ARENA]',
    'SCORE BOARD [PROCESS ONGOING]',
  ];

  const handleAddCredit = () => {
    arcadeAudio.playCoin();
    if (onAddCredit) {
      onAddCredit();
    } else {
      setInternalCredits((prev) => prev + 1);
    }
  };

  return (
    <header
      id="arcade-hud-header"
      className="fixed top-0 left-0 right-0 z-40 bg-[#070714]/90 backdrop-blur-md border-b border-amber-500/30 px-3 sm:px-6 py-2.5 flex items-center justify-between text-xs sm:text-sm font-cyber"
    >
      {/* Left: Branding & stage indicator */}
      <div className="flex items-center gap-3 sm:gap-5">
        <a
          href="#stage-hero"
          onClick={() => arcadeAudio.playSelect()}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          {/* Mini Joystick/Gear Pixel Icon */}
          <div className="w-8 h-8 rounded-lg bg-[#082e20] border-2 border-emerald-500/60 p-0.5 shadow-[0_0_12px_rgba(255,140,0,0.4)] flex items-center justify-center shrink-0">
            <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none">
              <circle cx="16" cy="16" r="10" fill="#FF6600" />
              <circle cx="16" cy="16" r="6" fill="#093826" />
              <rect x="14" y="9" width="4" height="10" fill="#E2E8F0" rx="1" />
              <circle cx="16" cy="7" r="4.5" fill="#FF3A00" stroke="#093826" strokeWidth="1.5" />
              <circle cx="15" cy="6" r="1" fill="#FFFCE6" />
            </svg>
          </div>
          <div>
            <div className="font-arcade text-[11px] sm:text-xs text-transparent bg-clip-text bg-gradient-to-r from-[#FFE600] via-[#FFB800] to-[#FF6E00] tracking-widest font-bold drop-shadow-[0_2px_8px_rgba(255,140,0,0.5)]">
              TECHORBIT
            </div>
            <div
              id="hud-department-subtitle"
              className="text-[9px] text-amber-300/90 hidden sm:block tracking-wider font-semibold font-arcade"
            >
              THE TECHNOLOGY ADVENTURE
            </div>
          </div>
        </a>

        {/* Active Stage Indicator */}
        <div className="hidden md:flex items-center gap-2 bg-[#082016]/90 border border-emerald-500/60 rounded-md px-2.5 py-1">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-arcade text-[9px] text-amber-300">
            {stageLabels[Math.min(currentStage, stageLabels.length - 1)]}
          </span>
        </div>
      </div>

      {/* Center: Real Running Timer Compact Badge */}
      <div className="hidden lg:flex items-center gap-4">
        <HackathonCountdown compact />

        <button
          id="hud-insert-coin-btn"
          onClick={handleAddCredit}
          className="flex items-center gap-1.5 bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 rounded px-2.5 py-1 transition-all cursor-pointer group active:scale-95 shadow-[0_0_12px_rgba(255,184,0,0.2)]"
          title="Click to insert arcade coin"
        >
          <Coins className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-180 transition-transform duration-300" />
          <span className="font-arcade text-[9px]">TOKENS [{credits}]</span>
        </button>
      </div>

      {/* Right: Sound toggle and Apply CTA */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Sound toggle */}
        <button
          id="hud-sound-toggle-btn"
          onClick={onToggleSound}
          className={`p-1.5 rounded border transition-colors cursor-pointer ${
            soundEnabled
              ? 'border-amber-500/50 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25'
              : 'border-slate-700 bg-slate-800 text-slate-500'
          }`}
          title={soundEnabled ? 'Mute 8-bit sound FX' : 'Enable 8-bit sound FX'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Apply for Hackathon Team CTA */}
        <button
          id="hud-apply-now-btn"
          onClick={() => {
            arcadeAudio.playStartGame();
            onOpenApply();
          }}
          className="relative group px-3.5 sm:px-4 py-1.5 rounded bg-gradient-to-r from-[#FFC700] via-[#FF8A00] to-[#FF5500] hover:from-[#FFD233] hover:to-[#FF6A00] text-black font-arcade text-[10px] tracking-wider font-bold transition-all shadow-[0_0_20px_rgba(255,140,0,0.5)] active:translate-y-0.5 cursor-pointer flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
          <span>APPLY FOR TEAM</span>
        </button>
      </div>
    </header>
  );
};
