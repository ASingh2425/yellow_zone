import React, { useState } from 'react';
import { BuildingData, BuildingId } from '../types/protocol';
import { BuildingMarker } from './BuildingMarker';
import { sound } from '../utils/sound';
import { 
  Layers, 
  Compass, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Radio, 
  MapPin, 
  Activity,
  Shield,
  Eye
} from 'lucide-react';

interface CommunityMapProps {
  buildings: BuildingData[];
  selectedBuilding: BuildingData | null;
  onSelectBuilding: (building: BuildingData | null) => void;
  onEnterBuilding: (building: BuildingData) => void;
}

export const CommunityMap: React.FC<CommunityMapProps> = ({
  buildings,
  selectedBuilding,
  onSelectBuilding,
  onEnterBuilding
}) => {
  const [hoveredBuildingId, setHoveredBuildingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'topdown' | 'isometric'>('topdown');
  const [showConduits, setShowConduits] = useState(true);
  const [showDronePatrol, setShowDronePatrol] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoom = (delta: number) => {
    sound.playClick();
    setZoomLevel(prev => Math.min(1.4, Math.max(0.85, prev + delta)));
  };

  return (
    <div className="relative w-full h-full flex-1 overflow-hidden bg-[#080b10] select-none flex flex-col">
      {/* Map Control Toolbar */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-[#0f141c]/90 border border-[#232d3d] p-1.5 rounded backdrop-blur-md text-xs font-mono-code shadow-xl">
        <button
          onClick={() => {
            sound.playClick();
            setViewMode(v => v === 'topdown' ? 'isometric' : 'topdown');
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors cursor-pointer ${
            viewMode === 'isometric' 
              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 font-bold' 
              : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
          }`}
          title="Toggle Perspective Angle"
        >
          <Compass size={13} className={viewMode === 'isometric' ? 'text-yellow-400 rotate-45 transition-transform' : ''} />
          <span className="font-tech text-xs">{viewMode === 'isometric' ? 'ISOMETRIC' : 'TACTICAL TOP-DOWN'}</span>
        </button>

        <div className="h-4 w-[1px] bg-zinc-700"></div>

        {/* Toggle Grid Conduits */}
        <button
          onClick={() => {
            sound.playClick();
            setShowConduits(!showConduits);
          }}
          className={`px-2 py-1 rounded transition-colors text-[11px] cursor-pointer ${
            showConduits ? 'text-yellow-400 font-bold' : 'text-zinc-500'
          }`}
        >
          CONDUITS: {showConduits ? 'ON' : 'OFF'}
        </button>

        {/* Toggle Drone Patrol */}
        <button
          onClick={() => {
            sound.playClick();
            setShowDronePatrol(!showDronePatrol);
          }}
          className={`px-2 py-1 rounded transition-colors text-[11px] cursor-pointer ${
            showDronePatrol ? 'text-yellow-400 font-bold' : 'text-zinc-500'
          }`}
        >
          PATROLS: {showDronePatrol ? 'ON' : 'OFF'}
        </button>

        <div className="h-4 w-[1px] bg-zinc-700"></div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1">
          <button 
            onClick={() => handleZoom(0.1)}
            className="p-1 hover:bg-[#1c2432] text-zinc-300 rounded cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>
          <button 
            onClick={() => handleZoom(-0.1)}
            className="p-1 hover:bg-[#1c2432] text-zinc-300 rounded cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>
          <button 
            onClick={() => { sound.playClick(); setZoomLevel(1); }}
            className="px-1.5 py-0.5 text-[10px] text-zinc-400 hover:text-white cursor-pointer"
            title="Reset Zoom"
          >
            {Math.round(zoomLevel * 100)}%
          </button>
        </div>
      </div>

      {/* Topographic Sector Legend / Watermark */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none text-right font-mono-code text-[11px] text-zinc-500">
        <div className="text-yellow-400/80 font-bold tracking-widest font-tech text-xs">
          SECTOR-03: RESIDENTIAL & CIVIC LIFE
        </div>
        <div>GRID REF: 38°14'N // 112°04'E</div>
        <div className="text-zinc-600">SECURITY LOCK: LEVEL 3</div>
      </div>

      {/* Main Map Container with optional Isometric transformation */}
      <div 
        className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center transition-transform duration-500 ease-out"
        style={{
          perspective: viewMode === 'isometric' ? '1200px' : 'none'
        }}
      >
        <div
          className="relative w-full max-w-[1300px] h-[820px] transition-all duration-500"
          style={{
            transform: viewMode === 'isometric' 
              ? `scale(${zoomLevel}) rotateX(28deg) rotateZ(-12deg) translateY(-20px)` 
              : `scale(${zoomLevel})`,
            transformStyle: 'preserve-3d'
          }}
        >
          {/* SVG Map Canvas: Roads, Pathways, Concourse, Infrastructure */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Tactical grid pattern */}
              <pattern id="tacticalGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#161e2a" strokeWidth="0.8" />
                <circle cx="20" cy="20" r="0.8" fill="#1e293b" />
              </pattern>

              {/* Yellow glow filter */}
              <filter id="yellowGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Pulsing beacon marker */}
              <radialGradient id="beaconGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#facc15" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#facc15" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Base tactical grid */}
            <rect width="100%" height="100%" fill="url(#tacticalGrid)" />

            {/* Outer Sector Boundary Perimeter */}
            <rect 
              x="5%" 
              y="5%" 
              width="90%" 
              height="90%" 
              fill="none" 
              stroke="#243042" 
              strokeWidth="1.5" 
              strokeDasharray="6 4" 
            />

            {/* Corner Perimeter Markers */}
            <circle cx="5%" cy="5%" r="6" fill="#1b2432" stroke="#eab308" strokeWidth="1" />
            <circle cx="95%" cy="5%" r="6" fill="#1b2432" stroke="#eab308" strokeWidth="1" />
            <circle cx="5%" cy="95%" r="6" fill="#1b2432" stroke="#eab308" strokeWidth="1" />
            <circle cx="95%" cy="95%" r="6" fill="#1b2432" stroke="#eab308" strokeWidth="1" />

            {/* CENTRAL COMMUNITY SPACE: "Civic Concourse" Plaza */}
            <g transform="translate(650, 410)">
              {/* Outer Plaza Ring */}
              <circle r="95" fill="#0d1219" stroke="#253245" strokeWidth="2" />
              <circle r="95" fill="none" stroke="#facc15" strokeWidth="1" strokeDasharray="4 8" opacity="0.4" />
              <circle r="60" fill="#111722" stroke="#2c3a4f" strokeWidth="1.5" />
              <circle r="25" fill="#192333" stroke="#facc15" strokeWidth="1.5" />

              {/* Plaza Crosshairs & Radial Pathways */}
              <line x1="-95" y1="0" x2="95" y2="0" stroke="#222e3e" strokeWidth="1.5" />
              <line x1="0" y1="-95" x2="0" y2="95" stroke="#222e3e" strokeWidth="1.5" />
              <line x1="-67" y1="-67" x2="67" y2="67" stroke="#1d2735" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="-67" y1="67" x2="67" y2="-67" stroke="#1d2735" strokeWidth="1" strokeDasharray="3 3" />

              {/* Central Holographic Obelisk / Core Monument */}
              <polygon points="0,-12 12,0 0,12 -12,0" fill="#facc15" opacity="0.8" />
              <circle r="6" fill="#000" />
              <circle r="2" fill="#fff" />

              <text x="0" y="38" textAnchor="middle" fill="#8492a6" fontSize="9" fontFamily="Rajdhani" letterSpacing="1">
                CIVIC CONCOURSE
              </text>
              <text x="0" y="49" textAnchor="middle" fill="#facc15" fontSize="7" fontFamily="JetBrains Mono" opacity="0.7">
                SANCTUARY COMMONS // ZONE Y
              </text>
            </g>

            {/* BELIEVABLE ROAD NETWORK & PATHWAYS */}
            {/* Primary Arterial Road 1: Hospital to Plaza (NW to Center) */}
            <path 
              d="M 420 280 L 560 360" 
              stroke="#1a2330" 
              strokeWidth="24" 
              strokeLinecap="round" 
            />
            <path 
              d="M 420 280 L 560 360" 
              stroke="#2e3d52" 
              strokeWidth="1.5" 
              strokeDasharray="6 4" 
            />

            {/* Primary Arterial Road 2: School to Plaza (NE to Center) */}
            <path 
              d="M 880 280 L 740 360" 
              stroke="#1a2330" 
              strokeWidth="24" 
              strokeLinecap="round" 
            />
            <path 
              d="M 880 280 L 740 360" 
              stroke="#2e3d52" 
              strokeWidth="1.5" 
              strokeDasharray="6 4" 
            />

            {/* Primary Arterial Road 3: Sports Pavilion to Plaza (SW to Center) */}
            <path 
              d="M 440 560 L 570 460" 
              stroke="#1a2330" 
              strokeWidth="24" 
              strokeLinecap="round" 
            />
            <path 
              d="M 440 560 L 570 460" 
              stroke="#2e3d52" 
              strokeWidth="1.5" 
              strokeDasharray="6 4" 
            />

            {/* Primary Arterial Road 4: Society/Living to Plaza (Center-South) */}
            <path 
              d="M 650 540 L 650 505" 
              stroke="#1a2330" 
              strokeWidth="28" 
              strokeLinecap="square" 
            />
            <path 
              d="M 650 540 L 650 505" 
              stroke="#2e3d52" 
              strokeWidth="1.5" 
              strokeDasharray="4 4" 
            />

            {/* Primary Arterial Road 5: Museum to Plaza (East to Center) */}
            <path 
              d="M 960 520 L 745 425" 
              stroke="#1a2330" 
              strokeWidth="24" 
              strokeLinecap="round" 
            />
            <path 
              d="M 960 520 L 745 425" 
              stroke="#2e3d52" 
              strokeWidth="1.5" 
              strokeDasharray="6 4" 
            />

            {/* Inter-Building Ring Roads: Hospital to School */}
            <path 
              d="M 520 220 L 780 220" 
              stroke="#161e2a" 
              strokeWidth="14" 
              strokeLinecap="round" 
            />
            <path 
              d="M 520 220 L 780 220" 
              stroke="#273447" 
              strokeWidth="1" 
              strokeDasharray="4 6" 
            />

            {/* Inter-Building Ring Roads: Sports to Society */}
            <path 
              d="M 440 680 L 590 680" 
              stroke="#161e2a" 
              strokeWidth="14" 
              strokeLinecap="round" 
            />
            <path 
              d="M 440 680 L 590 680" 
              stroke="#273447" 
              strokeWidth="1" 
              strokeDasharray="4 6" 
            />

            {/* Inter-Building Road: School to Museum */}
            <path 
              d="M 980 340 L 980 440" 
              stroke="#161e2a" 
              strokeWidth="14" 
              strokeLinecap="round" 
            />

            {/* POWER & FIBER CONDUITS (Layer) */}
            {showConduits && (
              <g opacity="0.85">
                {/* Yellow conduit bus lines connecting all 5 nodes */}
                <path 
                  d="M 360 220 L 650 150 L 940 220 L 1020 540 L 650 720 L 280 620 Z" 
                  fill="none" 
                  stroke="#eab308" 
                  strokeWidth="1.5" 
                  strokeDasharray="8 6" 
                  opacity="0.6" 
                />
                
                {/* Conduit Junction nodes */}
                <circle cx="650" cy="150" r="4" fill="#facc15" />
                <circle cx="650" cy="720" r="4" fill="#facc15" />

                <text x="660" y="145" fill="#facc15" fontSize="8" fontFamily="JetBrains Mono" opacity="0.8">
                  CONDUIT-Y01 [ONLINE]
                </text>
                <text x="660" y="730" fill="#facc15" fontSize="8" fontFamily="JetBrains Mono" opacity="0.8">
                  CONDUIT-Y02 [DEGRADED]
                </text>
              </g>
            )}

            {/* DRONE PATROL VECTORS (Layer) */}
            {showDronePatrol && (
              <g>
                <ellipse 
                  cx="650" 
                  cy="410" 
                  rx="480" 
                  ry="290" 
                  fill="none" 
                  stroke="#ef4444" 
                  strokeWidth="1" 
                  strokeDasharray="4 12" 
                  opacity="0.4" 
                />

                {/* Drone Marker 1 */}
                <g className="animate-pulse">
                  <circle cx="340" cy="360" r="3" fill="#ef4444" />
                  <circle cx="340" cy="360" r="12" fill="none" stroke="#ef4444" strokeWidth="0.8" opacity="0.5" />
                  <text x="355" y="364" fill="#ef4444" fontSize="8" fontFamily="JetBrains Mono">
                    PATROL-DRONE [A-1]
                  </text>
                </g>

                {/* Drone Marker 2 */}
                <g className="animate-pulse" style={{ animationDelay: '1s' }}>
                  <circle cx="950" cy="460" r="3" fill="#ef4444" />
                  <circle cx="950" cy="460" r="12" fill="none" stroke="#ef4444" strokeWidth="0.8" opacity="0.5" />
                  <text x="965" y="464" fill="#ef4444" fontSize="8" fontFamily="JetBrains Mono">
                    PATROL-DRONE [B-4]
                  </text>
                </g>
              </g>
            )}

            {/* Environmental Labels & MANU Infrastructure Elements */}
            <g opacity="0.5" fontSize="8" fontFamily="JetBrains Mono" fill="#64748b">
              {/* North Gate */}
              <text x="650" y="70" textAnchor="middle">SECURITY APERTURE NORTH // GATE-01</text>
              <line x1="610" y1="78" x2="690" y2="78" stroke="#334155" strokeWidth="2" />

              {/* South Gate */}
              <text x="650" y="770" textAnchor="middle">PERIMETER BARRIER SOUTH // GATE-04 [LOCKED]</text>
              <line x1="590" y1="778" x2="710" y2="778" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />

              {/* Sector Coordinates */}
              <text x="75" y="80">ZONE SECTOR: Y-ALPHA</text>
              <text x="1100" y="80" textAnchor="end">RESONANCE FREQ: 142.8 MHZ</text>
              <text x="75" y="750">ATMOSPHERE: 98.4 kPa (NOMINAL)</text>
              <text x="1100" y="750" textAnchor="end">PURGE SCHEDULE: 06:00 SZT</text>
            </g>
          </svg>

          {/* 5 Building Markers (Positioned accurately in the Community) */}
          {buildings.map((building) => (
            <BuildingMarker
              key={building.id}
              building={building}
              isHovered={hoveredBuildingId === building.id}
              isSelected={selectedBuilding?.id === building.id}
              onHover={setHoveredBuildingId}
              onSelect={onSelectBuilding}
              onEnter={onEnterBuilding}
            />
          ))}
        </div>
      </div>

      {/* Map Bottom Bar / Helper HUD */}
      <div className="absolute bottom-3 left-4 right-4 z-20 flex flex-wrap items-center justify-between text-[11px] font-mono-code text-zinc-400 bg-[#0d1218]/80 px-3 py-1.5 rounded border border-[#202936] backdrop-blur-sm pointer-events-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-yellow-400">
            <MapPin size={12} />
            <span>COMMUNITY ZONE MAP ACTIVE</span>
          </span>
          <span className="text-zinc-600">|</span>
          <span>SELECT ANY FACILITY TO INSPECT OR ENTER ROOM</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-zinc-500">YELLOW SECTOR STATUS:</span>
          <span className="text-amber-400 font-bold">5 FACILITIES IDENTIFIED</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400">CLICK [ENTER] TO ACCESS 3D FPP ROOM</span>
        </div>
      </div>
    </div>
  );
};
