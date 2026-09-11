import * as THREE from 'three';

/**
 * Procedural texture generator replicating the user's uploaded arcade assets:
 * - Elevator Action (Taito) marquee, side art, bezel, and CRT gameplay screen
 * - Asteroids (Atari) marquee, side art, geometric control panel, and vector CRT
 * - Diamond tread steel plate (Metal_St.jpg)
 * - Plywood woodgrain cabinet side texture (Wood_Ply.jpg)
 * - Minted gold coin face & normal map for improved 24K gold arcade tokens
 */

// Helper to create a Three.js CanvasTexture from an offscreen canvas
function canvasToTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * 1. Elevator Action Marquee Texture
 * Recreates the iconic red/yellow striped 3D "ELEVATOR ACTION" typography,
 * Taito brand logo, trenchcoat spy silhouette, yellow door, and hanging light fixture.
 */
export function createElevatorActionMarqueeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background: Warm wood/brown retro tone
  const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bgGrad.addColorStop(0, '#53230b');
  bgGrad.addColorStop(0.5, '#8c441c');
  bgGrad.addColorStop(1, '#3b1705');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Wood grain subtle horizontal streaks
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  for (let y = 0; y < canvas.height; y += 4) {
    if (Math.sin(y * 0.2) > 0) {
      ctx.fillRect(0, y, canvas.width, 2);
    }
  }

  // Hanging ceiling lamp on left
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(70, 0);
  ctx.lineTo(70, 45);
  ctx.stroke();

  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.ellipse(70, 52, 28, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Taito Logo in banner left
  ctx.fillStyle = '#fef08a';
  ctx.strokeStyle = '#1e1b4b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(125, 20);
  ctx.lineTo(195, 20);
  ctx.lineTo(185, 52);
  ctx.lineTo(135, 52);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#1e1b4b';
  ctx.font = '900 16px "Arial Black", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TAITO', 160, 42);

  // Left red door frame with spy leaning out
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(40, 110, 130, 200);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(52, 122, 105, 188);

  // Spy silhouette in left door
  ctx.fillStyle = '#1c1917';
  // Fedora hat
  ctx.beginPath();
  ctx.ellipse(105, 155, 32, 8, -0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(88, 136, 32, 20);
  // Trenchcoat & arm aiming gun
  ctx.fillRect(80, 165, 45, 90);
  ctx.fillRect(120, 175, 32, 12); // gun arm
  ctx.fillRect(150, 170, 12, 20); // revolver

  // Main "ELEVATOR ACTION" Typography
  // Red & Yellow horizontal striped retro 3D display lettering
  const drawStripedText = (
    text: string,
    x: number,
    y: number,
    fontSize: number,
    skew: number
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.transform(1, 0, skew, 1, 0, 0);

    // Deep black drop shadow
    ctx.font = `900 ${fontSize}px "Impact", "Arial Black", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#0f0502';
    for (let s = 14; s > 0; s -= 2) {
      ctx.fillText(text, s, s);
    }

    // White outer stroke
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 14;
    ctx.lineJoin = 'round';
    ctx.strokeText(text, 0, 0);

    // Black intermediate stroke
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 8;
    ctx.strokeText(text, 0, 0);

    // Text fill with top-half yellow and bottom-half red horizontal stripes
    const textGrad = ctx.createLinearGradient(0, -fontSize * 0.45, 0, fontSize * 0.45);
    textGrad.addColorStop(0, '#fef08a');
    textGrad.addColorStop(0.48, '#facc15');
    textGrad.addColorStop(0.5, '#dc2626');
    textGrad.addColorStop(1, '#991b1b');
    ctx.fillStyle = textGrad;
    ctx.fillText(text, 0, 0);

    // Crisp black scanline stripes across the lower red half
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    for (let i = 0; i < fontSize * 0.45; i += 5) {
      ctx.fillRect(-fontSize * 2.5, i, fontSize * 5, 2);
    }

    ctx.restore();
  };

  drawStripedText('ELEVATOR', 520, 100, 84, -0.1);
  drawStripedText('Action', 545, 215, 96, -0.15);

  // Right Side: Yellow Elevator with Agent 17 in trenchcoat holding Top Secret folder
  ctx.fillStyle = '#facc15';
  ctx.fillRect(800, 60, 200, 250);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 6;
  ctx.strokeRect(800, 60, 200, 250);

  // Agent 17 illustration representation
  ctx.fillStyle = '#e2e8f0'; // light trenchcoat
  ctx.fillRect(840, 110, 80, 150);
  ctx.fillStyle = '#1e293b'; // tie & collar
  ctx.fillRect(875, 125, 12, 35);
  // Head & hair
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(880, 95, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fed7aa'; // face
  ctx.fillRect(865, 85, 30, 26);
  // Gun in hand
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(925, 95, 24, 10);
  ctx.fillRect(935, 105, 8, 14);

  // Top Secret Folder
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  ctx.save();
  ctx.translate(890, 180);
  ctx.rotate(-0.25);
  ctx.fillRect(-22, -30, 44, 60);
  ctx.strokeRect(-22, -30, 44, 60);
  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 8px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TOP SECRET', 0, -5);
  ctx.restore();

  // Glass shine reflection over the entire marquee
  const shine = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  shine.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
  shine.addColorStop(0.3, 'rgba(255, 255, 255, 0.05)');
  shine.addColorStop(0.5, 'transparent');
  shine.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
  ctx.fillStyle = shine;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  return canvasToTexture(canvas);
}

/**
 * 2. Elevator Action Side Art Texture
 * Recreates the retro brown/tan arcade side panel with Taito curved racing bands.
 */
export function createElevatorActionSideTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Base tan/brown arcade cabinet finish
  ctx.fillStyle = '#b78358';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle woodgrain pattern
  ctx.fillStyle = 'rgba(78, 42, 17, 0.08)';
  for (let i = 0; i < canvas.height; i += 3) {
    if (Math.sin(i * 0.08) > 0) {
      ctx.fillRect(0, i, canvas.width, 1.5);
    }
  }

  // Taito Header Ribbon
  ctx.fillStyle = '#7a3111';
  ctx.beginPath();
  ctx.moveTo(40, 60);
  ctx.lineTo(240, 60);
  ctx.lineTo(260, 110);
  ctx.lineTo(40, 110);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#b78358';
  ctx.font = '900 36px "Arial Black", sans-serif';
  ctx.fillText('TAITO', 60, 100);

  // Iconic curved concentric stripes (Brown / Dark Red / Tan bands)
  ctx.strokeStyle = '#7a3111';
  ctx.lineWidth = 26;
  ctx.lineCap = 'square';

  // Upper ear curve
  ctx.beginPath();
  ctx.moveTo(50, 120);
  ctx.lineTo(50, 280);
  ctx.arcTo(50, 480, 200, 480, 120);
  ctx.lineTo(440, 480);
  ctx.stroke();

  // Second inner band
  ctx.lineWidth = 18;
  ctx.strokeStyle = '#4a1d0a';
  ctx.beginPath();
  ctx.moveTo(90, 140);
  ctx.lineTo(90, 280);
  ctx.arcTo(90, 520, 220, 520, 100);
  ctx.lineTo(440, 520);
  ctx.stroke();

  // Bottom geometric horizontal block stripes
  const bandY = [600, 680, 760, 840];
  bandY.forEach((y, idx) => {
    ctx.fillStyle = idx % 2 === 0 ? '#7a3111' : '#5a220c';
    ctx.fillRect(50, y, 380 - idx * 40, 45);
    ctx.fillStyle = '#301105';
    ctx.fillRect(50, y + 38, 380 - idx * 40, 7);
  });

  // T-molding dark outline
  ctx.strokeStyle = '#271207';
  ctx.lineWidth = 10;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

  return canvasToTexture(canvas);
}

/**
 * 3. Elevator Action CRT Gameplay Screen
 * Recreates the 8-bit cross-section building levels 16, 17, 18 with elevator shaft,
 * blue & red doors, elevator carriage, and score header.
 */
export function createElevatorActionScreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 448;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // CRT Screen deep cyan-black background
  ctx.fillStyle = '#081a24';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Header: PLAYER-1, HI-SCORE, CREDITS in retro arcade font
  ctx.fillStyle = '#f472b6'; // retro hot pink arcade score font
  ctx.font = 'bold 16px "Courier New", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('PLAYER-1', 20, 25);
  ctx.fillText('004200', 20, 45);

  ctx.textAlign = 'center';
  ctx.fillText('HI-SCORE', 256, 25);
  ctx.fillText('035000', 256, 45);

  ctx.textAlign = 'right';
  ctx.fillText('CREDIT 02', 492, 45);

  // Multi-floor building structure
  const floors = [
    { y: 80, num: 19 },
    { y: 160, num: 18 },
    { y: 240, num: 17 },
    { y: 320, num: 16 },
  ];

  floors.forEach((f) => {
    // Floor girder beam
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(0, f.y + 60, canvas.width, 14);

    // Floor room wallpaper (teal arcade walls)
    ctx.fillStyle = '#0f766e';
    ctx.fillRect(0, f.y, canvas.width, 60);

    // Central elevator shaft void
    ctx.fillStyle = '#041017';
    ctx.fillRect(215, f.y, 82, 60);

    // Red floor number tag on right wall
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(455, f.y + 4, 38, 20);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${f.num}`, 474, f.y + 19);

    // Doors: Blue & Red secret doors
    const doorX = [40, 110, 160, 310, 370, 415];
    doorX.forEach((dx, i) => {
      ctx.fillStyle = i === 1 || i === 4 ? '#b91c1c' : '#1d4ed8';
      ctx.fillRect(dx, f.y + 12, 34, 48);
      ctx.strokeStyle = '#020617';
      ctx.lineWidth = 2;
      ctx.strokeRect(dx, f.y + 12, 34, 48);
      // Door knob
      ctx.fillStyle = '#facc15';
      ctx.fillRect(dx + 28, f.y + 36, 3, 4);
    });
  });

  // Elevator Carriage in central shaft (between floor 17 & 18)
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(217, 180, 78, 66);
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 3;
  ctx.strokeRect(217, 180, 78, 66);
  // Elevator cable
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(256, 60);
  ctx.lineTo(256, 180);
  ctx.stroke();

  // Agent 17 sprite inside elevator
  ctx.fillStyle = '#f8fafc'; // trenchcoat
  ctx.fillRect(246, 210, 20, 30);
  ctx.fillStyle = '#0f172a'; // fedora
  ctx.fillRect(243, 202, 26, 6);
  ctx.fillRect(247, 196, 18, 8);

  // Basement brick foundation at the bottom
  ctx.fillStyle = '#991b1b';
  ctx.fillRect(0, 394, canvas.width, 54);
  ctx.strokeStyle = '#450a0a';
  ctx.lineWidth = 2;
  for (let by = 394; by < canvas.height; by += 12) {
    for (let bx = (by % 24 === 0 ? 0 : 16); bx < canvas.width; bx += 32) {
      ctx.strokeRect(bx, by, 32, 12);
    }
  }

  // CRT Scanlines and curvature vignette
  ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
  for (let y = 0; y < canvas.height; y += 3) {
    ctx.fillRect(0, y, canvas.width, 1);
  }

  const vignette = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    180,
    canvas.width / 2,
    canvas.height / 2,
    300
  );
  vignette.addColorStop(0, 'transparent');
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  return canvasToTexture(canvas);
}

/**
 * 4. Asteroids Marquee Texture
 * Recreates the Atari Asteroids vector typography with explosive cosmic starburst.
 */
export function createAsteroidsMarqueeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep space black background
  ctx.fillStyle = '#04040c';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Stars
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 160; i++) {
    const sx = Math.random() * canvas.width;
    const sy = Math.random() * canvas.height;
    const sr = Math.random() * 2 + 0.5;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  }

  // Cosmic neon laser streak across marquee
  const streak = ctx.createLinearGradient(0, 260, canvas.width, 40);
  streak.addColorStop(0, 'rgba(6, 182, 212, 0.8)');
  streak.addColorStop(0.5, 'rgba(236, 72, 153, 0.8)');
  streak.addColorStop(1, 'rgba(250, 204, 21, 0.8)');
  ctx.strokeStyle = streak;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(40, 260);
  ctx.lineTo(canvas.width - 40, 50);
  ctx.stroke();

  // Vector Asteroids Rocks in background
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  const drawRock = (x: number, y: number, r: number) => {
    ctx.beginPath();
    const pts = 8;
    for (let p = 0; p < pts; p++) {
      const ang = (p / pts) * Math.PI * 2;
      const rad = r * (0.7 + (p % 2) * 0.5);
      const px = x + Math.cos(ang) * rad;
      const py = y + Math.sin(ang) * rad;
      if (p === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
  };

  drawRock(120, 100, 48);
  drawRock(880, 200, 60);
  drawRock(780, 80, 32);

  // Main "ASTEROIDS" Vector Typography
  ctx.save();
  ctx.font = '900 110px "Impact", "Arial Black", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Outer glowing stroke
  ctx.strokeStyle = '#00f3ff';
  ctx.lineWidth = 12;
  ctx.shadowColor = '#00f3ff';
  ctx.shadowBlur = 24;
  ctx.strokeText('ASTEROIDS', canvas.width / 2, canvas.height / 2);

  // Crisp white inner vector text
  ctx.fillStyle = '#ffffff';
  ctx.fillText('ASTEROIDS', canvas.width / 2, canvas.height / 2);
  ctx.restore();

  // Atari logo on left
  ctx.fillStyle = '#ef4444';
  ctx.font = '900 24px "Arial Black", sans-serif';
  ctx.fillText('ATARI', 120, 260);

  return canvasToTexture(canvas);
}

/**
 * 5. Asteroids Side Art Texture
 * Recreates the iconic Atari rocket ship swooping through psychedelic space with planets and asteroids.
 */
export function createAsteroidsSideTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Black space
  ctx.fillStyle = '#06060e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Diagonal supersonic flight trail (Pink & Cyan cosmic streaks)
  const cosmicGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  cosmicGrad.addColorStop(0, '#ec4899');
  cosmicGrad.addColorStop(0.35, '#8b5cf6');
  cosmicGrad.addColorStop(0.65, '#06b6d4');
  cosmicGrad.addColorStop(1, '#0284c7');

  ctx.fillStyle = cosmicGrad;
  ctx.beginPath();
  ctx.moveTo(80, 0);
  ctx.lineTo(240, 0);
  ctx.lineTo(canvas.width, 700);
  ctx.lineTo(canvas.width, 920);
  ctx.lineTo(120, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.closePath();
  ctx.fill();

  // Neon speed lines
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  for (let l = 0; l < 8; l++) {
    ctx.beginPath();
    ctx.moveTo(40 + l * 50, 0);
    ctx.lineTo(canvas.width, 400 + l * 70);
    ctx.stroke();
  }

  // Futuristic Space Battle Ship (white wedge shape with red & yellow cockpit)
  ctx.save();
  ctx.translate(280, 360);
  ctx.rotate(-0.65);

  // Ship hull
  ctx.fillStyle = '#f8fafc';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(140, 0);
  ctx.lineTo(-90, -70);
  ctx.lineTo(-40, 0);
  ctx.lineTo(-90, 70);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Cockpit canopy
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(-10, -14, 50, 28);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(10, -8, 20, 16);

  // Thruster flame exhaust
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.moveTo(-40, -20);
  ctx.lineTo(-120, 0);
  ctx.lineTo(-40, 20);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Exploding Target Rings & Asteroids
  const rings = [
    { x: 380, y: 160, r: 50, col: '#ef4444' },
    { x: 140, y: 720, r: 65, col: '#f59e0b' },
    { x: 360, y: 820, r: 45, col: '#06b6d4' },
  ];

  rings.forEach((rg) => {
    ctx.strokeStyle = rg.col;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(rg.x, rg.y, rg.r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(rg.x, rg.y, rg.r * 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Spikes / blast rays
    ctx.lineWidth = 4;
    for (let a = 0; a < 8; a++) {
      const ang = (a / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(rg.x + Math.cos(ang) * rg.r, rg.y + Math.sin(ang) * rg.r);
      ctx.lineTo(rg.x + Math.cos(ang) * (rg.r + 25), rg.y + Math.sin(ang) * (rg.r + 25));
      ctx.stroke();
    }
  });

  return canvasToTexture(canvas);
}

/**
 * 6. Asteroids Control Panel Texture
 * Recreates the geometric red, white, and navy Mondrian layout with button markings:
 * "ROTATE LEFT", "ROTATE RIGHT", "THRUST", "FIRE", "HYPER SPACE", "1 PLAYER", "2 PLAYERS".
 */
export function createAsteroidsControlPanelTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Base Navy Blue
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Geometric red, white & navy blocks
  ctx.fillStyle = '#dc2626'; // Red
  ctx.fillRect(20, 20, 110, 110);
  ctx.fillRect(215, 20, 80, 110);
  ctx.fillRect(380, 20, 110, 110);

  ctx.fillStyle = '#f8fafc'; // White
  ctx.fillRect(135, 20, 75, 110);
  ctx.fillRect(300, 20, 75, 110);

  // Black divider grids
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 6;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

  // Button Labels & Chevrons
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px "Courier New", monospace';
  ctx.textAlign = 'center';

  // Instructions header banner
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(20, 138, canvas.width - 40, 28);
  ctx.fillStyle = '#ffffff';
  ctx.fillText('INSTRUCTIONS: INSERT COINS • SELECT 1 OR 2 PLAYER', canvas.width / 2, 156);

  // Specific control buttons text
  ctx.font = '900 10px sans-serif';
  ctx.fillStyle = '#000000';
  ctx.fillText('ROTATE', 172, 60);
  ctx.fillText('LEFT', 172, 75);

  ctx.fillText('ROTATE', 172, 98);
  ctx.fillText('RIGHT', 172, 112);

  ctx.fillStyle = '#ffffff';
  ctx.fillText('HYPER', 255, 60);
  ctx.fillText('SPACE', 255, 75);

  ctx.fillStyle = '#000000';
  ctx.fillText('THRUST', 337, 60);
  ctx.fillText('FIRE', 337, 98);

  // Player 1 & 2 start banners at top
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(130, 2, 110, 16);
  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(270, 2, 110, 16);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 9px sans-serif';
  ctx.fillText('1 PLAYER START', 185, 13);
  ctx.fillText('2 PLAYERS START', 325, 13);

  return canvasToTexture(canvas);
}

/**
 * 7. Diamond Tread Plate Metal Texture (Recreating Metal_St.jpg)
 * Industrial embossed cross-hatch diamond tread steel pattern.
 */
export function createDiamondPlateMetalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Base dark metallic steel
  ctx.fillStyle = '#11141c';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle steel noise
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.2)';
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  // Draw embossed diamond tread pattern
  const tileSize = 32;
  const drawDiamond = (cx: number, cy: number, rot: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    // Dark shadow below
    ctx.fillStyle = '#05070a';
    ctx.beginPath();
    ctx.ellipse(2, 2, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Steel body
    ctx.fillStyle = '#222838';
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Top highlight rim
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.ellipse(-1, -1, 12, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  for (let y = 0; y < canvas.height; y += tileSize) {
    for (let x = 0; x < canvas.width; x += tileSize) {
      drawDiamond(x + 8, y + 8, Math.PI / 4);
      drawDiamond(x + 24, y + 24, -Math.PI / 4);
    }
  }

  const texture = canvasToTexture(canvas);
  texture.repeat.set(4, 4);
  return texture;
}

/**
 * 8. Plywood Cabinet Woodgrain Texture (Recreating Wood_Ply.jpg)
 * Warm arcade side panel plywood grain with annual rings and texture.
 */
export function createWoodGrainTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Base warm olive-brown wood tone
  ctx.fillStyle = '#5c5234';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw fibrous woodgrain rings
  for (let y = 0; y < canvas.height; y++) {
    const wave = Math.sin(y * 0.04) * 15 + Math.sin(y * 0.12) * 5;
    const darkness = (Math.sin((y + wave) * 0.08) + 1) * 0.5;
    ctx.fillStyle = `rgba(32, 28, 14, ${darkness * 0.25})`;
    ctx.fillRect(0, y, canvas.width, 1);
  }

  // Add random wood knots
  const knots = [
    { x: 120, y: 90, r: 14 },
    { x: 380, y: 280, r: 18 },
    { x: 220, y: 410, r: 12 },
  ];

  knots.forEach((k) => {
    ctx.fillStyle = '#262010';
    ctx.beginPath();
    ctx.ellipse(k.x, k.y, k.r, k.r * 1.5, 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(74, 62, 33, 0.4)';
    ctx.lineWidth = 3;
    for (let r = k.r * 1.4; r < k.r * 3.5; r += 6) {
      ctx.beginPath();
      ctx.ellipse(k.x, k.y, r, r * 1.6, 0.3, 0, Math.PI * 2);
      ctx.stroke();
    }
  });

  return canvasToTexture(canvas);
}

/**
 * 9. IMPROVED GOLD COINS: Minted 24K Gold Coin Face Texture
 * Exquisite physical arcade coin face with outer bead rim, minted lettering:
 * "TECHORBIT ARCADE TOKEN • 1 TOKEN • 2026", concentric coin ridge,
 * radial golden sunburst luster, and embossed central 8-point Arcade Star emblem.
 */
export function createCoinFaceTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const cx = 256;
  const cy = 256;

  // Rich 24K Gold Radial gradient
  const goldGrad = ctx.createRadialGradient(cx - 50, cy - 50, 20, cx, cy, 250);
  goldGrad.addColorStop(0, '#fef08a'); // gleaming light gold
  goldGrad.addColorStop(0.35, '#facc15'); // vibrant 24k gold
  goldGrad.addColorStop(0.7, '#eab308'); // deep burnished gold
  goldGrad.addColorStop(0.92, '#ca8a04'); // rim gold
  goldGrad.addColorStop(1, '#854d0e'); // outer edge bronze shadow
  ctx.fillStyle = goldGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Radial Anisotropic Luster / Sunburst lines (like real minted coins)
  ctx.save();
  ctx.translate(cx, cy);
  const rays = 72;
  for (let i = 0; i < rays; i++) {
    const ang = (i / rays) * Math.PI * 2;
    ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 255, 255, 0.12)' : 'rgba(113, 63, 18, 0.15)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 240, ang, ang + (Math.PI * 2) / rays);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Outer Beaded / Milled Rim (Coin dots)
  const dotCount = 48;
  const rimRadius = 236;
  for (let i = 0; i < dotCount; i++) {
    const ang = (i / dotCount) * Math.PI * 2;
    const px = cx + Math.cos(ang) * rimRadius;
    const py = cy + Math.sin(ang) * rimRadius;

    // Shadow
    ctx.fillStyle = '#713f12';
    ctx.beginPath();
    ctx.arc(px + 1.5, py + 1.5, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Highlight
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Inner Concentric Raised Relief Ring
  ctx.strokeStyle = '#713f12';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, 218, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 214, 0, Math.PI * 2);
  ctx.stroke();

  // Minted Lettering along circular path: "★ TECHORBIT ARCADE TOKEN ★ 2026 ★"
  const drawCircularText = (
    text: string,
    radius: number,
    startAngle: number,
    totalAngle: number
  ) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.font = '900 18px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const step = totalAngle / (text.length - 1);
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const angle = startAngle + i * step;
      ctx.save();
      ctx.rotate(angle);
      ctx.translate(0, -radius);

      // Bevel shadow
      ctx.fillStyle = '#854d0e';
      ctx.fillText(char, 1.5, 1.5);

      // Gold highlight
      ctx.fillStyle = '#fef08a';
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
    ctx.restore();
  };

  drawCircularText('★ TECHORBIT ARCADE ★', 188, -Math.PI * 0.72, Math.PI * 1.44);
  drawCircularText('★ 1 TOKEN • 2026 ★', 188, Math.PI * 0.35, Math.PI * 0.7);

  // Center Basin Ring
  ctx.strokeStyle = '#713f12';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, 145, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#fef9c3';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 142, 0, Math.PI * 2);
  ctx.stroke();

  // Center Embossed 8-Point Arcade Star & Token Crest
  ctx.save();
  ctx.translate(cx, cy);

  const drawEmbossedStar = (points: number, outerR: number, innerR: number) => {
    // Drop shadow
    ctx.fillStyle = '#854d0e';
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const ang = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
      const rad = i % 2 === 0 ? outerR : innerR;
      const x = Math.cos(ang) * rad + 3;
      const y = Math.sin(ang) * rad + 3;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    // Gleaming gold face
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const ang = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
      const rad = i % 2 === 0 ? outerR : innerR;
      const x = Math.cos(ang) * rad;
      const y = Math.sin(ang) * rad;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    // Faceted star shading
    for (let i = 0; i < points * 2; i++) {
      const ang1 = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
      const ang2 = ((i + 1) / (points * 2)) * Math.PI * 2 - Math.PI / 2;
      const r1 = i % 2 === 0 ? outerR : innerR;
      const r2 = (i + 1) % 2 === 0 ? outerR : innerR;

      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.45)' : 'rgba(113,63,18,0.35)';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(ang1) * r1, Math.sin(ang1) * r1);
      ctx.lineTo(Math.cos(ang2) * r2, Math.sin(ang2) * r2);
      ctx.closePath();
      ctx.fill();
    }
  };

  drawEmbossedStar(8, 95, 42);

  // Center Token Dollar / Arcade Inscription
  ctx.fillStyle = '#713f12';
  ctx.font = '900 32px "Arial Black", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('1', 2, 2);
  ctx.fillStyle = '#ffffff';
  ctx.fillText('1', 0, 0);

  ctx.restore();

  return canvasToTexture(canvas);
}

/**
 * 10. Coin Normal Map Generator
 * Generates Tangent Space Normal map giving tactile, realistic physical 3D embossed
 * depth to the coin rim, text, and center star.
 */
export function createCoinNormalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const cx = 128;
  const cy = 128;

  // Base normal flat purple-blue (128, 128, 255)
  ctx.fillStyle = '#8080ff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Concentric normal beveled slopes
  const drawNormalRing = (r: number, width: number) => {
    ctx.strokeStyle = '#b080ff'; // tilted slope right
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  };

  drawNormalRing(118, 4);
  drawNormalRing(106, 3);
  drawNormalRing(72, 3);

  // Star normal depth
  ctx.fillStyle = '#a070ff';
  ctx.beginPath();
  ctx.arc(cx, cy, 46, 0, Math.PI * 2);
  ctx.fill();

  return canvasToTexture(canvas);
}

/**
 * 11. Dual-Slot Arcade Coin Door Texture
 * Authentic black textured steel coin door with dual illuminated orange 25¢ insert coin reject buttons,
 * keyhole cam lock, and coin return flap.
 */
export function createCoinDoorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Black textured steel
  ctx.fillStyle = '#11131a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Outer recessed frame
  ctx.strokeStyle = '#272b38';
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);

  // Keyhole Lock at top center
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.arc(canvas.width / 2, 40, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(canvas.width / 2 - 3, 34, 6, 14);

  // Dual Coin Entry Inserts (Orange Backlit 25¢ Buttons)
  const slotX = [68, 188];
  slotX.forEach((sx) => {
    // Outer black bezel
    ctx.fillStyle = '#020617';
    ctx.fillRect(sx - 34, 75, 68, 80);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.strokeRect(sx - 34, 75, 68, 80);

    // Glowing translucent orange push button
    ctx.fillStyle = '#f97316';
    ctx.fillRect(sx - 28, 82, 56, 44);
    ctx.fillStyle = '#ffedd5';
    ctx.font = '900 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('25¢', sx, 102);
    ctx.font = 'bold 8px sans-serif';
    ctx.fillText('INSERT', sx, 116);

    // Vertical metal coin slot
    ctx.fillStyle = '#000000';
    ctx.fillRect(sx - 3, 134, 6, 16);

    // Lower spring-loaded coin return pocket
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(sx - 30, 180, 60, 52);
    ctx.strokeStyle = '#475569';
    ctx.strokeRect(sx - 30, 180, 60, 52);
    ctx.fillStyle = '#334155';
    ctx.fillRect(sx - 24, 186, 48, 20); // flap
  });

  return canvasToTexture(canvas);
}

/**
 * 12. Pirate Chest Weathered Wood Plank Texture
 * Dark aged sea-salted timber planks with rich grain, nail indentations,
 * and dark iron edge trim.
 */
export function createPiratePlankTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Dark weathered aged oak background
  ctx.fillStyle = '#26170d';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw distinct horizontal wooden planks
  const plankHeight = 64;
  for (let y = 0; y < canvas.height; y += plankHeight) {
    // Plank base gradient
    const grad = ctx.createLinearGradient(0, y, 0, y + plankHeight);
    grad.addColorStop(0, '#3e2313');
    grad.addColorStop(0.5, '#4a2b18');
    grad.addColorStop(1, '#2c180b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, y, canvas.width, plankHeight - 4);

    // Deep plank divider seam
    ctx.fillStyle = '#0f0804';
    ctx.fillRect(0, y + plankHeight - 4, canvas.width, 4);

    // Wood fiber grain lines
    for (let i = 0; i < plankHeight - 4; i += 3) {
      const alpha = 0.08 + Math.random() * 0.12;
      ctx.fillStyle = `rgba(15, 8, 4, ${alpha})`;
      const wave = Math.sin(i * 0.1) * 3;
      ctx.fillRect(0, y + i + wave, canvas.width, 1.5);
    }

    // Forged iron square nails at plank ends
    ctx.fillStyle = '#1c1c1f';
    ctx.strokeStyle = '#4a4a55';
    ctx.lineWidth = 1;
    [24, canvas.width - 24].forEach((nx) => {
      ctx.fillRect(nx - 4, y + plankHeight / 2 - 4, 8, 8);
      ctx.strokeRect(nx - 4, y + plankHeight / 2 - 4, 8, 8);
    });
  }

  return canvasToTexture(canvas);
}

/**
 * 13. Pirate Chest Jolly Roger & Iron Band Front Texture
 * Weathered planks featuring an embossed skull and crossed cutlasses emblem,
 * forged iron corner brackets, and brass lock escutcheon.
 */
export function createPirateJollyRogerTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Base wood planks
  ctx.fillStyle = '#3a2012';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Planks
  for (let y = 0; y < canvas.height; y += 42) {
    ctx.fillStyle = y % 84 === 0 ? '#432616' : '#331a0e';
    ctx.fillRect(0, y, canvas.width, 40);
    ctx.fillStyle = '#140a04';
    ctx.fillRect(0, y + 40, canvas.width, 2);
  }

  // Heavy Black Wrought-Iron Straps (Vertical)
  const strapX = [60, canvas.width - 60];
  strapX.forEach((sx) => {
    ctx.fillStyle = '#18181b';
    ctx.fillRect(sx - 20, 0, 40, canvas.height);
    ctx.strokeStyle = '#3f3f46';
    ctx.lineWidth = 2;
    ctx.strokeRect(sx - 20, 0, 40, canvas.height);

    // Domed rivets
    for (let ry = 20; ry < canvas.height; ry += 48) {
      ctx.fillStyle = '#52525b';
      ctx.beginPath();
      ctx.arc(sx, ry, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#71717a';
      ctx.beginPath();
      ctx.arc(sx - 1.5, ry - 1.5, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Center Golden Brass Escutcheon & Keyhole
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  ctx.fillStyle = '#ca8a04';
  ctx.strokeStyle = '#854d0e';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx - 36, cy - 45);
  ctx.lineTo(cx + 36, cy - 45);
  ctx.lineTo(cx + 44, cy + 20);
  ctx.lineTo(cx, cy + 50);
  ctx.lineTo(cx - 44, cy + 20);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Keyhole
  ctx.fillStyle = '#171717';
  ctx.beginPath();
  ctx.arc(cx, cy - 10, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx - 5, cy - 10);
  ctx.lineTo(cx + 5, cy - 10);
  ctx.lineTo(cx + 7, cy + 18);
  ctx.lineTo(cx - 7, cy + 18);
  ctx.closePath();
  ctx.fill();

  // Jolly Roger Skull & Crossed Cutlasses on flanks
  const drawSkull = (sx: number, sy: number) => {
    ctx.save();
    ctx.translate(sx, sy);
    ctx.fillStyle = '#fef08a';
    ctx.strokeStyle = '#854d0e';

    // Crossed cutlasses/bones
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(-26, -18);
    ctx.lineTo(26, 18);
    ctx.moveTo(26, -18);
    ctx.lineTo(-26, 18);
    ctx.stroke();

    // Cranium
    ctx.beginPath();
    ctx.arc(0, -6, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-10, 8, 20, 10);

    // Eye sockets
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.ellipse(-6, -5, 4.5, 6, -0.2, 0, Math.PI * 2);
    ctx.ellipse(6, -5, 4.5, 6, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Teeth marks
    ctx.fillRect(-8, 14, 3, 5);
    ctx.fillRect(-2, 14, 4, 5);
    ctx.fillRect(5, 14, 3, 5);
    ctx.restore();
  };

  drawSkull(160, 110);
  drawSkull(352, 110);

  return canvasToTexture(canvas);
}

/**
 * 14. Military Ammunition Crate Main Body Texture
 * Heavy tactical olive-drab matte metal with yellow stencil markings:
 * "7.62mm NATO M80", "1,000 CARTRIDGES", "AMMUNITION CRATE", hazard caution stripes,
 * and military ordinance bomb insignia.
 */
export function createAmmoCrateTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Matte Military Olive Drab (#293322)
  ctx.fillStyle = '#293322';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle steel noise & weathering
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.fillStyle = Math.random() > 0.6 ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.12)';
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  // Yellow & Black Hazard Caution Diagonal Stripes along top edge
  const stripeH = 20;
  for (let x = -stripeH; x < canvas.width + stripeH; x += 24) {
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 12, 0);
    ctx.lineTo(x - 2, stripeH);
    ctx.lineTo(x - 14, stripeH);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.moveTo(x + 12, 0);
    ctx.lineTo(x + 24, 0);
    ctx.lineTo(x + 10, stripeH);
    ctx.lineTo(x - 2, stripeH);
    ctx.closePath();
    ctx.fill();
  }

  // Top divider line
  ctx.fillStyle = '#0f170e';
  ctx.fillRect(0, stripeH, canvas.width, 2);

  // Stenciled Military Markings
  ctx.font = '900 24px "Impact", "Arial Black", sans-serif';
  ctx.fillStyle = '#facc15';
  ctx.textAlign = 'left';
  ctx.fillText('AMMUNITION CRATE', 32, 62);

  ctx.font = 'bold 15px "Courier New", monospace';
  ctx.fillStyle = '#f8fafc';
  ctx.fillText('CAL. 7.62MM NATO M80', 32, 90);
  ctx.fillText('1,000 CARTRIDGES LINKED', 32, 114);
  ctx.fillText('LOT AM-84D012-005', 32, 138);

  // Caution Box
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 2;
  ctx.strokeRect(32, 155, 260, 48);
  ctx.fillStyle = '#eab308';
  ctx.font = '900 11px sans-serif';
  ctx.fillText('CLASS 1.4S • HIGH EXPLOSIVE', 42, 172);
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 9px monospace';
  ctx.fillText('DO NOT STORE NEAR OPEN FLAME', 42, 190);

  // Right Side: Military Ordnance Bomb / Shell Insignia
  const bx = 390;
  const by = 135;

  ctx.save();
  ctx.translate(bx, by);

  // Outer warning ring
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 44, 0, Math.PI * 2);
  ctx.stroke();

  // Bomb silhouette
  ctx.fillStyle = '#0f170e';
  ctx.beginPath();
  ctx.ellipse(0, 4, 18, 26, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(-12, -26, 24, 12); // fins
  ctx.fillRect(-5, -34, 10, 8); // fuse tip

  ctx.fillStyle = '#facc15';
  ctx.font = '900 12px "Arial Black", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('MIL-SPEC', 0, 6);

  ctx.restore();

  // Heavy steel corner brackets & bolts
  ctx.fillStyle = '#1c1917';
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2;

  // 4 corners
  const cornerW = 28;
  const cornerH = 34;
  [[0, 0], [canvas.width - cornerW, 0], [0, canvas.height - cornerH], [canvas.width - cornerW, canvas.height - cornerH]].forEach(([cx, cy]) => {
    ctx.fillRect(cx, cy, cornerW, cornerH);
    ctx.strokeRect(cx, cy, cornerW, cornerH);
    // Bolt
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(cx + cornerW / 2, cy + cornerH / 2, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1c1917';
  });

  return canvasToTexture(canvas);
}

/**
 * 15. Military Ammunition Crate Lid Texture
 * Heavy metal lid with toggle handle graphics, caution markers, and "TOP - OPEN THIS SIDE" stencil.
 */
export function createAmmoCrateLidTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Olive drab
  ctx.fillStyle = '#2b3624';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Outer recessed steel rim
  ctx.strokeStyle = '#141a11';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);

  // Center carry handle indent
  ctx.fillStyle = '#141a11';
  ctx.fillRect(canvas.width / 2 - 80, canvas.height / 2 - 25, 160, 50);
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 3;
  ctx.strokeRect(canvas.width / 2 - 80, canvas.height / 2 - 25, 160, 50);

  // Steel wire handle
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 60, canvas.height / 2);
  ctx.lineTo(canvas.width / 2 + 60, canvas.height / 2);
  ctx.stroke();

  // Stencils
  ctx.fillStyle = '#facc15';
  ctx.font = '900 16px "Impact", "Arial Black", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('▲ TOP • OPEN THIS SIDE ▲', canvas.width / 2, 45);
  ctx.fillText('KEEP DRY • HANDLE WITH CARE', canvas.width / 2, canvas.height - 30);

  return canvasToTexture(canvas);
}

