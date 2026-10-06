import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { BuildingData, CTFData } from '../types/protocol';
import { sound } from '../utils/sound';
import { 
  Move, 
  MousePointer, 
  CheckCircle2, 
  Lock,
  ArrowLeft,
  RotateCcw,
  Zap
} from 'lucide-react';

interface ThreeRoomFPPProps {
  building: BuildingData;
  onInteractCTF: (ctf: CTFData) => void;
  onReturnToMap: () => void;
}

export const ThreeRoomFPP: React.FC<ThreeRoomFPPProps> = ({
  building,
  onInteractCTF,
  onReturnToMap
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activePrompt, setActivePrompt] = useState<{
    type: 'ctf' | 'exit';
    target?: CTFData;
    message: string;
  } | null>(null);

  const [compassHeading, setCompassHeading] = useState(0);
  const [playerCoord, setPlayerCoord] = useState({ x: 0, z: 0 });
  const [isSprinting, setIsSprinting] = useState(false);

  // Persistent reference to runtime state
  const stateRef = useRef({
    keys: { forward: false, backward: false, left: false, right: false, sprint: false },
    isMouseDown: false,
    prevMouseX: 0,
    prevMouseY: 0,
    cameraYaw: Math.PI, // Facing into the room (towards -Z)
    cameraPitch: 0,
    playerPos: new THREE.Vector3(0, 1.7, 5.5),
    velocity: new THREE.Vector3(0, 0, 0),
    headBobTimer: 0,
    stepDistance: 0,
    activePrompt: null as { type: 'ctf' | 'exit'; target?: CTFData; message: string } | null,
    onInteractCTF,
    onReturnToMap,
    building
  });

  stateRef.current.onInteractCTF = onInteractCTF;
  stateRef.current.onReturnToMap = onReturnToMap;
  stateRef.current.building = building;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Reset player position when entering building
    stateRef.current.playerPos.set(0, 1.7, 5.8);
    stateRef.current.velocity.set(0, 0, 0);
    stateRef.current.cameraYaw = Math.PI; // Face forward into room
    stateRef.current.cameraPitch = 0;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    
    // Choose specific background fog color based on building environment
    const getBuildingAtmosphere = () => {
      switch (building.id) {
        case 'hospital':
          return { bg: 0x051318, fog: 0.04, primary: 0x06b6d4, accent: 0x10b981 };
        case 'school':
          return { bg: 0x081119, fog: 0.04, primary: 0x38bdf8, accent: 0xf59e0b };
        case 'museum':
          return { bg: 0x0e071c, fog: 0.035, primary: 0xfacc15, accent: 0xa855f7 };
        case 'sports':
          return { bg: 0x140d07, fog: 0.04, primary: 0xf97316, accent: 0xfacc15 };
        case 'society':
          return { bg: 0x110915, fog: 0.045, primary: 0xd946ef, accent: 0xfacc15 };
      }
    };

    const atmo = getBuildingAtmosphere();
    scene.background = new THREE.Color(atmo.bg);
    scene.fog = new THREE.FogExp2(atmo.bg, atmo.fog);

    const camera = new THREE.PerspectiveCamera(
      70,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.copy(stateRef.current.playerPos);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 2. Dynamic Room Dimensions & Shell
    const roomWidth = 14;
    const roomLength = 16;
    const roomHeight = 4.4;

    // Lighting setup specific to the building
    const ambientLight = new THREE.AmbientLight(atmo.bg, 1.2);
    scene.add(ambientLight);

    // Main Overhead fixture
    const mainLight = new THREE.PointLight(atmo.primary, 1.8, 22, 1.1);
    mainLight.position.set(0, roomHeight - 0.5, 0);
    mainLight.castShadow = true;
    scene.add(mainLight);

    // Secondary fill light
    const fillLight = new THREE.PointLight(atmo.accent, 1.2, 18, 1.3);
    fillLight.position.set(0, 2.5, -4);
    scene.add(fillLight);

    // 3. Unique Environment & Materials Generation
    const animatedObjects: { update: (time: number, delta: number) => void }[] = [];

    // Helper: Texture generator for unique floors
    const generateFloorTexture = (type: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;

      if (type === 'hospital') {
        // Sterile medical teal/white tile
        ctx.fillStyle = '#08171d';
        ctx.fillRect(0, 0, 512, 512);
        ctx.strokeStyle = '#0e2b34';
        ctx.lineWidth = 2;
        for (let i = 0; i <= 512; i += 64) {
          ctx.strokeRect(i, 0, 64, 512);
        }
        // Emergency triage guide stripes
        ctx.fillStyle = '#0d9488';
        ctx.fillRect(230, 0, 52, 512);
        ctx.fillStyle = '#10b981';
        ctx.fillRect(250, 0, 12, 512);
      } else if (type === 'school') {
        // Institutional classroom composite tile
        ctx.fillStyle = '#0f1722';
        ctx.fillRect(0, 0, 512, 512);
        ctx.strokeStyle = '#1b2a3d';
        ctx.lineWidth = 3;
        for (let i = 0; i <= 512; i += 128) {
          for (let j = 0; j <= 512; j += 128) {
            ctx.strokeRect(i, j, 128, 128);
          }
        }
        ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
        ctx.fillRect(64, 64, 384, 384);
      } else if (type === 'museum') {
        // Polished obsidian dark marble
        ctx.fillStyle = '#090511';
        ctx.fillRect(0, 0, 512, 512);
        ctx.strokeStyle = '#27173e';
        ctx.lineWidth = 2;
        ctx.strokeRect(16, 16, 480, 480);
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(256, 256, 180, 0, Math.PI * 2);
        ctx.stroke();
      } else if (type === 'sports') {
        // Synthetic athletic running track & hardwood
        ctx.fillStyle = '#180e07';
        ctx.fillRect(0, 0, 512, 512);
        // Track lanes
        ctx.strokeStyle = '#ea580c';
        ctx.lineWidth = 14;
        ctx.strokeRect(30, 30, 452, 452);
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 4;
        ctx.strokeRect(70, 70, 372, 372);
      } else {
        // Society: Grated industrial residential deck plates
        ctx.fillStyle = '#100a14';
        ctx.fillRect(0, 0, 512, 512);
        ctx.strokeStyle = '#2a1a33';
        ctx.lineWidth = 4;
        for (let i = 0; i <= 512; i += 32) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, 512);
          ctx.stroke();
        }
        ctx.fillStyle = 'rgba(217, 70, 239, 0.15)';
        ctx.fillRect(100, 100, 312, 312);
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(4, 4);
      return tex;
    };

    // Floor Mesh
    const floorTexture = generateFloorTexture(building.id);
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: building.id === 'museum' ? 0.15 : 0.65,
      metalness: building.id === 'museum' ? 0.8 : 0.35
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(roomWidth, roomLength), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Ceiling
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0x090c12,
      roughness: 0.8,
      metalness: 0.3
    });
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomWidth, roomLength), ceilingMat);
    ceiling.position.y = roomHeight;
    ceiling.rotation.x = Math.PI / 2;
    scene.add(ceiling);

    // Wall Material matching building theme
    const getWallColor = () => {
      switch (building.id) {
        case 'hospital': return 0x091c24; // clinical teal
        case 'school': return 0x0c1926; // classroom navy/slate
        case 'museum': return 0x140a25; // regal indigo
        case 'sports': return 0x1f140c; // industrial sports carbon
        case 'society': return 0x1a0d20; // dark dystopian residential
      }
    };

    const wallMat = new THREE.MeshStandardMaterial({
      color: getWallColor(),
      roughness: 0.6,
      metalness: 0.4
    });

    // 4 Walls
    const northWall = new THREE.Mesh(new THREE.PlaneGeometry(roomWidth, roomHeight), wallMat);
    northWall.position.set(0, roomHeight / 2, -roomLength / 2);
    northWall.receiveShadow = true;
    scene.add(northWall);

    const southWall = new THREE.Mesh(new THREE.PlaneGeometry(roomWidth, roomHeight), wallMat);
    southWall.position.set(0, roomHeight / 2, roomLength / 2);
    southWall.rotation.y = Math.PI;
    southWall.receiveShadow = true;
    scene.add(southWall);

    const eastWall = new THREE.Mesh(new THREE.PlaneGeometry(roomLength, roomHeight), wallMat);
    eastWall.position.set(roomWidth / 2, roomHeight / 2, 0);
    eastWall.rotation.y = -Math.PI / 2;
    eastWall.receiveShadow = true;
    scene.add(eastWall);

    const westWall = new THREE.Mesh(new THREE.PlaneGeometry(roomLength, roomHeight), wallMat);
    westWall.position.set(-roomWidth / 2, roomHeight / 2, 0);
    westWall.rotation.y = Math.PI / 2;
    westWall.receiveShadow = true;
    scene.add(westWall);

    // EXIT AIRLOCK GATE ON SOUTH WALL
    const airlockMat = new THREE.MeshStandardMaterial({ color: 0x1e2736, metalness: 0.8 });
    const airlock = new THREE.Mesh(new THREE.BoxGeometry(3.4, 3.2, 0.3), airlockMat);
    airlock.position.set(0, 1.6, roomLength / 2 - 0.15);
    scene.add(airlock);

    // Hazard bar on airlock
    const hazardMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const hazard = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.15, 0.22), hazardMat);
    hazard.position.set(0, 2.3, roomLength / 2 - 0.2);
    scene.add(hazard);

    // Text Sprite Helper
    const createBillboardSprite = (text: string, sub: string, color: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;
      
      ctx.fillStyle = 'rgba(8, 12, 18, 0.9)';
      ctx.fillRect(0, 0, 512, 256);
      ctx.strokeStyle = color;
      ctx.lineWidth = 6;
      ctx.strokeRect(6, 6, 500, 244);

      ctx.fillStyle = color;
      ctx.font = 'bold 36px Rajdhani, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(text, 256, 95);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '24px "JetBrains Mono", monospace';
      ctx.fillText(sub, 256, 170);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(3, 1.5, 1);
      return sprite;
    };

    const airlockSign = createBillboardSprite('[ AIRLOCK PORTAL ]', 'PRESS [E] TO RETURN TO MAP', '#facc15');
    airlockSign.position.set(0, 2.9, roomLength / 2 - 0.4);
    scene.add(airlockSign);

    // ==========================================
    // 4. DISTINCT THEMED ARCHITECTURE & MOVEMENT
    // ==========================================

    switch (building.id) {
      // ----------------------------------------
      // 1. HOSPITAL: Quarantine Pod & Pulsing ECG
      // ----------------------------------------
      case 'hospital': {
        // Central Triage Pod with Patient Bed
        const podBase = new THREE.Mesh(
          new THREE.CylinderGeometry(1.6, 1.8, 0.8, 16),
          new THREE.MeshStandardMaterial({ color: 0x0e2733, metalness: 0.9, roughness: 0.2 })
        );
        podBase.position.set(0, 0.4, -1);
        scene.add(podBase);

        // Medical Stasis Capsule Glass
        const glassCapsule = new THREE.Mesh(
          new THREE.CylinderGeometry(1.2, 1.2, 1.8, 16, 1, true),
          new THREE.MeshPhysicalMaterial({ color: 0x5eead4, transparent: true, opacity: 0.35, roughness: 0.1, transmission: 0.9 })
        );
        glassCapsule.position.set(0, 1.4, -1);
        scene.add(glassCapsule);

        // Animated Rotating Surgical Light Fixture in ceiling
        const surgicalRing = new THREE.Mesh(
          new THREE.TorusGeometry(1.4, 0.08, 8, 24),
          new THREE.MeshBasicMaterial({ color: 0x22d3ee })
        );
        surgicalRing.rotation.x = Math.PI / 2;
        surgicalRing.position.set(0, roomHeight - 0.6, -1);
        scene.add(surgicalRing);

        // Holographic ECG Vitals Screen on Front Wall
        const ecgCanvas = document.createElement('canvas');
        ecgCanvas.width = 512;
        ecgCanvas.height = 256;
        const ecgCtx = ecgCanvas.getContext('2d')!;
        const ecgTexture = new THREE.CanvasTexture(ecgCanvas);
        const ecgScreen = new THREE.Mesh(
          new THREE.PlaneGeometry(3.6, 1.8),
          new THREE.MeshBasicMaterial({ map: ecgTexture, transparent: true })
        );
        ecgScreen.position.set(0, 2.4, -roomLength / 2 + 0.1);
        scene.add(ecgScreen);

        // Floating bio-particles
        const particleGeo = new THREE.BufferGeometry();
        const pCount = 60;
        const pPositions = new Float32Array(pCount * 3);
        for (let i = 0; i < pCount; i++) {
          pPositions[i * 3] = (Math.random() - 0.5) * 2;
          pPositions[i * 3 + 1] = 0.5 + Math.random() * 2.0;
          pPositions[i * 3 + 2] = -1 + (Math.random() - 0.5) * 2;
        }
        particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
        const particleMat = new THREE.PointsMaterial({ color: 0x10b981, size: 0.06, transparent: true, opacity: 0.8 });
        const particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);

        // EERIE: flickering surgical lamp + red quarantine beacon
        const flickerSurgical = new THREE.PointLight(0x9ff5e8, 2.2, 12, 1.4);
        flickerSurgical.position.set(0, roomHeight - 0.8, -1);
        scene.add(flickerSurgical);
        const quarantineBeacon = new THREE.PointLight(0xef2b2b, 1.4, 16, 1.2);
        quarantineBeacon.position.set(-4.5, 3.1, 3.5);
        scene.add(quarantineBeacon);
        const beaconMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 12, 12),
          new THREE.MeshBasicMaterial({ color: 0xef4444 })
        );
        beaconMesh.position.set(-4.5, 3.4, 3.5);
        scene.add(beaconMesh);
        // EERIE: hanging IV stands silhouettes
        [-3.4, 3.4].forEach((x) => {
          const pole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.03, 0.03, 2.4, 8),
            new THREE.MeshStandardMaterial({ color: 0x1a2b33, metalness: 0.8, roughness: 0.4 })
          );
          pole.position.set(x, 1.2, 2.2);
          scene.add(pole);
          const hook = new THREE.Mesh(
            new THREE.BoxGeometry(0.7, 0.04, 0.04),
            new THREE.MeshStandardMaterial({ color: 0x1a2b33, metalness: 0.8 })
          );
          hook.position.set(x, 2.4, 2.2);
          scene.add(hook);
          const bagMat = new THREE.MeshPhysicalMaterial({ color: 0x5eead4, transparent: true, opacity: 0.28, roughness: 0.2 });
          const bag = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.42, 0.08), bagMat);
          bag.position.set(x - 0.28, 2.1, 2.2);
          scene.add(bag);
        });
        // EERIE: quarantine plastic curtain strips at entrance
        for (let i = 0; i < 5; i++) {
          const strip = new THREE.Mesh(
            new THREE.PlaneGeometry(0.55, 2.6),
            new THREE.MeshPhysicalMaterial({ color: 0x99f6e4, transparent: true, opacity: 0.13, roughness: 0.3, side: THREE.DoubleSide })
          );
          strip.position.set(-1.4 + i * 0.7, 1.7, 5.4);
          strip.rotation.y = (Math.random() - 0.5) * 0.25;
          scene.add(strip);
          animatedObjects.push({ update: (t) => { strip.rotation.y = Math.sin(t * 0.9 + i) * 0.18; } });
        }

        // Animation update
        animatedObjects.push({
          update: (time) => {
            surgicalRing.rotation.z = time * 0.5;
            ecgCtx.fillStyle = 'rgba(6, 24, 30, 0.2)';
            ecgCtx.fillRect(0, 0, 512, 256);
            const glitch = Math.random() > 0.965;
            ecgCtx.strokeStyle = glitch ? '#ef4444' : '#10b981';
            ecgCtx.lineWidth = 4;
            ecgCtx.beginPath();
            const offset = (time * 180) % 512;
            for (let x = 0; x < 512; x += 4) {
              const relX = (x + offset) % 512;
              let y = 128;
              if (glitch) {
                y = 128 + (Math.random() - 0.5) * 90;
              } else if (relX > 200 && relX < 240) {
                y = 128 - Math.sin((relX - 200) / 40 * Math.PI) * 75;
              } else if (relX >= 240 && relX < 270) {
                y = 128 + Math.sin((relX - 240) / 30 * Math.PI) * 45;
              } else if (relX >= 400 && relX < 430) {
                y = 128;
              }
              if (x === 0) ecgCtx.moveTo(x, y);
              else ecgCtx.lineTo(x, y);
            }
            ecgCtx.stroke();
            ecgCtx.fillStyle = glitch ? '#fca5a5' : '#5eead4';
            ecgCtx.font = 'bold 20px monospace';
            ecgCtx.fillText(glitch ? `SIGNAL LOST // PURGE SPIKE` : `BPM: 74 // TRIAGE DESYNC: 38%`, 20, 40);
            ecgTexture.needsUpdate = true;
            const pos = particleGeo.attributes.position.array as Float32Array;
            for (let i = 0; i < pCount; i++) {
              pos[i * 3 + 1] += 0.008;
              if (pos[i * 3 + 1] > 2.5) pos[i * 3 + 1] = 0.5;
            }
            particleGeo.attributes.position.needsUpdate = true;
            flickerSurgical.intensity = Math.random() > 0.08 ? 2.2 : 0.35;
            quarantineBeacon.intensity = 1.1 + Math.sin(time * 4.2) * 0.9;
            const s = 1 + Math.sin(time * 4.2) * 0.25;
            beaconMesh.scale.set(s, s, s);
          }
        });
        break;
      }

      // ----------------------------------------
      // 2. SCHOOL: Pedagogical Database Core
      // ----------------------------------------
      case 'school': {
        // Towering central holographic core
        const corePillar = new THREE.Mesh(
          new THREE.CylinderGeometry(0.9, 1.1, roomHeight, 16),
          new THREE.MeshStandardMaterial({ color: 0x142334, metalness: 0.8, roughness: 0.3 })
        );
        corePillar.position.set(0, roomHeight / 2, -1);
        scene.add(corePillar);

        // Orbiting Holographic Rings
        const ring1 = new THREE.Mesh(
          new THREE.TorusGeometry(1.6, 0.04, 8, 32),
          new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true })
        );
        ring1.position.set(0, 2.0, -1);
        scene.add(ring1);

        const ring2 = new THREE.Mesh(
          new THREE.TorusGeometry(2.0, 0.03, 8, 32),
          new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true })
        );
        ring2.position.set(0, 2.0, -1);
        scene.add(ring2);

        // Floating geometric formula solids orbiting
        const formulaCube = new THREE.Mesh(
          new THREE.BoxGeometry(0.35, 0.35, 0.35),
          new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true })
        );
        scene.add(formulaCube);

        // Classroom study desks with interactive slates
        [-2.8, 2.8].forEach((x) => {
          const desk = new THREE.Mesh(
            new THREE.BoxGeometry(1.6, 0.75, 0.9),
            new THREE.MeshStandardMaterial({ color: 0x182433 })
          );
          desk.position.set(x, 0.37, 1.2);
          scene.add(desk);

          const slate = new THREE.Mesh(
            new THREE.PlaneGeometry(0.6, 0.4),
            new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
          );
          slate.rotation.x = -Math.PI / 2;
          slate.position.set(x, 0.76, 1.2);
          scene.add(slate);
        });

        // Front chalkboard projection
        const boardCanvas = document.createElement('canvas');
        boardCanvas.width = 512;
        boardCanvas.height = 256;
        const bCtx = boardCanvas.getContext('2d')!;
        const boardTexture = new THREE.CanvasTexture(boardCanvas);
        const blackboard = new THREE.Mesh(
          new THREE.PlaneGeometry(4.2, 2.0),
          new THREE.MeshBasicMaterial({ map: boardTexture })
        );
        blackboard.position.set(0, 2.4, -roomLength / 2 + 0.1);
        scene.add(blackboard);

        animatedObjects.push({
          update: (time) => {
            ring1.rotation.x = time * 0.8;
            ring1.rotation.y = time * 0.5;
            ring2.rotation.x = -time * 0.6;
            ring2.rotation.z = time * 0.7;

            // Orbit formula cube
            formulaCube.position.set(
              Math.cos(time * 1.5) * 2.2,
              2.0 + Math.sin(time * 2.0) * 0.3,
              -1 + Math.sin(time * 1.5) * 2.2
            );
            formulaCube.rotation.x = time;
            formulaCube.rotation.y = time;

            // Draw scrolling classroom curriculum formula
            bCtx.fillStyle = '#06201a';
            bCtx.fillRect(0, 0, 512, 256);
            bCtx.strokeStyle = '#10b981';
            bCtx.strokeRect(4, 4, 504, 248);
            bCtx.fillStyle = '#38bdf8';
            bCtx.font = 'bold 22px "JetBrains Mono", monospace';
            bCtx.fillText('EDU-CORE // LOGIC & CIVIC ARCHITECTURE', 20, 45);
            bCtx.fillStyle = '#e2e8f0';
            bCtx.font = '16px monospace';
            bCtx.fillText(`[AXIOM 4] DELTA_SANCTUARY = NULL(POPULATION)`, 20, 90);
            bCtx.fillText(`PUPIL COUNT REGISTERED: 84 / 120 [36 MISSING]`, 20, 125);
            bCtx.fillStyle = '#f59e0b';
            bCtx.fillText(`CURRICULUM FIREWALL STATUS: PURGING...`, 20, 165);
            boardTexture.needsUpdate = true;
          }
        });
        break;
      }

      // ----------------------------------------
      // 3. MUSEUM: Ancient Spinning Relic & Lasers
      // ----------------------------------------
      case 'museum': {
        // Circular dais
        const dais = new THREE.Mesh(
          new THREE.CylinderGeometry(1.6, 1.8, 0.7, 24),
          new THREE.MeshStandardMaterial({ color: 0x1d1130, metalness: 0.9, roughness: 0.1 })
        );
        dais.position.set(0, 0.35, -1);
        scene.add(dais);

        // Glass containment dome
        const dome = new THREE.Mesh(
          new THREE.SphereGeometry(1.3, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
          new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.25, transmission: 0.9, roughness: 0.1 })
        );
        dome.position.set(0, 0.7, -1);
        scene.add(dome);

        // The Spinning Ancient Relic Core (Inner Octahedron + Outer Gyro Ring)
        const relicCore = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.45, 0),
          new THREE.MeshBasicMaterial({ color: 0xfacc15, wireframe: true })
        );
        relicCore.position.set(0, 1.35, -1);
        scene.add(relicCore);

        const relicRing = new THREE.Mesh(
          new THREE.TorusGeometry(0.75, 0.03, 8, 24),
          new THREE.MeshBasicMaterial({ color: 0xd97706 })
        );
        relicRing.position.set(0, 1.35, -1);
        scene.add(relicRing);

        // Laser Security Beam sweeping across room
        const laserMat = new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.7 });
        const laserBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 12, 8), laserMat);
        laserBeam.rotation.z = Math.PI / 2;
        laserBeam.position.set(0, 1.1, -1);
        scene.add(laserBeam);

        // Display cases along side walls
        [-5.5, 5.5].forEach((x) => {
          const caseStand = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 1.0, 1.2),
            new THREE.MeshStandardMaterial({ color: 0x180d26, metalness: 0.8 })
          );
          caseStand.position.set(x, 0.5, 0);
          scene.add(caseStand);

          const relicArtifact = new THREE.Mesh(
            new THREE.DodecahedronGeometry(0.25),
            new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: true })
          );
          relicArtifact.position.set(x, 1.3, 0);
          scene.add(relicArtifact);
        });

        animatedObjects.push({
          update: (time) => {
            relicCore.rotation.x = time * 1.2;
            relicCore.rotation.y = time * 1.6;
            relicRing.rotation.x = time * 0.8;
            relicRing.rotation.z = -time * 1.0;

            // Sweeping laser
            laserBeam.position.z = -1 + Math.sin(time * 1.5) * 3.5;
            laserBeam.position.y = 1.1 + Math.cos(time * 2.0) * 0.2;
          }
        });
        break;
      }

      // ----------------------------------------
      // 4. SPORTS: Scoreboard & Pulsing Power Conduit
      // ----------------------------------------
      case 'sports': {
        // Overhead Stadium Scoreboard suspended from ceiling
        const scoreFrame = new THREE.Mesh(
          new THREE.BoxGeometry(4.2, 1.4, 0.5),
          new THREE.MeshStandardMaterial({ color: 0x1c1209, metalness: 0.9 })
        );
        scoreFrame.position.set(0, roomHeight - 1.2, -1);
        scene.add(scoreFrame);

        // Scoreboard display texture
        const scoreCanvas = document.createElement('canvas');
        scoreCanvas.width = 512;
        scoreCanvas.height = 128;
        const sCtx = scoreCanvas.getContext('2d')!;
        const scoreTexture = new THREE.CanvasTexture(scoreCanvas);
        const scoreScreen = new THREE.Mesh(
          new THREE.PlaneGeometry(3.9, 1.1),
          new THREE.MeshBasicMaterial({ map: scoreTexture })
        );
        scoreScreen.position.set(0, roomHeight - 1.2, -0.74);
        scene.add(scoreScreen);

        // Metal Gym Locker Row
        const lockerBank = new THREE.Mesh(
          new THREE.BoxGeometry(4.8, 2.2, 0.7),
          new THREE.MeshStandardMaterial({ color: 0x24180d, metalness: 0.8, roughness: 0.4 })
        );
        lockerBank.position.set(0, 1.1, -roomLength / 2 + 0.4);
        scene.add(lockerBank);

        // Exposed Glowing Floor Conduit under grates
        const conduitCoil = new THREE.Mesh(
          new THREE.TorusGeometry(2.4, 0.08, 8, 32),
          new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true })
        );
        conduitCoil.rotation.x = Math.PI / 2;
        conduitCoil.position.set(0, 0.05, 0.5);
        scene.add(conduitCoil);

        animatedObjects.push({
          update: (time) => {
            // Pulsing conduit coil
            const pulse = (Math.sin(time * 6.0) + 1) / 2;
            conduitCoil.scale.set(1 + pulse * 0.05, 1 + pulse * 0.05, 1);

            // Draw Scoreboard Clock & Grid telemetry
            sCtx.fillStyle = '#0f0701';
            sCtx.fillRect(0, 0, 512, 128);
            sCtx.strokeStyle = '#ea580c';
            sCtx.strokeRect(2, 2, 508, 124);
            sCtx.fillStyle = '#facc15';
            sCtx.font = 'bold 36px "Chakra Petch", sans-serif';
            sCtx.fillText(`PAVILION // ATH-Y04`, 20, 48);
            sCtx.fillStyle = '#ea580c';
            sCtx.font = 'bold 28px monospace';
            const secs = String(Math.floor((time * 10) % 60)).padStart(2, '0');
            sCtx.fillText(`SUB-LEVEL BUS: 12,000 kW [OVERLOAD] :${secs}`, 20, 95);
            scoreTexture.needsUpdate = true;
          }
        });
        break;
      }

      // ----------------------------------------
      // 5. SOCIETY: Rotating Fan Blades & Fog
      // ----------------------------------------
      case 'society': {
        // Ceiling Industrial Ventilation Fans
        const fanGroup = new THREE.Group();
        fanGroup.position.set(0, roomHeight - 0.2, 0);

        for (let i = 0; i < 4; i++) {
          const blade = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.04, 1.4),
            new THREE.MeshStandardMaterial({ color: 0x1a0f24, metalness: 0.8 })
          );
          blade.rotation.y = (i * Math.PI) / 2;
          blade.position.set(0, 0, 0.7).applyAxisAngle(new THREE.Vector3(0, 1, 0), (i * Math.PI) / 2);
          fanGroup.add(blade);
        }
        scene.add(fanGroup);

        // Habitat Unit Doors along side walls
        [-roomWidth / 2 + 0.25, roomWidth / 2 - 0.25].forEach((x, idx) => {
          const podDoor = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 2.8, 1.8),
            new THREE.MeshStandardMaterial({ color: 0x22102e, metalness: 0.8 })
          );
          podDoor.position.set(x, 1.4, -1);
          scene.add(podDoor);

          // Unit 404 sign
          const sign = createBillboardSprite(
            idx === 0 ? 'UNIT 404 [SEALED]' : 'UNIT 405 [VACANT]',
            idx === 0 ? 'WARNING: CITIZEN EXPUNGED' : 'DOOR LOCKED',
            idx === 0 ? '#ef4444' : '#facc15'
          );
          sign.position.set(x + (idx === 0 ? 0.45 : -0.45), 2.2, -1);
          sign.scale.set(1.4, 0.7, 1);
          scene.add(sign);
        });

        // Communal water synthesizer kiosk in center
        const kiosk = new THREE.Mesh(
          new THREE.BoxGeometry(1.6, 2.2, 1.4),
          new THREE.MeshStandardMaterial({ color: 0x1f0d2b, metalness: 0.8 })
        );
        kiosk.position.set(0, 1.1, -1);
        scene.add(kiosk);

        animatedObjects.push({
          update: (time) => {
            fanGroup.rotation.y = time * 3.5; // continuously spinning fan blades
          }
        });
        break;
      }
    }

    // ==========================================
    // 5. THE TWO CLEAR CTF TERMINAL STATIONS
    // ==========================================
    const ctfObjects: { mesh: THREE.Group; ctf: CTFData; pos: THREE.Vector3 }[] = [];

    building.ctfs.forEach((ctf) => {
      const group = new THREE.Group();
      const [px, py, pz] = ctf.roomPosition;
      group.position.set(px, 0, pz);
      if (ctf.roomRotation) group.rotation.y = ctf.roomRotation;

      // Pedestal Base
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x111622,
        metalness: 0.9,
        roughness: 0.3
      });
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, 1.1, 16), baseMat);
      base.position.y = 0.55;
      base.castShadow = true;
      group.add(base);

      // Status Ring
      const statusColor = ctf.completed ? 0x10b981 : 0xfacc15;
      const statusRing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.72, 0.72, 0.08, 16),
        new THREE.MeshBasicMaterial({ color: statusColor })
      );
      statusRing.position.y = 0.95;
      group.add(statusRing);

      // Angled Console
      const consoleMesh = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.8, 0.1),
        new THREE.MeshStandardMaterial({ color: 0x1a2332, metalness: 0.8 })
      );
      consoleMesh.position.set(0, 1.35, 0);
      consoleMesh.rotation.x = -0.35;
      group.add(consoleMesh);

      // Holographic Screen with Canvas
      const screenColor = ctf.completed ? '#10b981' : '#facc15';
      const screenMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.95, 0.65),
        new THREE.MeshBasicMaterial({ color: statusColor, wireframe: true })
      );
      screenMesh.position.set(0, 1.37, 0.06);
      screenMesh.rotation.x = -0.35;
      group.add(screenMesh);

      // Floating Billboard Label
      const labelText = `CTF // ${ctf.slot} ${ctf.label}`;
      const sublabelText = ctf.completed ? '[ STATUS: SECURED ✓ ]' : '[ PRESS E TO ACCESS ]';
      const sprite = createBillboardSprite(labelText, sublabelText, screenColor);
      sprite.position.set(0, 2.3, 0);
      sprite.scale.set(2.4, 1.2, 1);
      group.add(sprite);

      scene.add(group);
      ctfObjects.push({
        mesh: group,
        ctf,
        pos: new THREE.Vector3(px, py, pz)
      });
    });

    // ==========================================
    // 6. CONTROLS (Smooth Movement & Mouse Look)
    // ==========================================
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = stateRef.current;
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          state.keys.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          state.keys.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          state.keys.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          state.keys.right = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          state.keys.sprint = true;
          setIsSprinting(true);
          break;
        case 'KeyE':
          if (state.activePrompt) {
            sound.playClick();
            if (state.activePrompt.type === 'ctf' && state.activePrompt.target) {
              state.onInteractCTF(state.activePrompt.target);
            } else if (state.activePrompt.type === 'exit') {
              state.onReturnToMap();
            }
          }
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const state = stateRef.current;
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          state.keys.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          state.keys.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          state.keys.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          state.keys.right = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          state.keys.sprint = false;
          setIsSprinting(false);
          break;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      stateRef.current.isMouseDown = true;
      stateRef.current.prevMouseX = e.clientX;
      stateRef.current.prevMouseY = e.clientY;

      if (stateRef.current.activePrompt) {
        sound.playClick();
        if (stateRef.current.activePrompt.type === 'ctf' && stateRef.current.activePrompt.target) {
          stateRef.current.onInteractCTF(stateRef.current.activePrompt.target);
        } else if (stateRef.current.activePrompt.type === 'exit') {
          stateRef.current.onReturnToMap();
        }
      }
    };

    const handleMouseUp = () => {
      stateRef.current.isMouseDown = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const state = stateRef.current;
      if (document.pointerLockElement === renderer.domElement) {
        state.cameraYaw -= e.movementX * 0.0022;
        state.cameraPitch -= e.movementY * 0.0022;
      } else if (state.isMouseDown) {
        const deltaX = e.clientX - state.prevMouseX;
        const deltaY = e.clientY - state.prevMouseY;
        state.cameraYaw -= deltaX * 0.0035;
        state.cameraPitch -= deltaY * 0.0035;
        state.prevMouseX = e.clientX;
        state.prevMouseY = e.clientY;
      }
      state.cameraPitch = Math.max(-1.4, Math.min(1.4, state.cameraPitch));
    };

    const handleCanvasClick = () => {
      if (document.pointerLockElement !== renderer.domElement) {
        renderer.domElement.requestPointerLock?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('click', handleCanvasClick);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // ==========================================
    // 7. SMOOTH 60FPS PHYSICS & RENDER LOOP
    // ==========================================
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min((currentTime - lastTime) / 1000, 0.08);
      lastTime = currentTime;

      const state = stateRef.current;

      // Update orientation
      const euler = new THREE.Euler(state.cameraPitch, state.cameraYaw, 0, 'YXZ');
      camera.quaternion.setFromEuler(euler);

      // Determine movement intention
      const forwardDir = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), state.cameraYaw);
      const rightDir = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), state.cameraYaw);

      const inputVector = new THREE.Vector3();
      if (state.keys.forward) inputVector.add(forwardDir);
      if (state.keys.backward) inputVector.sub(forwardDir);
      if (state.keys.right) inputVector.add(rightDir);
      if (state.keys.left) inputVector.sub(rightDir);

      const isMoving = inputVector.lengthSq() > 0;
      const speedMultiplier = state.keys.sprint ? 1.6 : 1.0;
      const maxSpeed = 5.2 * speedMultiplier;
      const acceleration = 36.0;
      const damping = 9.5;

      if (isMoving) {
        inputVector.normalize();
        state.velocity.x += inputVector.x * acceleration * delta;
        state.velocity.z += inputVector.z * acceleration * delta;
      }

      // Clamp velocity to max speed
      const currentSpeed = Math.sqrt(state.velocity.x * state.velocity.x + state.velocity.z * state.velocity.z);
      if (currentSpeed > maxSpeed) {
        state.velocity.x = (state.velocity.x / currentSpeed) * maxSpeed;
        state.velocity.z = (state.velocity.z / currentSpeed) * maxSpeed;
      }

      // Smooth friction deceleration
      state.velocity.x -= state.velocity.x * damping * delta;
      state.velocity.z -= state.velocity.z * damping * delta;

      // Apply movement to position
      state.playerPos.x += state.velocity.x * delta;
      state.playerPos.z += state.velocity.z * delta;

      // Realistic subtle head bobbing when moving
      if (isMoving && currentSpeed > 0.5) {
        state.headBobTimer += delta * 11 * speedMultiplier;
        camera.position.y = 1.7 + Math.sin(state.headBobTimer) * 0.045;

        // Footsteps
        state.stepDistance += currentSpeed * delta;
        if (state.stepDistance > (state.keys.sprint ? 2.2 : 1.7)) {
          sound.playFootstep();
          state.stepDistance = 0;
        }
      } else {
        camera.position.y += (1.7 - camera.position.y) * 0.15;
      }

      // Wall boundaries collision & slide
      const margin = 0.9;
      const minX = -roomWidth / 2 + margin;
      const maxX = roomWidth / 2 - margin;
      const minZ = -roomLength / 2 + margin;
      const maxZ = roomLength / 2 - margin;

      if (state.playerPos.x < minX) {
        state.playerPos.x = minX;
        state.velocity.x = 0;
      } else if (state.playerPos.x > maxX) {
        state.playerPos.x = maxX;
        state.velocity.x = 0;
      }

      if (state.playerPos.z < minZ) {
        state.playerPos.z = minZ;
        state.velocity.z = 0;
      } else if (state.playerPos.z > maxZ) {
        state.playerPos.z = maxZ;
        state.velocity.z = 0;
      }

      camera.position.x = state.playerPos.x;
      camera.position.z = state.playerPos.z;

      // Update animated objects
      animatedObjects.forEach((obj) => obj.update(currentTime / 1000, delta));

      // Proximity detection for CTF stations
      let nearestPrompt: { type: 'ctf' | 'exit'; target?: CTFData; message: string } | null = null;
      let minDistance = 2.8;

      ctfObjects.forEach(({ ctf, pos }) => {
        const dist = state.playerPos.distanceTo(pos);
        if (dist < minDistance) {
          minDistance = dist;
          nearestPrompt = {
            type: 'ctf',
            target: ctf,
            message: `ACCESS [${ctf.label} // CTF-${ctf.slot}]`
          };
        }
      });

      // Airlock exit proximity
      const distToExit = state.playerPos.distanceTo(new THREE.Vector3(0, 1.7, roomLength / 2 - 0.5));
      if (distToExit < 2.5 && (!nearestPrompt || distToExit < minDistance)) {
        nearestPrompt = {
          type: 'exit',
          message: 'EXIT AIRLOCK & RETURN TO COMMUNITY MAP'
        };
      }

      if (JSON.stringify(nearestPrompt) !== JSON.stringify(state.activePrompt)) {
        state.activePrompt = nearestPrompt;
        setActivePrompt(nearestPrompt);
        if (nearestPrompt) sound.playHover();
      }

      // Compass & HUD update
      setCompassHeading(Math.round((-state.cameraYaw * 180) / Math.PI) % 360);
      setPlayerCoord({
        x: Math.round(state.playerPos.x * 10) / 10,
        z: Math.round(state.playerPos.z * 10) / 10
      });

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement) {
        renderer.domElement.removeEventListener('mousedown', handleMouseDown);
        renderer.domElement.removeEventListener('click', handleCanvasClick);
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
      renderer.dispose();
    };
  }, [building]);

  return (
    <div className="relative w-full h-full flex-1 overflow-hidden select-none bg-black">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-crosshair" />

      {/* Reticle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className={`relative transition-all duration-200 ${activePrompt ? 'scale-125' : 'scale-100'}`}>
          <div className="w-6 h-6 border border-yellow-500/50 rounded-full flex items-center justify-center">
            <div className={`w-1.5 h-1.5 rounded-full transition-colors ${activePrompt ? 'bg-yellow-400' : 'bg-yellow-500/60'}`} />
          </div>
          {activePrompt && (
            <div className="absolute -inset-2 border border-yellow-400 rounded-full animate-ping opacity-75" />
          )}
        </div>
      </div>

      {/* PROXIMITY INTERACTION BANNER */}
      {activePrompt && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 font-mono-code text-center pointer-events-auto">
          <button
            onClick={() => {
              sound.playClick();
              if (activePrompt.type === 'ctf' && activePrompt.target) {
                onInteractCTF(activePrompt.target);
              } else if (activePrompt.type === 'exit') {
                onReturnToMap();
              }
            }}
            className="px-6 py-3 rounded-lg bg-[#0e141e]/95 border-2 border-yellow-400 text-yellow-300 font-tech font-bold text-sm tracking-wider shadow-[0_0_30px_rgba(250,204,21,0.55)] hover:bg-yellow-400 hover:text-black transition-all cursor-pointer flex items-center gap-3 backdrop-blur-md animate-bounce"
          >
            <span className="px-2 py-0.5 rounded bg-black/60 text-white border border-yellow-400/60 text-xs">
              PRESS [E] OR CLICK
            </span>
            <span>{activePrompt.message}</span>
          </button>
        </div>
      )}

      {/* Top Left: Themed Building Indicator */}
      <div className="absolute top-4 left-4 z-20 bg-[#0c1017]/90 border border-[#232f42] p-3 rounded font-mono-code text-xs backdrop-blur-md pointer-events-none">
        <div className="text-yellow-400 font-tech font-bold text-sm tracking-widest flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping" />
          <span>FACILITY INTERIOR // {building.name}</span>
        </div>
        <div className="text-[11px] text-zinc-300 mt-1">
          {building.sectorTitle}
        </div>
        <div className="flex items-center gap-3 mt-2 text-[10px] text-zinc-400 pt-1.5 border-t border-zinc-800">
          <span>POS: [{playerCoord.x}, {playerCoord.z}]</span>
          <span>HEADING: {compassHeading}°</span>
          {isSprinting && <span className="text-yellow-400 font-bold flex items-center gap-0.5"><Zap size={10} /> SPRINTING</span>}
        </div>
      </div>

      {/* Top Right: CTF Terminals in this Room */}
      <div className="absolute top-4 right-4 z-20 bg-[#0c1017]/90 border border-[#232f42] p-3 rounded font-mono-code text-xs backdrop-blur-md pointer-events-auto">
        <div className="text-zinc-400 text-[10px] uppercase tracking-wider mb-1.5 font-tech">
          ROOM CTF TERMINALS
        </div>
        <div className="space-y-1.5">
          {building.ctfs.map((ctf) => (
            <button
              key={ctf.id}
              onClick={() => {
                sound.playClick();
                onInteractCTF(ctf);
              }}
              className="w-full flex items-center justify-between gap-3 px-2.5 py-1.5 rounded bg-[#131a26] hover:bg-[#1a2333] border border-[#2b394d] text-left cursor-pointer group transition-colors"
            >
              <div className="flex items-center gap-1.5">
                {ctf.completed ? (
                  <CheckCircle2 size={13} className="text-emerald-400" />
                ) : (
                  <Lock size={13} className="text-yellow-400" />
                )}
                <span className="text-zinc-200 group-hover:text-yellow-300 font-tech text-xs">
                  {ctf.label}
                </span>
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                ctf.completed ? 'text-emerald-300 bg-emerald-950/60' : 'text-yellow-300 bg-yellow-950/60'
              }`}>
                {ctf.completed ? 'SECURED' : 'OPEN'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="absolute bottom-3 left-4 right-4 z-20 flex flex-wrap items-center justify-between text-[11px] font-mono-code text-zinc-400 bg-[#0b0e14]/90 px-4 py-2 rounded-lg border border-[#202936] backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-yellow-400 font-semibold">
            <Move size={14} />
            <span>[W][A][S][D] MOVE</span>
          </div>
          <span className="text-zinc-600">|</span>
          <div className="text-zinc-300">
            <span>[SHIFT] SPRINT</span>
          </div>
          <span className="text-zinc-600">|</span>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <MousePointer size={14} />
            <span>CLICK TO LOCK LOOK</span>
          </div>
          <span className="text-zinc-600">|</span>
          <div className="text-yellow-300 font-bold">
            <span>[E] INTERACT</span>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playAirlock();
            onReturnToMap();
          }}
          className="flex items-center gap-1.5 px-3 py-1 rounded bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 text-xs font-tech font-bold cursor-pointer transition-colors"
        >
          <ArrowLeft size={13} />
          <span>RETURN TO COMMUNITY MAP</span>
        </button>
      </div>
    </div>
  );
};
