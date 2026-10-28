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
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-2.5 bg-zinc-950/85 backdrop-blur-md border-b border-zinc-800/60 max-w-lg mx-auto w-full">
      {/* Brand Zone - Clickable to return to menu when in game */}
      <button
        type="button"
        onClick={() => {
          if (inGame && onRequestQuit) {
            sound.playTap();
            onRequestQuit();
          }
        }}
        className={`group flex items-center gap-2.5 text-left transition-all ${
          inGame ? 'cursor-pointer hover:opacity-90 active:scale-95' : 'cursor-default'
        }`}
        title={inGame ? 'Retourner au menu' : undefined}
        aria-label={inGame ? 'Retourner au menu principal' : 'ParCœur'}
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-rose-500/30 flex items-center justify-center shadow-md shadow-rose-950/50 group-hover:border-rose-400/60 transition-all">
          <ParCoeurLogo size={24} />
        </div>
        <div className="flex flex-col">
          <span className="font-display font-bold text-lg tracking-tight text-white leading-none">
            Par<span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">Cœur</span>
          </span>
          {inGame && (
            <span className="text-[10px] text-zinc-400 group-hover:text-rose-300 transition-colors font-medium">
              Accueil ‹
            </span>
          )}
        </div>
      </button>

      {/* Center in-game round counter & multiplayer code */}
      <div className="flex items-center gap-1.5">
        {multiplayerCode && (
          <div className="flex items-center gap-1 px-2.5 py-0.5 bg-rose-500/10 rounded-full border border-rose-500/30 text-[11px] font-bold text-rose-300">
            <span>📱 {multiplayerCode}</span>
          </div>
        )}
        {inGame && currentRound && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900/90 rounded-full border border-zinc-800 text-xs font-semibold text-zinc-300 tabular-nums">
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

      {/* Controls Zone */}
      <div className="flex items-center gap-1">

        <button
          type="button"
          onClick={onToggleSound}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors active:scale-95"
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
          className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors active:scale-95"
          title="Règles du jeu"
          aria-label="Règles du jeu"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
