import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Heart, 
  Sparkles, 
  RotateCcw, 
  Bot, 
  Flame, 
  Check, 
  X,
  Share2,
  ArrowRight,
  Dices,
  Home
} from 'lucide-react';
import { CategoryId, CoupleVerdict, Player, RoundResult } from '../types/quiz';
import { sound } from '../utils/audio';
import { getFormattedQuestion } from '../utils/questionFormatter';
import { getRandomChallenge, LoveChallenge } from '../data/challenges';

interface GameSummaryProps {
  player1: Player;
  player2: Player;
  history: RoundResult[];
  onRestart: () => void;
  onNewGameSetup: () => void;
  onNextManche?: () => void;
  nextMancheNumber?: number;
  nextTargetName?: string;
  selectedCategories?: CategoryId[];
  isMultiplayer?: boolean;
  isConnected?: boolean;
  isReconnecting?: boolean;
  onReconnect?: () => void;
}

export const GameSummary: React.FC<GameSummaryProps> = ({
  player1,
  player2,
  history,
  onRestart,
  onNewGameSetup,
  onNextManche,
  nextMancheNumber,
  nextTargetName,
  selectedCategories = [],
  isMultiplayer = false,
  isConnected = true,
  isReconnecting = false,
  onReconnect,
}) => {
  const isCoquin = selectedCategories.includes('coquin');
  const [aiVerdict, setAiVerdict] = useState<CoupleVerdict | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [currentChallenge, setCurrentChallenge] = useState<LoveChallenge>(() => getRandomChallenge(isCoquin));
  const [isRollingGage, setIsRollingGage] = useState<boolean>(false);
  const [aiGageActive, setAiGageActive] = useState<boolean>(false);
  const [isLaunchingNext, setIsLaunchingNext] = useState<boolean>(false);
  const [isRestarting, setIsRestarting] = useState<boolean>(false);

  const totalMatches = history.filter((h) => h.isMatch || h.agreedAnyway).length;
  const totalRounds = history.length;
  const matchPercentage = totalRounds > 0 ? Math.round((totalMatches / totalRounds) * 100) : 0;

  const getDefaultTitle = () => {
    if (matchPercentage >= 85) return 'Âmes Sœurs & Télépathie Absolue 💖';
    if (matchPercentage >= 65) return 'Couple Fusionnel & Complice ✨';
    if (matchPercentage >= 40) return 'Amour Pétillant & Mystères à Explorer 🔥';
    return 'Duo Complice en Pleine Découverte 🌱';
  };

  const getDefaultVerdict = () => {
    if (matchPercentage >= 85) {
      return `Incroyable connexion ! ${player1.name} et ${player2.name} se lisent comme dans un livre ouvert. Votre complicité est exceptionnelle !`;
    }
    if (matchPercentage >= 65) {
      return `Une très belle symbiose ! Vous vous connaissez très bien tout en gardant quelques surprises captivantes pour entretenir la flamme.`;
    }
    if (matchPercentage >= 40) {
      return `Un bel équilibre entre affinités et univers propres. Vous avez encore de délicieux territoires à explorer ensemble !`;
    }
    return `Chaque jour est une découverte mutuelle ! Continuez d'échanger et de vous écouter pour nourrir votre flamme.`;
  };

  const handleRerollChallenge = () => {
    sound.playTap();
    setIsRollingGage(true);
    setAiGageActive(false);
    setTimeout(() => {
      setCurrentChallenge(getRandomChallenge(isCoquin));
      setIsRollingGage(false);
      sound.vibrate([20]);
    }, 250);
  };

  useEffect(() => {
    sound.playFanfare();
    sound.vibrate([30, 60, 30, 60]);
    confetti({
      particleCount: 85,
      spread: 85,
      origin: { y: 0.6 },
      colors: isCoquin 
        ? ['#f43f5e', '#e11d48', '#fb7185', '#fda4af', '#f59e0b']
        : ['#f43f5e', '#fb7185', '#fda4af', '#facc15', '#a855f7'],
    });
  }, [isCoquin]);

  useEffect(() => {
    if (!isConnected) {
      setIsLaunchingNext(false);
      setIsRestarting(false);
    }
  }, [isConnected]);

  useEffect(() => {
    if (isLaunchingNext) {
      const timer = setTimeout(() => setIsLaunchingNext(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [isLaunchingNext]);

  useEffect(() => {
    if (isRestarting) {
      const timer = setTimeout(() => setIsRestarting(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [isRestarting]);

  const handleAskCupidAi = async () => {
    setIsLoadingAi(true);
    sound.playTap();

    try {
      const matched = history.filter((h) => h.isMatch || h.agreedAnyway);
      const mismatched = history.filter((h) => !h.isMatch && !h.agreedAnyway);

      const res = await fetch('/api/gemini/couple-verdict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player1: player1.name,
          player2: player2.name,
          score: totalMatches,
          totalQuestions: totalRounds,
          isCoquin,
          matchedQuestions: matched.map((m) => ({
            question: m.question.question,
            answer: m.targetAnswer,
          })),
          mismatchedQuestions: mismatched.map((m) => ({
            question: m.question.question,
            p1Answer: m.targetAnswer,
            p2Answer: m.guesserAnswer,
          })),
        }),
      });

      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      setAiVerdict(data);
      setAiGageActive(true);
      sound.playSuccess();
      confetti({ particleCount: 50, spread: 60 });
    } catch (e) {
      console.warn('AI verdict fallback:', e);
      setAiVerdict({
        coupleTitle: getDefaultTitle(),
        verdict: getDefaultVerdict(),
        loveChallenge: currentChallenge.description,
      });
    } finally {
      setIsLoadingAi(false);
    }
  };

  const activeTitle = aiVerdict?.coupleTitle || getDefaultTitle();
  const activeVerdict = aiVerdict?.verdict || getDefaultVerdict();

  const handleShare = () => {
    sound.playTap();
    const text = `On a fait ${matchPercentage}% de télépathie sur ParCœur ! Titre : ${activeTitle}`;
    if (navigator.share) {
      navigator.share({ title: 'ParCœur', text, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-16 pt-2 max-w-lg mx-auto w-full px-4 animate-fade-in relative z-10 select-none">
      
      {/* 1. Main Telepathy Score Hero Card */}
      <div className="relative overflow-hidden rounded-[30px] ios-glass p-6 text-center shadow-2xl border border-white/[0.08]">
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-[22px] bg-gradient-to-tr from-rose-500 via-rose-600 to-amber-500 flex items-center justify-center text-white mx-auto shadow-xl shadow-rose-950/60 mb-3 border border-white/20">
          <Trophy className="w-8 h-8" />
        </div>

        <span className="text-[10px] font-bold text-rose-300 uppercase tracking-widest block">
          Score de Complicité
        </span>

        <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-white mt-1 tracking-tight">
          {matchPercentage}%
        </h2>

        <p className="text-xs sm:text-sm text-zinc-300/90 mt-1 font-medium">
          {totalMatches} match(s) complice(s) sur {totalRounds} questions
        </p>

        {/* Dynamic Title Badge */}
        <div className="mt-4 inline-block px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-rose-200 font-display font-bold text-xs sm:text-sm shadow-sm backdrop-blur-md">
          {activeTitle}
        </div>
      </div>

      {/* 2. Players Individual Comparison Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-[24px] ios-glass text-left border border-white/[0.08]">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-2xl">{player1.avatar}</span>
            <span className="text-xs font-bold text-white truncate">{player1.name}</span>
          </div>
          <span className="text-lg font-bold text-amber-300 tabular-nums">
            {player1.score} <span className="text-xs text-zinc-400 font-normal">pts trouvés</span>
          </span>
        </div>

        <div className="p-4 rounded-[24px] ios-glass text-left border border-white/[0.08]">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-2xl">{player2.avatar}</span>
            <span className="text-xs font-bold text-white truncate">{player2.name}</span>
          </div>
          <span className="text-lg font-bold text-rose-300 tabular-nums">
            {player2.score} <span className="text-xs text-zinc-400 font-normal">pts trouvés</span>
          </span>
        </div>
      </div>

      {/* 3. Cupid AI / Verdict Box */}
      <div className="p-5 rounded-[28px] ios-glass text-left space-y-3.5 shadow-xl border border-white/[0.08]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            <h3 className="font-display font-bold text-sm text-white">
              Le Verdict de Cupidon
            </h3>
          </div>
          {!aiVerdict && (
            <button
              onClick={handleAskCupidAi}
              disabled={isLoadingAi}
              className="text-xs text-rose-300 hover:text-white font-semibold flex items-center gap-1 active:scale-95 transition-colors px-2.5 py-1 rounded-xl bg-white/[0.05] border border-white/[0.08]"
            >
              <Bot className="w-3.5 h-3.5 text-amber-300" />
              <span>{isLoadingAi ? 'Analyse...' : 'Analyse Gemini ✨'}</span>
            </button>
          )}
        </div>

        <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed italic bg-black/30 p-3.5 rounded-2xl border border-white/[0.06]">
          « {activeVerdict} »
        </p>

        {/* Love Challenge Card */}
        <div className={`p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
          isCoquin 
            ? 'bg-gradient-to-br from-rose-950/40 via-red-950/30 to-black border-rose-500/40 shadow-xl' 
            : 'bg-black/40 border-white/[0.08]'
        }`}>
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {isCoquin ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  <Flame className="w-3 h-3 text-rose-400 fill-rose-400 animate-pulse" />
                  Gage Coquin & Intimité
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/[0.06] text-rose-300 border border-rose-500/30">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  Gage Complice & Tendresse
                </span>
              )}

              {aiGageActive && aiVerdict?.loveChallenge ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                  Cupidon AI ✨
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-zinc-400">
                  {isCoquin ? '🌶️'.repeat(currentChallenge.intensity) : '💖'.repeat(currentChallenge.intensity)}
                </span>
              )}
            </div>

            <button
              onClick={handleRerollChallenge}
              disabled={isRollingGage}
              className="text-xs px-2.5 py-1 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200 border border-white/[0.08] flex items-center gap-1.5 active:scale-95 transition-all shadow-sm font-semibold shrink-0"
              title="Tirer un autre gage"
            >
              <Dices className={`w-3.5 h-3.5 text-rose-400 ${isRollingGage ? 'animate-spin' : ''}`} />
              <span>Changer 🎲</span>
            </button>
          </div>

          <div className={`transition-opacity duration-200 ${isRollingGage ? 'opacity-30' : 'opacity-100'}`}>
            <h4 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
              <span>💌</span>
              <span>
                {aiGageActive && aiVerdict?.loveChallenge
                  ? 'Gage sur-mesure pour vous deux'
                  : currentChallenge.title}
              </span>
            </h4>

            <p className="text-xs sm:text-sm font-medium text-rose-100/95 leading-relaxed">
              {aiGageActive && aiVerdict?.loveChallenge
                ? aiVerdict.loveChallenge
                : currentChallenge.description}
            </p>

            {(!aiGageActive || !aiVerdict?.loveChallenge) && currentChallenge.penaltyHint && (
              <p className="text-[11px] text-zinc-400 mt-2 italic flex items-center gap-1">
                <span>💡</span>
                <span>{currentChallenge.penaltyHint}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 4. Round Breakdown */}
      <div className="rounded-[28px] ios-glass p-4 text-left border border-white/[0.08]">
        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
          Historique des questions
        </h4>
        <div className="space-y-2">
          {history.map((item, idx) => {
            const isSuccess = item.isMatch || item.agreedAnyway;
            return (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-black/35 border border-white/[0.06] flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-zinc-500 font-mono font-bold">
                      #{idx + 1}
                    </span>
                    <span className="font-semibold text-zinc-200">
                      {getFormattedQuestion(item.question, 'reveal', item.targetPlayer.name, item.guesserPlayer.name)}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 flex flex-wrap gap-2">
                    <span>
                      <strong className="text-rose-300">{item.targetPlayer.name} :</strong> « {item.targetAnswer} »
                    </span>
                    <span>·</span>
                    <span>
                      <strong className="text-amber-300">{item.guesserPlayer.name} :</strong> « {item.guesserAnswer} »
                    </span>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isSuccess
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-white/[0.05] text-zinc-500 border border-white/[0.08]'
                  }`}
                >
                  {isSuccess ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <X className="w-3.5 h-3.5" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Share Button */}
      <button
        onClick={handleShare}
        className="w-full py-3.5 rounded-2xl ios-glass border border-white/[0.08] text-xs font-semibold text-zinc-300 hover:text-white flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
      >
        <Share2 className="w-4 h-4 text-rose-400" />
        <span>{copiedLink ? 'Copié dans le presse-papier !' : 'Partager notre score de couple'}</span>
      </button>

      {/* Action Buttons in Thumb Zone */}
      <div className="space-y-2.5 pt-2">
        {onNextManche && (
          <button
            type="button"
            disabled={isLaunchingNext}
            onClick={() => {
              if (isLaunchingNext) return;
              setIsLaunchingNext(true);
              sound.playTap();
              sound.vibrate(20);
              onNextManche();
            }}
            className={`w-full h-15 rounded-full font-display font-bold text-base text-white transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
              isLaunchingNext
                ? 'bg-white/[0.05] text-zinc-500 cursor-not-allowed border border-white/[0.05] rounded-full'
                : 'btn-sensual-cta animate-shimmer cursor-pointer'
            }`}
          >
            {isLaunchingNext ? (
              <span>Lancement de la manche...</span>
            ) : (
              <>
                <span>Lancer la manche {nextMancheNumber || 2} ({nextTargetName || 'Partenaire'})</span>
                <ArrowRight className="w-5 h-5 ml-1" />
              </>
            )}
          </button>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={isRestarting}
            onClick={() => {
              if (isRestarting) return;
              setIsRestarting(true);
              sound.playTap();
              onRestart();
            }}
            className="h-12 rounded-2xl ios-glass border border-white/[0.08] text-white font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 hover:bg-white/[0.08] transition-all"
          >
            <RotateCcw className={`w-4 h-4 text-zinc-400 ${isRestarting ? 'animate-spin' : ''}`} />
            <span>{isRestarting ? 'Relance...' : 'Rejouer'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onNewGameSetup();
            }}
            className="h-12 rounded-2xl ios-glass border border-white/[0.08] text-white font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 hover:bg-white/[0.08] transition-all"
          >
            <Home className="w-4 h-4 text-rose-400" />
            <span>Menu Principal</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameSummary;
