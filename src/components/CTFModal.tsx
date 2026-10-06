import React, { useState } from 'react';
import { CTFData, BuildingData } from '../types/protocol';
import { sound } from '../utils/sound';
import { 
  X, 
  Terminal, 
  Cpu, 
  Key, 
  CheckCircle2, 
  Lock, 
  AlertTriangle, 
  Sparkles,
  Database,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface CTFModalProps {
  ctf: CTFData;
  building: BuildingData;
  onClose: () => void;
  onSolve: (ctfId: string) => void;
}

export const CTFModal: React.FC<CTFModalProps> = ({
  ctf,
  building,
  onClose,
  onSolve
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleOptionSelect = (opt: string) => {
    sound.playClick();
    setSelectedOption(opt);
    setErrorMessage('');
  };

  const handleExecuteDecryption = () => {
    sound.playTerminalBeep(true);
    setIsDecrypting(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsDecrypting(false);
      sound.playSuccess();
      onSolve(ctf.id);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none">
      <div className="max-w-2xl w-full bg-[#0d121a] border-2 border-yellow-500/60 rounded-lg shadow-[0_0_50px_rgba(250,204,21,0.25)] flex flex-col overflow-hidden font-mono-code text-xs relative">
        {/* Tactical Corner Brackets */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-yellow-400 z-10" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-yellow-400 z-10" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-yellow-400 z-10" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-yellow-400 z-10" />

        {/* Modal Header */}
        <div className="bg-[#121824] px-5 py-3 border-b border-[#253245] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Terminal size={16} className="text-yellow-400" />
            <div>
              <span className="font-tech text-yellow-400 font-bold text-sm tracking-widest">
                {ctf.label} // CTF #{ctf.slot}
              </span>
              <span className="text-zinc-500 text-[10px] ml-2">
                LOCATION: {building.name} ({building.code})
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1 rounded hover:bg-[#1f2838] text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Status Alert Banner */}
          <div className={`p-3 rounded border flex items-center justify-between ${
            ctf.completed
              ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
              : 'bg-yellow-950/20 border-yellow-500/40 text-yellow-300'
          }`}>
            <div className="flex items-center gap-2">
              {ctf.completed ? (
                <ShieldCheck size={16} className="text-emerald-400" />
              ) : (
                <Lock size={16} className="text-yellow-400 animate-pulse" />
              )}
              <span className="font-tech text-xs tracking-wider">
                {ctf.completed ? 'FLAG RECOVERED & VERIFIED' : 'ENCRYPTED TERMINAL ACCESS INTERCEPT'}
              </span>
            </div>

            <span className="text-[10px] font-mono-code font-bold">
              TYPE: {ctf.type}
            </span>
          </div>

          {/* Description & Objective */}
          <div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 font-tech">
              Terminal Mission Objective
            </div>
            <p className="text-zinc-200 text-xs leading-relaxed bg-[#10151f] p-3 rounded border border-zinc-800">
              {ctf.description}
            </p>
          </div>

          {/* Clue Panel */}
          <div className="bg-[#0b0e14] p-3 rounded border border-[#1e2634]">
            <div className="flex items-center gap-2 text-yellow-400 text-xs font-bold font-tech mb-1">
              <Cpu size={14} />
              <span>SUBSYSTEM TELEMETRY CLUE</span>
            </div>
            <div className="text-zinc-300 text-xs leading-relaxed">
              {ctf.clue}
            </div>
          </div>

          {/* If already completed: show decrypted data & flag */}
          {ctf.completed ? (
            <div className="bg-emerald-950/20 border border-emerald-500/40 p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-tech font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 size={14} />
                  DECRYPTED MEMORY PAYLOAD
                </span>
                <span className="text-[10px] text-emerald-400/80 font-mono-code">INTEGRITY: 100%</span>
              </div>

              <div className="text-emerald-200 text-xs leading-relaxed font-mono-code bg-black/40 p-3 rounded border border-emerald-800/50">
                {ctf.unlockedData}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-emerald-900/50 text-[11px]">
                <span className="text-zinc-400">CAPTURED FLAG:</span>
                <code className="text-yellow-400 font-bold bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/30">
                  {ctf.flagCode}
                </code>
              </div>
            </div>
          ) : (
            /* Interactive Challenge / Decryption Options */
            <div className="space-y-3">
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-tech flex items-center justify-between">
                <span>{ctf.challengePrompt}</span>
                <span className="text-yellow-400">SELECT CIPHER OVERRIDE</span>
              </div>

              {/* Options */}
              {ctf.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ctf.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(opt)}
                      className={`p-2.5 rounded border text-left cursor-pointer transition-all flex items-center justify-between ${
                        selectedOption === opt
                          ? 'border-yellow-400 bg-yellow-500/15 text-yellow-300 font-bold'
                          : 'border-zinc-800 bg-[#121722] hover:border-zinc-700 text-zinc-300'
                      }`}
                    >
                      <span className="font-mono-code text-xs">{opt}</span>
                      {selectedOption === opt && (
                        <span className="w-2 h-2 rounded-full bg-yellow-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {errorMessage && (
                <div className="text-red-400 text-xs flex items-center gap-1.5 mt-2">
                  <AlertTriangle size={14} />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#10151f] px-5 py-3 border-t border-[#253245] flex items-center justify-between gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded border border-zinc-700 bg-zinc-800/60 hover:bg-zinc-700 text-zinc-300 font-tech font-bold text-xs cursor-pointer transition-colors"
          >
            DISCONNECT
          </button>

          {!ctf.completed ? (
            <button
              onClick={handleExecuteDecryption}
              disabled={isDecrypting}
              className="px-5 py-2 rounded bg-yellow-500 hover:bg-yellow-400 active:scale-95 text-black font-tech font-bold text-xs tracking-wider flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(250,204,21,0.4)] transition-all disabled:opacity-50"
            >
              <Key size={14} />
              <span>{isDecrypting ? 'DECRYPTING MEMORY STREAM...' : 'EXECUTE BYPASS / RECOVER FLAG'}</span>
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-5 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-tech font-bold text-xs tracking-wider cursor-pointer"
            >
              RETURN TO ROOM
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
