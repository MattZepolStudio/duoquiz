import React, { useState, useEffect } from 'react';
import { 
  Check, 
  HelpCircle, 
  Mic, 
  MicOff, 
  Sparkles, 
  Flame, 
  ArrowRight, 
  ArrowLeft, 
  Pencil, 
  RotateCcw,
  Sliders
} from 'lucide-react';
import { DifficultyLevel, Player, Question } from '../types/quiz';
import { sound } from '../utils/audio';
import { speechService } from '../utils/speech';
import { getFormattedQuestion } from '../utils/questionFormatter';

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  totalCount: number;
  activePlayer: Player;
  otherPlayer: Player;
  isGuesser: boolean;
  initialAnswer?: string;
  onNextQuestion: (answer: string, updatedOptions?: string[]) => void;
  onPrevQuestion?: () => void;
  canGoPrev: boolean;
  currentDifficulty: DifficultyLevel;
  onChangeDifficulty: (newDiff: DifficultyLevel) => void;
  onOptionsChange?: (updatedOptions: string[]) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentIndex,
  totalCount,
  activePlayer,
  otherPlayer,
  isGuesser,
  initialAnswer = '',
  onNextQuestion,
  onPrevQuestion,
  canGoPrev,
  currentDifficulty,
  onChangeDifficulty,
  onOptionsChange,
}) => {
  // 4 option cards
  const [options, setOptions] = useState<string[]>(question.options);
  const [selectedAnswer, setSelectedAnswer] = useState<string>(initialAnswer);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [customInputValue, setCustomInputValue] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showDifficultyMenu, setShowDifficultyMenu] = useState<boolean>(false);

  // Sync options when question changes
  useEffect(() => {
    setOptions(question.options);
    setSelectedAnswer(initialAnswer);
    setEditingIndex(null);
    setCustomInputValue('');
    setShowHint(false);
    setShowDifficultyMenu(false);
  }, [question.id, currentIndex, initialAnswer]);

  const handleSelectOption = (opt: string) => {
    sound.playTap();
    sound.vibrate(12);
    setSelectedAnswer(opt);
    setEditingIndex(null);
  };

  const handleStartEditingSlot = (slotIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playTap();
    setEditingIndex(slotIndex);
    setCustomInputValue(options[slotIndex] || '');
  };

  const handleCancelEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playTap();
    setEditingIndex(null);
    setCustomInputValue('');
  };

  const handleConfirmCustomSlot = (slotIndex: number) => {
    const trimmed = customInputValue.trim();
    if (!trimmed) return;
    sound.playTap();
    const updated = [...options];
    updated[slotIndex] = trimmed;
    setOptions(updated);
    setSelectedAnswer(trimmed);
    setEditingIndex(null);
    setCustomInputValue('');
    if (onOptionsChange) {
      onOptionsChange(updated);
    }
  };

  const handleStartMic = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playTap();
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
      return;
    }

    const started = speechService.startListening({
      onResult: (text) => {
        setCustomInputValue(text);
      },
      onError: (err) => {
        console.warn('Speech error:', err);
        setIsListening(false);
      },
      onEnd: () => {
        setIsListening(false);
      },
    });

    if (started) {
      setIsListening(true);
    }
  };

  const canProceed = selectedAnswer.trim().length > 0;
  const isLastQuestion = currentIndex === totalCount - 1;

  const displayedQuestionText = getFormattedQuestion(
    question,
    isGuesser ? 'guesser' : 'target',
    isGuesser ? otherPlayer.name : activePlayer.name,
    isGuesser ? activePlayer.name : otherPlayer.name
  );

  return (
    <div className="flex flex-col justify-between h-full max-h-full max-w-lg mx-auto w-full px-3 py-1.5 sm:px-4 sm:py-2.5 animate-fade-in overflow-hidden select-none">
      {/* Top Header & Progress */}
      <div className="shrink-0 space-y-1.5">
        {/* Progress Bar & Indicators */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg sm:text-xl shrink-0">{activePlayer.avatar}</span>
            <div className="min-w-0">
              <span className="text-xs font-bold text-white uppercase tracking-wider block truncate">
                {activePlayer.name}
              </span>
              <span className="text-[10px] text-zinc-400 block truncate">
                {isGuesser
                  ? `Devine les choix de ${otherPlayer.name}`
                  : 'Tes réponses secrètes'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Difficulty Badge with interactive change */}
            <div className="relative">
              {!isGuesser ? (
                <button
                  type="button"
                  onClick={() => {
                    sound.playTap();
                    setShowDifficultyMenu(!showDifficultyMenu);
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] sm:text-[11px] font-semibold text-zinc-300 active:scale-95 transition-all hover:border-zinc-700"
                  title="Changer la difficulté de cette question"
                >
                  {currentDifficulty === 'spicy' ? (
                    <span className="text-red-400 flex items-center gap-0.5">
                      <Flame className="w-2.5 h-2.5" /> Pimentée
                    </span>
                  ) : currentDifficulty === 'medium' ? (
                    <span className="text-amber-400">💫 Complice</span>
                  ) : (
                    <span className="text-rose-400">🌸 Douce</span>
                  )}
                  <Sliders className="w-2 h-2 text-zinc-500 ml-0.5" />
                </button>
              ) : (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] sm:text-[11px] font-semibold text-zinc-300">
                  {currentDifficulty === 'spicy' ? (
                    <span className="text-red-400 flex items-center gap-0.5">
                      <Flame className="w-2.5 h-2.5" /> Pimentée
                    </span>
                  ) : currentDifficulty === 'medium' ? (
                    <span className="text-amber-400">💫 Complice</span>
                  ) : (
                    <span className="text-rose-400">🌸 Douce</span>
                  )}
                </div>
              )}

              {/* Popover to adjust difficulty for THIS question */}
              {!isGuesser && showDifficultyMenu && (
                <div className="absolute right-0 top-7 z-30 w-32 bg-zinc-900 border border-zinc-700 rounded-xl p-1 shadow-2xl animate-fade-in space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playTap();
                      onChangeDifficulty('easy');
                      setShowDifficultyMenu(false);
                    }}
                    className={`w-full py-1 px-2 rounded-lg text-xs font-medium text-left flex items-center gap-1.5 ${
                      currentDifficulty === 'easy' ? 'bg-rose-500/20 text-rose-300 font-bold' : 'text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    <span>🌸</span> Douce
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playTap();
                      onChangeDifficulty('medium');
                      setShowDifficultyMenu(false);
                    }}
                    className={`w-full py-1 px-2 rounded-lg text-xs font-medium text-left flex items-center gap-1.5 ${
                      currentDifficulty === 'medium' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    <span>💫</span> Complice
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playTap();
                      onChangeDifficulty('spicy');
                      setShowDifficultyMenu(false);
                    }}
                    className={`w-full py-1 px-2 rounded-lg text-xs font-medium text-left flex items-center gap-1.5 ${
                      currentDifficulty === 'spicy' ? 'bg-red-500/20 text-red-300 font-bold' : 'text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    <span>🌶️</span> Pimentée
                  </button>
                </div>
              )}
            </div>

            {/* Counter */}
            <span className="text-[11px] font-bold text-zinc-400 tabular-nums px-2 py-0.5 bg-zinc-900/60 rounded-full border border-zinc-800">
              {currentIndex + 1}/{totalCount}
            </span>
          </div>
        </div>

        {/* Linear progress bar */}
        <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalCount) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 shadow-sm text-left">
          <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-0.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>
              {isGuesser
                ? `Que pense ${otherPlayer.name} ?`
                : 'Ta réponse personnelle :'}
            </span>
          </div>

          <h3 className="text-xs sm:text-sm md:text-base font-display font-bold text-white leading-snug">
            {displayedQuestionText}
          </h3>

          {question.hint && (
            <div className="mt-1.5 pt-1.5 border-t border-zinc-800/80">
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  setShowHint(!showHint);
                }}
                className="text-[10px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 font-medium"
              >
                <HelpCircle className="w-3 h-3 text-amber-400" />
                <span>{showHint ? 'Masquer l’indice' : 'Indice complice'}</span>
              </button>
              {showHint && (
                <p className="text-[10px] text-amber-200/90 mt-0.5 italic animate-fade-in">
                  💡 {question.hint}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Exactly 4 Options Grid (Compact & Flexible to fit any screen height) */}
      <div className="flex-1 min-h-0 flex flex-col justify-center gap-1.5 sm:gap-2 my-1">
        {options.slice(0, 4).map((opt, idx) => {
          const isSelected = selectedAnswer === opt;
          const isCurrentlyEditing = !isGuesser && editingIndex === idx;

          if (isCurrentlyEditing) {
            return (
              <div
                key={idx}
                className="w-full p-2.5 rounded-xl bg-zinc-900 border-2 border-rose-500 shadow-md animate-fade-in text-left space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px] font-semibold text-rose-300">
                  <span>Remplacer choix {String.fromCharCode(65 + idx)} :</span>
                  <button
                    type="button"
                    onClick={handleCancelEditing}
                    className="text-zinc-400 hover:text-white"
                  >
                    Annuler
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={customInputValue}
                    onChange={(e) => setCustomInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleConfirmCustomSlot(idx);
                    }}
                    placeholder="Tape ta propre réponse..."
                    className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-400"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleStartMic}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isListening
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-zinc-800 text-zinc-300 hover:text-white'
                    }`}
                    title="Dicter à la voix"
                  >
                    {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex justify-end pt-0.5">
                  <button
                    type="button"
                    onClick={() => handleConfirmCustomSlot(idx)}
                    disabled={!customInputValue.trim()}
                    className="px-3 py-1 rounded-lg bg-rose-500 text-white text-[11px] font-bold hover:bg-rose-600 disabled:opacity-40 transition-colors"
                  >
                    Valider ce choix
                  </button>
                </div>
              </div>
            );
          }

          // Normal option card
          return (
            <div
              key={idx}
              onClick={() => handleSelectOption(opt)}
              role="button"
              tabIndex={0}
              className={`w-full px-3 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl flex items-center justify-between text-left transition-all border cursor-pointer active:scale-[0.99] ${
                isSelected
                  ? 'bg-rose-500/20 border-rose-500 text-white shadow-md shadow-rose-950/40 ring-1 ring-rose-500'
                  : 'bg-zinc-900/70 border-zinc-800/80 text-zinc-200 hover:bg-zinc-850 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 pr-2 min-w-0 flex-1">
                <span className="w-5 h-5 rounded-full bg-zinc-800 text-[10px] font-bold text-zinc-400 flex items-center justify-center shrink-0 border border-zinc-700">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-xs sm:text-sm font-medium leading-snug break-words line-clamp-2">
                  {opt}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {!isGuesser && (
                  <button
                    type="button"
                    onClick={(e) => handleStartEditingSlot(idx, e)}
                    className="w-6 h-6 rounded-lg bg-zinc-800/70 hover:bg-zinc-700 text-zinc-400 hover:text-rose-300 flex items-center justify-center transition-colors"
                    title="Remplacer cette proposition par la mienne"
                    aria-label="Remplacer cette proposition"
                  >
                    <Pencil className="w-2.5 h-2.5" />
                  </button>
                )}

                <div
                  className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border transition-colors ${
                    isSelected
                      ? 'bg-rose-500 border-rose-500 text-white'
                      : 'border-zinc-700 bg-zinc-800'
                  }`}
                >
                  {isSelected && <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Navigation CTA Bar */}
      <div className="shrink-0 pt-1 pb-1 flex items-center gap-2">
        {canGoPrev && onPrevQuestion && (
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onPrevQuestion();
            }}
            className="h-11 sm:h-12 px-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center active:scale-95 transition-all"
            title="Question précédente"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          disabled={!canProceed}
          onClick={() => {
            if (canProceed) {
              sound.playTap();
              sound.vibrate(15);
              onNextQuestion(selectedAnswer, options);
            }
          }}
          className={`flex-1 h-11 sm:h-12 rounded-xl flex items-center justify-center gap-2 font-display font-bold text-xs sm:text-sm shadow-xl transition-all active:scale-[0.98] ${
            canProceed
              ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-rose-950/40 hover:opacity-95'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          }`}
        >
          {isGuesser ? (
            <>
              <span>Révéler la réponse de {otherPlayer.name} !</span>
              <Sparkles className="w-3.5 h-3.5" />
            </>
          ) : isLastQuestion ? (
            <span>Enregistrer toutes mes réponses ✅</span>
          ) : (
            <>
              <span>Question suivante</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
