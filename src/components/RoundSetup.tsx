import React from 'react';
import { Sparkles, EyeOff, Play, Sliders, Flame } from 'lucide-react';
import { DifficultyLevel, Player, Question } from '../types/quiz';
import { sound } from '../utils/audio';

interface RoundSetupProps {
  roundNumber: number;
  totalRounds: number;
  targetPlayer: Player;
  guesserPlayer: Player;
  currentDifficulty: DifficultyLevel;
  onChangeDifficulty: (diff: DifficultyLevel) => void;
  categoryName: string;
  isNsfwCategory?: boolean;
  onReadyToAnswer: () => void;
}

export const RoundSetup: React.FC<RoundSetupProps> = ({
  roundNumber,
  totalRounds,
  targetPlayer,
  guesserPlayer,
  currentDifficulty,
  onChangeDifficulty,
  categoryName,
  isNsfwCategory,
  onReadyToAnswer,
}) => {
  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-80px)] max-w-lg mx-auto w-full px-4 py-6 animate-fade-in text-center">
      {/* Top Tag & Indicator */}
      <div className="w-full flex flex-col items-center gap-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>
            Manche {roundNumber} {totalRounds < 99 && `sur ${totalRounds}`}
          </span>
          <span className="text-zinc-600">·</span>
          <span className="text-rose-400 font-medium">{categoryName}</span>
        </div>
      </div>

      {/* Main Focus Card: Hand phone to target player */}
      <div className="w-full my-auto flex flex-col items-center">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-rose-500/20 to-pink-500/20 border border-rose-500/40 flex items-center justify-center text-4xl shadow-xl shadow-rose-950/40 animate-pulse">
            {targetPlayer.avatar}
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-rose-400">
            <EyeOff className="w-4 h-4" />
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white">
          Donnez le téléphone à <br />
          <span className="text-rose-400">{targetPlayer.name}</span> !
        </h2>

        <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-xs">
          <strong className="text-zinc-200">{guesserPlayer.name}</strong>, ferme les yeux ou regarde ailleurs ! {targetPlayer.name} va enregistrer sa réponse secrète.
        </p>

        {/* Live Difficulty Selector for THIS round */}
        <div className="w-full mt-6 p-4 rounded-3xl bg-zinc-900/90 border border-zinc-800/80 text-left">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 uppercase tracking-wider">
              <Sliders className="w-3.5 h-3.5 text-rose-400" />
              <span>Difficulté de cette manche</span>
            </div>
            {isNsfwCategory && (
              <span className="flex items-center gap-1 text-[11px] text-rose-400 font-semibold">
                <Flame className="w-3 h-3" /> Intime
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                sound.playTap();
                onChangeDifficulty('easy');
              }}
              className={`py-2 px-2.5 rounded-xl flex flex-col items-center text-center border transition-all ${
                currentDifficulty === 'easy'
                  ? 'bg-rose-500/20 border-rose-500/70 text-white shadow-sm'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <span className="text-sm">🌸</span>
              <span className="text-xs font-bold mt-0.5">Douce</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playTap();
                onChangeDifficulty('medium');
              }}
              className={`py-2 px-2.5 rounded-xl flex flex-col items-center text-center border transition-all ${
                currentDifficulty === 'medium'
                  ? 'bg-amber-500/20 border-amber-500/70 text-white shadow-sm'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <span className="text-sm">💫</span>
              <span className="text-xs font-bold mt-0.5">Complice</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playTap();
                onChangeDifficulty('spicy');
              }}
              className={`py-2 px-2.5 rounded-xl flex flex-col items-center text-center border transition-all ${
                currentDifficulty === 'spicy'
                  ? 'bg-red-500/25 border-red-500/80 text-white shadow-sm'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <span className="text-sm">🌶️</span>
              <span className="text-xs font-bold mt-0.5">Pimentée</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="w-full pt-4">
        <button
          type="button"
          onClick={() => {
            sound.playTap();
            sound.vibrate(15);
            onReadyToAnswer();
          }}
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-display font-bold text-base shadow-lg shadow-rose-950/40 hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Je suis {targetPlayer.name}, c'est parti !</span>
        </button>
      </div>
    </div>
  );
};
