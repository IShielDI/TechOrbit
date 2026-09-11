import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  createElevatorActionMarqueeTexture,
  createElevatorActionSideTexture,
  createElevatorActionScreenTexture,
  createAsteroidsMarqueeTexture,
  createAsteroidsSideTexture,
  createAsteroidsControlPanelTexture,
  createDiamondPlateMetalTexture,
  createWoodGrainTexture,
  createCoinFaceTexture,
  createCoinNormalTexture,
  createCoinDoorTexture,
  createPiratePlankTexture,
  createPirateJollyRogerTexture,
  createAmmoCrateTexture,
  createAmmoCrateLidTexture,
} from '../utils/arcadeTextures';
import { arcadeAudio } from '../utils/audio';

interface Arcade3DSceneProps {
  scrollProgress?: number; // optional external override
  onCoinCollect?: (totalCount: number) => void;
}

export const Arcade3DScene: React.FC<Arcade3DSceneProps> = ({
  scrollProgress,
  onCoinCollect,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const sceneRef = useRef<THREE.Scene | null>(null);
  const collectedCoinsCountRef = useRef<number>(0);

  useEffect(() => {
    if (scrollProgress !== undefined) {
      scrollRef.current = scrollProgress;
    }
  }, [scrollProgress]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x070714, 0.022);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 150);
    camera.position.set(0, 2.5, 10);

    // 2. Renderer with Filmic Tone Mapping
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 3. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x2d1b4e, 2.0);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff3cc, 2.4);
    dirLight.position.set(6, 12, 6);
    scene.add(dirLight);

    const pinkLight = new THREE.PointLight(0xff007f, 3.8, 32);
    pinkLight.position.set(-4, 3, 2);
    scene.add(pinkLight);

    const cyanLight = new THREE.PointLight(0x00f3ff, 3.8, 32);
    cyanLight.position.set(4, 3, -8);
    scene.add(cyanLight);

    // Warm golden accent light for coins
    const goldAccentLight = new THREE.PointLight(0xfacc15, 2.5, 25);
    goldAccentLight.position.set(0, 4, 3);
    scene.add(goldAccentLight);

    // 4. Synthwave Floor Grid & Floor Plane
    const gridHelper = new THREE.GridHelper(120, 60, 0x00f3ff, 0x4a044e);
    gridHelper.position.y = -1.2;
    scene.add(gridHelper);

    const planeGeo = new THREE.PlaneGeometry(120, 120);
    const planeMat = new THREE.MeshBasicMaterial({
      color: 0x070417,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const floorPlane = new THREE.Mesh(planeGeo, planeMat);
    floorPlane.rotation.x = -Math.PI / 2;
    floorPlane.position.y = -1.22;
    scene.add(floorPlane);

    // 5. Starfield / Cyber Dust
    const starsCount = 800;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starsCount * 3);
    const starColors = new Float32Array(starsCount * 3);

    const palette = [
      new THREE.Color(0x00f3ff),
      new THREE.Color(0xff007f),
      new THREE.Color(0xfacc15),
      new THREE.Color(0x38bdf8),
      new THREE.Color(0xa855f7),
    ];

    for (let i = 0; i < starsCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 55;
      starPositions[i * 3 + 1] = Math.random() * 22 - 1;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 65;

      const col = palette[Math.floor(Math.random() * palette.length)];
      starColors[i * 3] = col.r;
      starColors[i * 3 + 1] = col.g;
      starColors[i * 3 + 2] = col.b;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });

    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // ==============================================================
    // 6. SHARED TEXTURES FROM USER-UPLOADED ASSETS
    // ==============================================================
    const elevatorMarqueeTex = createElevatorActionMarqueeTexture();
    const elevatorSideTex = createElevatorActionSideTexture();
    const elevatorScreenTex = createElevatorActionScreenTexture();

    const asteroidsMarqueeTex = createAsteroidsMarqueeTexture();
    const asteroidsSideTex = createAsteroidsSideTexture();
    const asteroidsControlTex = createAsteroidsControlPanelTexture();

    const diamondPlateTex = createDiamondPlateMetalTexture();
    const woodGrainTex = createWoodGrainTexture();
    const coinDoorTex = createCoinDoorTexture();

    const coinFaceTex = createCoinFaceTexture();
    const coinNormalTex = createCoinNormalTexture();

    const piratePlankTex = createPiratePlankTexture();
    const pirateJollyRogerTex = createPirateJollyRogerTexture();
    const ammoCrateTex = createAmmoCrateTexture();
    const ammoCrateLidTex = createAmmoCrateLidTexture();

    // ==============================================================
    // 7. REALISTIC ARCADE CABINETS WITH AUTHENTIC USER ASSETS
    // ==============================================================
    const cabinetsGroup = new THREE.Group();

    interface CabinetConfig {
      type: 'elevator-action' | 'asteroids' | 'techorbit' | 'space-bounty';
      neonColor: number;
      glowColor: number;
      position: [number, number, number];
      rotationY: number;
    }

    const createRealisticArcadeCabinet = (cfg: CabinetConfig) => {
      const cabinet = new THREE.Group();

      // Main Cabinet Body Dimensions: W: 1.25, H: 2.9, D: 1.4
      // 1. Lower Chassis (black laminate / plywood sides)
      const baseGeo = new THREE.BoxGeometry(1.22, 1.4, 1.2);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x111420,
        roughness: 0.45,
        metalness: 0.5,
      });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.set(0, -0.4, 0);
      cabinet.add(base);

      // 2. Diamond Tread Steel Kickplate at bottom (Metal_St.jpg)
      const kickplateGeo = new THREE.PlaneGeometry(1.18, 0.45);
      const kickplateMat = new THREE.MeshStandardMaterial({
        map: diamondPlateTex,
        roughness: 0.35,
        metalness: 0.85,
      });
      const kickplate = new THREE.Mesh(kickplateGeo, kickplateMat);
      kickplate.position.set(0, -0.85, 0.61);
      cabinet.add(kickplate);

      // 3. Realistic Dual-Slot Coin Door
      const coinDoorGeo = new THREE.PlaneGeometry(0.72, 0.82);
      const coinDoorMaterial = new THREE.MeshStandardMaterial({
        map: coinDoorTex,
        roughness: 0.3,
        metalness: 0.7,
      });
      const coinDoor = new THREE.Mesh(coinDoorGeo, coinDoorMaterial);
      coinDoor.position.set(0, -0.28, 0.615);
      cabinet.add(coinDoor);

      // 4. Shaped Side Wings (textured with user's uploaded art)
      const sideMat = new THREE.MeshStandardMaterial({
        map:
          cfg.type === 'elevator-action'
            ? elevatorSideTex
            : cfg.type === 'asteroids'
            ? asteroidsSideTex
            : woodGrainTex,
        roughness: 0.4,
        metalness: 0.4,
      });

      const sideGeo = new THREE.BoxGeometry(0.06, 2.8, 1.35);
      const leftSide = new THREE.Mesh(sideGeo, sideMat);
      leftSide.position.set(-0.62, 0.25, 0);
      cabinet.add(leftSide);

      const rightSide = new THREE.Mesh(sideGeo, sideMat);
      rightSide.position.set(0.62, 0.25, 0);
      cabinet.add(rightSide);

      // T-Molding Border along cabinet edge
      const tmoldMat = new THREE.MeshStandardMaterial({
        color: cfg.neonColor,
        roughness: 0.2,
        metalness: 0.8,
        emissive: cfg.neonColor,
        emissiveIntensity: 0.3,
      });
      const tmoldGeo = new THREE.BoxGeometry(0.08, 2.84, 0.04);
      const leftTmold = new THREE.Mesh(tmoldGeo, tmoldMat);
      leftTmold.position.set(-0.62, 0.25, 0.68);
      cabinet.add(leftTmold);

      const rightTmold = new THREE.Mesh(tmoldGeo, tmoldMat);
      rightTmold.position.set(0.62, 0.25, 0.68);
      cabinet.add(rightTmold);

      // 5. Backlit Upper Marquee (with Elevator Action or Asteroids banner)
      const marqueeGeo = new THREE.PlaneGeometry(1.18, 0.42);
      const marqueeMat = new THREE.MeshStandardMaterial({
        map: cfg.type === 'elevator-action' ? elevatorMarqueeTex : asteroidsMarqueeTex,
        roughness: 0.2,
        metalness: 0.2,
        emissive: 0xffffff,
        emissiveMap: cfg.type === 'elevator-action' ? elevatorMarqueeTex : asteroidsMarqueeTex,
        emissiveIntensity: 0.85,
      });
      const marquee = new THREE.Mesh(marqueeGeo, marqueeMat);
      marquee.position.set(0, 1.42, 0.58);
      marquee.rotation.x = -0.15; // Slanted canopy tilt
      cabinet.add(marquee);

      // Marquee Housing Box
      const marqueeBoxGeo = new THREE.BoxGeometry(1.2, 0.46, 0.45);
      const marqueeBoxMat = new THREE.MeshStandardMaterial({ color: 0x090b14 });
      const marqueeBox = new THREE.Mesh(marqueeBoxGeo, marqueeBoxMat);
      marqueeBox.position.set(0, 1.42, 0.38);
      cabinet.add(marqueeBox);

      // Marquee Light casting ambient illumination
      const marqueeLight = new THREE.PointLight(cfg.neonColor, 1.6, 6);
      marqueeLight.position.set(0, 1.42, 0.75);
      cabinet.add(marqueeLight);

      // 6. Recessed CRT Monitor with Gameplay Screen
      const screenGeo = new THREE.PlaneGeometry(0.96, 0.76);
      let screenMaterial: THREE.Material;

      if (cfg.type === 'elevator-action') {
        screenMaterial = new THREE.MeshStandardMaterial({
          map: elevatorScreenTex,
          emissive: 0x38bdf8,
          emissiveMap: elevatorScreenTex,
          emissiveIntensity: 0.7,
          roughness: 0.15,
        });
      } else {
        // Asteroids Vector Glow Screen
        screenMaterial = new THREE.MeshStandardMaterial({
          map: elevatorScreenTex, // or CRT
          color: 0x030712,
          emissive: cfg.glowColor,
          emissiveIntensity: 0.5,
          roughness: 0.2,
        });
      }

      const screen = new THREE.Mesh(screenGeo, screenMaterial);
      screen.position.set(0, 0.72, 0.48);
      screen.rotation.x = -0.32; // classic tilted arcade CRT angle
      cabinet.add(screen);

      // Bezel Shadow Box Frame
      const bezelFrameGeo = new THREE.BoxGeometry(1.18, 0.88, 0.3);
      const bezelFrameMat = new THREE.MeshStandardMaterial({ color: 0x080911, roughness: 0.8 });
      const bezelFrame = new THREE.Mesh(bezelFrameGeo, bezelFrameMat);
      bezelFrame.position.set(0, 0.72, 0.38);
      cabinet.add(bezelFrame);

      // Screen dynamic Point Light
      const screenLight = new THREE.PointLight(cfg.glowColor, 1.8, 5);
      screenLight.position.set(0, 0.72, 0.7);
      cabinet.add(screenLight);

      // 7. Cantilevered Control Panel Shelf
      const panelShelfGeo = new THREE.BoxGeometry(1.18, 0.12, 0.52);
      const panelShelfMat = new THREE.MeshStandardMaterial({
        map: cfg.type === 'asteroids' ? asteroidsControlTex : undefined,
        color: cfg.type === 'asteroids' ? 0xffffff : 0x1e1b4b,
        roughness: 0.3,
        metalness: 0.5,
      });
      const panelShelf = new THREE.Mesh(panelShelfGeo, panelShelfMat);
      panelShelf.position.set(0, 0.2, 0.65);
      panelShelf.rotation.x = 0.15; // Juts out slightly angled down
      cabinet.add(panelShelf);

      // 8. Joysticks & Arcade Pushbuttons
      // Left Player 1 Joystick
      const stickGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.18);
      const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1 });
      const stick1 = new THREE.Mesh(stickGeo, chromeMat);
      stick1.position.set(-0.35, 0.34, 0.65);
      cabinet.add(stick1);

      const ballGeo = new THREE.SphereGeometry(0.065, 16, 16);
      const ballMat = new THREE.MeshStandardMaterial({
        color: cfg.neonColor,
        roughness: 0.1,
        metalness: 0.4,
        emissive: cfg.neonColor,
        emissiveIntensity: 0.4,
      });
      const ball1 = new THREE.Mesh(ballGeo, ballMat);
      ball1.position.set(-0.35, 0.44, 0.65);
      cabinet.add(ball1);

      // Player 2 Joystick
      const stick2 = new THREE.Mesh(stickGeo, chromeMat);
      stick2.position.set(0.12, 0.34, 0.65);
      cabinet.add(stick2);

      const ball2 = new THREE.Mesh(ballGeo, new THREE.MeshStandardMaterial({ color: 0xef4444 }));
      ball2.position.set(0.12, 0.44, 0.65);
      cabinet.add(ball2);

      // Microswitch Pushbuttons (Red, Yellow, Blue, Green)
      const btnGeo = new THREE.CylinderGeometry(0.038, 0.038, 0.04, 16);
      const buttonColors = [0xef4444, 0xfacc15, 0x3b82f6, 0x10b981];
      buttonColors.forEach((bcol, idx) => {
        const btnMat = new THREE.MeshStandardMaterial({
          color: bcol,
          emissive: bcol,
          emissiveIntensity: 0.35,
          roughness: 0.2,
        });
        const btn = new THREE.Mesh(btnGeo, btnMat);
        btn.position.set(-0.16 + (idx % 2) * 0.09, 0.28, 0.62 + Math.floor(idx / 2) * 0.09);
        cabinet.add(btn);
      });

      // Position & Rotate Cabinet
      cabinet.position.set(...cfg.position);
      cabinet.rotation.y = cfg.rotationY;

      return cabinet;
    };

    // Cabinet 1: Authentic Elevator Action by Taito (Left, Stage 0)
    const cab1 = createRealisticArcadeCabinet({
      type: 'elevator-action',
      neonColor: 0xf59e0b, // warm amber
      glowColor: 0x06b6d4, // cyan CRT glow
      position: [-3.3, 0.2, 4],
      rotationY: 0.45,
    });
    cabinetsGroup.add(cab1);

    // Cabinet 2: Authentic Asteroids by Atari (Right, Stage 1)
    const cab2 = createRealisticArcadeCabinet({
      type: 'asteroids',
      neonColor: 0x00f3ff, // electric cyan
      glowColor: 0xec4899, // cosmic pink
      position: [3.4, 0.2, -3],
      rotationY: -0.55,
    });
    cabinetsGroup.add(cab2);

    // Cabinet 3: Elevator Action Special Edition (Left, Stage 2)
    const cab3 = createRealisticArcadeCabinet({
      type: 'elevator-action',
      neonColor: 0xef4444, // red neon
      glowColor: 0xfacc15, // gold screen
      position: [-3.6, 0.2, -10],
      rotationY: 0.6,
    });
    cabinetsGroup.add(cab3);

    // Cabinet 4: Asteroids Championship Arena (Right, Stage 2 / Score Board)
    const cab4 = createRealisticArcadeCabinet({
      type: 'asteroids',
      neonColor: 0x10b981, // emerald vector
      glowColor: 0x38bdf8, // sky blue
      position: [3.3, 0.2, -16],
      rotationY: -0.4,
    });
    cabinetsGroup.add(cab4);

    scene.add(cabinetsGroup);

    // ==============================================================
    // 8. AUTHENTIC PIRATE CHESTS FULL OF GOLD COINS & AMMUNITION CRATES
    // ==============================================================
    const cratesGroup = new THREE.Group();
    const chestSparkles: { mesh: THREE.Mesh; light: THREE.PointLight; baseIntensity: number }[] = [];

    // --- A. PIRATE TREASURE CHEST BUILDER ---
    interface PirateChestConfig {
      position: [number, number, number];
      rotationY: number;
      scale?: number;
      lidAngle?: number;
    }

    const createPirateTreasureChest = (cfg: PirateChestConfig) => {
      const chest = new THREE.Group();
      const s = cfg.scale || 1.0;

      // 1. Weathered Sea-Oak Plank Body (W: 1.45, H: 0.72, D: 0.94)
      const woodMat = new THREE.MeshStandardMaterial({
        map: piratePlankTex,
        roughness: 0.75,
        metalness: 0.15,
      });
      const frontMat = new THREE.MeshStandardMaterial({
        map: pirateJollyRogerTex,
        roughness: 0.65,
        metalness: 0.25,
      });
      const darkWoodMat = new THREE.MeshStandardMaterial({
        color: 0x24140a,
        roughness: 0.85,
        metalness: 0.1,
      });

      const bodyMaterials = [
        woodMat,      // +X
        woodMat,      // -X
        darkWoodMat,  // +Y inner rim
        darkWoodMat,  // -Y
        frontMat,     // +Z front with Jolly Roger skull & keyhole
        woodMat,      // -Z back
      ];

      const bodyGeo = new THREE.BoxGeometry(1.45, 0.72, 0.94);
      const body = new THREE.Mesh(bodyGeo, bodyMaterials);
      body.position.set(0, 0.36, 0);
      chest.add(body);

      // 2. Heavy Wrought-Iron Straps & Rivets
      const ironMat = new THREE.MeshStandardMaterial({
        color: 0x18181c,
        roughness: 0.45,
        metalness: 0.85,
      });
      const rivetMat = new THREE.MeshStandardMaterial({
        color: 0x71717a,
        roughness: 0.3,
        metalness: 0.9,
      });

      // 4 Corner Brackets
      const cw = 0.08;
      const ch = 0.74;
      const cd = 0.08;
      const cornerGeo = new THREE.BoxGeometry(cw, ch, cd);
      const cornerOffsets = [
        [-0.725 + cw / 2, 0.36, -0.47 + cd / 2],
        [0.725 - cw / 2, 0.36, -0.47 + cd / 2],
        [-0.725 + cw / 2, 0.36, 0.47 - cd / 2],
        [0.725 - cw / 2, 0.36, 0.47 - cd / 2],
      ];

      cornerOffsets.forEach(([cx, cy, cz]) => {
        const corner = new THREE.Mesh(cornerGeo, ironMat);
        corner.position.set(cx, cy, cz);
        chest.add(corner);

        // Domed rivets
        for (let r = -0.26; r <= 0.26; r += 0.26) {
          const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 8), rivetMat);
          rivet.position.set(cx, cy + r, cz + (cz > 0 ? 0.042 : -0.042));
          chest.add(rivet);
        }
      });

      // Iron Drop Handles on left and right sides
      const handleGeo = new THREE.TorusGeometry(0.11, 0.024, 8, 16, Math.PI);
      const handleLeft = new THREE.Mesh(handleGeo, ironMat);
      handleLeft.rotation.y = Math.PI / 2;
      handleLeft.rotation.x = Math.PI / 2;
      handleLeft.position.set(-0.73, 0.42, 0);
      chest.add(handleLeft);

      const handleRight = handleLeft.clone();
      handleRight.position.set(0.73, 0.42, 0);
      chest.add(handleRight);

      // 3. Arched Domed Treasure Chest Lid (Propped Open)
      const lidGroup = new THREE.Group();
      // Pivot at top-back edge
      lidGroup.position.set(0, 0.72, -0.47);
      lidGroup.rotation.x = cfg.lidAngle ?? -0.78; // 45-degree backward tilt

      // Half-cylinder dome along X axis
      const domeRadius = 0.47;
      const domeLength = 1.46;
      const domeGeo = new THREE.CylinderGeometry(domeRadius, domeRadius, domeLength, 24, 1, false, 0, Math.PI);
      domeGeo.rotateZ(Math.PI / 2);
      domeGeo.rotateX(-Math.PI / 2);

      const domeMat = new THREE.MeshStandardMaterial({
        map: piratePlankTex,
        roughness: 0.75,
        metalness: 0.15,
      });
      const domeMesh = new THREE.Mesh(domeGeo, domeMat);
      domeMesh.position.set(0, 0, domeRadius);
      lidGroup.add(domeMesh);

      // Curved Iron Bands over the Dome with Rivets
      const strapRadius = domeRadius + 0.012;
      [-0.55, 0, 0.55].forEach((sx) => {
        const strapGeo = new THREE.CylinderGeometry(strapRadius, strapRadius, 0.075, 20, 1, true, 0, Math.PI);
        strapGeo.rotateZ(Math.PI / 2);
        strapGeo.rotateX(-Math.PI / 2);
        const strap = new THREE.Mesh(strapGeo, ironMat);
        strap.position.set(sx, 0, domeRadius);
        lidGroup.add(strap);
      });

      // Golden Brass Padlock Hasp
      const haspGeo = new THREE.BoxGeometry(0.12, 0.22, 0.035);
      const brassMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.28, metalness: 0.85 });
      const hasp = new THREE.Mesh(haspGeo, brassMat);
      hasp.position.set(0, -0.05, domeRadius * 2 + 0.01);
      lidGroup.add(hasp);

      chest.add(lidGroup);

      // 4. Mound of Shimmering Gold Coins Inside
      const moundGeo = new THREE.SphereGeometry(0.65, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.45);
      moundGeo.scale(1.0, 0.38, 0.65);
      const goldMoundMat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        metalness: 0.95,
        roughness: 0.18,
        emissive: 0xb45309,
        emissiveIntensity: 0.32,
      });
      const goldMound = new THREE.Mesh(moundGeo, goldMoundMat);
      goldMound.position.set(0, 0.65, 0);
      chest.add(goldMound);

      // 5. Array of Physical 3D Minted Gold Coins inside the chest
      const coinDiscGeo = new THREE.CylinderGeometry(0.082, 0.082, 0.018, 16);
      const coinFaceMaterial = new THREE.MeshStandardMaterial({
        map: coinFaceTex,
        normalMap: coinNormalTex,
        normalScale: new THREE.Vector2(0.6, 0.6),
        color: 0xffe066,
        metalness: 0.95,
        roughness: 0.16,
        emissive: 0x92400e,
        emissiveIntensity: 0.22,
      });

      for (let c = 0; c < 28; c++) {
        const coin = new THREE.Mesh(coinDiscGeo, coinFaceMaterial);
        const ang = (c / 28) * Math.PI * 2 + Math.sin(c) * 0.6;
        const rad = 0.12 + Math.sin(c * 2.3) * 0.34;
        const cx = Math.cos(ang) * rad;
        const cz = Math.sin(ang) * (rad * 0.62);
        const cy = 0.68 + Math.cos(rad * 2.5) * 0.08 + (c % 3) * 0.02;

        coin.position.set(cx, cy, cz);
        coin.rotation.set(
          Math.sin(c * 1.5) * 0.35,
          c * 0.8,
          Math.cos(c * 1.7) * 0.35
        );
        chest.add(coin);
      }

      // 6. Cascading Overflowing Gold Coins Spilling Over Rim
      const spillOffsets = [
        [0.16, 0.66, 0.48, 0.7],
        [-0.2, 0.65, 0.49, 0.6],
        [0.04, 0.5, 0.52, 1.2],
        [-0.12, 0.36, 0.54, 1.3],
        [0.24, 0.14, 0.6, 0.15],
        [-0.26, 0.04, 0.66, 0.2],
        [0.04, 0.03, 0.72, 0.1],
        [0.32, 0.02, 0.79, 0.25],
      ];

      spillOffsets.forEach(([sx, sy, sz, rx]) => {
        const spillCoin = new THREE.Mesh(coinDiscGeo, coinFaceMaterial);
        spillCoin.position.set(sx, sy, sz);
        spillCoin.rotation.set(rx, Math.random() * 2, 0);
        chest.add(spillCoin);
      });

      // 7. Warm Golden Treasure Point Light Radiating from Within
      const treasureLight = new THREE.PointLight(0xf59e0b, 2.6, 4.5);
      treasureLight.position.set(0, 0.82, 0.08);
      chest.add(treasureLight);

      // 8. Twinkling Treasure Sparkle Flare
      const flareGeo = new THREE.PlaneGeometry(0.48, 0.48);
      const sparkleMat = new THREE.MeshBasicMaterial({
        color: 0xfef08a,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });
      const treasureSparkle = new THREE.Mesh(flareGeo, sparkleMat);
      treasureSparkle.position.set(0, 0.88, 0.12);
      chest.add(treasureSparkle);

      chestSparkles.push({
        mesh: treasureSparkle,
        light: treasureLight,
        baseIntensity: 2.6,
      });

      chest.scale.set(s, s, s);
      chest.position.set(...cfg.position);
      chest.rotation.y = cfg.rotationY;

      return chest;
    };

    // --- B. MILITARY AMMUNITION CRATE BUILDER ---
    interface AmmoCrateConfig {
      position: [number, number, number];
      rotationY: number;
      scale?: number;
      isOpen?: boolean;
      isDoubleStack?: boolean;
    }

    const createAmmunitionCrate = (cfg: AmmoCrateConfig) => {
      const root = new THREE.Group();
      const s = cfg.scale || 1.0;

      const buildSingleBox = (isTopBox = false, openThis = false) => {
        const boxGroup = new THREE.Group();
        // Dimensions: W: 1.48, H: 0.68, D: 0.9
        const ammoMat = new THREE.MeshStandardMaterial({
          map: ammoCrateTex,
          roughness: 0.45,
          metalness: 0.5,
        });
        const lidMat = new THREE.MeshStandardMaterial({
          map: ammoCrateLidTex,
          roughness: 0.45,
          metalness: 0.5,
        });
        const sideMat = new THREE.MeshStandardMaterial({
          color: 0x242d1f, // Tactical Olive Drab
          roughness: 0.5,
          metalness: 0.45,
        });
        const darkSteelMat = new THREE.MeshStandardMaterial({
          color: 0x12151c,
          roughness: 0.35,
          metalness: 0.85,
        });

        const boxMaterials = [
          sideMat, // +X
          sideMat, // -X
          openThis ? sideMat : lidMat, // +Y
          sideMat, // -Y
          ammoMat, // +Z front stencils & hazard stripes
          ammoMat, // -Z back
        ];

        const mainGeo = new THREE.BoxGeometry(1.48, 0.68, 0.9);
        const mainBox = new THREE.Mesh(mainGeo, boxMaterials);
        mainBox.position.set(0, 0.34, 0);
        boxGroup.add(mainBox);

        // Stamped Steel Corner Protectors (8 corners)
        const cw = 0.15;
        const ch = 0.15;
        const cd = 0.15;
        const cornerGeo = new THREE.BoxGeometry(cw, ch, cd);
        const boltGeo = new THREE.SphereGeometry(0.016, 6, 6);
        const boltMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });

        [-0.74 + cw / 2, 0.74 - cw / 2].forEach((cx) => {
          [0.08, 0.6].forEach((cy) => {
            [-0.45 + cd / 2, 0.45 - cd / 2].forEach((cz) => {
              const corner = new THREE.Mesh(cornerGeo, darkSteelMat);
              corner.position.set(cx, cy, cz);
              boxGroup.add(corner);

              const bolt = new THREE.Mesh(boltGeo, boltMat);
              bolt.position.set(cx, cy, cz + (cz > 0 ? 0.075 : -0.075));
              boxGroup.add(bolt);
            });
          });
        });

        // Recessed Wire Drop-Handles on Sides
        const handleRecessGeo = new THREE.BoxGeometry(0.04, 0.18, 0.36);
        const handleRecessLeft = new THREE.Mesh(handleRecessGeo, darkSteelMat);
        handleRecessLeft.position.set(-0.73, 0.35, 0);
        boxGroup.add(handleRecessLeft);

        const wireHandleGeo = new THREE.TorusGeometry(0.11, 0.02, 6, 12, Math.PI);
        const wireHandle = new THREE.Mesh(wireHandleGeo, darkSteelMat);
        wireHandle.rotation.y = Math.PI / 2;
        wireHandle.position.set(-0.75, 0.35, 0);
        boxGroup.add(wireHandle);

        const handleRecessRight = handleRecessLeft.clone();
        handleRecessRight.position.set(0.73, 0.35, 0);
        boxGroup.add(handleRecessRight);

        const wireHandleR = wireHandle.clone();
        wireHandleR.position.set(0.75, 0.35, 0);
        boxGroup.add(wireHandleR);

        // Front Yellow Toggle Clasps
        const latchGeo = new THREE.BoxGeometry(0.08, 0.22, 0.045);
        const latchMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.7, roughness: 0.3 });
        [-0.42, 0.42].forEach((lx) => {
          const latch = new THREE.Mesh(latchGeo, latchMat);
          latch.position.set(lx, 0.58, 0.47);
          boxGroup.add(latch);
        });

        // If Open: Propped lid leaning back and 3D metallic brass cartridges
        if (openThis) {
          const proppedLidGeo = new THREE.BoxGeometry(1.5, 0.09, 0.94);
          const proppedLid = new THREE.Mesh(proppedLidGeo, lidMat);
          proppedLid.position.set(0, 0.86, -0.26);
          proppedLid.rotation.x = -0.62;
          boxGroup.add(proppedLid);

          // Rows of 7.62mm Brass Cartridges with Copper Tips
          const brassMat = new THREE.MeshStandardMaterial({
            color: 0xfacc15,
            metalness: 0.92,
            roughness: 0.2,
          });
          const copperTipMat = new THREE.MeshStandardMaterial({
            color: 0xdd6b20,
            metalness: 0.85,
            roughness: 0.25,
          });

          const casingGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.14, 12);
          const tipGeo = new THREE.ConeGeometry(0.02, 0.045, 12);

          for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 8; col++) {
              const bullet = new THREE.Group();
              const casing = new THREE.Mesh(casingGeo, brassMat);
              const tip = new THREE.Mesh(tipGeo, copperTipMat);
              tip.position.y = 0.092;
              bullet.add(casing);
              bullet.add(tip);

              bullet.position.set(
                -0.44 + col * 0.125,
                0.62,
                -0.18 + row * 0.15
              );
              bullet.rotation.x = 0.08;
              boxGroup.add(bullet);
            }
          }

          const ammoGlow = new THREE.PointLight(0xf59e0b, 1.4, 3);
          ammoGlow.position.set(0, 0.78, 0);
          boxGroup.add(ammoGlow);
        }

        return boxGroup;
      };

      const bottomBox = buildSingleBox(false, cfg.isOpen && !cfg.isDoubleStack);
      root.add(bottomBox);

      if (cfg.isDoubleStack) {
        const topBox = buildSingleBox(true, false);
        topBox.position.set(0.05, 0.68, 0.04);
        topBox.rotation.y = 0.15; // 8.5-degree tactical stack offset
        root.add(topBox);
      }

      root.scale.set(s, s, s);
      root.position.set(...cfg.position);
      root.rotation.y = cfg.rotationY;

      return root;
    };

    // 1. Stage 0 Right: Pirate Chest #1 (Brimming with Gold Coins spilling out)
    const pirateChest1 = createPirateTreasureChest({
      position: [2.7, -0.84, 5.5],
      rotationY: -0.42,
      scale: 1.05,
      lidAngle: -0.82,
    });
    cratesGroup.add(pirateChest1);

    // 2. Stage 0 Left: Heavy Ammunition Crate Stack #1 (7.62mm NATO tactical double-stack)
    const ammoCrate1 = createAmmunitionCrate({
      position: [-2.9, -0.85, 4.2],
      rotationY: 0.38,
      scale: 1.0,
      isDoubleStack: true,
    });
    cratesGroup.add(ammoCrate1);

    // 3. Stage 1 Left: Open Ammunition Supply Crate (with shiny brass cartridges & stencils)
    const ammoCrate2 = createAmmunitionCrate({
      position: [-2.8, -0.85, -3.8],
      rotationY: 0.52,
      scale: 1.02,
      isOpen: true,
    });
    cratesGroup.add(ammoCrate2);

    // 4. Stage 2 Right: Pirate Chest #2 (Heaped Gold Coins & Tokens with golden radiance)
    const pirateChest2 = createPirateTreasureChest({
      position: [2.8, -0.84, -9.5],
      rotationY: -0.58,
      scale: 1.08,
      lidAngle: -0.85,
    });
    cratesGroup.add(pirateChest2);

    // 5. Stage 2 Left: Heavy Ammunition Crate Stack #2 (Hazard stripes and stencils)
    const ammoCrate3 = createAmmunitionCrate({
      position: [-3.0, -0.85, -13.0],
      rotationY: 0.44,
      scale: 1.05,
      isDoubleStack: true,
    });
    cratesGroup.add(ammoCrate3);

    // 6. Stage 2 / Score Board Right: Pirate Chest #3 (Ancient Treasure Cache at the terminus)
    const pirateChest3 = createPirateTreasureChest({
      position: [2.6, -0.84, -16.8],
      rotationY: -0.36,
      scale: 1.05,
      lidAngle: -0.8,
    });
    cratesGroup.add(pirateChest3);

    scene.add(cratesGroup);

    // ==============================================================
    // 9. IMPROVED 24K GOLD COINS / ARCADE TOKENS
    // Minted multi-relief 3D coins with reeded milled edges,
    // embossed arcade star, normal maps, dynamic sparkle flares,
    // and interactive collection chimes!
    // ==============================================================
    const coinsGroup = new THREE.Group();
    const coinMeshes: {
      group: THREE.Group;
      initialY: number;
      sparkleMesh: THREE.Mesh;
      baseRotationSpeed: number;
      bounceOffset: number;
    }[] = [];

    // Coin Materials
    const goldPBRMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.96,
      roughness: 0.16,
      emissive: 0x854d0e,
      emissiveIntensity: 0.35,
    });

    const coinFaceMaterial = new THREE.MeshStandardMaterial({
      map: coinFaceTex,
      normalMap: coinNormalTex,
      normalScale: new THREE.Vector2(0.12, 0.12),
      metalness: 0.94,
      roughness: 0.18,
      emissive: 0x713f12,
      emissiveIntensity: 0.3,
    });

    // Multi-material for coin body: [sides, top face, bottom face]
    const coinMaterials = [goldPBRMat, coinFaceMaterial, coinFaceMaterial];

    // Main Coin Geometry with beveled disc
    const coinBodyGeo = new THREE.CylinderGeometry(0.52, 0.52, 0.09, 48);

    // Raised Outer Rim Bevel Torus (Top & Bottom)
    const rimTorusGeo = new THREE.TorusGeometry(0.49, 0.026, 12, 48);

    // Embossed Center 3D Star relief
    const starCenterGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.11, 8);

    // Sparkle / Glint Lens Flare Cross (4-point flare)
    const flareGeo = new THREE.PlaneGeometry(0.4, 0.4);
    const flareMat = new THREE.MeshBasicMaterial({
      color: 0xfffbeb,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const coinCount = 14;

    for (let i = 0; i < coinCount; i++) {
      const cg = new THREE.Group();

      // 1. Coin Body with Minted Face & Normal Maps
      const body = new THREE.Mesh(coinBodyGeo, coinMaterials);
      body.rotation.x = Math.PI / 2;
      cg.add(body);

      // 2. Top & Bottom Raised Rim Rings
      const topRim = new THREE.Mesh(rimTorusGeo, goldPBRMat);
      topRim.position.z = 0.045;
      cg.add(topRim);

      const bottomRim = new THREE.Mesh(rimTorusGeo, goldPBRMat);
      bottomRim.position.z = -0.045;
      cg.add(bottomRim);

      // 3. Center Embossed Relief Star
      const starMesh = new THREE.Mesh(starCenterGeo, goldPBRMat);
      starMesh.rotation.x = Math.PI / 2;
      cg.add(starMesh);

      // 4. Sparkle Glint Flare attached to upper rim
      const sparkle = new THREE.Mesh(flareGeo, flareMat);
      sparkle.position.set(0.32, 0.32, 0.06);
      cg.add(sparkle);

      // 5. Subtle golden halo glow
      const coinLight = new THREE.PointLight(0xfacc15, 0.9, 3.5);
      coinLight.position.set(0, 0, 0.3);
      cg.add(coinLight);

      // Stagger along corridor flight path
      const side = (i % 2 === 0 ? 1 : -1) * (1.8 + (i % 3) * 0.9);
      const initialY = 1.2 + (i % 4) * 0.6;
      const z = 8 - i * 2.8;
      cg.position.set(side, initialY, z);

      coinsGroup.add(cg);
      coinMeshes.push({
        group: cg,
        initialY,
        sparkleMesh: sparkle,
        baseRotationSpeed: 0.022 + (i % 4) * 0.004,
        bounceOffset: 0,
      });
    }

    scene.add(coinsGroup);

    // ==============================================================
    // 10. Floating Tech Domain Polyhedra
    // ==============================================================
    const floatingShapesGroup = new THREE.Group();

    const icoGeo = new THREE.IcosahedronGeometry(0.8, 0);
    const icoMat = new THREE.MeshStandardMaterial({
      color: 0x00f3ff,
      wireframe: true,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
    });
    const icosahedron = new THREE.Mesh(icoGeo, icoMat);
    icosahedron.position.set(-1.8, 3.2, 2.5);
    floatingShapesGroup.add(icosahedron);

    const torGeo = new THREE.TorusGeometry(0.7, 0.18, 12, 32);
    const torMat = new THREE.MeshStandardMaterial({
      color: 0xff007f,
      wireframe: true,
      emissive: 0xe11d48,
      emissiveIntensity: 0.6,
    });
    const torus = new THREE.Mesh(torGeo, torMat);
    torus.position.set(2.0, 3.5, -4);
    floatingShapesGroup.add(torus);

    const octGeo = new THREE.OctahedronGeometry(0.7, 0);
    const octMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      wireframe: true,
      emissive: 0x15803d,
      emissiveIntensity: 0.6,
    });
    const octahedron = new THREE.Mesh(octGeo, octMat);
    octahedron.position.set(-2.0, 2.8, -11);
    floatingShapesGroup.add(octahedron);

    scene.add(floatingShapesGroup);

    // Mouse movement listener
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Window resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Interactive Coin Click / Raycasting
    const raycaster = new THREE.Raycaster();
    const clickMouse = new THREE.Vector2();

    const handleWindowClick = (e: MouseEvent) => {
      clickMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      clickMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(clickMouse, camera);

      const coinIntersects = raycaster.intersectObjects(coinsGroup.children, true);
      const crateIntersects = raycaster.intersectObjects(cratesGroup.children, true);

      if (coinIntersects.length > 0 || crateIntersects.length > 0) {
        // Coin or Pirate Chest Loot Clicked!
        arcadeAudio.playCoin();
        collectedCoinsCountRef.current += 1;
        if (onCoinCollect) {
          onCoinCollect(collectedCoinsCountRef.current);
        }

        // Find parent group and trigger celebratory jump if floating coin
        if (coinIntersects.length > 0) {
          let hitObj: THREE.Object3D | null = coinIntersects[0].object;
          while (hitObj && hitObj.parent !== coinsGroup) {
            hitObj = hitObj.parent;
          }

          if (hitObj) {
            const coinData = coinMeshes.find((cm) => cm.group === hitObj);
            if (coinData) {
              coinData.bounceOffset = 0.8;
            }
          }
        }
      }
    };
    window.addEventListener('click', handleWindowClick);

    // ==============================================================
    // 11. ANIMATION LOOP
    // ==============================================================
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Native smooth scroll calculation with buttery lerping
      const totalScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const targetScroll = Math.min(1, Math.max(0, window.scrollY / totalScroll));
      scrollRef.current += (targetScroll - scrollRef.current) * 0.08;
      const currentScroll = scrollRef.current;

      const targetCamZ = 10 - currentScroll * 30;
      const targetCamY = 2.4 + Math.sin(currentScroll * Math.PI * 2) * 0.6;
      const targetCamX = Math.sin(currentScroll * Math.PI * 3) * 1.2 + mouseRef.current.x * 0.4;

      camera.position.z += (targetCamZ - camera.position.z) * 0.06;
      camera.position.y += (targetCamY + mouseRef.current.y * 0.2 - camera.position.y) * 0.06;
      camera.position.x += (targetCamX - camera.position.x) * 0.06;

      camera.lookAt(camera.position.x * 0.4, camera.position.y - 0.5, camera.position.z - 8);

      // Animate Improved Gold Coins:
      // Tumbling gyroscopic precession rotation + organic sine bobbing + sparkling flare pulse!
      coinMeshes.forEach((cm, idx) => {
        const { group, initialY, sparkleMesh, baseRotationSpeed } = cm;

        // Gyroscopic spin
        group.rotation.y += baseRotationSpeed;
        group.rotation.x = Math.sin(elapsedTime * 1.8 + idx) * 0.2;
        group.rotation.z = Math.cos(elapsedTime * 1.4 + idx) * 0.15;

        // Smooth vertical floating + decay jump bounce
        if (cm.bounceOffset > 0.01) {
          cm.bounceOffset *= 0.92;
        } else {
          cm.bounceOffset = 0;
        }

        group.position.y = initialY + Math.sin(elapsedTime * 2.2 + idx * 0.8) * 0.18 + cm.bounceOffset;

        // Dynamic Sparkle Flare twinkle
        const flareScale = Math.max(0.2, Math.sin(elapsedTime * 4 + idx * 1.5) * 1.2 + 0.4);
        sparkleMesh.scale.set(flareScale, flareScale, 1);
        sparkleMesh.rotation.z += 0.04;
      });

      // Animate Pirate Treasure Chest Sparkles & Pulsing Golden Radiance
      chestSparkles.forEach((cs, idx) => {
        const pulse = Math.sin(elapsedTime * 3.5 + idx * 2.0);
        const flareScale = Math.max(0.25, pulse * 0.7 + 0.9);
        cs.mesh.scale.set(flareScale, flareScale, 1);
        cs.mesh.rotation.z += 0.025;
        cs.light.intensity = cs.baseIntensity + pulse * 0.6;
      });

      // Rotate polyhedra
      icosahedron.rotation.x += 0.01;
      icosahedron.rotation.y += 0.015;
      torus.rotation.x += 0.015;
      torus.rotation.y += 0.02;
      octahedron.rotation.y += 0.02;
      octahedron.rotation.z += 0.01;

      // Animate cabinets slightly with subtle breathing bob
      cab1.position.y = 0.2 + Math.sin(elapsedTime * 1.5) * 0.03;
      cab2.position.y = 0.2 + Math.cos(elapsedTime * 1.5) * 0.03;
      cab3.position.y = 0.2 + Math.sin(elapsedTime * 1.8 + 1) * 0.03;
      cab4.position.y = 0.2 + Math.cos(elapsedTime * 1.8 + 1) * 0.03;

      // Infinite grid illusion
      gridHelper.position.z = Math.floor(camera.position.z / 2) * 2;
      floorPlane.position.z = gridHelper.position.z;

      // Rotate starfield slowly
      starField.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleWindowClick);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
    };
  }, [onCoinCollect]);

  return (
    <div
      id="arcade-3d-viewport"
      ref={mountRef}
      className="fixed inset-0 w-full h-full pointer-events-auto z-0 overflow-hidden"
      aria-label="3D Interactive Arcade Environment"
    />
  );
};
