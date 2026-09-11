import React from 'react';
import { arcadeAudio } from '../utils/audio';
import { Trophy, Clock, ChevronUp } from 'lucide-react';

export const SelectedCandidatesBoard: React.FC = () => {
  return (
    <section
      id="candidates-roster"
      className="min-h-[60vh] flex flex-col justify-center px-4 sm:px-6 py-20 max-w-4xl mx-auto"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-amber-500/30 pb-4">
        <div>
          <div className="font-arcade text-xs text-amber-400 mb-1 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>APPOINTEE ROSTER // RESULTS</span>
          </div>
          <h2 className="font-arcade text-2xl sm:text-4xl text-white font-bold tracking-wide">
            SCORE BOARD
          </h2>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#082016] border border-emerald-500/60 text-emerald-300 font-arcade text-[10px]">
          <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>STATUS // EVALUATION</span>
        </div>
      </div>

      {/* Static Score Board Container */}
      <div className="relative bg-[#09120e]/95 border-2 border-amber-500/50 rounded-2xl p-8 sm:p-14 text-center shadow-[0_0_35px_rgba(255,140,0,0.2)]">
        {/* Cybernetic Corner Accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-400 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-400 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-400 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-400 rounded-br-lg" />

        <div className="max-w-md mx-auto space-y-4 py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#082016] border border-emerald-500/60 text-amber-300 font-arcade text-[10px]">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>APPLICATION REVIEW CYCLE</span>
          </div>

          <h3 className="font-arcade text-2xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[#FFE600] via-[#FFB800] to-[#FF6E00] tracking-wider font-bold drop-shadow-[0_2px_12px_rgba(255,140,0,0.5)]">
            Process Ongoing
          </h3>

          <p className="text-xs sm:text-sm text-slate-400 font-cyber leading-relaxed">
            Candidate selections and semester roster evaluations are currently underway.
            Names will be published once Stage 1 concludes.
          </p>
        </div>

        {/* Footer Navigation */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex items-center justify-center">
          <a
            href="#stage-hero"
            onClick={() => arcadeAudio.playSelect()}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/60 text-slate-300 hover:text-amber-300 font-arcade text-[10px] flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
            <span>RETURN TO TOP</span>
          </a>
        </div>
      </div>
    </section>
  );
};
