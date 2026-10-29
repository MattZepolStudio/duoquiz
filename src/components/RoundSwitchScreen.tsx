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
      particleCount: 65,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#fb7185', '#f59e0b', '#ec4899', '#ffffff'],
    });
  }, []);

  useEffect(() => {
    if (isLaunching) {
      const timer = setTimeout(() => setIsLaunching(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [isLaunching]);

  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-80px)] max-w-lg mx-auto w-full px-4 py-6 animate-fade-in text-center relative z-10 select-none">
      
      {/* Top Tag Pill */}
      <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full ios-glass border border-white/[0.08] text-xs font-semibold text-rose-200 shadow-md">
        <Trophy className="w-3.5 h-3.5 text-amber-300" />
        <span>Fin de la Manche {completedManche}</span>
      </div>

      {/* Main Score Centerpiece */}
      <div className="my-auto flex flex-col items-center w-full py-4">
        {/* Glowing Centerpiece Avatar */}
        <div className="relative mb-5 flex items-center justify-center">
          <div className="w-24 h-24 rounded-[28px] ios-glass-glow flex items-center justify-center text-5xl shadow-2xl border-2 border-rose-400/40">
            {previousGuesser.avatar}
          </div>
          <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-white flex items-center justify-center text-xs font-extrabold shadow-lg border border-white/20">
            +{guesserScoreThisManche} pt{guesserScoreThisManche > 1 ? 's' : ''}
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
          Bien joué {previousGuesser.name} !
        </h2>

        <p className="text-xs sm:text-sm text-zinc-300/90 mt-1.5 max-w-xs leading-relaxed">
          <strong className="text-amber-300">{guesserScoreThisManche}</strong> bonne(s) réponse(s) sur {totalQuestionsThisManche} en devinant les choix secrets de {previousTarget.name}.
        </p>

        {/* Global Score comparison cards */}
        <div className="w-full mt-5 p-3.5 rounded-[24px] ios-glass grid grid-cols-2 gap-2.5 text-left border border-white/[0.08]">
          <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.06] flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center text-lg shrink-0">
              {player1.avatar}
            </span>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-zinc-400 truncate block">
                {player1.name}
              </span>
              <span className="text-sm font-bold text-white tabular-nums">
                {player1.score} pt{player1.score > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.06] flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center text-lg shrink-0">
              {player2.avatar}
            </span>
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
        <div className="w-full mt-4 p-4 rounded-[26px] ios-glass-glow text-left space-y-3 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-300 uppercase tracking-widest">
            <RotateCw className="w-4 h-4 text-amber-300" />
            <span>Inversion des rôles : Manche {nextMancheNumber}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.08] flex items-center justify-center text-2xl shrink-0 border border-white/[0.1]">
              {nextTarget.avatar}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                C'est au tour de {nextTarget.name} de répondre
              </h3>
              <p className="text-xs text-zinc-300/80 mt-0.5 leading-relaxed">
                {nextTarget.name} prend le téléphone en secret. {nextGuesser.name} devra ensuite tenter de deviner ses goûts !
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-white/[0.06] flex items-center gap-2 text-[11px] text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>{nextTarget.name} pourra personnaliser ses réponses avec l'icône ✏️.</span>
          </div>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="w-full space-y-2.5 pt-2">
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
          className={`w-full h-15 rounded-full font-display font-bold text-base text-white transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
            isLaunching
              ? 'bg-white/[0.05] text-zinc-500 cursor-not-allowed border border-white/[0.05] rounded-full'
              : 'btn-sensual-cta animate-shimmer cursor-pointer'
          }`}
        >
          <span>{isLaunching ? 'Lancement...' : `Lancer la manche de ${nextTarget.name}`}</span>
          <ArrowRight className="w-5 h-5 ml-1" />
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onGoToSummary();
            }}
            className="h-11 rounded-xl ios-glass text-xs font-semibold text-zinc-300 hover:text-white transition-colors flex items-center justify-center gap-1.5 active:scale-95 border border-white/[0.08]"
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
              className="h-11 rounded-xl ios-glass text-xs font-semibold text-zinc-300 hover:text-white transition-colors flex items-center justify-center gap-1.5 active:scale-95 border border-white/[0.08]"
            >
              <Home className="w-3.5 h-3.5 text-zinc-400" />
              <span>Menu Principal</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoundSwitchScreen;
