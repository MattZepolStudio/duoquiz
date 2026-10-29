import React from 'react';
import { 
  Trophy, 
  X, 
  Heart, 
  Sparkles, 
  RotateCw, 
  Check, 
  Smartphone, 
  ArrowRight,
  HelpCircle,
  Home,
  Target,
  Eye,
  Layers
} from 'lucide-react';
import { Player, RoundResult } from '../types/quiz';
import { sound } from '../utils/audio';
import { getFormattedQuestion } from '../utils/questionFormatter';

interface ScoreOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  player1: Player;
  player2: Player;
  currentManche?: number;
  currentRound?: number;
  totalRounds?: number;
  targetPlayer?: Player;
  guesserPlayer?: Player;
  history?: RoundResult[];
  isMultiplayer?: boolean;
  multiplayerCode?: string;
  onOpenRules: () => void;
  onRequestQuit: () => void;
}

export const ScoreOverviewModal: React.FC<ScoreOverviewModalProps> = ({
  isOpen,
  onClose,
  player1,
  player2,
  currentManche = 1,
  currentRound = 1,
  totalRounds = 5,
  targetPlayer,
  guesserPlayer,
  history = [],
  isMultiplayer = false,
  multiplayerCode,
  onOpenRules,
  onRequestQuit,
}) => {
  if (!isOpen) return null;

  const totalMatches = history.filter((h) => h.isMatch || h.agreedAnyway).length;
  const totalCompleted = history.length;
  const matchPercentage = totalCompleted > 0 ? Math.round((totalMatches / totalCompleted) * 100) : 0;
  const remainingInManche = Math.max(0, (totalRounds || 5) - (currentRound || 1) + 1);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/75 backdrop-blur-xl animate-fade-in select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          sound.playTap();
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#121217]/95 backdrop-blur-2xl border border-white/[0.08] rounded-[32px] w-full max-w-lg p-5 sm:p-6 text-zinc-100 shadow-2xl overflow-y-auto max-h-[90vh] flex flex-col space-y-4 animate-scale-up text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center shadow-md text-amber-300">
              <Trophy className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-display font-bold text-white flex items-center gap-1.5">
                <span>Tableau de Bord & Scores</span>
              </h3>
              <p className="text-[11px] text-zinc-400">
                Manche {currentManche} · Question {currentRound}/{totalRounds}
                {multiplayerCode && <span className="ml-1.5 text-rose-300 font-mono font-bold">· Salon {multiplayerCode}</span>}
              </p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center text-zinc-400 hover:text-white transition-colors active:scale-90"
            title="Fermer"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Score Duel Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Player 1 Card */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-xl shrink-0 shadow-sm">
              {player1.avatar}
            </span>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-amber-300 truncate block">
                {player1.name}
              </span>
              <span className="text-base font-extrabold text-white tabular-nums">
                {player1.score} <span className="text-[10px] text-zinc-400 font-normal">pts trouvés</span>
              </span>
            </div>
          </div>

          {/* Player 2 Card */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-xl shrink-0 shadow-sm">
              {player2.avatar}
            </span>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-rose-300 truncate block">
                {player2.name}
              </span>
              <span className="text-base font-extrabold text-white tabular-nums">
                {player2.score} <span className="text-[10px] text-zinc-400 font-normal">pts trouvés</span>
              </span>
            </div>
          </div>
        </div>

        {/* 2. Global Telepathy Gauge (if at least one round completed) */}
        {totalCompleted > 0 && (
          <div className="p-3.5 rounded-2xl ios-glass border border-white/[0.08] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                <span>Complicité globale :</span>
              </span>
              <span className="font-bold text-rose-300 tabular-nums">
                {matchPercentage}% ({totalMatches}/{totalCompleted} matchs)
              </span>
            </div>
            <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/[0.06]">
              <div 
                className="h-full bg-gradient-to-r from-rose-500 via-pink-400 to-amber-300 rounded-full transition-all duration-500"
                style={{ width: `${matchPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* 3. Current Manche State & Roles */}
        {targetPlayer && guesserPlayer && (
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider font-bold text-zinc-400">
              <span className="flex items-center gap-1.5 text-rose-300">
                <RotateCw className="w-3.5 h-3.5 text-amber-300" />
                <span>Rôles de la Manche {currentManche}</span>
              </span>
              <span className="text-zinc-400">
                {remainingInManche} restante{remainingInManche > 1 ? 's' : ''}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-0.5">
              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-0.5">
                <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1">
                  <Target className="w-3 h-3 text-rose-400" />
                  Répond en secret
                </span>
                <span className="font-bold text-white block truncate">
                  {targetPlayer.avatar} {targetPlayer.name}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-0.5">
                <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1">
                  <Eye className="w-3 h-3 text-amber-400" />
                  Tente de deviner
                </span>
                <span className="font-bold text-white block truncate">
                  {guesserPlayer.avatar} {guesserPlayer.name}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 4. Past Questions History Breakdown (if any) */}
        {history.length > 0 ? (
          <div className="space-y-2 pt-0.5">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
              Historique des questions ({history.length})
            </span>
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-0.5">
              {history.map((item, idx) => {
                const isMatch = item.isMatch || item.agreedAnyway;
                return (
                  <div 
                    key={idx}
                    className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-start justify-between gap-2.5 text-xs"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-start gap-1.5 font-semibold text-zinc-200">
                        <span className="text-[10px] text-zinc-500 font-mono shrink-0 mt-0.5">#{idx + 1}</span>
                        <span className="leading-snug">
                          {getFormattedQuestion(item.question, 'reveal', item.targetPlayer.name, item.guesserPlayer.name)}
                        </span>
                      </div>
                      <div className="space-y-0.5 text-[10px] text-zinc-400 pt-0.5">
                        <div className="flex items-start gap-1.5 leading-snug">
                          <span className="font-bold text-rose-300 shrink-0">{item.targetPlayer.name} :</span>
                          <span className="text-zinc-300 break-words">« {item.targetAnswer} »</span>
                        </div>
                        <div className="flex items-start gap-1.5 leading-snug">
                          <span className="font-bold text-amber-300 shrink-0">{item.guesserPlayer.name} :</span>
                          <span className="text-zinc-300 break-words">« {item.guesserAnswer} »</span>
                        </div>
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                      isMatch
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-white/[0.04] text-zinc-500 border border-white/[0.06]'
                    }`}>
                      {isMatch ? '✓' : '✕'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center text-xs text-zinc-400">
            Première manche en cours : les scores et comparaisons s'afficheront dès les premières révélations ! ✨
          </div>
        )}

        {/* 5. Action Buttons (Resume, Rules, Quit) */}
        <div className="space-y-2 pt-2">
          {/* Resume game */}
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="w-full h-13 rounded-full btn-sensual-cta text-white font-display font-bold text-sm flex items-center justify-center gap-2 shadow-xl active:scale-[0.98] animate-shimmer cursor-pointer"
          >
            <span>Continuer la partie</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </button>

          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => {
                sound.playTap();
                onClose();
                onOpenRules();
              }}
              className="h-10 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-zinc-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-white/[0.06] active:scale-95"
            >
              <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
              <span>Règles & Aide</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playTap();
                onClose();
                onRequestQuit();
              }}
              className="h-10 rounded-xl bg-white/[0.05] hover:bg-rose-500/15 text-zinc-300 hover:text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-white/[0.06] active:scale-95"
            >
              <Home className="w-3.5 h-3.5 text-rose-400" />
              <span>Quitter la partie</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ScoreOverviewModal;
