import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
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
  Sliders,
  X,
  AlertCircle
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
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showQuickValidation = (msg: string) => {
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }
    setValidationMessage(msg);
    validationTimeoutRef.current = setTimeout(() => {
      setValidationMessage(null);
    }, 3500);
  };

  // Sync options when question changes
  useEffect(() => {
    setOptions(question.options);
    setSelectedAnswer(initialAnswer);
    setEditingIndex(null);
    setCustomInputValue('');
    setShowHint(false);
    setShowDifficultyMenu(false);
    setValidationMessage(null);
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }
  }, [question.id, currentIndex, initialAnswer]);

  useEffect(() => {
    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (editingIndex !== null) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [editingIndex]);

  const handleSelectOption = (opt: string) => {
    sound.playTap();
    sound.vibrate(12);
    setSelectedAnswer(opt);
    setEditingIndex(null);
    setValidationMessage(null);
  };

  const handleStartEditingSlot = (slotIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playTap();
    setEditingIndex(slotIndex);
    setCustomInputValue(options[slotIndex] || '');
    setValidationMessage(null);
  };

  const handleCancelEditing = (e?: React.SyntheticEvent) => {
    if (e) e.stopPropagation();
    sound.playTap();
    setEditingIndex(null);
    setCustomInputValue('');
    setValidationMessage(null);
  };

  const handleClearCustomInput = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playTap();
    setCustomInputValue('');
    inputRef.current?.focus();
    showQuickValidation("Réponse supprimée. Tape ta nouvelle réponse ou clique sur Annuler.");
  };

  const handleConfirmCustomSlot = (slotIndex: number) => {
    const trimmed = customInputValue.trim();
    if (!trimmed) {
      sound.vibrate(50);
      showQuickValidation("La proposition ne peut pas être vide ! Saisis une réponse.");
      inputRef.current?.focus();
      return;
    }
    sound.playTap();
    const updated = [...options];
    updated[slotIndex] = trimmed;
    setOptions(updated);
    setSelectedAnswer(trimmed);
    setEditingIndex(null);
    setCustomInputValue('');
    setValidationMessage(null);
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

  const formatOptionText = (text: string) => {
    const targetName = isGuesser ? otherPlayer.name : activePlayer.name;
    const partnerName = isGuesser ? activePlayer.name : otherPlayer.name;

    return text
      .replace(/\{partner\}/g, partnerName)
      .replace(/\{target\}/g, targetName)
      .replace(/\{guesser\}/g, partnerName)
      .replace(/\bchez moi\b/gi, 'à la maison')
      .replace(/\bToi sans hésiter\b/gi, `${targetName} sans hésiter`)
      .replace(/\bToi clairement\b/gi, `${targetName} clairement`)
      .replace(/\bToi\b/g, targetName)
      .replace(/\bMoi\b/g, targetName);
  };

  const handleNextClick = () => {
    // If user is currently editing a slot
    if (editingIndex !== null) {
      const trimmed = customInputValue.trim();
      if (!trimmed) {
        sound.vibrate(50);
        showQuickValidation("La réponse est vide ! Tape une proposition ou clique sur Annuler.");
        inputRef.current?.focus();
        return;
      }
      sound.vibrate(50);
      showQuickValidation("Valide d'abord ta réponse avec 'Valider ce choix'.");
      return;
    }

    if (!selectedAnswer.trim()) {
      sound.vibrate(50);
      showQuickValidation("Merci de sélectionner ou renseigner une réponse pour continuer !");
      return;
    }

    sound.playTap();
    sound.vibrate(15);
    setValidationMessage(null);
    onNextQuestion(selectedAnswer, options);
  };

  return (
    <div className="flex flex-col justify-between h-full max-h-full max-w-lg mx-auto w-full px-4 pt-2 pb-5 sm:pb-7 animate-fade-in overflow-hidden select-none">
      {/* Top Header & Progress */}
      <div className="shrink-0 space-y-2">
        {/* Progress Bar & Indicators */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl shrink-0">{activePlayer.avatar}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-xs font-bold text-white uppercase tracking-wider block truncate">
                  {activePlayer.name}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 font-semibold shrink-0">
                  {isGuesser ? 'Devine' : 'Répond'}
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 block truncate">
                {isGuesser
                  ? `Devine ce qu'a choisi ${otherPlayer.name}`
                  : 'Tes réponses secrètes sur toi'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Difficulty Badge with interactive change */}
            <div className="relative">
              {!isGuesser ? (
                <button
                  type="button"
                  onClick={() => {
                    sound.playTap();
                    setShowDifficultyMenu(!showDifficultyMenu);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] sm:text-xs font-semibold text-zinc-300 active:scale-95 transition-all hover:border-zinc-700 shadow-sm"
                  title="Changer la difficulté de cette question"
                >
                  {currentDifficulty === 'spicy' ? (
                    <span className="text-red-400 flex items-center gap-0.5">
                      <Flame className="w-3 h-3" /> Pimentée
                    </span>
                  ) : currentDifficulty === 'medium' ? (
                    <span className="text-amber-400">💫 Complice</span>
                  ) : (
                    <span className="text-rose-400">🌸 Douce</span>
                  )}
                  <Sliders className="w-2.5 h-2.5 text-zinc-500 ml-0.5" />
                </button>
              ) : (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] sm:text-xs font-semibold text-zinc-300">
                  {currentDifficulty === 'spicy' ? (
                    <span className="text-red-400 flex items-center gap-0.5">
                      <Flame className="w-3 h-3" /> Pimentée
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
                <div className="absolute right-0 top-8 z-30 w-36 bg-zinc-900 border border-zinc-700 rounded-xl p-1 shadow-2xl animate-fade-in space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playTap();
                      onChangeDifficulty('easy');
                      setShowDifficultyMenu(false);
                    }}
                    className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-medium text-left flex items-center gap-1.5 ${
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
                    className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-medium text-left flex items-center gap-1.5 ${
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
                    className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-medium text-left flex items-center gap-1.5 ${
                      currentDifficulty === 'spicy' ? 'bg-red-500/20 text-red-300 font-bold' : 'text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    <span>🌶️</span> Pimentée
                  </button>
                </div>
              )}
            </div>

            {/* Counter */}
            <span className="text-xs font-bold text-zinc-400 tabular-nums px-2.5 py-0.5 bg-zinc-900/80 rounded-full border border-zinc-800">
              {currentIndex + 1}/{totalCount}
            </span>
          </div>
        </div>

        {/* Linear progress bar */}
        <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalCount) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 10, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800/90 shadow-sm text-left"
        >
          <div className="text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-rose-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {isGuesser
                  ? `🔮 ${activePlayer.name}, devine le choix de ${otherPlayer.name} :`
                  : `🎯 ${activePlayer.name}, à toi de répondre pour toi :`}
              </span>
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-display font-bold text-white leading-snug">
            {displayedQuestionText}
          </h3>

          <div className="mt-1 flex items-center gap-1 text-[11px]">
            {isGuesser ? (
              <span className="text-amber-300/90 font-medium">
                💡 Choisis ce que {otherPlayer.name} a répondu en secret.
              </span>
            ) : (
              <span className="text-zinc-400 italic">
                🔒 Réponds sincèrement. {otherPlayer.name} tentera ensuite de deviner ton choix.
              </span>
            )}
          </div>

          {question.hint && (
            <div className="mt-2 pt-2 border-t border-zinc-800/80">
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  setShowHint(!showHint);
                }}
                className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 font-medium"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>{showHint ? 'Masquer l’indice' : 'Indice complice'}</span>
              </button>
              {showHint && (
                <p className="text-xs text-amber-200/90 mt-1 italic animate-fade-in">
                  💡 {question.hint}
                </p>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Exactly 4 Options Grid (Comfortable height & touch targets) */}
      <div className="flex-1 min-h-0 flex flex-col justify-center gap-2.5 sm:gap-3.5 my-2 sm:my-3">
        {options.slice(0, 4).map((opt, idx) => {
          const isSelected = selectedAnswer === opt;
          const isCurrentlyEditing = !isGuesser && editingIndex === idx;

          if (isCurrentlyEditing) {
            return (
              <div
                key={idx}
                className="w-full p-3 rounded-2xl bg-zinc-900 border-2 border-rose-500 shadow-md animate-fade-in text-left space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-rose-300">
                  <span>Remplacer choix {String.fromCharCode(65 + idx)} :</span>
                  <button
                    type="button"
                    onClick={handleCancelEditing}
                    className="text-zinc-400 hover:text-white"
                  >
                    Annuler
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1 flex items-center">
                    <input
                      ref={inputRef}
                      type="text"
                      value={customInputValue}
                      onChange={(e) => setCustomInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleConfirmCustomSlot(idx);
                        if (e.key === 'Escape') handleCancelEditing(e);
                      }}
                      placeholder="Tape ta propre réponse..."
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl pl-3 pr-9 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-400"
                      autoFocus
                    />
                    {customInputValue.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearCustomInput}
                        className="absolute right-2 w-6 h-6 rounded-full bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 flex items-center justify-center transition-all active:scale-90"
                        title="Supprimer la réponse"
                        aria-label="Supprimer la réponse"
                      >
                        <X className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleStartMic}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isListening
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-zinc-800 text-zinc-300 hover:text-white'
                    }`}
                    title="Dicter à la voix"
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-0.5">
                  {options[idx] !== question.options[idx] ? (
                    <button
                      type="button"
                      onClick={() => {
                        sound.playTap();
                        const updated = [...options];
                        updated[idx] = question.options[idx];
                        setOptions(updated);
                        setCustomInputValue(question.options[idx]);
                        if (selectedAnswer === options[idx]) {
                          setSelectedAnswer(question.options[idx]);
                        }
                        if (onOptionsChange) {
                          onOptionsChange(updated);
                        }
                      }}
                      className="text-[11px] text-zinc-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
                      title="Rétablir la proposition par défaut de la question"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Rétablir le choix d'origine</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  <button
                    type="button"
                    onClick={() => handleConfirmCustomSlot(idx)}
                    disabled={!customInputValue.trim()}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 disabled:opacity-40 transition-colors"
                  >
                    Valider ce choix
                  </button>
                </div>
              </div>
            );
          }

          // Normal option card
          return (
            <motion.div
              key={`${question.id}_opt_${idx}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: idx * 0.035, ease: 'easeOut' }}
              whileTap={{ scale: 0.985 }}
              onClick={() => handleSelectOption(opt)}
              role="button"
              tabIndex={0}
              className={`w-full px-3.5 py-3 sm:py-3.5 rounded-2xl flex items-center justify-between text-left transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-rose-500/20 border-rose-500 text-white shadow-md shadow-rose-950/40 ring-1 ring-rose-500'
                  : 'bg-zinc-900/80 border-zinc-800/90 text-zinc-200 hover:bg-zinc-850 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 pr-2 min-w-0 flex-1">
                <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 border transition-colors ${
                  isSelected ? 'bg-rose-500 text-white border-rose-400' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-xs sm:text-sm font-semibold leading-snug break-words">
                  {formatOptionText(opt)}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!isGuesser && (
                  <button
                    type="button"
                    onClick={(e) => handleStartEditingSlot(idx, e)}
                    className="w-7 h-7 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-rose-300 flex items-center justify-center transition-colors"
                    title="Remplacer cette proposition par la mienne"
                    aria-label="Remplacer cette proposition"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                )}

                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                    isSelected
                      ? 'bg-rose-500 border-rose-500 text-white'
                      : 'border-zinc-700 bg-zinc-800'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick validation alert if answer is missing or left empty */}
      {validationMessage && (
        <div className="shrink-0 mb-1 px-3 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-semibold flex items-center justify-between gap-2 shadow-lg backdrop-blur-sm animate-pulse">
          <div className="flex items-center gap-2 min-w-0">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="leading-snug">{validationMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setValidationMessage(null)}
            className="p-1 text-amber-400/80 hover:text-amber-100 shrink-0"
            aria-label="Fermer le message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Bottom Navigation CTA Bar */}
      <div className="shrink-0 pt-1 flex items-center gap-2">
        {canGoPrev && onPrevQuestion && (
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onPrevQuestion();
            }}
            className="h-12 sm:h-13 px-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center active:scale-95 transition-all shadow-md"
            title="Question précédente"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={handleNextClick}
          className={`flex-1 h-12 sm:h-13 rounded-2xl flex items-center justify-center gap-2 font-display font-bold text-sm shadow-xl transition-all active:scale-[0.98] ${
            canProceed && editingIndex === null
              ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-rose-950/40 hover:opacity-95 cursor-pointer'
              : 'bg-zinc-800 text-zinc-400 border border-zinc-750 hover:bg-zinc-750 cursor-pointer'
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
