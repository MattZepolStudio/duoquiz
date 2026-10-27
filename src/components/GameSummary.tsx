import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Heart, 
  Sparkles, 
  RotateCcw, 
  Bot, 
  Flame, 
  Award, 
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

  const totalMatches = history.filter((r) => r.isMatch || r.agreedAnyway).length;
  const totalRounds = history.length;
  const matchPercentage = Math.round((totalMatches / (totalRounds || 1)) * 100);

  // Default fallback title based on score
  const getDefaultTitle = () => {
    if (isCoquin) {
      if (matchPercentage >= 85) return 'Couple Fusionnel & Incendiaire 🔥';
      if (matchPercentage >= 70) return 'Amants Complices & Passionnés 🌶️';
      if (matchPercentage >= 50) return 'Séducteurs & Joueurs Coquins 💋';
      return 'Chaleur & Mystères à Explorer 🎭';
    }
    if (matchPercentage >= 85) return 'Âmes Sœurs Télépathiques 🔮';
    if (matchPercentage >= 70) return 'Duo Fusionnel & Complice 💖';
    if (matchPercentage >= 50) return 'Duo Passion & Négociation 🌶️';
    return 'Mystérieux & Imprévisibles 🎭';
  };

  const getDefaultVerdict = () => {
    if (isCoquin) {
      if (matchPercentage >= 85) {
        return `Une osmose totale et une alchimie électrique ! Vous connaissez les moindres désirs de l'autre et votre complicité intime fait monter la température en flèche.`;
      }
      if (matchPercentage >= 70) {
        return `Magnifique entente sensuelle ! Vous savez parfaitement comment faire vibrer l'autre et ce quiz confirme que vous êtes sur la même longueur d'onde charnelle.`;
      }
      if (matchPercentage >= 50) {
        return `De très belles étincelles et quelques surprises inattendues ! Parfait pour alimenter la curiosité et explorer de nouveaux terrains intimes ensemble ce soir.`;
      }
      return `Une grande part de mystère subsiste entre vous... Une excuse idéale pour laisser parler vos corps et percer vos secrets les plus coquins sous la couette !`;
    }

    if (matchPercentage >= 85) {
      return `Incroyable ! Vous lisez dans les pensées de l'autre comme dans un livre ouvert. Votre complicité est évidente et vos souvenirs sont gravés au fer rouge.`;
    }
    if (matchPercentage >= 70) {
      return `Très belle performance ! Vous vous connaissez remarquablement bien au quotidien et vous savez exactement comment faire plaisir à l'autre.`;
    }
    if (matchPercentage >= 50) {
      return `Un équilibre parfait entre complicité et petites surprises ! Vous avez encore quelques mystères à percer, et c'est ce qui fait tout le piment de votre relation.`;
    }
    return `Visiblement, l'un de vous cache encore bien son jeu ! Une excellente excuse pour passer la soirée à refaire le monde et explorer vos secrets.`;
  };

  const handleRerollChallenge = () => {
    sound.playTap();
    setIsRollingGage(true);
    setAiGageActive(false);
    setTimeout(() => {
      setCurrentChallenge((prev) => getRandomChallenge(isCoquin, prev?.id));
      setIsRollingGage(false);
      sound.vibrate([20]);
    }, 250);
  };

  useEffect(() => {
    sound.playFanfare();
    sound.vibrate([30, 60, 30, 60]);
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.6 },
      colors: isCoquin 
        ? ['#f43f5e', '#e11d48', '#fb7185', '#fda4af', '#f59e0b']
        : ['#f43f5e', '#fb7185', '#fda4af', '#facc15', '#a855f7'],
    });
  }, [isCoquin]);

  // Reset loading states if connection is lost
  useEffect(() => {
    if (!isConnected) {
      setIsLaunchingNext(false);
      setIsRestarting(false);
    }
  }, [isConnected]);

  // Safety timeout to avoid frozen buttons if partner or server fails to respond
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
    const text = `On a fait ${matchPercentage}% de télépathie sur DuoQuiz ! Titre : ${activeTitle}`;
    if (navigator.share) {
      navigator.share({ title: 'DuoQuiz', text, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto w-full px-4 py-4 pb-24 animate-fade-in text-center">
      {/* Trophy & Score Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-950/60 via-zinc-900 to-zinc-950 border border-rose-500/30 p-6 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-rose-950/60 mb-3">
          <Trophy className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold text-rose-400 uppercase tracking-widest block">
          Score de Complicité
        </span>

        <h2 className="text-4xl font-display font-extrabold text-white mt-1">
          {matchPercentage}%
        </h2>

        <p className="text-sm font-semibold text-zinc-300 mt-1">
          {totalMatches} match(s) sur {totalRounds} questions
        </p>

        {/* Dynamic Couple Badge Title */}
        <div className="mt-4 inline-block px-4 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-300 font-display font-bold text-sm">
          {activeTitle}
        </div>
      </div>

      {/* Players Individual Scores */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{player1.avatar}</span>
            <span className="text-xs font-bold text-white truncate">{player1.name}</span>
          </div>
          <span className="text-lg font-bold text-rose-400 tabular-nums">
            {player1.score} <span className="text-xs text-zinc-400 font-normal">pts trouvés</span>
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{player2.avatar}</span>
            <span className="text-xs font-bold text-white truncate">{player2.name}</span>
          </div>
          <span className="text-lg font-bold text-pink-400 tabular-nums">
            {player2.score} <span className="text-xs text-zinc-400 font-normal">pts trouvés</span>
          </span>
        </div>
      </div>

      {/* Cupid AI / Verdict Box */}
      <div className="p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 text-left space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <h3 className="font-display font-bold text-sm text-white">
              Le Verdict de Cupidon
            </h3>
          </div>
          {!aiVerdict && (
            <button
              onClick={handleAskCupidAi}
              disabled={isLoadingAi}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 active:scale-95"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>{isLoadingAi ? 'Analyse...' : 'Analyse Gemini ✨'}</span>
            </button>
          )}
        </div>

        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
          « {activeVerdict} »
        </p>

        {/* Love Challenge / Gage d'Amour */}
        <div className={`p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
          isCoquin 
            ? 'bg-gradient-to-br from-red-950/60 via-rose-950/40 to-zinc-950 border-rose-500/40 shadow-lg shadow-rose-950/40' 
            : 'bg-gradient-to-br from-rose-950/40 via-pink-950/20 to-zinc-950 border-rose-500/25'
        }`}>
          {/* Header Tag & Reroll Button */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {isCoquin ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-red-500/20 text-red-300 border border-red-500/40">
                  <Flame className="w-3 h-3 text-red-400 fill-red-400 animate-pulse" />
                  Gage Coquin & Intimité
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  <Sparkles className="w-3 h-3 text-rose-400" />
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

            {/* Reroll Gage button */}
            <button
              onClick={handleRerollChallenge}
              disabled={isRollingGage}
              className="text-xs px-2.5 py-1 rounded-xl bg-zinc-800/90 hover:bg-zinc-700/90 text-zinc-200 border border-zinc-700 flex items-center gap-1.5 active:scale-95 transition-all shadow-sm font-semibold shrink-0"
              title="Tirer un autre gage au hasard"
            >
              <Dices className={`w-3.5 h-3.5 text-rose-400 ${isRollingGage ? 'animate-spin' : ''}`} />
              <span>Changer 🎲</span>
            </button>
          </div>

          {/* Title & Description */}
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

      {/* Round-by-Round Breakdown Accordion */}
      <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800/80 p-4 text-left">
        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
          Historique des manches
        </h4>
        <div className="space-y-2.5">
          {history.map((item, idx) => {
            const isSuccess = item.isMatch || item.agreedAnyway;
            return (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-850 flex items-start justify-between gap-3"
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
                      <strong className="text-zinc-300">{item.targetPlayer.name} :</strong> « {item.targetAnswer} »
                    </span>
                    <span>·</span>
                    <span>
                      <strong className="text-zinc-300">{item.guesserPlayer.name} :</strong> « {item.guesserAnswer} »
                    </span>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isSuccess
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                  }`}
                >
                  {isSuccess ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Share button */}
      <button
        onClick={handleShare}
        className="w-full py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white flex items-center justify-center gap-2 active:scale-95"
      >
        <Share2 className="w-4 h-4 text-rose-400" />
        <span>{copiedLink ? 'Copié dans le presse-papier !' : 'Partager notre score de couple'}</span>
      </button>

      {/* Multiplayer Disconnection Banner */}
      {isMultiplayer && !isConnected && (
        <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-left flex items-center justify-between gap-3 animate-fade-in shadow-lg">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl shrink-0">⚠️</span>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">Connexion multijoueur coupée</div>
              <div className="text-[11px] text-amber-200/90 leading-tight">
                {isReconnecting ? 'Reconnexion automatique...' : 'Un souci réseau est survenu.'}
              </div>
            </div>
          </div>
          {onReconnect && (
            <button
              type="button"
              onClick={() => {
                sound.playTap();
                onReconnect();
              }}
              disabled={isReconnecting}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-200 text-xs font-semibold active:scale-95 transition-all shrink-0 flex items-center gap-1.5"
            >
              {isReconnecting ? (
                <>
                  <div className="w-3 h-3 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                  <span>En cours...</span>
                </>
              ) : (
                <span>Réessayer 🔄</span>
              )}
            </button>
          )}
        </div>
      )}

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
            className={`w-full h-14 rounded-2xl font-display font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
              isLaunchingNext
                ? 'bg-zinc-800 text-zinc-400 border border-zinc-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white shadow-rose-950/50 hover:brightness-105'
            }`}
          >
            {isLaunchingNext ? (
              <>
                <div className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                <span>Lancement de la manche {nextMancheNumber || 2}...</span>
              </>
            ) : (
              <>
                <span>Lancer la manche {nextMancheNumber || 2} ({nextTargetName || 'Partenaire'})</span>
                <ArrowRight className="w-5 h-5" />
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
            className="h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-white font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 hover:bg-zinc-850"
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
            className="h-12 rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-850 border border-rose-500/30 text-white font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 hover:border-rose-500/50"
          >
            <Home className="w-4 h-4 text-rose-400" />
            <span>Menu Principal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
