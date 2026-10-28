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
  Zap,
  Flame,
  CheckCircle2
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
      particleCount: 55,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#fb7185', '#f59e0b', '#ec4899', '#ffffff'],
    });

    const hearts = Array.from({ length: 7 }).map((_, i) => ({
      id: Date.now() + i,
      left: 15 + Math.random() * 70,
      delay: Math.random() * 0.35,
      size: 14 + Math.random() * 10,
    }));
    setFloatingHearts(hearts);
  };

  const triggerMismatchReaction = () => {
    sound.playMismatch();
    sound.vibrate([40, 25]);
  };

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

  useEffect(() => {
    clearAllTimers();
    setTargetFlipped(false);
    setGuesserFlipped(false);
    setEvaluationRevealed(false);
    setIsAdvancing(false);
    setFloatingHearts([]);

    // 1. Reveal Target's real answer
    const t1 = setTimeout(() => {
      setTargetFlipped(true);
      sound.playCardFlip();
    }, 550);

    // 2. Reveal Guesser's guess
    const t2 = setTimeout(() => {
      setGuesserFlipped(true);
      sound.playCardFlip();
    }, 1250);

    // 3. Final verdict
    const t3 = setTimeout(() => {
      setEvaluationRevealed(true);
      if (scoreAwarded) {
        triggerMatchCelebration();
      } else {
        triggerMismatchReaction();
      }
    }, 1900);

    timersRef.current = [t1, t2, t3];
    return () => clearAllTimers();
  }, [currentIndex, scoreAwarded]);

  const displayedQuestionText = getFormattedQuestion(
    question,
    'reveal',
    targetPlayer.name,
    guesserPlayer.name
  );

  const formatAnswer = (text: string) => {
    if (!text) return '—';
    return text
      .replace(/\{partner\}/g, guesserPlayer.name)
      .replace(/\{target\}/g, targetPlayer.name)
      .replace(/\{guesser\}/g, guesserPlayer.name);
  };

  const isEffectiveMatch = scoreAwarded;

  return (
    <div 
      className="flex flex-col justify-between h-full max-h-full max-w-lg mx-auto w-full px-4 pt-2 pb-6 animate-fade-in overflow-hidden select-none relative z-10"
      onClick={!evaluationRevealed ? handleFastForward : undefined}
    >
      {/* Floating Confetti Hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {floatingHearts.map((h) => (
          <div
            key={h.id}
            className="absolute bottom-20 text-rose-500 animate-heart-float"
            style={{
              left: `${h.left}%`,
              animationDelay: `${h.delay}s`,
              fontSize: `${h.size}px`,
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      {/* ========================================================
          1. DYNAMIC ISLAND FLOATING HEADER & PROGRESS
         ======================================================== */}
      <div className="shrink-0 space-y-2.5">
        <div className="ios-glass rounded-full px-4 py-2 flex items-center justify-between shadow-lg shadow-black/40 border border-white/[0.08]">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-200">
            <MessageCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Débrief complice</span>
          </div>

          <div className="flex items-center gap-2">
            {!evaluationRevealed && (
              <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-300 animate-pulse" />
                <span>Toucher pour passer</span>
              </span>
            )}
            <span className="text-xs font-bold text-white tabular-nums px-2.5 py-0.5 bg-white/[0.06] rounded-full border border-white/[0.08]">
              {currentIndex + 1} / {totalCount}
            </span>
          </div>
        </div>

        {/* Linear progress bar */}
        <div className="w-full bg-white/[0.04] h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-rose-500 to-amber-400 transition-all duration-300 rounded-full"
            style={{ width: `${((currentIndex + 1) / totalCount) * 100}%` }}
          />
        </div>

        {/* Question Reminder */}
        <p className="text-xs sm:text-sm text-zinc-300 font-medium max-w-sm mx-auto pt-0.5 line-clamp-2 italic">
          « {displayedQuestionText} »
        </p>
      </div>

      {/* ========================================================
          2. RESULT BANNER & COMPARATIVE CARDS
         ======================================================== */}
      <div className="flex-1 min-h-0 flex flex-col justify-center space-y-3.5 my-2">
        {/* Triumphant Yet Elegant Result Banner */}
        <div className="min-h-[64px] flex items-center justify-center">
          {!evaluationRevealed ? (
            <div className="w-full p-3 rounded-2xl ios-glass flex items-center justify-center gap-2 text-zinc-300 shadow-md">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '2.5s' }} />
              <span className="text-xs font-semibold">
                Révélation des réponses en direct...
              </span>
            </div>
          ) : isEffectiveMatch ? (
            <div className="w-full p-3.5 rounded-2xl border border-emerald-500/50 bg-gradient-to-r from-emerald-950/70 via-[#102a20]/80 to-emerald-950/70 text-emerald-200 flex items-center justify-center gap-3 shadow-xl shadow-emerald-950/50 animate-fade-in relative overflow-hidden backdrop-blur-xl">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400/50 shrink-0 shadow-inner">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <div className="text-left">
                <span className="font-display font-extrabold text-sm sm:text-base block text-white tracking-tight">
                  C'est un Match parfait ! 🎉
                </span>
                <span className="text-[11px] text-emerald-300/90 font-medium">
                  +1 point de complicité pour {guesserPlayer.name} !
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full p-3.5 rounded-2xl border border-amber-500/30 bg-[#16141a]/90 text-zinc-300 flex items-center justify-center gap-3 shadow-md backdrop-blur-xl animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/40 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="font-display font-bold text-sm block text-white">
                  Pas tout à fait pareil ! 🤔
                </span>
                <span className="text-[10px] text-zinc-400">
                  Débattez ou accordez le point si vous étiez d'accord sur le fond.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Distinct Comparative Floating Cards */}
        <div className="grid grid-cols-2 gap-3 text-left">
          {/* Card 1: Target Player (Sensual Rose Theme) */}
          <div className="perspective-1000 h-[135px] sm:h-[145px] w-full">
            <div
              className={`relative w-full h-full transition-transform duration-700 transform-style-3d cursor-pointer ${
                targetFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* Front Mystery */}
              <div className="backface-hidden absolute inset-0 w-full h-full rounded-[24px] ios-glass p-3.5 flex flex-col items-center justify-center shadow-lg border border-white/[0.08]">
                <div className="w-9 h-9 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-300 font-bold text-sm mb-1.5 shadow-inner animate-pulse">
                  ?
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-200">
                  <span>{targetPlayer.avatar}</span>
                  <span className="truncate">{targetPlayer.name}</span>
                </div>
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">
                  Réponse secrète
                </span>
              </div>

              {/* Back Revealed Answer */}
              <div className="backface-hidden rotate-y-180 absolute inset-0 w-full h-full rounded-[24px] bg-gradient-to-br from-rose-950/40 via-zinc-900/95 to-black border border-rose-500/40 p-3.5 flex flex-col justify-between shadow-xl backdrop-blur-xl">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-300 mb-1">
                    <span>{targetPlayer.avatar}</span>
                    <span className="truncate">{targetPlayer.name} a répondu :</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-3">
                    « {formatAnswer(targetAnswer)} »
                  </p>
                </div>
                <div className="flex items-center justify-between text-[9px] text-zinc-400 pt-1.5 border-t border-white/[0.06]">
                  <span>Réponse réelle</span>
                  <span className="text-rose-400 font-bold px-1.5 py-0.2 rounded bg-rose-500/15 border border-rose-500/30">
                    Authentique
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Guesser Player (Warm Amber/Coral Theme) */}
          <div className="perspective-1000 h-[135px] sm:h-[145px] w-full">
            <div
              className={`relative w-full h-full transition-transform duration-700 transform-style-3d cursor-pointer ${
                guesserFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* Front Mystery */}
              <div className="backface-hidden absolute inset-0 w-full h-full rounded-[24px] ios-glass p-3.5 flex flex-col items-center justify-center shadow-lg border border-white/[0.08]">
                <div className="w-9 h-9 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 font-bold text-sm mb-1.5 shadow-inner animate-pulse">
                  ?
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-200">
                  <span>{guesserPlayer.avatar}</span>
                  <span className="truncate">{guesserPlayer.name}</span>
                </div>
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">
                  Devinette
                </span>
              </div>

              {/* Back Revealed Answer */}
              <div
                className={`backface-hidden rotate-y-180 absolute inset-0 w-full h-full rounded-[24px] p-3.5 flex flex-col justify-between shadow-xl backdrop-blur-xl transition-all ${
                  evaluationRevealed && isEffectiveMatch
                    ? 'bg-gradient-to-br from-emerald-950/40 via-zinc-900/95 to-black border-2 border-emerald-400/80 ring-2 ring-emerald-500/20'
                    : 'bg-gradient-to-br from-amber-950/30 via-zinc-900/95 to-black border border-amber-500/40'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-300 mb-1">
                    <span>{guesserPlayer.avatar}</span>
                    <span className="truncate">{guesserPlayer.name} a deviné :</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-3">
                    « {formatAnswer(guesserAnswer)} »
                  </p>
                </div>
                <div className="flex items-center justify-between text-[9px] text-zinc-400 pt-1.5 border-t border-white/[0.06]">
                  <span>Pronostic</span>
                  {evaluationRevealed && (
                    <span
                      className={`font-bold px-1.5 py-0.2 rounded ${
                        isEffectiveMatch 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                          : 'bg-zinc-800 text-zinc-400'
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

        {/* Manual Override if disagreed */}
        {evaluationRevealed && !isAutoMatch && (
          <div className="pt-1 animate-fade-in">
            {!scoreAwarded ? (
              <button
                type="button"
                onClick={() => {
                  triggerMatchCelebration();
                  onConfirmMatch();
                }}
                className="w-full py-2.5 px-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-semibold text-zinc-200 hover:text-white flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
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
                className="text-xs text-zinc-400 hover:text-zinc-200 underline"
              >
                Annuler le point accordé
              </button>
            )}
          </div>
        )}
      </div>

      {/* ========================================================
          3. NEXT CTA BUTTON (Large Shimmering Button)
         ======================================================== */}
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
          className={`w-full h-14 rounded-2xl font-display font-bold text-sm sm:text-base shadow-xl transition-all flex items-center justify-center gap-2.5 active:scale-[0.98] ${
            isAdvancing
              ? 'bg-white/[0.05] text-zinc-500 cursor-not-allowed border border-white/[0.05]'
              : 'bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 text-white shadow-rose-950/60 hover:brightness-105 animate-shimmer cursor-pointer border border-white/20'
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

export default RevealCard;
