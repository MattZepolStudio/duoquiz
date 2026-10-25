import React from 'react';
import { Sparkles, EyeOff, Brain, Heart, Flame } from 'lucide-react';
import { MultiplayerPlayer } from '../types/multiplayer';

interface MultiplayerWaitingScreenProps {
  partnerPlayer?: MultiplayerPlayer;
  myPlayer?: MultiplayerPlayer;
  waitingFor: 'target_answers' | 'guesser_turn';
  currentIndex: number;
  totalCount: number;
  isCoquin?: boolean;
}

const TEASERS_FOR_TARGET = [
  'Ne lorgne pas sur son écran ! Laisse la magie et le mystère opérer... 🤫',
  'Est-ce que ton amour va se souvenir de ce moment clé ? Suspens...',
  'Prépare-toi à être surpris(e) par ses réponses !',
  'Patience... Les meilleurs secrets prennent un instant à être rédigés ! 💖',
];

const TEASERS_FOR_GUESSER = [
  'Ton amour est en train de se creuser les méninges pour deviner ce que tu penses ! 🧠',
  'Va-t-il/elle trouver le bon choix ou se tromper magistralement ?',
  'Chaque bonne réponse rapporte des points de complicité !',
  'Observe bien son visage pendant qu\'il/elle hésite... 😂',
];

export const MultiplayerWaitingScreen: React.FC<MultiplayerWaitingScreenProps> = ({
  partnerPlayer,
  waitingFor,
  currentIndex,
  totalCount,
  isCoquin,
}) => {
  const partnerName = partnerPlayer?.name || 'Ton Amour';
  const partnerAvatar = partnerPlayer?.avatar || '🐱';

  const teasers = waitingFor === 'target_answers' ? TEASERS_FOR_TARGET : TEASERS_FOR_GUESSER;
  const teaser = teasers[currentIndex % teasers.length];

  const progressPercent = Math.min(100, Math.round(((currentIndex) / (totalCount || 1)) * 100));

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full max-w-lg mx-auto px-4 py-8 animate-fade-in text-center">
      {/* Animated Aura & Avatar */}
      <div className="relative mb-6">
        <div className={`w-28 h-28 rounded-3xl flex items-center justify-center text-5xl shadow-2xl relative z-10 border ${
          isCoquin 
            ? 'bg-gradient-to-br from-rose-900/60 to-red-950/80 border-rose-500/50 shadow-rose-950/60'
            : 'bg-gradient-to-br from-zinc-900 to-rose-950/40 border-rose-500/30 shadow-rose-950/50'
        }`}>
          <span className="animate-bounce" style={{ animationDuration: '2s' }}>
            {partnerAvatar}
          </span>
        </div>

        {/* Pulsing rings */}
        <div className="absolute inset-0 rounded-3xl bg-rose-500/20 blur-xl animate-pulse pointer-events-none" />
        <div className="absolute -inset-2 rounded-3xl border border-rose-500/30 animate-ping pointer-events-none opacity-20" style={{ animationDuration: '3s' }} />
      </div>

      {/* Status Badge */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold mb-3">
        {waitingFor === 'target_answers' ? (
          <>
            <EyeOff className="w-3.5 h-3.5" />
            <span>{partnerName} répond en secret</span>
          </>
        ) : (
          <>
            <Brain className="w-3.5 h-3.5" />
            <span>{partnerName} tente de deviner</span>
          </>
        )}
      </div>

      <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight">
        {waitingFor === 'target_answers' ? (
          <>
            Ne regarde pas ! <br />
            <span className="bg-gradient-to-r from-rose-400 to-pink-300 bg-clip-text text-transparent">
              {partnerName} est sur son écran...
            </span>
          </>
        ) : (
          <>
            Le grand test ! <br />
            <span className="bg-gradient-to-r from-rose-400 to-pink-300 bg-clip-text text-transparent">
              {partnerName} choisit sa réponse...
            </span>
          </>
        )}
      </h2>

      {/* Live Progress Bar */}
      <div className="w-full max-w-xs mt-6 bg-zinc-900/90 rounded-2xl p-4 border border-zinc-800 shadow-sm">
        <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold mb-2">
          <span>Progression en direct</span>
          <span className="text-rose-400 tabular-nums">
            Question {Math.min(totalCount, currentIndex + 1)} / {totalCount}
          </span>
        </div>
        <div className="w-full h-2.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
          <div
            className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Teaser Quote Card */}
      <div className="mt-6 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 max-w-xs text-xs text-zinc-300 leading-relaxed shadow-sm">
        <div className="flex items-center justify-center gap-1 text-rose-400 mb-1 font-bold">
          {isCoquin ? <Flame className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
          <span>Ambiance de couple</span>
        </div>
        « {teaser} »
      </div>
    </div>
  );
};
