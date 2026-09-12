import React, { useState } from 'react';
import { Arcade3DScene } from './components/Arcade3DScene';
import { TechOrbitLogo } from './components/TechOrbitLogo';
import { HackathonCountdown } from './components/HackathonCountdown';
import { ApplyModal } from './components/ApplyModal';
import { ArcadeAssetViewerModal } from './components/ArcadeAssetViewerModal';
import { SelectedCandidatesBoard } from './components/SelectedCandidatesBoard';
import { HackathonRoleId, HackathonRole } from './types';
import { arcadeAudio } from './utils/audio';
import { APPLICATION_DEADLINE_LABEL, isApplicationsOpen } from './deadline';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Zap,
  Terminal,
  Code2,
  Building2,
  Trophy,
  Megaphone,
  ArrowRight,
  ChevronDown,
  ShieldCheck,
  Flame,
  Radio,
  Box,
  Layers,
  Cpu,
  Coins,
  GraduationCap,
  Users,
} from 'lucide-react';

const hackathonRoles: HackathonRole[] = [
  {
    id: 'marketing-outreach',
    title: 'Marketing & Outreach',
    headcount: '2 people',
    roleTag: '2 SEATS // OUTREACH',
    color: '#FFB800',
    glowColor: 'rgba(255, 184, 0, 0.4)',
    iconName: 'megaphone',
    mission: 'Cross-college promotion, social media, registration drive, sponsor/partner shoutouts',
    deliverables: [
      'Cross-college promotion',
      'Social media campaigns',
      'Registration drive',
      'Sponsor/partner shoutouts',
    ],
    slotsAvailable: 2,
  },
  {
    id: 'design-content',
    title: 'Design & Content',
    headcount: '1–2 people',
    roleTag: '1–2 SEATS // CREATIVE',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    iconName: 'palette',
    mission: 'Branding, posters, certificates, sponsor deck design, social creatives',
    deliverables: [
      'Branding & visual assets',
      'Posters & banners',
      'Certificates & credentials',
      'Sponsor deck & social creatives',
    ],
    slotsAvailable: 2,
  },
  {
    id: 'logistics-operations',
    title: 'Logistics & Operations',
    headcount: '2 people',
    roleTag: '2 SEATS // OPERATIONS',
    color: '#FF8A00',
    glowColor: 'rgba(255, 138, 0, 0.4)',
    iconName: 'building',
    mission: 'Venue setup, food, power/Wi-Fi, seating, on-ground coordination during the 24 hours',
    deliverables: [
      'Venue setup & seating',
      'Food & refreshments',
      'Power & high-speed Wi-Fi',
      '24-hour on-ground coordination',
    ],
    slotsAvailable: 2,
  },
  {
    id: 'technical-judging',
    title: 'Technical & Judging',
    headcount: '2 people',
    roleTag: '2 SEATS // TECH & JURY',
    color: '#FF5500',
    glowColor: 'rgba(255, 85, 0, 0.4)',
    iconName: 'code',
    mission: 'Problem statements, tech support desk, mentor/judge coordination, rubric & round scheduling',
    deliverables: [
      'Problem statements curation',
      'Tech support desk',
      'Mentor & judge coordination',
      'Rubric & round scheduling',
    ],
    slotsAvailable: 2,
  },
  {
    id: 'hospitality-volunteers',
    title: 'Hospitality & Volunteers',
    headcount: '2 people',
    roleTag: '2 SEATS // HOSPITALITY',
    color: '#22c55e',
    glowColor: 'rgba(34, 197, 94, 0.4)',
    iconName: 'users',
    mission: 'Guest & participant reception, check-in desk, hospitality coordination, and volunteer team management during the 24 hours',
    deliverables: [
      'Guest & participant reception',
      'Check-in & welcome desk',
      'Hospitality coordination',
      'Volunteer team management',
    ],
    slotsAvailable: 2,
  },
];

export const App: React.FC = () => {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(false);
  const [isAssetViewerOpen, setIsAssetViewerOpen] = useState<boolean>(false);
  const [coinToast, setCoinToast] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<HackathonRoleId>('marketing-outreach');

  const handleOpenApply = (roleId: HackathonRoleId = 'marketing-outreach') => {
    setSelectedRole(roleId);
    arcadeAudio.playStartGame();
    setIsApplyModalOpen(true);
  };

  const handleCoinCollected = () => {
    setCoinToast('+1 GOLD ARCADE TOKEN COLLECTED!');
    setTimeout(() => {
      setCoinToast(null);
    }, 2400);
  };

  return (
    <div className="relative min-h-screen bg-[#070714] text-slate-100 font-cyber selection:bg-[#00f3ff] selection:text-black overflow-x-hidden">
      {/* 3D WebGL Background Scene with Interactive Gold Coins & Cabinets */}
      <Arcade3DScene
        onCoinCollect={handleCoinCollected}
      />

      {/* Floating Coin Collection Toast */}
      {coinToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-bounce flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-950/90 border border-yellow-400 text-yellow-300 font-arcade text-xs shadow-[0_0_25px_rgba(250,204,21,0.6)] backdrop-blur-md">
          <Coins className="w-4 h-4 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
          <span>{coinToast}</span>
        </div>
      )}

      {/* Main Content Sections */}
      <main className="relative z-10 pt-8 sm:pt-12">
        {/* =========================================
            HERO SECTION: techorbit
            ========================================= */}
        <section
          id="stage-hero"
          className="min-h-[85vh] flex flex-col justify-center items-center px-4 sm:px-6 text-center max-w-5xl mx-auto py-16"
        >
          {/* Authentic TechOrbit Pixel Logo - aligned with the screen */}
          <div className="w-full flex justify-center items-center mb-8">
            <TechOrbitLogo size="hero" showSubtitle={false} />
          </div>

          {/* 4-Stage Mission Breadcrumb Formation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl mb-10">
            <a
              href="#stage-0"
              onClick={() => arcadeAudio.playSelect()}
              className="bg-[#082016]/80 hover:bg-[#0b2b1e] border border-emerald-500/60 hover:border-amber-400 p-3.5 rounded-xl transition-all text-left group shadow-[0_0_15px_rgba(16,185,129,0.15)]"
            >
              <div className="text-[10px] font-arcade text-emerald-400 flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>STAGE 0</span>
              </div>
              <div className="font-cyber font-semibold text-xs text-white group-hover:text-amber-300">
                Approved Charter
              </div>
            </a>

            <a
              href="#stage-1"
              onClick={() => arcadeAudio.playSelect()}
              className="bg-[#082016]/80 hover:bg-[#0b2b1e] border border-amber-500/60 hover:border-amber-400 p-3.5 rounded-xl transition-all text-left group shadow-[0_0_15px_rgba(255,184,0,0.15)]"
            >
              <div className="text-[10px] font-arcade text-amber-400 flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>STAGE 1</span>
              </div>
              <div className="font-cyber font-semibold text-xs text-white group-hover:text-amber-300">
                Crew Hiring (7d)
              </div>
            </a>

            <a
              href="#stage-2"
              onClick={() => arcadeAudio.playSelect()}
              className="bg-[#082016]/80 hover:bg-[#0b2b1e] border border-orange-500/60 hover:border-orange-400 p-3.5 rounded-xl transition-all text-left group shadow-[0_0_15px_rgba(255,102,0,0.15)]"
            >
              <div className="text-[10px] font-arcade text-orange-400 flex items-center gap-1.5 mb-1">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>STAGE 2</span>
              </div>
              <div className="font-cyber font-semibold text-xs text-white group-hover:text-amber-300">
                Hackathon Execution
              </div>
            </a>

            <a
              href="#candidates-roster"
              onClick={() => arcadeAudio.playSelect()}
              className="bg-[#082016]/80 hover:bg-[#0b2b1e] border border-emerald-500/60 hover:border-amber-400 p-3.5 rounded-xl transition-all text-left group shadow-[0_0_15px_rgba(16,185,129,0.15)]"
            >
              <div className="text-[10px] font-arcade text-amber-300 flex items-center gap-1.5 mb-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>SCORE BOARD</span>
              </div>
              <div className="font-cyber font-semibold text-xs text-white group-hover:text-amber-300">
                Process Ongoing
              </div>
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
            <a
              href="#stage-0"
              onClick={() => arcadeAudio.playSelect()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FFC700] via-[#FF8A00] to-[#FF5500] hover:from-[#FFD233] hover:to-[#FF6A00] text-black font-arcade text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,140,0,0.45)]"
            >
              <span>EXPLORE 3 STAGES</span>
              <ChevronDown className="w-4 h-4 text-black animate-bounce" />
            </a>

            <a
              href="#candidates-roster"
              onClick={() => arcadeAudio.playSelect()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/60 text-slate-200 hover:text-amber-300 font-arcade text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>SCORE BOARD</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </a>
          </div>
        </section>

        {/* =========================================
            STAGE 0: PLANNING AND APPROVAL
            ========================================= */}
        <section
          id="stage-0"
          className="min-h-[75vh] flex flex-col justify-center px-4 sm:px-6 py-20 max-w-4xl mx-auto"
        >
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-emerald-500/30 pb-4">
            <div>
              <div className="font-arcade text-xs text-emerald-400 mb-1 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>PHASE ZERO // COMPLETED & APPROVED</span>
              </div>
              <h2 className="font-arcade text-2xl sm:text-4xl text-white font-bold tracking-wide">
                STAGE 0 — PLANNING & APPROVAL
              </h2>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 font-arcade text-[10px]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>OFFICIAL CLEARANCE</span>
            </div>
          </div>

          {/* Department Executive Charter & Approval Card */}
          <div className="relative bg-[#082016]/90 border-2 border-emerald-500/60 rounded-2xl p-6 sm:p-8 shadow-[0_0_30px_rgba(16,185,129,0.2)] space-y-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="space-y-1">
                <span className="font-arcade text-[10px] text-amber-300 bg-[#061c12] border border-amber-500/50 px-2.5 py-1 rounded">
                  OFFICIAL CHARTER #TORB-CS25
                </span>
                <h3 className="font-arcade text-lg sm:text-xl text-white pt-2">
                  Department Executive Charter & Academic Approval
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div className="pt-4 border-t border-emerald-900/60 flex items-center justify-end">
              <a
                href="#stage-1"
                onClick={() => arcadeAudio.playSelect()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FFC700] via-[#FF8A00] to-[#FF5500] hover:from-[#FFD233] hover:to-[#FF6A00] text-black font-arcade text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(255,140,0,0.4)] shrink-0"
              >
                <span>CONTINUE TO STAGE 1</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* =========================================
            STAGE 1: HIRING (ACTIVE NOW WITH 7-DAY TIMER)
            ========================================= */}
        <section
          id="stage-1"
          className="min-h-screen flex flex-col justify-center px-4 sm:px-6 py-20 max-w-5xl mx-auto"
        >
          {/* Stage Header with Live Indicator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-amber-500/40 pb-4">
            <div>
              <div className="font-arcade text-xs text-amber-400 mb-1 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <span>PHASE ONE // CURRENT LIVE PHASE</span>
              </div>
              <h2 className="font-arcade text-2xl sm:text-4xl text-white font-bold tracking-wide">
                STAGE 1 — HIRING
              </h2>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 border-2 border-amber-400 text-amber-300 font-arcade text-xs shadow-[0_0_25px_rgba(255,184,0,0.3)]">
              <Clock className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>APPLICATIONS CLOSE {APPLICATION_DEADLINE_LABEL}</span>
            </div>
          </div>

          {/* Running Countdown inside Stage 1 */}
          <div className="mb-6 sm:mb-8">
            <HackathonCountdown />
          </div>

          {/* Single Apply CTA Button directly below Timer */}
          <div className="flex justify-center mb-10">
            <button
              id="stage-1-apply-crew-btn"
              onClick={() => handleOpenApply('marketing-outreach')}
              disabled={!isApplicationsOpen()}
              className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-xl bg-gradient-to-r from-[#FFC700] via-[#FF8A00] to-[#FF5500] hover:from-[#FFD233] hover:to-[#FF6A00] text-black font-arcade text-xs sm:text-sm font-bold tracking-wider transition-all shadow-[0_0_30px_rgba(255,140,0,0.45)] active:translate-y-0.5 cursor-pointer inline-flex items-center justify-center gap-2.5 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>
                {isApplicationsOpen() ? 'APPLY FOR TECHORBIT CREW' : 'APPLICATIONS CLOSED'}
              </span>
            </button>
          </div>

          {/* 4 Specialized Hackathon Domains - NO apply button inside column */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {hackathonRoles.map((role) => (
              <div
                key={role.id}
                className="relative bg-[#082016]/90 border border-emerald-500/40 hover:border-amber-400/80 rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,184,0,0.2)] flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-arcade text-[10px] text-amber-300 bg-[#061c12] border border-amber-500/40 px-2.5 py-1 rounded">
                      {role.roleTag}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-arcade text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                      <Users className="w-3 h-3" />
                      <span>{role.headcount}</span>
                    </span>
                  </div>

                  <h3 className="font-arcade text-lg sm:text-xl text-white mb-2 group-hover:text-amber-300 transition-colors">
                    {role.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {role.mission}
                  </p>
                </div>

                <div className="pt-3 border-t border-emerald-900/60">
                  <div className="text-[10px] font-arcade text-slate-400 mb-2 tracking-wider">
                    KEY FOCUS & RESPONSIBILITIES:
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-300">
                    {role.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span className="leading-tight">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================
            STAGE 2: EXECUTION
            ========================================= */}
        <section
          id="stage-2"
          className="min-h-[60vh] flex flex-col justify-center px-4 sm:px-6 py-20 max-w-4xl mx-auto"
        >
          {/* Stage Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-orange-500/40 pb-4">
            <div>
              <div className="font-arcade text-xs text-orange-400 mb-1 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>PHASE TWO // SCHEDULED POST-HIRING</span>
              </div>
              <h2 className="font-arcade text-2xl sm:text-4xl text-white font-bold tracking-wide">
                STAGE 2 — EXECUTION
              </h2>
            </div>
          </div>

          {/* Clean Call to Action Container */}
          <div className="relative bg-gradient-to-b from-[#082016] to-[#06140e] border-2 border-amber-500/70 rounded-2xl p-6 sm:p-10 text-center shadow-[0_0_40px_rgba(255,140,0,0.25)] space-y-6">
            <h3 className="font-arcade text-2xl sm:text-3xl text-white font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#FFD200] via-[#FF8A00] to-[#FF4500]">
              CAMPUS HACKATHON ARENA
            </h3>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  arcadeAudio.playStartGame();
                  setSelectedRole('marketing-outreach');
                  setIsApplyModalOpen(true);
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#FFC700] via-[#FF8A00] to-[#FF5500] hover:from-[#FFD233] hover:to-[#FF6A00] text-black font-arcade text-xs sm:text-sm font-bold tracking-wider transition-all shadow-[0_0_30px_rgba(255,140,0,0.45)] active:translate-y-0.5 cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>INSERT COIN // APPLY TO TECHORBIT</span>
              </button>

              <a
                href="#candidates-roster"
                onClick={() => arcadeAudio.playSelect()}
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 text-amber-300 font-arcade text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <span>VIEW SCORE BOARD</span>
                <ChevronDown className="w-4 h-4 text-amber-400 animate-bounce" />
              </a>
            </div>
          </div>
        </section>

        {/* Selected Candidates Board at End of Scroll */}
        <SelectedCandidatesBoard />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-emerald-950 bg-[#040d09] py-8 text-center text-xs text-slate-500 font-cyber">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <div className="font-arcade text-[11px] text-amber-400 tracking-wider">
            TECHORBIT // COMPUTER SCIENCE DEPARTMENT
          </div>
        </div>
      </footer>

      {/* Application Modal */}
      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        preselectedRole={selectedRole}
      />

      {/* Retro Arcade Cabinets & Minted Gold Coins Modal */}
      <ArcadeAssetViewerModal
        isOpen={isAssetViewerOpen}
        onClose={() => setIsAssetViewerOpen(false)}
        onCollectCoin={handleCoinCollected}
      />
    </div>
  );
};
export default App;
