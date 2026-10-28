import React from 'react';
import { Volume2, VolumeX, HelpCircle } from 'lucide-react';
import { sound } from '../utils/audio';
import { ParCoeurLogo } from './ParCoeurLogo';

interface TopNavProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onRequestQuit?: () => void;
  onOpenHelp: () => void;
  currentRound?: number;
  totalRounds?: number;
  currentManche?: number;
  inGame?: boolean;
  multiplayerCode?: string;
}

export const TopNav: React.FC<TopNavProps> = ({
  soundEnabled,
  onToggleSound,
  onRequestQuit,
  onOpenHelp,
  currentRound,
  totalRounds,
  currentManche,
  inGame,
  multiplayerCode,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0b0c]/80 backdrop-blur-2xl border-b border-white/[0.06] transition-colors">
      <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto w-full">
        {/* Brand Zone */}
        <button
          type="button"
          onClick={() => {
            if (inGame && onRequestQuit) {
              sound.playTap();
              onRequestQuit();
            }
          }}
          className={`group flex items-center gap-2.5 text-left transition-transform ${
            inGame ? 'cursor-pointer active:scale-95' : 'cursor-default'
          }`}
          title={inGame ? 'Retourner au menu' : undefined}
          aria-label={inGame ? 'Retourner au menu principal' : 'ParCœur'}
        >
          {/* Logo container */}
          <div className="w-9 h-9 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shadow-md shadow-black/40 group-hover:border-rose-500/30 transition-all">
            <ParCoeurLogo size={24} />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg tracking-tight text-white leading-none">
              Par<span className="bg-gradient-to-r from-rose-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">Cœur</span>
            </span>
            {inGame ? (
              <span className="text-[10px] text-zinc-400 group-hover:text-rose-300 transition-colors font-medium mt-0.5">
                ‹ Quitter la partie
              </span>
            ) : (
              <span className="text-[9px] tracking-widest uppercase font-semibold text-zinc-500 mt-0.5">
                Le Jeu de Couple
              </span>
            )}
          </div>
        </button>

        {/* Center in-game round counter & multiplayer code */}
        <div className="flex items-center gap-1.5">
          {multiplayerCode && (
            <div className="flex items-center gap-1 px-3 py-1 bg-white/[0.05] rounded-full border border-rose-500/30 text-[11px] font-bold text-rose-300 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              <span>{multiplayerCode}</span>
            </div>
          )}
          {inGame && currentRound && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/[0.05] rounded-full border border-white/[0.08] text-xs font-semibold text-zinc-300 tabular-nums shadow-sm backdrop-blur-md">
              {currentManche && (
                <span className="text-rose-400 font-bold">M{currentManche} · </span>
              )}
              <span>Q{currentRound}</span>
              {totalRounds && totalRounds < 99 && (
                <span className="text-zinc-500">/{totalRounds}</span>
              )}
            </div>
          )}
        </div>

        {/* Controls Zone (Audio & Rules) */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleSound}
            className="w-9 h-9 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] flex items-center justify-center text-zinc-400 hover:text-zinc-100 transition-all active:scale-95"
            title={soundEnabled ? 'Couper le son' : 'Activer le son'}
            aria-label={soundEnabled ? 'Couper le son' : 'Activer le son'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-rose-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-zinc-500" />
            )}
          </button>

          <button
            type="button"
            onClick={onOpenHelp}
            className="w-9 h-9 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] flex items-center justify-center text-zinc-400 hover:text-zinc-100 transition-all active:scale-95"
            title="Règles du jeu"
            aria-label="Règles du jeu"
          >
            <HelpCircle className="w-4 h-4 text-zinc-300" />
          </button>
        </div>
      </div>
    </header>
  );
};
