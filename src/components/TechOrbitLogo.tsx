import React from 'react';

export interface TechOrbitLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showGraphic?: boolean;
  showText?: boolean;
  showSubtitle?: boolean;
  className?: string;
}

export interface TechOrbitTextProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
}

export interface TechOrbitGraphicProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
}

/**
 * Common SVG Defs for Pixel Arcade Gradients & Effects
 */
export const TechOrbitDefs: React.FC = () => (
  <defs>
    {/* 80s/90s Arcade 6-Stripe Horizontal Raster Gradient */}
    <linearGradient id="arcadeRasterStripeGrad" x1="0" y1="118" x2="0" y2="178" gradientUnits="userSpaceOnUse">
      {/* Stripe 1: Electric Lemon Yellow */}
      <stop offset="0%" stopColor="#FFE700" />
      <stop offset="16.6%" stopColor="#FFE700" />
      {/* Stripe 2: Golden Amber */}
      <stop offset="16.7%" stopColor="#FFBA00" />
      <stop offset="33.3%" stopColor="#FFBA00" />
      {/* Stripe 3: Warm Gold-Orange */}
      <stop offset="33.4%" stopColor="#FF8E00" />
      <stop offset="50.0%" stopColor="#FF8E00" />
      {/* Stripe 4: Arcade Vibrant Orange */}
      <stop offset="50.1%" stopColor="#FF5800" />
      <stop offset="66.6%" stopColor="#FF5800" />
      {/* Stripe 5: Vivid Red-Orange */}
      <stop offset="66.7%" stopColor="#E62E00" />
      <stop offset="83.3%" stopColor="#E62E00" />
      {/* Stripe 6: Deep Crimson Red */}
      <stop offset="83.4%" stopColor="#BD1400" />
      <stop offset="100%" stopColor="#BD1400" />
    </linearGradient>

    {/* 3D Drop Block Shadow Gradient */}
    <linearGradient id="arcade3DBlockGrad" x1="0" y1="178" x2="0" y2="204" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stopColor="#0B1C38" />
      <stop offset="100%" stopColor="#030814" />
    </linearGradient>

    {/* Pixel Retro CRT Screen Glow Filter */}
    <filter id="arcadePixelGlow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#FF7700" floodOpacity="0.45" />
      <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#020814" floodOpacity="0.8" />
    </filter>

    {/* Scanline pattern for authentic arcade monitor texture */}
    <pattern id="arcadeScanlines" width="100" height="4" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="100" y2="0" stroke="#000000" strokeWidth="1" opacity="0.18" />
    </pattern>
  </defs>
);

/**
 * 8-Bit Pixel Star Sprite (Classic 4-pointed cross star)
 */
export const PixelStar: React.FC<{ x: number; y: number; size?: number; color?: string }> = ({
  x,
  y,
  size = 4,
  color = '#FFE700',
}) => {
  return (
    <g shapeRendering="crispEdges">
      {/* Center 2x2 unit */}
      <rect x={x - size} y={y - size} width={size * 2} height={size * 2} fill="#FFFFFF" />
      {/* Arms */}
      <rect x={x - size * 2} y={y - size / 2} width={size} height={size} fill={color} />
      <rect x={x + size} y={y - size / 2} width={size} height={size} fill={color} />
      <rect x={x - size / 2} y={y - size * 2} width={size} height={size} fill={color} />
      <rect x={x - size / 2} y={y + size} width={size} height={size} fill={color} />
    </g>
  );
};

/**
 * Pure Pixel-Art Arcade Joystick & Gear Orbit
 * Built entirely of discrete square/rectangular pixel blocks - NO smooth vector curves!
 */
export const PixelArcadeGraphic: React.FC = () => {
  return (
    <g id="pixel-arcade-graphic" shapeRendering="crispEdges">
      {/* ========================================================
          1. RETRO PIXEL COGWHEEL / ORBITAL GEAR (Centered at x=270, y=70)
          ======================================================== */}
      <g id="pixel-gear">
        {/* Dark Emerald/Navy Outer Silhouette (Heavy 4px pixel border) */}
        <path
          d="
            M 258 14 H 282 V 22 H 294 V 26 H 306 V 32 H 318 V 40 H 326 V 50 H 336 V 62 H 346 V 82 H 336 V 94 H 326 V 104 H 314 V 112 H 302 V 118 H 282 V 126 H 258 V 118 H 238 V 112 H 226 V 104 H 214 V 94 H 204 V 82 H 194 V 62 H 204 V 50 H 214 V 40 H 226 V 32 H 238 V 26 H 250 V 22 H 258 Z
          "
          fill="#061c12"
        />

        {/* Outer Teeth & Gear Body in Warm Orange-Amber Pixel Steps */}
        <path
          d="
            M 262 18 H 278 V 26 H 290 V 30 H 302 V 36 H 314 V 44 H 322 V 54 H 332 V 66 H 342 V 78 H 332 V 90 H 322 V 100 H 310 V 108 H 298 V 114 H 278 V 122 H 262 V 114 H 242 V 108 H 230 V 100 H 218 V 90 H 208 V 78 H 218 V 66 H 228 V 54 H 238 V 44 H 250 V 36 H 262 Z
          "
          fill="#FF6A00"
        />

        {/* Gear Top Highlight Pixels (Yellow/Gold pixel glints) */}
        <rect x="262" y="18" width="16" height="4" fill="#FFE700" />
        <rect x="290" y="30" width="12" height="4" fill="#FFE700" />
        <rect x="238" y="30" width="12" height="4" fill="#FFBA00" />
        <rect x="314" y="44" width="8" height="6" fill="#FFBA00" />
        <rect x="218" y="44" width="8" height="6" fill="#FF8E00" />

        {/* Gear Teeth Shadow Pixels (Deep red-orange) */}
        <rect x="262" y="118" width="16" height="4" fill="#B71C1C" />
        <rect x="332" y="74" width="10" height="8" fill="#B71C1C" />
        <rect x="208" y="74" width="10" height="8" fill="#B71C1C" />

        {/* Center Pixel Circular Aperture (Dark emerald arcade void) */}
        <path
          d="
            M 254 54 H 286 V 58 H 294 V 66 H 298 V 78 H 294 V 86 H 286 V 90 H 254 V 86 H 246 V 78 H 242 V 66 H 246 V 58 H 254 Z
          "
          fill="#061c12"
        />
        {/* Inner Gold Rim Ring */}
        <rect x="254" y="54" width="32" height="2" fill="#FFBA00" />
        <rect x="254" y="88" width="32" height="2" fill="#B71C1C" />
      </g>

      {/* ========================================================
          2. ISOMETRIC PIXEL ARCADE CONSOLE BASE (2:1 Isometric Steps)
          ======================================================== */}
      <g id="pixel-console-deck">
        {/* Base Outer Silhouette (Dark Navy/Green pixel border) */}
        <path
          d="
            M 270 52 
            L 294 64 L 318 76 L 334 84 
            V 98 
            L 318 106 L 294 118 L 270 130 
            L 246 118 L 222 106 L 206 98 
            V 84 
            L 222 76 L 246 64 
            Z
          "
          fill="#061c12"
        />

        {/* Left 3D Vertical Side Skirt (Warm Rust Terracotta Pixels) */}
        <path
          d="
            M 206 84 L 270 116 V 128 L 206 96 Z
          "
          fill="#9C4215"
        />
        {/* Right 3D Vertical Side Skirt (Deep Shadow Mahogany Pixels) */}
        <path
          d="
            M 270 116 L 334 84 V 96 L 270 128 Z
          "
          fill="#5C1D06"
        />

        {/* Top Deck Surface (Golden arcade console plate) */}
        <polygon
          points="270,56 330,86 270,116 210,86"
          fill="#F59E0B"
        />
        {/* Top Deck Inner Inset Highlight Plate */}
        <polygon
          points="270,62 322,86 270,110 218,86"
          fill="#FCD34D"
        />

        {/* Pixel Arcade Push-Button on Deck */}
        <g id="pixel-button">
          <rect x="236" y="80" width="12" height="8" fill="#061c12" />
          <rect x="238" y="78" width="8" height="6" fill="#DC2626" />
          <rect x="240" y="78" width="4" height="2" fill="#FEF08A" />
        </g>

        {/* Joystick Base Mounting Washer (Stepped Pixel Oval) */}
        <path
          d="
            M 262 82 H 278 V 84 H 284 V 88 H 278 V 90 H 262 V 88 H 256 V 84 H 262 Z
          "
          fill="#061c12"
        />
        <rect x="264" y="84" width="12" height="4" fill="#475569" />
        <rect x="268" y="84" width="4" height="4" fill="#0F172A" />
      </g>

      {/* ========================================================
          3. METAL JOYSTICK SHAFT (Vertical Stepped Pixel Column)
          ======================================================== */}
      <g id="pixel-joystick-shaft">
        {/* Shaft border */}
        <rect x="266" y="48" width="8" height="38" fill="#061c12" />
        {/* Highlight pixel stripe */}
        <rect x="268" y="48" width="2" height="36" fill="#F8FAFC" />
        {/* Midtone pixel stripe */}
        <rect x="270" y="48" width="2" height="36" fill="#94A3B8" />
        {/* Shadow pixel stripe */}
        <rect x="272" y="48" width="2" height="36" fill="#334155" />
      </g>

      {/* ========================================================
          4. RETRO PIXEL JOYSTICK BALL-TOP (16-Bit Stepped Arcade Sphere)
          Centered at (270, 34) with radius ~18px
          ======================================================== */}
      <g id="pixel-joystick-ball">
        {/* Outer Heavy Dark Border (4px pixel steps) */}
        <path
          d="
            M 262 14 H 278 V 18 H 286 V 22 H 290 V 28 H 294 V 40 H 290 V 46 H 286 V 50 H 278 V 54 H 262 V 50 H 254 V 46 H 250 V 40 H 246 V 28 H 250 V 22 H 254 V 18 H 262 Z
          "
          fill="#061c12"
        />

        {/* Row-by-Row Discrete Pixel Spherical Body */}
        {/* Row 1: y=18..22 (Top rim) */}
        <rect x="262" y="18" width="16" height="4" fill="#FF5500" />
        {/* Row 2: y=22..26 */}
        <rect x="256" y="22" width="28" height="4" fill="#FF4400" />
        {/* Row 3: y=26..30 */}
        <rect x="252" y="26" width="36" height="4" fill="#FF3300" />
        {/* Rows 4-6: y=30..42 (Equator) */}
        <rect x="250" y="30" width="40" height="12" fill="#E62200" />
        {/* Row 7: y=42..46 */}
        <rect x="252" y="42" width="36" height="4" fill="#BD1400" />
        {/* Row 8: y=46..50 */}
        <rect x="256" y="46" width="28" height="4" fill="#8B0000" />

        {/* Specular White Pixel Glint (Top-left 4x4 & 2x2 highlight) */}
        <rect x="258" y="24" width="6" height="6" fill="#FFFFFF" />
        <rect x="264" y="24" width="4" height="4" fill="#FFF9C4" />
        <rect x="258" y="30" width="4" height="2" fill="#FFF9C4" />

        {/* Secondary Yellow Rim Highlight */}
        <rect x="264" y="18" width="12" height="2" fill="#FFE700" />
        <rect x="278" y="22" width="4" height="2" fill="#FFA000" />

        {/* Deep Bottom-Right Pixel Shadow Cluster */}
        <rect x="282" y="38" width="6" height="6" fill="#660000" />
        <rect x="274" y="46" width="8" height="4" fill="#4A0000" />
      </g>

      {/* ========================================================
          5. SURROUNDING RETRO PIXEL STARS & GLINTS
          ======================================================== */}
      <g id="pixel-stars">
        <PixelStar x={80} y={35} size={3} color="#FFE700" />
        <PixelStar x={160} y={45} size={2.5} color="#FFBA00" />
        <PixelStar x={190} y={70} size={3} color="#FFE700" />
        <PixelStar x={380} y={35} size={3} color="#FFE700" />
        <PixelStar x={360} y={65} size={2.5} color="#FF8E00" />
        <PixelStar x={445} y={60} size={3} color="#FFE700" />

        {/* Small floating 4x4 and 6x6 pixel chips */}
        <rect x="135" y="25" width="4" height="4" fill="#FFBA00" />
        <rect x="350" y="22" width="4" height="4" fill="#FFE700" />
        <rect x="420" y="40" width="6" height="6" fill="#FF8E00" />
        <rect x="95" y="65" width="6" height="6" fill="#FF5500" />
      </g>
    </g>
  );
};

/**
 * Authentic 80s/90s Arcade Pixel-Art Lettering for "TECHORBIT"
 * Pure blocky bitmap typography built on a strict 7x8 integer pixel matrix.
 * - Stepped 90-degree integer pixel geometry (no invalid path strings or font flash)
 * - 8 horizontal arcade raster color bands (Lemon Glint -> Gold -> Amber -> Orange -> Red -> Crimson)
 * - Heavy midnight navy pixel border outline
 * - Solid 3D drop-block pixel extrusion
 * - Specular pixel glints on the top row
 */
const WORD = ['T', 'E', 'C', 'H', 'O', 'R', 'B', 'I', 'T'] as const;

const LETTER_BITMAPS: Record<string, string[]> = {
  T: [
    '1111111',
    '1111111',
    '0011100',
    '0011100',
    '0011100',
    '0011100',
    '0011100',
    '0011100',
  ],
  E: [
    '1111111',
    '1100000',
    '1100000',
    '1111110',
    '1111110',
    '1100000',
    '1100000',
    '1111111',
  ],
  C: [
    '0111111',
    '1100000',
    '1100000',
    '1100000',
    '1100000',
    '1100000',
    '1100000',
    '0111111',
  ],
  H: [
    '1100011',
    '1100011',
    '1100011',
    '1111111',
    '1111111',
    '1100011',
    '1100011',
    '1100011',
  ],
  O: [
    '0111110',
    '1100011',
    '1100011',
    '1100011',
    '1100011',
    '1100011',
    '1100011',
    '0111110',
  ],
  R: [
    '1111110',
    '1100011',
    '1100011',
    '1111110',
    '1111100',
    '1101110',
    '1100111',
    '1100011',
  ],
  B: [
    '1111110',
    '1100011',
    '1100011',
    '1111110',
    '1100011',
    '1100011',
    '1100011',
    '1111110',
  ],
  I: [
    '1111111',
    '0011100',
    '0011100',
    '0011100',
    '0011100',
    '0011100',
    '0011100',
    '1111111',
  ],
};

const ROW_COLORS = [
  '#FFF875', // Row 0: Lemon Glint
  '#FFE600', // Row 1: Bright Yellow
  '#FFAE00', // Row 2: Gold Amber
  '#FF7700', // Row 3: Bright Orange
  '#FF3C00', // Row 4: Red-Orange
  '#E61A00', // Row 5: Vivid Red
  '#B80E00', // Row 6: Crimson
  '#7A0000', // Row 7: Deep Shadow Maroon
];

interface LetterRun {
  key: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  isTop: boolean;
}

interface ExtrusionColumn {
  key: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

// Precompute pixel layout for absolute highest rendering efficiency
const computePixelLettering = () => {
  const pixelSize = 5;
  const letterGap = 6;
  const letterWidth = 7 * pixelSize; // 35px
  const totalWidth = WORD.length * letterWidth + (WORD.length - 1) * letterGap; // 363px
  const startX = 270 - totalWidth / 2; // 88.5 -> exactly centered around 270
  const startY = 134;
  const extrusionHeight = 12;

  const runs: LetterRun[] = [];
  const extrusions: ExtrusionColumn[] = [];

  WORD.forEach((char, letterIdx) => {
    const bitmap = LETTER_BITMAPS[char];
    if (!bitmap) return;
    const letterStartX = startX + letterIdx * (letterWidth + letterGap);

    // 1. Compute horizontal pixel runs per row
    bitmap.forEach((rowStr, rowIdx) => {
      let runStart: number | null = null;
      for (let col = 0; col <= rowStr.length; col++) {
        const isPixel = col < rowStr.length && rowStr[col] === '1';
        if (isPixel && runStart === null) {
          runStart = col;
        } else if (!isPixel && runStart !== null) {
          const runWidth = (col - runStart) * pixelSize;
          runs.push({
            key: `run-${letterIdx}-${rowIdx}-${runStart}`,
            x: letterStartX + runStart * pixelSize,
            y: startY + rowIdx * pixelSize,
            width: runWidth,
            height: pixelSize,
            color: ROW_COLORS[rowIdx],
            isTop: rowIdx === 0,
          });
          runStart = null;
        }
      }
    });

    // 2. Compute 3D drop blocks under the bottom of each column
    for (let col = 0; col < 7; col++) {
      let maxRow = -1;
      for (let row = 7; row >= 0; row--) {
        if (bitmap[row][col] === '1') {
          maxRow = row;
          break;
        }
      }
      if (maxRow >= 0) {
        extrusions.push({
          key: `ext-${letterIdx}-${col}`,
          x: letterStartX + col * pixelSize,
          y: startY + (maxRow + 1) * pixelSize,
          width: pixelSize,
          height: extrusionHeight,
        });
      }
    }
  });

  return { runs, extrusions };
};

const { runs: PRECOMPUTED_RUNS, extrusions: PRECOMPUTED_EXTRUSIONS } = computePixelLettering();

export const TechOrbitRasterLettering: React.FC = () => {
  return (
    <g id="techorbit-raster-pixel-lettering" filter="url(#arcadePixelGlow)" shapeRendering="crispEdges">
      {/* Accessibility Title */}
      <title>TECHORBIT</title>

      {/* ========================================================
          1. 3D EXTRUSION BACK LAYER (Midnight Navy Shadow Shelves)
          ======================================================== */}
      <g id="pixel-3d-extrusion-outlines">
        {PRECOMPUTED_EXTRUSIONS.map((ext) => (
          <rect
            key={`out-${ext.key}`}
            x={ext.x - 2}
            y={ext.y - 2}
            width={ext.width + 4}
            height={ext.height + 4}
            fill="#020610"
          />
        ))}
      </g>
      <g id="pixel-3d-extrusion-faces">
        {PRECOMPUTED_EXTRUSIONS.map((ext) => (
          <g key={ext.key}>
            <rect
              x={ext.x}
              y={ext.y}
              width={ext.width}
              height={ext.height}
              fill="url(#arcade3DBlockGrad)"
              stroke="#030814"
              strokeWidth="0.5"
            />
            {/* Bottom 3D Rim Highlight */}
            <rect
              x={ext.x}
              y={ext.y + ext.height - 2}
              width={ext.width}
              height={2}
              fill="#061224"
            />
          </g>
        ))}
      </g>

      {/* ========================================================
          2. HEAVY DARK PIXEL BORDER OUTLINE (Expanded silhouette)
          ======================================================== */}
      <g id="pixel-outline-layer">
        {PRECOMPUTED_RUNS.map((run) => (
          <rect
            key={`border-${run.key}`}
            x={run.x - 2}
            y={run.y - 2}
            width={run.width + 4}
            height={run.height + 4}
            fill="#061c12"
          />
        ))}
      </g>

      {/* ========================================================
          3. FRONT LETTER FACES (8 Arcade Raster Horizontal Bands)
          ======================================================== */}
      <g id="pixel-raster-faces">
        {PRECOMPUTED_RUNS.map((run) => (
          <rect
            key={`face-${run.key}`}
            x={run.x}
            y={run.y}
            width={run.width}
            height={run.height}
            fill={run.color}
          />
        ))}
      </g>

      {/* ========================================================
          4. TOP PIXEL SPECULAR GLINTS (Glossy Arcade Sheen)
          ======================================================== */}
      <g id="top-pixel-highlights">
        {PRECOMPUTED_RUNS.filter((run) => run.isTop).map((run) => (
          <rect
            key={`glint-${run.key}`}
            x={run.x}
            y={run.y}
            width={run.width}
            height={1.5}
            fill="#FFFFFF"
            opacity={0.85}
          />
        ))}
      </g>

      {/* ========================================================
          5. FLANKING RETRO 8-BIT STARS & GLINTS
          ======================================================== */}
      <g id="flanking-pixel-stars">
        <PixelStar x={60} y={154} size={3.5} color="#FFE700" />
        <PixelStar x={480} y={154} size={3.5} color="#FFE700" />
        <rect x={74} y={140} width={3} height={3} fill="#FFBA00" />
        <rect x={464} y={166} width={3} height={3} fill="#FFBA00" />
      </g>
    </g>
  );
};

/**
 * Standalone Pixel-Art "TECHORBIT" Lettering
 */
export const TechOrbitText: React.FC<TechOrbitTextProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-48 sm:w-56 h-auto',
    md: 'w-64 sm:w-72 md:w-80 h-auto',
    lg: 'w-80 sm:w-96 md:w-[420px] h-auto',
    hero: 'w-full max-w-lg sm:max-w-xl md:max-w-2xl h-auto',
  }[size];

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="50 126 440 68"
        className={`${sizeClasses} drop-shadow-[0_4px_24px_rgba(255,100,0,0.45)]`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
        style={{ imageRendering: 'pixelated' }}
      >
        <TechOrbitDefs />
        <TechOrbitRasterLettering />
      </svg>
    </div>
  );
};

/**
 * Standalone Pixel-Art Joystick & Gear Graphic
 */
export const TechOrbitGraphic: React.FC<TechOrbitGraphicProps> = ({
  size = 'hero',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-48 sm:w-56 h-auto',
    md: 'w-64 sm:w-72 md:w-80 h-auto',
    lg: 'w-80 sm:w-96 md:w-[420px] h-auto',
    hero: 'w-full max-w-lg sm:max-w-xl md:max-w-2xl h-auto',
  }[size];

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="60 10 420 125"
        className={`${sizeClasses} drop-shadow-[0_8px_30px_rgba(255,140,0,0.45)]`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
        style={{ imageRendering: 'pixelated' }}
      >
        <TechOrbitDefs />
        <PixelArcadeGraphic />
      </svg>
    </div>
  );
};

/**
 * Complete Pixel-Art TechOrbit Logo with Joystick, Gear, and TECHORBIT Lettering
 * Exactly styled after classic 80s/90s arcade machine game titles!
 */
export const TechOrbitLogo: React.FC<TechOrbitLogoProps> = ({
  size = 'hero',
  showGraphic = true,
  showText = true,
  showSubtitle = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-44 h-auto',
    md: 'w-64 h-auto',
    lg: 'w-80 h-auto sm:w-96',
    hero: 'w-full max-w-lg sm:max-w-xl md:max-w-2xl h-auto',
  }[size];

  return (
    <div className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}>
      <svg
        viewBox={showSubtitle ? '40 10 460 235' : '40 10 460 200'}
        className={`${sizeClasses} drop-shadow-[0_8px_32px_rgba(255,120,0,0.4)]`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
        style={{ imageRendering: 'pixelated' }}
      >
        <TechOrbitDefs />

        {/* 1. RETRO PIXEL JOYSTICK & GEAR GRAPHIC */}
        {showGraphic && <PixelArcadeGraphic />}

        {/* 2. AUTHENTIC 80s ARCADE PIXEL LETTERING: "TECHORBIT" */}
        {showText && <TechOrbitRasterLettering />}

        {/* Optional Retro Subtitle */}
        {showSubtitle && (
          <g id="techorbit-pixel-subtitle">
            <text
              x="270"
              y="222"
              textAnchor="middle"
              className="font-arcade"
              fontSize="12"
              letterSpacing="4"
              fill="#061c12"
              fontWeight="bold"
            >
              ★ THE TECHNOLOGY ADVENTURE ★
            </text>
            <text
              x="270"
              y="220"
              textAnchor="middle"
              className="font-arcade"
              fontSize="12"
              letterSpacing="4"
              fill="#FFE700"
              fontWeight="bold"
            >
              ★ THE TECHNOLOGY ADVENTURE ★
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
