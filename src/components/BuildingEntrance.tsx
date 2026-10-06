import React, { useState } from 'react';
import { BuildingData, CTFData } from '../types/protocol';
import { ThreeRoomFPP } from './ThreeRoomFPP';
import { sound } from '../utils/sound';
import { 
  ArrowLeft, 
  Terminal, 
  Box, 
  Activity, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  ShieldAlert,
  Info,
  Layers,
  ChevronRight
} from 'lucide-react';

interface BuildingEntranceProps {
  building: BuildingData;
  onReturnToMap: () => void;
  onSelectCTF: (ctf: CTFData) => void;
  onOpenResidentDossier?: (residentId: string) => void;
}

export const BuildingEntrance: React.FC<BuildingEntranceProps> = ({
  building,
  onReturnToMap,
  onSelectCTF,
  onOpenResidentDossier
}) => {
  // Allow toggling between 3D FPP Walkthrough and 2D Tactical View
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const solvedCount = building.ctfs.filter(c => c.completed).length;

  // Themed visual styling for 2D console
  const getThemedStyle = () => {
    switch (building.id) {
      case 'hospital':
        return {
          bannerBorder: 'border-teal-500/60 shadow-[0_0_30px_rgba(20,184,166,0.2)]',
          badge: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
          accentText: 'text-teal-400',
          titleColor: 'text-teal-200',
          ambientDot: 'bg-teal-400'
        };
      case 'school':
        return {
          bannerBorder: 'border-sky-500/60 shadow-[0_0_30px_rgba(56,189,248,0.2)]',
          badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
          accentText: 'text-sky-400',
          titleColor: 'text-sky-200',
          ambientDot: 'bg-sky-400'
        };
      case 'museum':
        return {
          bannerBorder: 'border-purple-500/60 shadow-[0_0_30px_rgba(168,85,247,0.2)]',
          badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          accentText: 'text-purple-400',
          titleColor: 'text-purple-200',
          ambientDot: 'bg-purple-400'
        };
      case 'sports':
        return {
          bannerBorder: 'border-orange-500/60 shadow-[0_0_30px_rgba(249,115,22,0.2)]',
          badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
          accentText: 'text-orange-400',
          titleColor: 'text-orange-200',
          ambientDot: 'bg-orange-400'
        };
      case 'society':
        return {
          bannerBorder: 'border-fuchsia-500/60 shadow-[0_0_30px_rgba(217,70,239,0.2)]',
          badge: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40',
          accentText: 'text-fuchsia-400',
          titleColor: 'text-fuchsia-200',
          ambientDot: 'bg-fuchsia-400'
        };
    }
  };

  const theme = getThemedStyle();

  return (
    <div className={`relative w-full h-full flex flex-col bg-[#07090e] select-none overflow-hidden transition-all duration-700 ${viewMode === '3d' ? 'opacity-100' : 'opacity-100'}`}>
      {/* Entrance Portal Animation Overlay */}
      {viewMode === '3d' && (
        <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
            <div className="w-[80vw] h-[80vw] rounded-full border-4 border-yellow-500/30 animate-ping opacity-0 animation-delay-300"></div>
            <div className="absolute w-[60vw] h-[60vw] rounded-full border-4 border-yellow-400/50 animate-ping animation-delay-500"></div>
            <div className="absolute w-[40vw] h-[40vw] rounded-full border-4 border-yellow-300/70 animate-pulse"></div>
        </div>
      )}
      {/* Top Facility Room Header */}
      <div className="z-20 bg-[#0d1117]/95 border-b border-[#222d3d] px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-code backdrop-blur-md">
        {/* Left: Back to Map & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playAirlock();
              onReturnToMap();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#161d28] hover:bg-yellow-500/10 border border-[#2b374a] hover:border-yellow-500/50 text-yellow-400 font-tech font-bold cursor-pointer transition-colors"
          >
            <ArrowLeft size={14} />
            <span>COMMUNITY MAP</span>
          </button>

          <div className="h-4 w-[1px] bg-zinc-800 hidden sm:block"></div>

          <div>
            <div className="flex items-center gap-2">
              <span className={`font-tech font-bold text-sm tracking-wide ${theme.accentText}`}>
                {building.name}
              </span>
              <span className="text-zinc-600">//</span>
              <span className="font-tech text-zinc-300 font-semibold">
                {building.sectorTitle}
              </span>
            </div>
            <div className="text-[10px] text-zinc-500 flex items-center gap-2">
              <span>LOCATION: {building.code}</span>
              <span>&bull;</span>
              <span>ENTRANCE ROOM 01/01</span>
              <span>&bull;</span>
              <span className="text-yellow-400 font-semibold">STATUS: {building.status}</span>
            </div>
          </div>
        </div>

        {/* Right: Switch Mode & CTF Summary */}
        <div className="flex items-center gap-3">
          {/* CTF Status in room */}
          <div className="hidden sm:flex items-center gap-2 bg-[#121822] px-2.5 py-1 rounded border border-[#253245]">
            <span className="text-zinc-400 text-[11px]">ROOM CTF:</span>
            <span className={`font-bold ${solvedCount === 2 ? 'text-emerald-400' : 'text-yellow-400'}`}>
              {solvedCount}/2 RECOVERED
            </span>
          </div>

          {/* Toggle View Mode: 3D FPP vs 2D Tactical */}
          <div className="flex items-center bg-[#121822] p-0.5 rounded border border-[#263345]">
            <button
              onClick={() => {
                sound.playClick();
                setViewMode('3d');
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-tech font-bold cursor-pointer transition-all ${
                viewMode === '3d'
                  ? 'bg-yellow-500 text-black shadow-[0_0_10px_rgba(250,204,21,0.4)]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Box size={13} />
              <span>3D FPP ROOM</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setViewMode('2d');
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-tech font-bold cursor-pointer transition-all ${
                viewMode === '2d'
                  ? 'bg-yellow-500 text-black shadow-[0_0_10px_rgba(250,204,21,0.4)]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Terminal size={13} />
              <span>2D TACTICAL CONSOLE</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {viewMode === '3d' ? (
          <ThreeRoomFPP
            building={building}
            onInteractCTF={onSelectCTF}
            onReturnToMap={onReturnToMap}
          />
        ) : (
          <div className="w-full h-full p-6 lg:p-8 flex flex-col justify-between overflow-y-auto bg-[#0a0d13]">
            <div className="max-w-5xl mx-auto w-full space-y-6">
              <div className={`bg-[#10151f] border-2 ${theme.bannerBorder} p-6 rounded-lg shadow-xl relative overflow-hidden`}>
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4 mb-4">
                  <div>
                    <div className={`text-[11px] ${theme.accentText} font-mono-code mb-1 font-bold flex items-center gap-2`}>
                      <span className={`w-2 h-2 rounded-full ${theme.ambientDot} animate-ping`} />
                      <span>{building.name} // ARCHITECTURAL SECTOR CORE</span>
                    </div>
                    <h1 className={`text-2xl lg:text-3xl font-display font-bold ${theme.titleColor} tracking-wide`}>
                      {building.sectorTitle}
                    </h1>
                    <p className="text-zinc-300 text-xs mt-1 max-w-2xl font-mono-code leading-relaxed">
                      {building.loreDescription}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 block font-mono-code">STATUS LEVEL</span>
                    <span className={`px-2.5 py-1 rounded font-tech font-bold text-sm border ${theme.badge}`}>
                      {building.status}
                    </span>
                  </div>
                </div>

                {/* Ambient Sensor details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono-code">
                  <div className="bg-[#0b0e14] p-3 rounded border border-zinc-800">
                    <div className="text-zinc-500 text-[10px] uppercase font-tech">Atmosphere & Filter</div>
                    <div className="text-zinc-300 font-bold mt-1">98.4 kPa &bull; HEPA Decon Active</div>
                  </div>
                  <div className="bg-[#0b0e14] p-3 rounded border border-zinc-800">
                    <div className="text-zinc-500 text-[10px] uppercase font-tech">Security Lockout</div>
                    <div className="text-amber-400 font-bold mt-1">Memory Daemon Override Active</div>
                  </div>
                  <div className="bg-[#0b0e14] p-3 rounded border border-zinc-800">
                    <div className="text-zinc-500 text-[10px] uppercase font-tech">Citizen Dossier Status</div>
                    <button 
                      onClick={() => onOpenResidentDossier && onOpenResidentDossier(building.residentId)}
                      className="text-yellow-400 hover:underline font-bold mt-1 text-left cursor-pointer"
                    >
                      Inspect Recovered Records &rarr;
                    </button>
                  </div>
                </div>
              </div>

              {/* The Two Clearly Identifiable CTF Interaction Points */}
              <div>
                <div className="flex items-center justify-between mb-3 font-mono-code text-xs">
                  <span className="text-yellow-400 font-tech font-bold tracking-wider text-sm flex items-center gap-2">
                    <Terminal size={15} />
                    INTERACTIVE ROOM TERMINALS // CTF ACCESS POINTS
                  </span>
                  <span className="text-zinc-500">2 TERMINALS DEPLOYED</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {building.ctfs.map((ctf) => (
                    <div
                      key={ctf.id}
                      className={`relative rounded-lg p-5 border transition-all duration-300 flex flex-col justify-between ${
                        ctf.completed
                          ? 'bg-[#0f1718] border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                          : 'bg-[#121721] border-[#2c384a] hover:border-yellow-500/70 hover:shadow-[0_0_20px_rgba(250,204,21,0.2)]'
                      }`}
                    >
                      <div>
                        {/* Terminal Header */}
                        <div className="flex items-center justify-between mb-3 border-b border-zinc-800/80 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300 font-mono-code font-bold text-[11px] border border-yellow-500/30">
                              CTF // {ctf.slot}
                            </span>
                            <span className="font-tech text-white font-bold text-sm tracking-wider">
                              {ctf.label}
                            </span>
                          </div>

                          <span className={`text-[10px] px-2 py-0.5 rounded font-mono-code font-bold ${
                            ctf.completed
                              ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/40'
                              : 'text-amber-400 bg-amber-950/40 border border-amber-500/30'
                          }`}>
                            {ctf.completed ? 'RECOVERED' : 'LOCKED'}
                          </span>
                        </div>

                        {/* Subtitle & Type */}
                        <div className="text-xs text-yellow-400 font-tech font-semibold mb-1">
                          {ctf.subtitle}
                        </div>
                        <div className="text-[10px] text-zinc-500 font-mono-code mb-3 uppercase">
                          TYPE: {ctf.type}
                        </div>

                        {/* Description & Clue */}
                        <p className="text-zinc-300 text-xs font-mono-code leading-relaxed mb-3">
                          {ctf.description}
                        </p>

                        <div className="bg-[#0b0e14] p-2.5 rounded border border-zinc-800 text-[11px] text-zinc-400 font-mono-code mb-4">
                          <span className="text-yellow-400/90 font-bold block mb-0.5">TELEMETRY CLUE:</span>
                          {ctf.clue}
                        </div>
                      </div>

                      {/* CTA to open CTF puzzle modal */}
                      <button
                        onClick={() => {
                          sound.playClick();
                          onSelectCTF(ctf);
                        }}
                        className={`w-full py-2.5 rounded font-tech font-bold text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
                          ctf.completed
                            ? 'bg-emerald-900/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40'
                            : 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.35)]'
                        }`}
                      >
                        {ctf.completed ? (
                          <>
                            <CheckCircle2 size={14} />
                            <span>INSPECT RECOVERED LOGS</span>
                          </>
                        ) : (
                          <>
                            <Terminal size={14} />
                            <span>ACCESS TERMINAL INTERFACE</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Environmental Room Props Information */}
              <div className="bg-[#10141c] p-4 rounded border border-[#222c3b] text-xs font-mono-code">
                <div className="text-zinc-400 font-tech font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Sparkles size={14} className="text-yellow-400" />
                  <span>Interactive Room Fixtures</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {building.roomTheme.ambientDetails.map((prop, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded bg-[#171f2b] text-zinc-300 border border-zinc-700 text-[11px]">
                      &bull; {prop}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Return bar */}
            <div className="max-w-5xl mx-auto w-full pt-6 flex justify-between items-center text-xs font-mono-code text-zinc-500">
              <span>MANU PROTOCOL // SANCTUARY ZERO ENTRANCE PROTOCOL</span>
              <button
                onClick={() => {
                  sound.playAirlock();
                  onReturnToMap();
                }}
                className="text-yellow-400 hover:underline flex items-center gap-1 cursor-pointer font-tech font-bold text-sm"
              >
                <span>&larr; EXIT TO COMMUNITY MAP</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
