import React, { useState } from 'react';
import { X, Sparkles, Coins, Box, Eye, Layers, ShieldCheck } from 'lucide-react';
import { arcadeAudio } from '../utils/audio';

interface ArcadeAssetViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCollectCoin: () => void;
}

export const ArcadeAssetViewerModal: React.FC<ArcadeAssetViewerModalProps> = ({
  isOpen,
  onClose,
  onCollectCoin,
}) => {
  const [activeTab, setActiveTab] = useState<'elevator' | 'asteroids' | 'goldcoin' | 'crates'>('crates');

  if (!isOpen) return null;

  return (
    <div
      id="arcade-asset-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        id="arcade-asset-modal-card"
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0b16] border-2 border-cyan-500/60 rounded-xl p-5 sm:p-7 shadow-[0_0_50px_rgba(6,182,212,0.4)] text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-yellow-500/20 border border-yellow-400/50 flex items-center justify-center">
              <Coins className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h2 className="font-arcade text-sm sm:text-base text-yellow-300 tracking-wider">
                RETRO 3D ASSETS & MINTED COIN TERMINAL
              </h2>
              <p className="text-xs text-cyan-400 font-cyber">
                PBR 3D models with authentic textures & multi-relief 24K gold minted tokens
              </p>
            </div>
          </div>
          <button
            id="close-asset-modal-btn"
            onClick={() => {
              arcadeAudio.playSelect();
              onClose();
            }}
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-slate-800 pb-3 mb-6 overflow-x-auto">
          <button
            id="tab-goldcoin"
            onClick={() => {
              arcadeAudio.playSelect();
              setActiveTab('goldcoin');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-arcade text-xs transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'goldcoin'
                ? 'bg-yellow-500/20 border border-yellow-400 text-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.3)]'
                : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Coins className="w-4 h-4 text-yellow-400" />
            <span>IMPROVED GOLD COINS</span>
          </button>

          <button
            id="tab-elevator"
            onClick={() => {
              arcadeAudio.playSelect();
              setActiveTab('elevator');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-arcade text-xs transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'elevator'
                ? 'bg-amber-500/20 border border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Box className="w-4 h-4 text-amber-400" />
            <span>ELEVATOR ACTION (TAITO)</span>
          </button>

          <button
            id="tab-asteroids"
            onClick={() => {
              arcadeAudio.playSelect();
              setActiveTab('asteroids');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-arcade text-xs transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'asteroids'
                ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Box className="w-4 h-4 text-cyan-400" />
            <span>ASTEROIDS (ATARI)</span>
          </button>

          <button
            id="tab-crates"
            onClick={() => {
              arcadeAudio.playSelect();
              setActiveTab('crates');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-arcade text-xs transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'crates'
                ? 'bg-amber-500/20 border border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Box className="w-4 h-4 text-amber-400" />
            <span>PIRATE CHESTS & AMMO CRATES</span>
          </button>
        </div>

        {/* Tab 1: Improved Gold Coins */}
        {activeTab === 'goldcoin' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Visual Presentation of the Minted Coin */}
              <div className="relative flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#141204] via-[#0d0d18] to-[#0a0a14] border border-yellow-500/40 rounded-xl overflow-hidden shadow-[inset_0_0_30px_rgba(250,204,21,0.15)] group">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(250,204,21,0.15),transparent_70%)] pointer-events-none" />

                {/* Animated 3D Coin Graphic Representation */}
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-yellow-100 via-yellow-400 to-amber-700 p-2 shadow-[0_0_35px_rgba(250,204,21,0.6)] animate-pulse flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-900 via-yellow-600 to-yellow-200 p-2 flex items-center justify-center border-2 border-yellow-200/80">
                    <div className="relative w-full h-full rounded-full bg-gradient-to-b from-yellow-400 via-amber-500 to-yellow-600 flex flex-col items-center justify-center shadow-inner text-amber-950 font-arcade">
                      {/* Beaded rim */}
                      <div className="absolute inset-1.5 rounded-full border-2 border-dashed border-amber-900/50 pointer-events-none" />
                      <div className="text-[9px] tracking-widest text-amber-900 font-bold mb-1">
                        ★ TECHORBIT ★
                      </div>
                      <div className="text-3xl font-black tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                        ★ 1 ★
                      </div>
                      <div className="text-[8px] tracking-widest text-amber-900 font-bold mt-1">
                        ARCADE TOKEN
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    id="coin-preview-collect-btn"
                    onClick={() => {
                      arcadeAudio.playCoin();
                      onCollectCoin();
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-arcade text-xs font-bold transition-all shadow-[0_0_15px_rgba(250,204,21,0.5)] active:scale-95 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>TOSS / COLLECT TOKEN</span>
                  </button>
                </div>
              </div>

              {/* Coin Specs */}
              <div className="space-y-4">
                <h3 className="font-arcade text-sm text-yellow-300">
                  SPECIFICATIONS & PHYSICAL SHADING
                </h3>
                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="p-3 bg-slate-900/70 border border-yellow-500/30 rounded-lg">
                    <span className="text-yellow-400 font-bold">24K Gold PBR Shader:</span> High
                    metalness (0.96) with low surface roughness (0.16) and subtle warm bronze
                    emissive ambient glow.
                  </div>
                  <div className="p-3 bg-slate-900/70 border border-yellow-500/30 rounded-lg">
                    <span className="text-yellow-400 font-bold">Minted Dual Relief:</span> Milled
                    outer rim with 48 micro-beads, circular inscription "★ TECHORBIT ARCADE TOKEN ★
                    2026 ★", and embossed 8-pointed arcade star crest.
                  </div>
                  <div className="p-3 bg-slate-900/70 border border-yellow-500/30 rounded-lg">
                    <span className="text-yellow-400 font-bold">Dynamic Glint & Gyroscopic Spin:</span>{' '}
                    Precession tumbling with 4-point golden lens flare sparkles and real-time click
                    raycasting for sound & collection.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Elevator Action */}
        {activeTab === 'elevator' && (
          <div className="space-y-5 animate-fade-in text-xs text-slate-300">
            <div className="p-4 bg-amber-950/20 border border-amber-500/40 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-arcade text-sm text-amber-300">
                  ELEVATOR ACTION (TAITO AMERICA, 1983)
                </h3>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/50 text-amber-300 text-[10px] font-arcade">
                  AUTHENTIC RETRO CABINET
                </span>
              </div>
              <p className="text-slate-300">
                Featuring the complete user-uploaded artwork suite:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-900/80 border border-slate-700/80 rounded-lg">
                  <div className="font-bold text-amber-300 mb-1">Striped Canopy Marquee:</div>
                  Iconic 3D yellow-to-red striped "ELEVATOR ACTION" typography with Agent 17 in
                  trenchcoat, hanging lamp, and Taito brand emblem.
                </div>
                <div className="p-3 bg-slate-900/80 border border-slate-700/80 rounded-lg">
                  <div className="font-bold text-amber-300 mb-1">CRT Screen & Bezel:</div>
                  Multi-floor cross-section hotel display showing levels 16 to 19, elevator shaft,
                  secret blue & red doors, and illuminated dial bezel.
                </div>
                <div className="p-3 bg-slate-900/80 border border-slate-700/80 rounded-lg">
                  <div className="font-bold text-amber-300 mb-1">Taito Curved Racing Side Art:</div>
                  Brown/tan aerodynamic concentric racing bands on plywood grain (`Wood_Ply.jpg`)
                  with T-molding rim.
                </div>
                <div className="p-3 bg-slate-900/80 border border-slate-700/80 rounded-lg">
                  <div className="font-bold text-amber-300 mb-1">Dual Coin Door & Treadplate:</div>
                  Illuminated orange 25¢ insert coin reject buttons and diamond tread metal kickplate
                  (`Metal_St.jpg`).
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Asteroids */}
        {activeTab === 'asteroids' && (
          <div className="space-y-5 animate-fade-in text-xs text-slate-300">
            <div className="p-4 bg-cyan-950/20 border border-cyan-500/40 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-arcade text-sm text-cyan-300">
                  ASTEROIDS (ATARI INC., 1979)
                </h3>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 text-[10px] font-arcade">
                  VECTOR CLASSIC
                </span>
              </div>
              <p className="text-slate-300">
                Faithfully recreated with high-resolution vector artwork:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-900/80 border border-slate-700/80 rounded-lg">
                  <div className="font-bold text-cyan-300 mb-1">Glowing Vector Marquee:</div>
                  Atari logo, deep space backdrop with vector asteroid rocks, and cyan glowing
                  "ASTEROIDS" headline.
                </div>
                <div className="p-3 bg-slate-900/80 border border-slate-700/80 rounded-lg">
                  <div className="font-bold text-cyan-300 mb-1">Supersonic Spaceship Side Art:</div>
                  Iconic Atari space combat illustration with cosmic pink-to-cyan supersonic speed
                  trails, wedge ship, and target rings.
                </div>
                <div className="p-3 bg-slate-900/80 border border-slate-700/80 rounded-lg">
                  <div className="font-bold text-cyan-300 mb-1">Mondrian Geometric Control Panel:</div>
                  Red, white, and navy panels with explicit markings: "ROTATE LEFT", "ROTATE RIGHT",
                  "THRUST", "FIRE", "HYPER SPACE".
                </div>
                <div className="p-3 bg-slate-900/80 border border-slate-700/80 rounded-lg">
                  <div className="font-bold text-cyan-300 mb-1">Vector Glow Display & Footrest:</div>
                  Cathode-ray tube vector rocks, UFO flying saucer, and industrial diamond steel
                  footrest.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Pirate Chests & Ammunition Crates */}
        {activeTab === 'crates' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pirate Treasure Chest Card */}
              <div className="p-5 bg-gradient-to-b from-[#1c120a] to-[#0d0905] border border-amber-500/50 rounded-xl space-y-4 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
                <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏴‍☠️</span>
                    <h3 className="font-arcade text-amber-300 text-sm">PIRATE CHEST OF GOLD COINS</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 font-arcade text-[10px]">
                    24K OVERFLOW
                  </span>
                </div>

                <div className="relative h-44 rounded-lg bg-gradient-to-b from-[#2a170a] to-[#120a04] border border-amber-500/30 flex flex-col items-center justify-center overflow-hidden p-4">
                  {/* Decorative glowing treasure chest visual */}
                  <div className="relative w-36 h-28 bg-[#3d2112] rounded-t-xl border-2 border-amber-950 flex flex-col items-center justify-between p-2 shadow-[0_0_25px_rgba(245,158,11,0.4)]">
                    {/* Wrought Iron Banding */}
                    <div className="absolute inset-x-0 top-6 h-2 bg-zinc-900 border-y border-zinc-700" />
                    <div className="absolute inset-y-0 left-6 w-2 bg-zinc-900 border-x border-zinc-700" />
                    <div className="absolute inset-y-0 right-6 w-2 bg-zinc-900 border-x border-zinc-700" />
                    
                    {/* Skull Emblem */}
                    <div className="z-10 text-amber-300 text-xs font-arcade font-bold">☠ JOLLY ROGER</div>

                    {/* Overflowing Gold Coins */}
                    <div className="z-10 flex flex-wrap items-center justify-center gap-1 -mt-1">
                      {[...Array(9)].map((_, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-200 via-yellow-400 to-amber-600 border border-yellow-200 shadow-[0_0_8px_rgba(250,204,21,0.8)] animate-pulse"
                          style={{ animationDelay: `${i * 120}ms` }}
                        />
                      ))}
                    </div>

                    {/* Brass Keyhole Lock */}
                    <div className="z-10 w-4 h-5 rounded-sm bg-yellow-500 border border-amber-700 flex items-center justify-center">
                      <div className="w-1 h-2 bg-black rounded-full" />
                    </div>
                  </div>

                  <div className="mt-2 text-[11px] text-yellow-300 font-arcade flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Click chests in 3D scene to collect gold tokens</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="font-bold text-amber-200">Pirate Chest Specifications:</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    <li><strong className="text-slate-200">Weathered Sea Oak:</strong> Dark seasoned planks with authentic grain fibers and iron square nails.</li>
                    <li><strong className="text-slate-200">Wrought-Iron Banding:</strong> Corner L-brackets, forged iron rivets, and side drop-handles.</li>
                    <li><strong className="text-slate-200">Arched Domed Lid:</strong> Barrel-domed lid propped open at 45° with brass padlock hasp.</li>
                    <li><strong className="text-slate-200">Heaped 24K Coins:</strong> 28+ minted gold coins stacked inside plus cascading coins spilling onto the corridor floor.</li>
                    <li><strong className="text-slate-200">Treasury Radiance:</strong> Warm interior amber point light + animated 4-point golden star flare sparkle.</li>
                  </ul>
                </div>
              </div>

              {/* Military Ammunition Crate Card */}
              <div className="p-5 bg-gradient-to-b from-[#141b12] to-[#090e08] border border-emerald-500/50 rounded-xl space-y-4 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎖️</span>
                    <h3 className="font-arcade text-emerald-300 text-sm">MIL-SPEC AMMUNITION CRATES</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-arcade text-[10px]">
                    7.62MM NATO
                  </span>
                </div>

                <div className="relative h-44 rounded-lg bg-gradient-to-b from-[#232c1e] to-[#10160d] border border-emerald-500/30 flex flex-col items-center justify-center overflow-hidden p-4">
                  {/* Tactical Ammo Crate graphic */}
                  <div className="relative w-44 h-24 bg-[#2e3b26] border-2 border-emerald-950 rounded p-2 flex flex-col justify-between shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    {/* Yellow Hazard Stripes */}
                    <div className="h-2.5 w-full bg-[repeating-linear-gradient(45deg,#eab308,#eab308_8px,#18181b_8px,#18181b_16px)] rounded-t-sm" />
                    
                    {/* Stencil Text */}
                    <div className="font-mono text-[10px] text-yellow-300 font-black tracking-wider leading-tight">
                      <div>AMMUNITION CRATE</div>
                      <div className="text-[8px] text-slate-200 font-bold">CAL. 7.62MM NATO M80</div>
                      <div className="text-[7px] text-slate-400">LOT AM-84D012-005 • 1,000 RDS</div>
                    </div>

                    {/* Corner Steel Guards & Yellow Clasps */}
                    <div className="flex items-center justify-between">
                      <div className="w-2 h-4 bg-yellow-400 rounded-sm" />
                      <div className="text-[9px] text-yellow-400 font-arcade">CLASS 1.4S HIGH EXP</div>
                      <div className="w-2 h-4 bg-yellow-400 rounded-sm" />
                    </div>
                  </div>

                  <div className="mt-2 text-[11px] text-emerald-300 font-arcade">
                    Stacked caches & open supply crates with brass ammo cartridges
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="font-bold text-emerald-200">Ammunition Crate Specifications:</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    <li><strong className="text-slate-200">Tactical Olive Drab:</strong> Matte ballistic steel casing with micro-noise weathering and edge wear.</li>
                    <li><strong className="text-slate-200">Authentic Military Stencils:</strong> Caliber 7.62mm NATO, lot code, Class 1.4S High Explosive warning box.</li>
                    <li><strong className="text-slate-200">Safety Hazard Chevrons:</strong> High-visibility black & yellow diagonal hazard caution striping.</li>
                    <li><strong className="text-slate-200">Open Supply Variant:</strong> Propped lid revealing 3 rows of shiny metallic brass cartridges with copper tips.</li>
                    <li><strong className="text-slate-200">Double-Stack Form Factor:</strong> Stacked caches along the arcade corridor with realistic 8.5° angle offsets.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Integrated directly into the 3D WebGL camera scroll corridor</span>
          </div>
          <button
            id="close-terminal-footer-btn"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-arcade text-xs transition-colors cursor-pointer"
          >
            RETURN TO FLIGHT
          </button>
        </div>
      </div>
    </div>
  );
};
