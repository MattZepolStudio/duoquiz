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
    <div className="flex flex-col justify-between min-h-[calc(100vh-80px)] max-w-lg mx-auto w-full px-4 py-4 animate-fade-in text-center">
      {/* Top Status */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300">
            <MessageCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Débrief à deux</span>
          </div>

          <span className="text-xs font-bold text-zinc-400 tabular-nums px-2.5 py-1 bg-zinc-900/80 rounded-full border border-zinc-800">
            Question {currentIndex + 1} / {totalCount}
          </span>
        </div>

        {/* Linear progress bar */}
        <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalCount) * 100}%` }}
          />
        </div>

        {/* Question Reminder */}
        <p className="text-xs text-zinc-300 font-semibold max-w-xs mx-auto pt-1">
          « {displayedQuestionText} »
        </p>
      </div>

      {/* Main Reveal Face-Off Cards */}
      <div className="my-auto space-y-4">
        {/* Match / Mismatch Banner */}
        <div
          className={`p-4 rounded-3xl border flex items-center justify-center gap-2.5 shadow-lg ${
            scoreAwarded
              ? 'bg-gradient-to-r from-emerald-950/60 to-emerald-900/40 border-emerald-500/50 text-emerald-200'
              : 'bg-gradient-to-r from-zinc-900 to-zinc-950 border-zinc-800 text-zinc-300'
          }`}
        >
          {scoreAwarded ? (
            <>
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <div className="text-left">
                <span className="font-display font-bold text-base block text-white">
                  C'est un Match parfait ! 🎉
                </span>
                <span className="text-xs text-emerald-300">
                  +1 point pour {guesserPlayer.name} !
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="font-display font-bold text-base block text-white">
                  Pas tout à fait pareil ! 🤔
                </span>
                <span className="text-xs text-zinc-400">
                  Débattez ou accordez le point si vous êtes d'accord.
                </span>
              </div>
            </>
          )}
        </div>

        {/* Comparison grid */}
        <div className="grid grid-cols-2 gap-3 text-left">
          {/* Target Answer */}
          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 mb-2">
                <span>{targetPlayer.avatar}</span>
                <span className="truncate">{targetPlayer.name} a répondu :</span>
              </div>
              <p className="text-sm font-bold text-white leading-snug">
                « {targetAnswer} »
              </p>
            </div>
            <span className="text-[10px] text-zinc-500 mt-3 block">
              Réponse originale
            </span>
          </div>

          {/* Guesser Answer */}
          <div
            className={`p-4 rounded-2xl border flex flex-col justify-between transition-colors ${
              scoreAwarded
                ? 'bg-emerald-950/30 border-emerald-500/40'
                : 'bg-zinc-900/90 border-zinc-800'
            }`}
          >
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-pink-400 mb-2">
                <span>{guesserPlayer.avatar}</span>
                <span className="truncate">{guesserPlayer.name} a deviné :</span>
              </div>
              <p className="text-sm font-bold text-white leading-snug">
                « {guesserAnswer} »
              </p>
            </div>
            <span className="text-[10px] text-zinc-500 mt-3 block">
              Pronostic
            </span>
          </div>
        </div>

        {/* Manual Override Button if not auto match */}
        {!isAutoMatch && (
          <div className="pt-2">
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
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 border border-zinc-700/80 text-xs font-semibold text-zinc-300 hover:text-white hover:border-emerald-500/50 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>On était d'accord sur le fond ! (Accorder le point)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  onRejectMatch();
                }}
                className="text-xs text-zinc-500 hover:text-zinc-400 underline"
              >
                Annuler le point accordé
              </button>
            )}
          </div>
        )}
      </div>

      {/* Next Step CTA */}
      <div className="pt-4">
        <button
          type="button"
          onClick={() => {
            sound.playTap();
            sound.vibrate(15);
            onNextRound();
          }}
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-display font-bold text-base shadow-xl shadow-rose-950/40 hover:brightness-105 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          {isLastRound ? (
            <>
              <Trophy className="w-5 h-5 text-amber-300" />
              <span>Voir le score de la manche</span>
            </>
          ) : (
            <>
              <span>Question suivante</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
