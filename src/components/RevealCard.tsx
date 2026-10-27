import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Trophy, 
  MessageCircle, 
  ThumbsUp,
  HelpCircle,
  Flame,
  Zap
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
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [targetFlipped, setTargetFlipped] = useState(false);
  const [guesserFlipped, setGuesserFlipped] = useState(false);
  const [evaluationRevealed, setEvaluationRevealed] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<Array<{ id: number; left: number; delay: number; size: number }>>([]);

  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const triggerMatchCelebration = () => {
    sound.playSuccess();
    sound.vibrate([25, 45, 25]);
    confetti({
      particleCount: 70,
      spread: 75,
      origin: { y: 0.65 },
      colors: ['#f43f5e', '#ec4899', '#fb7185', '#fda4af', '#facc15'],
    });

    // Generate floating hearts
    const hearts = Array.from({ length: 9 }).map((_, i) => ({
      id: Date.now() + i,
      left: 15 + Math.random() * 70,
      delay: Math.random() * 0.4,
      size: 14 + Math.random() * 12,
    }));
    setFloatingHearts(hearts);
  };

  const triggerMismatchReaction = () => {
    sound.playMismatch();
    sound.vibrate([45, 30]);
  };

  // Skip animation to immediately show both answers
  const handleFastForward = () => {
    if (evaluationRevealed) return;
    clearAllTimers();
    setTargetFlipped(true);
    setGuesserFlipped(true);
    setEvaluationRevealed(true);
    if (scoreAwarded) {
      triggerMatchCelebration();
    } else {
      triggerMismatchReaction();
    }
  };

  // Launch sequential 3D suspense on question mount or change
  useEffect(() => {
    setIsAdvancing(false);
    setTargetFlipped(false);
    setGuesserFlipped(false);
    setEvaluationRevealed(false);
    setFloatingHearts([]);
    clearAllTimers();

    // 1. Flip Target Answer card at 350ms
    const t1 = setTimeout(() => {
      setTargetFlipped(true);
      sound.playCardFlip();
      sound.vibrate(10);
    }, 350);

    // 2. Flip Guesser Answer card at 1050ms
    const t2 = setTimeout(() => {
      setGuesserFlipped(true);
      sound.playCardFlip();
      sound.vibrate(10);
    }, 1050);

    // 3. Reveal Match/Mismatch decision with celebratory effects at 1650ms
    const t3 = setTimeout(() => {
      setEvaluationRevealed(true);
      if (scoreAwarded) {
        triggerMatchCelebration();
      } else {
        triggerMismatchReaction();
      }
    }, 1650);

    timersRef.current = [t1, t2, t3];

    return () => clearAllTimers();
  }, [currentIndex, question.id]);

  const displayedQuestionText = getFormattedQuestion(
    question,
    'reveal',
    targetPlayer.name,
    guesserPlayer.name
  );

  const formatAnswer = (ans: string) => {
    if (!ans) return '';
    return ans
      .replace(/\{partner\}/g, guesserPlayer?.name || 'ton partenaire')
      .replace(/\{target\}/g, targetPlayer?.name || 'ton partenaire');
  };

  const isEffectiveMatch = scoreAwarded;

  return (
    <div 
      className="flex flex-col justify-between h-full max-h-full max-w-lg mx-auto w-full px-4 pt-2 pb-5 sm:pb-7 animate-fade-in text-center overflow-hidden select-none relative"
      onClick={!evaluationRevealed ? handleFastForward : undefined}
    >
      {/* Floating hearts container on match */}
      {floatingHearts.length > 0 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {floatingHearts.map((h) => (
            <div
              key={h.id}
              className="absolute bottom-16 animate-heart-float text-rose-500 drop-shadow-md"
              style={{
                left: `${h.left}%`,
                animationDelay: `${h.delay}s`,
                fontSize: `${h.size}px`,
              }}
            >
              💖
            </div>
          ))}
        </div>
      )}

      {/* Top Status */}
      <div className="shrink-0 space-y-1">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-semibold text-zinc-300">
            <MessageCircle className="w-3 h-3 text-rose-400" />
            <span>Débrief complice</span>
          </div>

          <div className="flex items-center gap-2">
            {!evaluationRevealed && (
              <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400 animate-pulse" />
                <span>Touche pour accélérer</span>
              </span>
            )}
            <span className="text-[11px] font-bold text-zinc-400 tabular-nums px-2 py-0.5 bg-zinc-900/80 rounded-full border border-zinc-800">
              {currentIndex + 1} / {totalCount}
            </span>
          </div>
        </div>

        {/* Linear progress bar */}
        <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-rose-400 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalCount) * 100}%` }}
          />
        </div>

        {/* Question Reminder */}
        <p className="text-[11px] sm:text-xs text-zinc-300 font-semibold max-w-xs mx-auto pt-0.5 line-clamp-2">
          « {displayedQuestionText} »
        </p>
      </div>

      {/* Main Reveal Face-Off Cards Area */}
      <div className="flex-1 min-h-0 flex flex-col justify-center space-y-2.5 sm:space-y-3.5 my-1">
        {/* Match / Mismatch / Suspense Banner */}
        <div className="min-h-[58px] flex items-center justify-center">
          {!evaluationRevealed ? (
            <div className="w-full p-2.5 sm:p-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 flex items-center justify-center gap-2 text-zinc-400 animate-pulse shadow-sm">
              <Sparkles className="w-4 h-4 text-rose-400 animate-spin" style={{ animationDuration: '3s' }} />
              <span className="text-xs font-semibold text-zinc-300">
                Révélation des réponses en direct...
              </span>
            </div>
          ) : isEffectiveMatch ? (
            <div className="w-full p-2.5 sm:p-3 rounded-2xl border border-emerald-500/60 bg-gradient-to-r from-emerald-950/80 via-emerald-900/50 to-emerald-950/80 text-emerald-200 flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-950/40 animate-shockwave relative overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-emerald-500/25 text-emerald-400 flex items-center justify-center border border-emerald-500/50 shrink-0">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <div className="text-left">
                <span className="font-display font-bold text-xs sm:text-sm block text-white">
                  C'est un Match parfait ! 🎉
                </span>
                <span className="text-[11px] text-emerald-300/90 font-medium">
                  +1 point de complicité pour {guesserPlayer.name} !
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full p-2.5 sm:p-3 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 text-zinc-300 flex items-center justify-center gap-2.5 shadow-md animate-gentle-shake">
              <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="font-display font-bold text-xs sm:text-sm block text-white">
                  Pas tout à fait pareil ! 🤔
                </span>
                <span className="text-[10px] text-zinc-400">
                  Débattez ou accordez le point si vous étiez d'accord.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 3D Comparison Cards Grid */}
        <div className="grid grid-cols-2 gap-2.5 text-left">
          {/* 1. Target Card (Lucas) */}
          <div className="perspective-1000 h-[120px] sm:h-[135px] w-full">
            <div
              className={`relative w-full h-full transition-transform duration-700 transform-style-3d cursor-pointer ${
                targetFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* Front (Mystery / Face cachée) */}
              <div className="backface-hidden absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800/90 p-3 flex flex-col items-center justify-center shadow-md">
                <div className="w-8 h-8 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-300 font-bold text-sm shadow-inner animate-pulse mb-1">
                  ?
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-300">
                  <span>{targetPlayer.avatar}</span>
                  <span className="truncate">{targetPlayer.name}</span>
                </div>
                <span className="text-[9px] text-zinc-500 uppercase tracking-wider mt-1">
                  Réponse secrète
                </span>
              </div>

              {/* Back (Revealed Answer / Face visible) */}
              <div className="backface-hidden rotate-y-180 absolute inset-0 w-full h-full rounded-2xl bg-zinc-900/95 border border-rose-500/40 p-3 flex flex-col justify-between shadow-md">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-400 mb-1">
                    <span>{targetPlayer.avatar}</span>
                    <span className="truncate">{targetPlayer.name} a répondu :</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-3">
                    « {formatAnswer(targetAnswer)} »
                  </p>
                </div>
                <div className="flex items-center justify-between text-[9px] text-zinc-500 pt-1 border-t border-zinc-800/60">
                  <span>Réponse personnelle</span>
                  <span className="text-rose-400/80 font-semibold">Authentique</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Guesser Card (Julie) */}
          <div className="perspective-1000 h-[120px] sm:h-[135px] w-full">
            <div
              className={`relative w-full h-full transition-transform duration-700 transform-style-3d cursor-pointer ${
                guesserFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* Front (Mystery / Face cachée) */}
              <div className="backface-hidden absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800/90 p-3 flex flex-col items-center justify-center shadow-md">
                <div className="w-8 h-8 rounded-full bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-300 font-bold text-sm shadow-inner animate-pulse mb-1">
                  ?
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-pink-300">
                  <span>{guesserPlayer.avatar}</span>
                  <span className="truncate">{guesserPlayer.name}</span>
                </div>
                <span className="text-[9px] text-zinc-500 uppercase tracking-wider mt-1">
                  Pronostic
                </span>
              </div>

              {/* Back (Revealed Answer / Face visible) */}
              <div
                className={`backface-hidden rotate-y-180 absolute inset-0 w-full h-full rounded-2xl p-3 flex flex-col justify-between shadow-md transition-colors ${
                  evaluationRevealed && isEffectiveMatch
                    ? 'bg-emerald-950/30 border-2 border-emerald-500/70 ring-1 ring-emerald-500/30'
                    : 'bg-zinc-900/95 border border-zinc-800'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-pink-400 mb-1">
                    <span>{guesserPlayer.avatar}</span>
                    <span className="truncate">{guesserPlayer.name} a deviné :</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-3">
                    « {formatAnswer(guesserAnswer)} »
                  </p>
                </div>
                <div className="flex items-center justify-between text-[9px] text-zinc-500 pt-1 border-t border-zinc-800/60">
                  <span>Pronostic</span>
                  {evaluationRevealed && (
                    <span
                      className={`font-semibold ${
                        isEffectiveMatch ? 'text-emerald-400' : 'text-zinc-500'
                      }`}
                    >
                      {isEffectiveMatch ? 'Match !' : 'Différent'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Manual Override Button if not auto match and evaluation is shown */}
        {evaluationRevealed && !isAutoMatch && (
          <div className="pt-0.5 animate-fade-in">
            {!scoreAwarded ? (
              <button
                type="button"
                onClick={() => {
                  triggerMatchCelebration();
                  onConfirmMatch();
                }}
                className="w-full py-2 px-3 rounded-xl bg-zinc-900/90 border border-zinc-700/80 text-[11px] font-semibold text-zinc-200 hover:text-white hover:border-emerald-500/50 flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm"
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
                className="text-[11px] text-zinc-400 hover:text-zinc-300 underline"
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
          disabled={isAdvancing}
          onClick={() => {
            if (isAdvancing) return;
            setIsAdvancing(true);
            sound.playTap();
            sound.vibrate(15);
            onNextRound();
          }}
          className={`w-full h-12 sm:h-13 rounded-2xl font-display font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
            isAdvancing
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-rose-950/40 hover:brightness-105 cursor-pointer'
          }`}
        >
          {isLastRound ? (
            <>
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>Voir le score de la manche</span>
            </>
          ) : (
            <>
              <span>{isAdvancing ? 'Chargement...' : 'Question suivante'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
