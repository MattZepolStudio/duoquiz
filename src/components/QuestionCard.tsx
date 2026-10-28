import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Check, 
  HelpCircle, 
  Sparkles, 
  Flame, 
  ArrowRight, 
  ArrowLeft, 
  Pencil, 
  RotateCcw,
  Sliders,
  X,
  Lock,
  Eye
} from 'lucide-react';
import { DifficultyLevel, Player, Question } from '../types/quiz';
import { sound } from '../utils/audio';
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
  const [options, setOptions] = useState<string[]>(question.options);
  const [selectedAnswer, setSelectedAnswer] = useState<string>(initialAnswer);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [customInputValue, setCustomInputValue] = useState<string>('');
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
        inputRef.current?.select();
      }, 50);
    }
  }, [editingIndex]);

  const handleSelectOption = (opt: string) => {
    sound.playTap();
    sound.hapticSelection();
    setSelectedAnswer(opt);
    setValidationMessage(null);
  };

  const handleStartEditingSlot = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playTap();
    setEditingIndex(idx);
    setCustomInputValue(options[idx] || '');
  };

  const handleConfirmCustomSlot = (idx: number) => {
    const trimmed = customInputValue.trim();
    if (!trimmed) {
      sound.vibrate(40);
      showQuickValidation("Veuillez saisir un texte pour votre réponse.");
      return;
    }
    sound.playTap();
    const updated = [...options];
    updated[idx] = trimmed;
    setOptions(updated);
    setSelectedAnswer(trimmed);
    setEditingIndex(null);
    setCustomInputValue('');
    setValidationMessage(null);
    if (onOptionsChange) {
      onOptionsChange(updated);
    }
  };

  const handleCancelEditing = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.stopPropagation();
    sound.playTap();
    setEditingIndex(null);
    setCustomInputValue('');
  };

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
      showQuickValidation("Merci de sélectionner une réponse pour continuer.");
      return;
    }

    sound.playTap();
    sound.vibrate(15);
    setValidationMessage(null);
    onNextQuestion(selectedAnswer, options);
  };

  return (
    <div className="flex flex-col justify-between h-full max-h-full max-w-lg mx-auto w-full px-4 pt-2 pb-6 animate-fade-in overflow-hidden select-none">
      
      {/* ========================================================
          1. DYNAMIC ISLAND / FLOATING PILL HEADER
         ======================================================== */}
      <div className="shrink-0 space-y-3">
        {/* Floating Island Pill */}
        <div className="ios-glass rounded-full px-4 py-2 flex items-center justify-between shadow-lg shadow-black/40 border border-white/[0.08]">
          {/* Active Player Info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-7 h-7 rounded-full bg-white/[0.08] flex items-center justify-center text-sm shadow-sm shrink-0">
              {activePlayer.avatar}
            </span>
            <div className="min-w-0 text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white truncate">
                  {activePlayer.name}
                </span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                  isGuesser 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {isGuesser ? 'Devine' : 'Répond'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Controls: Difficulty + Counter */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Difficulty Badge */}
            <div className="relative">
              {!isGuesser ? (
                <button
                  type="button"
                  onClick={() => {
                    sound.playTap();
                    setShowDifficultyMenu(!showDifficultyMenu);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-[11px] font-semibold text-zinc-300 active:scale-95 transition-all"
                  title="Changer la difficulté"
                >
                  {currentDifficulty === 'spicy' ? (
                    <span className="text-rose-400 flex items-center gap-0.5">
                      <Flame className="w-3 h-3 fill-rose-500 text-rose-400" /> Pimentée
                    </span>
                  ) : currentDifficulty === 'medium' ? (
                    <span className="text-amber-300">💫 Complice</span>
                  ) : (
                    <span className="text-rose-300">🌸 Douce</span>
                  )}
                  <Sliders className="w-2.5 h-2.5 text-zinc-500 ml-0.5" />
                </button>
              ) : (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-[11px] font-semibold text-zinc-300">
                  {currentDifficulty === 'spicy' ? (
                    <span className="text-rose-400 flex items-center gap-0.5">
                      <Flame className="w-3 h-3 fill-rose-500 text-rose-400" /> Pimentée
                    </span>
                  ) : currentDifficulty === 'medium' ? (
                    <span className="text-amber-300">💫 Complice</span>
                  ) : (
                    <span className="text-rose-300">🌸 Douce</span>
                  )}
                </div>
              )}

              {/* Popover difficulty menu */}
              {!isGuesser && showDifficultyMenu && (
                <div className="absolute right-0 top-9 z-30 w-36 bg-[#16161c] border border-white/[0.12] rounded-2xl p-1 shadow-2xl animate-fade-in space-y-0.5 backdrop-blur-xl">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playTap();
                      onChangeDifficulty('easy');
                      setShowDifficultyMenu(false);
                    }}
                    className={`w-full py-1.5 px-2.5 rounded-xl text-xs font-medium text-left flex items-center gap-1.5 ${
                      currentDifficulty === 'easy' ? 'bg-rose-500/20 text-rose-300 font-bold' : 'text-zinc-300 hover:bg-white/[0.06]'
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
                    className={`w-full py-1.5 px-2.5 rounded-xl text-xs font-medium text-left flex items-center gap-1.5 ${
                      currentDifficulty === 'medium' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-zinc-300 hover:bg-white/[0.06]'
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
                    className={`w-full py-1.5 px-2.5 rounded-xl text-xs font-medium text-left flex items-center gap-1.5 ${
                      currentDifficulty === 'spicy' ? 'bg-rose-600/20 text-rose-300 font-bold' : 'text-zinc-300 hover:bg-white/[0.06]'
                    }`}
                  >
                    <span>🌶️</span> Pimentée
                  </button>
                </div>
              )}
            </div>

            {/* Counter Badge */}
            <span className="text-xs font-bold text-white tabular-nums px-2.5 py-0.5 bg-white/[0.06] rounded-full border border-white/[0.08]">
              {currentIndex + 1}/{totalCount}
            </span>
          </div>
        </div>

        {/* Thin Sleek Linear Progress Bar */}
        <div className="w-full bg-white/[0.04] h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-500 via-rose-400 to-amber-400 transition-all duration-300 rounded-full"
            style={{ width: `${((currentIndex + 1) / totalCount) * 100}%` }}
          />
        </div>

        {/* Question Statement Card */}
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 8, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="p-4 sm:p-5 rounded-[24px] ios-glass shadow-xl text-left border border-white/[0.08] relative overflow-hidden"
        >
          {/* Subtle Ambient Light glow inside card */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="text-[10px] font-bold uppercase tracking-widest mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-rose-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {isGuesser
                  ? `🔮 ${activePlayer.name}, devine le choix de ${otherPlayer.name} :`
                  : `🎯 ${activePlayer.name}, à toi de répondre pour toi :`}
              </span>
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-display font-bold text-white leading-snug tracking-tight">
            {displayedQuestionText}
          </h3>

          <div className="mt-1.5 flex items-center gap-1 text-[11px]">
            {isGuesser ? (
              <span className="text-amber-200/90 font-medium">
                💡 Choisis ce que {otherPlayer.name} a répondu en secret.
              </span>
            ) : (
              <span className="text-zinc-400 italic">
                🔒 Réponds sincèrement. {otherPlayer.name} tentera de deviner ton choix ensuite.
              </span>
            )}
          </div>

          {question.hint && (
            <div className="mt-2.5 pt-2 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  setShowHint(!showHint);
                }}
                className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 font-medium transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
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

      {/* ========================================================
          2. THE 4 TACTILE GLASS OPTIONS (A, B, C, D)
         ======================================================== */}
      <div className="flex-1 min-h-0 flex flex-col justify-center gap-2.5 sm:gap-3 my-2 sm:my-3">
        {options.slice(0, 4).map((opt, idx) => {
          const isSelected = selectedAnswer === opt;
          const isCurrentlyEditing = !isGuesser && editingIndex === idx;

          if (isCurrentlyEditing) {
            return (
              <div
                key={idx}
                className="w-full p-3.5 rounded-2xl bg-[#16161c] border-2 border-rose-500 shadow-2xl animate-fade-in text-left space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-rose-300">
                  <span>Remplacer le choix {String.fromCharCode(65 + idx)} :</span>
                  <button
                    type="button"
                    onClick={handleCancelEditing}
                    className="text-zinc-400 hover:text-white text-[11px]"
                  >
                    Annuler ✕
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
                      className="w-full bg-black/50 border border-white/[0.12] rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-400"
                      autoFocus
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleConfirmCustomSlot(idx)}
                    disabled={!customInputValue.trim()}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-bold shadow-md hover:brightness-105 disabled:opacity-40 transition-all shrink-0 active:scale-95"
                  >
                    Valider
                  </button>
                </div>
              </div>
            );
          }

          // Modern Tactile iOS Option Card
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
              className={`w-full px-4 py-3.5 rounded-2xl flex items-center justify-between text-left transition-all border cursor-pointer select-none ${
                isSelected
                  ? 'bg-gradient-to-r from-rose-500/20 via-pink-500/15 to-amber-500/10 border-rose-500 text-white shadow-lg shadow-rose-950/40 ring-1 ring-rose-400/40'
                  : 'bg-black/35 hover:bg-white/[0.05] border-white/[0.07] hover:border-white/[0.14] text-zinc-300'
              }`}
            >
              <div className="flex items-center gap-3 pr-2 min-w-0 flex-1">
                {/* Option Letter Tag */}
                <span className={`w-7 h-7 rounded-xl text-xs font-bold flex items-center justify-center shrink-0 border transition-all ${
                  isSelected 
                    ? 'bg-rose-500 text-white border-rose-400 shadow-sm' 
                    : 'bg-white/[0.05] text-zinc-400 border-white/[0.08]'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                
                <span className={`text-xs sm:text-sm font-semibold leading-snug break-words ${
                  isSelected ? 'text-white font-bold' : 'text-zinc-200'
                }`}>
                  {formatOptionText(opt)}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Inline Edit pencil for personal answering phase */}
                {!isGuesser && (
                  <button
                    type="button"
                    onClick={(e) => handleStartEditingSlot(idx, e)}
                    className="w-7 h-7 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] text-zinc-400 hover:text-white flex items-center justify-center transition-colors border border-white/[0.06]"
                    title="Personnaliser cette réponse"
                    aria-label="Personnaliser cette réponse"
                  >
                    <Pencil className="w-3 h-3 text-rose-300" />
                  </button>
                )}

                {/* Modern Indicator (Pulsing glowing checkmark) */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                    isSelected
                      ? 'bg-gradient-to-tr from-rose-500 to-amber-400 border-rose-400 text-white shadow-md shadow-rose-500/40'
                      : 'border-white/[0.12] bg-black/30'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Validation alert message if tapped without answering */}
      {validationMessage && (
        <div className="shrink-0 mb-2 p-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs font-semibold text-center animate-fade-in shadow-lg">
          {validationMessage}
        </div>
      )}

      {/* ========================================================
          3. BOTTOM ACTION BAR (Large Shimmering Button)
         ======================================================== */}
      <div className="shrink-0 pt-1 flex items-center gap-2">
        {canGoPrev && onPrevQuestion && (
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onPrevQuestion();
            }}
            className="h-14 px-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-zinc-300 flex items-center justify-center transition-all active:scale-95"
            title="Question précédente"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        <button
          type="button"
          onClick={handleNextClick}
          className={`flex-1 h-14 rounded-2xl font-display font-bold text-sm sm:text-base shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
            selectedAnswer.trim()
              ? 'bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 text-white shadow-rose-950/60 hover:brightness-105 animate-shimmer cursor-pointer border border-white/20'
              : 'bg-white/[0.05] text-zinc-500 border border-white/[0.05] cursor-pointer'
          }`}
        >
          <span>{currentIndex === totalCount - 1 ? 'Terminer cette manche' : 'Valider & continuer'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;
