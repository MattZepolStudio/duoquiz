import React from 'react';
import { Sparkles, EyeOff, Brain, Flame, HelpCircle } from 'lucide-react';
import { MultiplayerPlayer } from '../types/multiplayer';
import { Question } from '../types/quiz';
import { getFormattedQuestion } from '../utils/questionFormatter';

interface MultiplayerWaitingScreenProps {
  partnerPlayer?: MultiplayerPlayer;
  myPlayer?: MultiplayerPlayer;
  waitingFor: 'target_answers' | 'guesser_turn';
  currentIndex: number;
  totalCount: number;
  isCoquin?: boolean;
  currentQuestion?: Question;
  mySavedAnswer?: string;
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
  myPlayer,
  waitingFor,
  currentIndex,
  totalCount,
  isCoquin,
  currentQuestion,
  mySavedAnswer,
}) => {
  const partnerName = partnerPlayer?.name || 'Ton/Ta partenaire';
  const partnerAvatar = partnerPlayer?.avatar || '🐱';
  const myName = myPlayer?.name || 'Moi';

  const teasers = waitingFor === 'target_answers' ? TEASERS_FOR_TARGET : TEASERS_FOR_GUESSER;
  const teaser = teasers[currentIndex % teasers.length];
  const progressPercent = Math.min(100, Math.round(((currentIndex + 1) / (totalCount || 1)) * 100));

  const formattedQuestion = currentQuestion
    ? getFormattedQuestion(
        currentQuestion,
        waitingFor === 'target_answers' ? 'guesser' : 'target',
        waitingFor === 'target_answers' ? partnerName : myName,
        waitingFor === 'target_answers' ? myName : partnerName
      )
    : '';

  return (
    <div className="flex flex-col items-center justify-between flex-1 w-full max-w-lg mx-auto px-4 py-4 sm:py-6 animate-fade-in text-center select-none overflow-y-auto">
      {/* Top Header & Avatar */}
      <div className="shrink-0 flex flex-col items-center">
        <div className="relative mb-3">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-xl relative z-10 border ${
            isCoquin 
              ? 'bg-gradient-to-br from-rose-900/60 to-red-950/80 border-rose-500/50 shadow-rose-950/60'
              : 'bg-gradient-to-br from-zinc-900 to-rose-950/40 border-rose-500/30 shadow-rose-950/50'
          }`}>
            <span className="animate-bounce" style={{ animationDuration: '2s' }}>
              {partnerAvatar}
            </span>
          </div>
          <div className="absolute inset-0 rounded-2xl bg-rose-500/20 blur-lg animate-pulse pointer-events-none" />
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold mb-1">
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

        <h2 className="text-lg sm:text-xl font-display font-bold text-white tracking-tight">
          {waitingFor === 'target_answers' ? (
            <>
              Question posée à{' '}
              <span className="bg-gradient-to-r from-rose-400 to-pink-300 bg-clip-text text-transparent">
                {partnerName}
              </span>
            </>
          ) : (
            <>
              {partnerName} doit deviner{' '}
              <span className="bg-gradient-to-r from-rose-400 to-pink-300 bg-clip-text text-transparent">
                ton choix !
              </span>
            </>
          )}
        </h2>
      </div>

      {/* Live Question Card Display */}
      {currentQuestion && (
        <div className="w-full max-w-md my-auto py-3 px-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl text-left space-y-3 animate-fade-in backdrop-blur-sm">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">
            <span className="text-zinc-400">
              Question {Math.min(totalCount, currentIndex + 1)} sur {totalCount}
            </span>
            <span className="text-rose-400 font-bold px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20">
              {currentQuestion.category}
            </span>
          </div>

          <p className="text-sm sm:text-base font-display font-bold text-white leading-snug">
            {formattedQuestion}
          </p>

          {/* If waiting for guesser: show what the waiting target answered */}
          {waitingFor === 'guesser_turn' && mySavedAnswer && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-left">
              <div className="text-[10px] font-bold uppercase tracking-wider text-rose-300 mb-0.5">
                Ta réponse enregistrée :
              </div>
              <div className="text-white text-xs sm:text-sm font-semibold">
                « {mySavedAnswer} »
              </div>
            </div>
          )}

          {/* Subtext info */}
          <div className="pt-0.5 flex items-center gap-2 text-xs text-zinc-400">
            {waitingFor === 'target_answers' ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span className="italic text-[11px]">
                  {partnerName} choisit sa réponse en secret... Prépare-toi à deviner son choix !
                </span>
              </>
            ) : (
              <>
                <Brain className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
                <span className="text-amber-300/90 font-medium text-[11px]">
                  {partnerName} hésite... Trouvera-t-il/elle ta réponse ?
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Bottom Progress & Atmosphere Teaser */}
      <div className="shrink-0 w-full max-w-md space-y-3 pt-2">
        {/* Live Progress Bar */}
        <div className="w-full bg-zinc-900/90 rounded-2xl p-3 border border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold mb-1.5">
            <span>Progression en direct</span>
            <span className="text-rose-400 tabular-nums">
              {Math.min(totalCount, currentIndex + 1)} / {totalCount}
            </span>
          </div>
          <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Teaser Quote Card */}
        <div className="p-2.5 rounded-xl bg-zinc-900/40 border border-zinc-800/60 text-xs text-zinc-300 leading-relaxed shadow-sm">
          <div className="flex items-center justify-center gap-1 text-rose-400 mb-0.5 font-bold text-[11px]">
            {isCoquin ? <Flame className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
            <span>Ambiance complice</span>
          </div>
          <p className="italic text-[11px]">« {teaser} »</p>
        </div>
      </div>
    </div>
  );
};
