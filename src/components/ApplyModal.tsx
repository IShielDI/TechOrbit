import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle2, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { HackathonRoleId, MemberApplication } from '../types';
import { arcadeAudio } from '../utils/audio';
import { APPLICATION_DEADLINE_LABEL, isApplicationsOpen } from '../deadline';

const ROLE_LABELS: Record<HackathonRoleId, string> = {
  'marketing-outreach': 'Marketing & Outreach',
  'design-content': 'Design & Content',
  'logistics-operations': 'Logistics & Operations',
  'technical-judging': 'Technical & Judging',
  'hospitality-volunteers': 'Hospitality & Volunteers',
};

const STORAGE_KEY = 'techorbit_hackathon_app';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedRole?: HackathonRoleId;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  isOpen,
  onClose,
  preselectedRole = 'technical-judging' as HackathonRoleId,
}) => {
  const [handle, setHandle] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [email, setEmail] = useState('');
  const [personalEmail, setPersonalEmail] = useState('');
  const [year, setYear] = useState('1');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [motivation, setMotivation] = useState('');

  const [submittedApp, setSubmittedApp] = useState<MemberApplication | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSubmittedApp(JSON.parse(saved) as MemberApplication);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  if (!isOpen) return null;

  const resetFormFields = () => {
    setHandle('');
    setPlayerName('');
    setEmail('');
    setPersonalEmail('');
    setYear('1');
    setGithubUrl('');
    setLinkedinUrl('');
    setMotivation('');
  };

  const handleReset = () => {
    arcadeAudio.playSelect();
    localStorage.removeItem(STORAGE_KEY);
    setSubmittedApp(null);
    setSubmitError(null);
    resetFormFields();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side required check
    if (!handle.trim() || !playerName.trim() || !email.trim()) return;

    // Client-side deadline guard (server enforces authoritatively)
    if (!isApplicationsOpen()) {
      setSubmitError(
        `Applications closed on ${APPLICATION_DEADLINE_LABEL}. The Stage 1 hiring window has ended.`
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    arcadeAudio.playCoin();

    // Client-side pre-processing
    const newApp: MemberApplication = {
      id: `TORB-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      playerName: playerName.trim(),
      handle: handle.toUpperCase().replace(/\s+/g, '_'),
      email: email.trim(),
      personalEmail: personalEmail.trim(),
      studentId: 'CS-' + Math.floor(10000 + Math.random() * 90000),
      year,
      role: preselectedRole,
      experienceLevel: 'Apprentice',
      portfolioOrGithub: githubUrl.trim(),
      linkedin: linkedinUrl.trim(),
      motivation,
      submittedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApp),
      });

      if (response.ok) {
        const data = (await response.json()) as { id?: string };
        if (data?.id) {
          newApp.id = data.id; // overwrite with server-assigned id
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newApp));
        setSubmittedApp(newApp);

        arcadeAudio.playVictory();
        confetti({
          particleCount: 120,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#FFD200', '#FF8A00', '#FF5500', '#22c55e'],
        });
      } else if (response.status === 410) {
        // Deadline passed on the server: hard stop, do NOT save locally.
        setSubmitError(
          `Applications closed on ${APPLICATION_DEADLINE_LABEL}. The Stage 1 hiring window has ended.`
        );
      } else {
        const errorText = await response.text().catch(() => response.statusText);
        setSubmitError(
          `Your application was saved on this device, but could not be sent to the club server: ${errorText}`
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newApp));
        setSubmittedApp(newApp);
      }
    } catch (apiErr) {
      const message = apiErr instanceof Error ? apiErr.message : String(apiErr);
      console.warn('[Client] Could not reach /api/applications:', apiErr);
      setSubmitError(
        `Your application was saved on this device, but could not be sent to the club server: ${message}`
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newApp));
      setSubmittedApp(newApp);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="apply-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#0b0c1e] border-2 border-amber-500/70 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(255,140,0,0.35)] my-auto font-cyber"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Marquee */}
        <div className="bg-gradient-to-r from-slate-900 via-[#082016] to-slate-900 border-b border-amber-500/40 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-arcade text-xs sm:text-sm text-amber-300 neon-text-gold">
              {submittedApp ? 'CLUB CREW PASS // CONFIRMED' : 'STAGE 1 // CLUB HIRING'}
            </span>
          </div>

          <button
            onClick={() => {
              arcadeAudio.playSelect();
              onClose();
            }}
            className="p-1.5 rounded-lg border border-slate-700 hover:border-amber-500 text-slate-400 hover:text-amber-300 bg-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 max-h-[80vh] overflow-y-auto">
          {submittedApp ? (
            /* PASSED CARD */
            <div className="space-y-6">
              {submitError && (
                <div className="rounded-lg border border-rose-500/60 bg-rose-950/40 px-4 py-3 text-xs text-rose-300">
                  {submitError}
                </div>
              )}

              <div className="text-center space-y-2">
                <div className="inline-flex p-3 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 mb-1">
                  <Award className="w-8 h-8 animate-bounce" />
                </div>
                <h3 className="font-arcade text-base sm:text-lg text-white">
                  APPLICATION RECORDED IN TECHORBIT DATABASE
                </h3>
              </div>

              {/* Pass Card */}
              <div className="relative bg-[#0d0f24] border-2 border-emerald-400/80 rounded-xl p-5 sm:p-6 shadow-[0_0_25px_rgba(16,185,129,0.25)] space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <div className="font-arcade text-[10px] text-emerald-400">
                      TECHORBIT // CAMPUS HACKATHON PASS
                    </div>
                    <div className="text-xs text-slate-400">MISSION: HOSTING 2025 CAMPUS HACKATHON</div>
                  </div>
                  <div className="text-right">
                    <div className="font-arcade text-xs text-yellow-400">ID: {submittedApp.id}</div>
                    <div className="text-[10px] text-slate-500">{submittedApp.submittedAt}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 font-arcade block">PLAYER HANDLE</span>
                    <span className="text-emerald-300 font-arcade text-xs">{submittedApp.handle}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-arcade block">RECRUIT NAME</span>
                    <span className="text-white font-semibold">{submittedApp.playerName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-arcade block">ASSIGNED ROLE</span>
                    <span className="text-amber-300 font-arcade text-[10px]">
                      {ROLE_LABELS[submittedApp.role] || submittedApp.role}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-arcade block">CLASS YEAR</span>
                    <span className="text-slate-300 font-arcade">Year {submittedApp.year}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-arcade block">STATUS</span>
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> STAGE 1 CANDIDATE
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer"
                >
                  Submit for another role
                </button>
                <button
                  type="button"
                  onClick={() => {
                    arcadeAudio.playSelect();
                    onClose();
                  }}
                  className="px-6 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-arcade text-xs font-bold transition-all cursor-pointer"
                >
                  RETURN TO ARCADE
                </button>
              </div>
            </div>
          ) : (
            /* FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isApplicationsOpen() ? (
                <div className="rounded-lg border border-red-500/60 bg-red-950/40 px-4 py-5 text-center space-y-2">
                  <div className="font-arcade text-sm text-red-300">APPLICATIONS CLOSED</div>
                  <p className="text-xs text-slate-300">
                    The Stage 1 hiring window ended on {APPLICATION_DEADLINE_LABEL}. Thanks
                    for your interest in TechOrbit.
                  </p>
                </div>
              ) : (
              <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-arcade text-amber-300 mb-1">
                    ARCADE HANDLE / CALLSIGN *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BYTESMITH"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="w-full bg-slate-900 border border-amber-500/40 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-arcade text-amber-300 mb-1">
                    FULL STUDENT NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Morgan Freeman"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full bg-slate-900 border border-amber-500/40 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-arcade text-amber-300 mb-1">
                    COLLEGE EMAIL *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@campus.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-amber-500/40 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-arcade text-amber-300 mb-1">
                    CLASS YEAR
                  </label>
                  <select
                    value={year}
                    onChange={(e) => {
                      arcadeAudio.playSelect();
                      setYear(e.target.value);
                    }}
                    className="w-full bg-slate-900 border border-amber-500/40 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 font-arcade"
                  >
                    <option value="1">1 (1st Year)</option>
                    <option value="2">2 (2nd Year)</option>
                    <option value="3">3 (3rd Year)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-arcade text-amber-300 mb-1">
                    PERSONAL EMAIL *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="personal@gmail.com"
                    value={personalEmail}
                    onChange={(e) => setPersonalEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-amber-500/40 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-arcade text-amber-300 mb-1">
                    GITHUB PROFILE *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://github.com/yourhandle"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-amber-500/40 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-arcade text-amber-300 mb-1">
                    LINKEDIN PROFILE *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://linkedin.com/in/yourhandle"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-cyan-500/40 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-arcade text-amber-300 mb-1">
                  WHY JOIN TECHORBIT?
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us what excites you about making this campus hackathon legendary..."
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  className="w-full bg-slate-900 border border-amber-500/40 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              {submitError && (
                <div className="rounded-lg border border-rose-500/60 bg-rose-950/40 px-4 py-3 text-xs text-rose-300">
                  {submitError}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-lg bg-gradient-to-r from-[#FFC700] via-[#FF8A00] to-[#FF5500] hover:from-[#FFD233] hover:to-[#FF6A00] text-black font-arcade text-xs font-bold transition-all shadow-[0_0_25px_rgba(255,140,0,0.5)] active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>INSERT COIN // SUBMIT APPLICATION</span>
                </button>
              </div>
              </>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};