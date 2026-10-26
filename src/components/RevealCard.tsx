import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  Sparkles, 
  Check, 
  X, 
  ArrowRight, 
  Trophy, 
  MessageCircle, 
  ThumbsUp 
} from 'lucide-react';
import { Player, Question } from '../types/quiz';
import { sound } from '../utils/audio';
import { getFormattedQuestion } from '../utils/questionFormatter';

interface RevealCardProps {
  question: Question;
  currentIndex: number;
  totalCount: number;
  targetPlayer: Player;
  guesserPlayer: Player;
  targetAnswer: string;
  guesserAnswer: string;
  isAutoMatch: boolean;
  scoreAwarded: boolean;
  onConfirmMatch: () => void;
  onRejectMatch: () => void;
  onNextRound: () => void;
  isLastRound: boolean;
}

export const RevealCard: React.FC<RevealCardProps> = ({
  question,
  currentIndex,
  totalCount,
  targetPlayer,
  guesserPlayer,
  targetAnswer,
  guesserAnswer,
  isAutoMatch,
  scoreAwarded,
  onConfirmMatch,
  onRejectMatch,
  onNextRound,
  isLastRound,
}) => {
  useEffect(() => {
    if (isAutoMatch) {
      sound.playSuccess();
      sound.vibrate([25, 45, 25]);
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#f43f5e', '#ec4899', '#fb7185', '#fda4af', '#facc15'],
      });
    } else {
      sound.playMismatch();
      sound.vibrate([50, 40]);
    }
  }, [isAutoMatch]);

  const displayedQuestionText = getFormattedQuestion(
    question,
    'reveal',
    targetPlayer.name,
    guesserPlayer.name
  );

  return (
    <div className="flex flex-col justify-between h-full max-h-full max-w-lg mx-auto w-full px-4 pt-2 pb-5 sm:pb-7 animate-fade-in text-center overflow-hidden select-none">
      {/* Top Status */}
      <div className="shrink-0 space-y-1">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-semibold text-zinc-300">
            <MessageCircle className="w-3 h-3 text-rose-400" />
            <span>Débrief à deux</span>
          </div>

          <span className="text-[11px] font-bold text-zinc-400 tabular-nums px-2 py-0.5 bg-zinc-900/80 rounded-full border border-zinc-800">
            Question {currentIndex + 1} / {totalCount}
          </span>
        </div>

        {/* Linear progress bar */}
        <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalCount) * 100}%` }}
          />
        </div>

        {/* Question Reminder */}
        <p className="text-[11px] sm:text-xs text-zinc-300 font-semibold max-w-xs mx-auto pt-0.5 line-clamp-2">
          « {displayedQuestionText} »
        </p>
      </div>

      {/* Main Reveal Face-Off Cards */}
      <div className="flex-1 min-h-0 flex flex-col justify-center space-y-2 sm:space-y-3 my-1">
        {/* Match / Mismatch Banner */}
        <div
          className={`p-2.5 sm:p-3 rounded-2xl border flex items-center justify-center gap-2 shadow-md ${
            scoreAwarded
              ? 'bg-gradient-to-r from-emerald-950/60 to-emerald-900/40 border-emerald-500/50 text-emerald-200'
              : 'bg-gradient-to-r from-zinc-900 to-zinc-950 border-zinc-800 text-zinc-300'
          }`}
        >
          {scoreAwarded ? (
            <>
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shrink-0">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <div className="text-left">
                <span className="font-display font-bold text-xs sm:text-sm block text-white">
                  C'est un Match parfait ! 🎉
                </span>
                <span className="text-[11px] text-emerald-300">
                  +1 point pour {guesserPlayer.name} !
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="font-display font-bold text-xs sm:text-sm block text-white">
                  Pas tout à fait pareil ! 🤔
                </span>
                <span className="text-[10px] text-zinc-400">
                  Débattez ou accordez le point si vous êtes d'accord.
                </span>
              </div>
            </>
          )}
        </div>

        {/* Comparison grid */}
        <div className="grid grid-cols-2 gap-2 text-left">
          {/* Target Answer */}
          <div className="p-2.5 sm:p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 mb-1">
                <span>{targetPlayer.avatar}</span>
                <span className="truncate">{targetPlayer.name} a répondu :</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-3">
                « {targetAnswer} »
              </p>
            </div>
            <span className="text-[9px] text-zinc-500 mt-2 block">
              Réponse originale
            </span>
          </div>

          {/* Guesser Answer */}
          <div
            className={`p-2.5 sm:p-3 rounded-xl border flex flex-col justify-between transition-colors ${
              scoreAwarded
                ? 'bg-emerald-950/30 border-emerald-500/40'
                : 'bg-zinc-900/90 border-zinc-800'
            }`}
          >
            <div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-pink-400 mb-1">
                <span>{guesserPlayer.avatar}</span>
                <span className="truncate">{guesserPlayer.name} a deviné :</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-3">
                « {guesserAnswer} »
              </p>
            </div>
            <span className="text-[9px] text-zinc-500 mt-2 block">
              Pronostic
            </span>
          </div>
        </div>

        {/* Manual Override Button if not auto match */}
        {!isAutoMatch && (
          <div className="pt-0.5">
            {!scoreAwarded ? (
              <button
                type="button"
                onClick={() => {
                  sound.playSuccess();
                  sound.vibrate(20);
                  confetti({
                    particleCount: 40,
                    spread: 60,
                    origin: { y: 0.7 },
                  });
                  onConfirmMatch();
                }}
                className="w-full py-1.5 px-3 rounded-xl bg-zinc-900 border border-zinc-700/80 text-[11px] font-semibold text-zinc-300 hover:text-white hover:border-emerald-500/50 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <ThumbsUp className="w-3 h-3 text-emerald-400" />
                <span>On était d'accord sur le fond ! (Accorder le point)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  onRejectMatch();
                }}
                className="text-[11px] text-zinc-500 hover:text-zinc-400 underline"
              >
                Annuler le point accordé
              </button>
            )}
          </div>
        )}
      </div>

      {/* Next Step CTA */}
      <div className="shrink-0 pt-2">
        <button
          type="button"
          onClick={() => {
            sound.playTap();
            sound.vibrate(15);
            onNextRound();
          }}
          className="w-full h-12 sm:h-13 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-display font-bold text-sm shadow-xl shadow-rose-950/40 hover:brightness-105 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          {isLastRound ? (
            <>
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>Voir le score de la manche</span>
            </>
          ) : (
            <>
              <span>Question suivante</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
