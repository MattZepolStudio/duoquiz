import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowRight, RotateCw, Trophy, Sparkles, Heart, Home } from 'lucide-react';
import { Player } from '../types/quiz';
import { sound } from '../utils/audio';

interface RoundSwitchScreenProps {
  completedManche: number;
  player1: Player;
  player2: Player;
  previousTarget: Player;
  previousGuesser: Player;
  guesserScoreThisManche: number;
  totalQuestionsThisManche: number;
  nextTarget: Player;
  nextGuesser: Player;
  onStartNextManche: () => void;
  onGoToSummary: () => void;
  onReturnToMenu?: () => void;
}

export const RoundSwitchScreen: React.FC<RoundSwitchScreenProps> = ({
  completedManche,
  player1,
  player2,
  previousTarget,
  previousGuesser,
  guesserScoreThisManche,
  totalQuestionsThisManche,
  nextTarget,
  nextGuesser,
  onStartNextManche,
  onGoToSummary,
  onReturnToMenu,
}) => {
  const nextMancheNumber = completedManche + 1;
  const [isLaunching, setIsLaunching] = React.useState(false);

  useEffect(() => {
    sound.playSuccess();
    sound.vibrate([20, 50, 20]);
    confetti({
      particleCount: 80,
      spread: 85,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#fb7185', '#38bdf8', '#facc15', '#a855f7'],
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-80px)] max-w-lg mx-auto w-full px-4 py-6 animate-fade-in text-center">
      {/* Top Tag */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300">
        <Trophy className="w-3.5 h-3.5 text-amber-400" />
        <span>Score de la Manche {completedManche}</span>
      </div>

      {/* Main Score Centerpiece */}
      <div className="my-auto flex flex-col items-center w-full">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500/20 to-rose-500/20 border border-amber-500/40 flex items-center justify-center text-5xl shadow-xl shadow-amber-950/40">
            {previousGuesser.avatar}
          </div>
          <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-extrabold shadow-md">
            +{guesserScoreThisManche} pt{guesserScoreThisManche > 1 ? 's' : ''}
          </div>
        </div>

        <h2 className="text-2xl font-display font-extrabold text-white">
          Bien joué {previousGuesser.name} !
        </h2>

        <p className="text-sm font-semibold text-zinc-300 mt-1">
          {guesserScoreThisManche} bonne(s) réponse(s) sur {totalQuestionsThisManche} en devinant les goûts de {previousTarget.name}.
        </p>

        {/* Global Score comparison strip */}
        <div className="w-full mt-4 p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 grid grid-cols-2 gap-2 text-left">
          <div className="p-2 rounded-xl bg-zinc-950/60 border border-zinc-850 flex items-center gap-2">
            <span className="text-lg">{player1.avatar}</span>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-zinc-400 truncate block">
                {player1.name}
              </span>
              <span className="text-sm font-bold text-white tabular-nums">
                {player1.score} pt{player1.score > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-zinc-950/60 border border-zinc-850 flex items-center gap-2">
            <span className="text-lg">{player2.avatar}</span>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-zinc-400 truncate block">
                {player2.name}
              </span>
              <span className="text-sm font-bold text-white tabular-nums">
                {player2.score} pt{player2.score > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Next Manche announcement card */}
        <div className="w-full mt-4 p-4 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-rose-500/30 text-left space-y-3 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
            <RotateCw className="w-4 h-4" />
            <span>Prochaine manche : manche {nextMancheNumber}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-2xl shrink-0 border border-zinc-700">
              {nextTarget.avatar}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                C'est au tour de {nextTarget.name} de répondre
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                {nextTarget.name} prend le téléphone en secret pour enregistrer ses choix. {nextGuesser.name} devra ensuite les deviner !
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800 flex items-center gap-2 text-[11px] text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>{nextTarget.name} pourra personnaliser ses réponses avec le bouton ✏️ !</span>
          </div>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="w-full space-y-2.5 pt-4">
        <button
          type="button"
          disabled={isLaunching}
          onClick={() => {
            if (isLaunching) return;
            setIsLaunching(true);
            sound.playTap();
            sound.vibrate(20);
            onStartNextManche();
          }}
          className={`w-full h-14 rounded-2xl font-display font-bold text-base shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
            isLaunching
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white shadow-rose-950/50 hover:brightness-105'
          }`}
        >
          <span>{isLaunching ? 'Lancement en cours...' : `Lancer la prochaine manche (${nextTarget.name})`}</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onGoToSummary();
            }}
            className="h-11 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition-colors flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>Bilan Cupidon IA</span>
          </button>

          {onReturnToMenu && (
            <button
              type="button"
              onClick={() => {
                sound.playTap();
                onReturnToMenu();
              }}
              className="h-11 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition-colors flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Home className="w-3.5 h-3.5 text-rose-400" />
              <span>Menu Principal</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
