/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  CategoryId, 
  DifficultyLevel, 
  GameStage, 
  Player, 
  Question, 
  RoundResult 
} from './types/quiz';
import { CATEGORIES, INITIAL_QUESTIONS } from './data/questions';
import { sound } from './utils/audio';
import { TopNav } from './components/TopNav';
import { RulesModal } from './components/RulesModal';
import { MainMenu } from './components/MainMenu';
import { QuestionCard } from './components/QuestionCard';
import { HandoverScreen } from './components/HandoverScreen';
import { RevealCard } from './components/RevealCard';
import { RoundSwitchScreen } from './components/RoundSwitchScreen';
import { GameSummary } from './components/GameSummary';
import { ConfirmQuitModal } from './components/ConfirmQuitModal';
import { useMultiplayer } from './utils/useMultiplayer';
import { MultiplayerSetupScreen } from './components/MultiplayerSetupScreen';
import { MultiplayerWaitingScreen } from './components/MultiplayerWaitingScreen';
import { initAppUrl } from './utils/appUrl';

export default function App() {
  // Sound & Haptics toggle
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isQuitModalOpen, setIsQuitModalOpen] = useState<boolean>(false);

  // Players state with local storage persistence
  const [player1, setPlayer1] = useState<Player>(() => {
    try {
      const saved = localStorage.getItem('duoquiz_p1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { id: 'p1', name: 'Joueur 1', avatar: '🦊', score: 0 };
  });

  const [player2, setPlayer2] = useState<Player>(() => {
    try {
      const saved = localStorage.getItem('duoquiz_p2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { id: 'p2', name: 'Joueur 2', avatar: '🐱', score: 0 };
  });

  // Setup options
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>(['souvenirs', 'quotidien', 'coquin']);
  const [globalDifficulty, setGlobalDifficulty] = useState<DifficultyLevel>('medium');
  const [questionCount, setQuestionCount] = useState<number>(5);

  // Multi-manche batched game state
  const [stage, setStage] = useState<GameStage>('menu');
  const [currentManche, setCurrentManche] = useState<number>(1);
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<string>>(new Set());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [p1Answers, setP1Answers] = useState<string[]>([]);
  const [p2Answers, setP2Answers] = useState<string[]>([]);
  const [matchDecisions, setMatchDecisions] = useState<Record<number, boolean>>({});
  const [cumulativeHistory, setCumulativeHistory] = useState<RoundResult[]>([]);
  const [lastMancheScore, setLastMancheScore] = useState<number>(0);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  // Real-time Multiplayer (2 phones mode) hook
  const multi = useMultiplayer();
  const urlRoomCode = new URLSearchParams(window.location.search).get('room') || '';

  // Auto-switch to multiplayer or auto-reconnect if returning from accidental tab close/refresh
  useEffect(() => {
    initAppUrl();
    if (urlRoomCode) {
      setStage('multiplayer_setup');
    } else {
      const wasInGame = sessionStorage.getItem('duoquiz_multi_in_game') === 'true';
      if (wasInGame && multi.savedRoomCode) {
        multi.reconnectSavedSession();
      }
    }
  }, [urlRoomCode, multi.savedRoomCode]);

  // Auto-restore target answers and advance to first unanswered question when reconnecting to p1_series
  useEffect(() => {
    if (multi.roomState && multi.roomState.stage === 'p1_series' && multi.isTarget) {
      if (multi.roomState.targetAnswers && multi.roomState.targetAnswers.length > 0) {
        setP1Answers(multi.roomState.targetAnswers);
        const firstUnanswered = multi.roomState.targetAnswers.findIndex(
          (ans) => !ans || ans.trim() === ''
        );
        if (firstUnanswered !== -1) {
          setCurrentQuestionIndex(firstUnanswered);
        }
      }
    }
  }, [multi.roomState?.stage, multi.roomState?.targetAnswers, multi.isTarget]);

  // Save player nicknames to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('duoquiz_p1', JSON.stringify(player1));
      localStorage.setItem('duoquiz_p2', JSON.stringify(player2));
    } catch {}
  }, [player1, player2]);

  const toggleSound = () => {
    sound.enabled = !soundEnabled;
    sound.hapticsEnabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      sound.playTap();
    }
  };

  const handleToggleCategory = (catId: CategoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  // Fetch AI generated questions when Gemini category or bonus is enabled
  const fetchAiQuestions = async (count: number, excludeIds: Set<string>): Promise<Question[]> => {
    try {
      const activeCats = selectedCategories.filter((c) => c !== 'custom_ai');
      const catLabel = activeCats.length > 0 ? activeCats.join(', ') : 'Couple & Complicité';
      const recentIds = Array.from(excludeIds).slice(-20);

      const res = await fetch('/api/gemini/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player1: player1.name,
          player2: player2.name,
          category: catLabel,
          difficulty: globalDifficulty,
          count,
          previousQuestions: recentIds,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
          return data.questions.map((q: any, i: number) => ({
            id: `ai_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`,
            category: 'custom_ai' as CategoryId,
            difficulty: globalDifficulty,
            question: q.question,
            targetQuestion: q.targetQuestion,
            guesserQuestion: q.guesserQuestion,
            options: Array.isArray(q.options) && q.options.length === 4
              ? q.options
              : ['Oui absolument', 'Pas vraiment', 'Ça dépend des jours', 'Un mystère total'],
            hint: q.hint,
            isAiGenerated: true,
          }));
        }
      }
    } catch (err) {
      console.warn('AI question generation fallback to local pool:', err);
    }
    return [];
  };

  // Fisher-Yates array shuffle helper
  const shuffleArray = <T,>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  // Helper to build a completely duplicate-free question list for a manche
  const buildUniqueQuestionList = (
    count: number,
    globalUsedIds: Set<string>,
    difficulty: DifficultyLevel,
    categories: CategoryId[]
  ): { questions: Question[]; nextUsedIds: Set<string> } => {
    const validCats = categories.filter((c) => c !== 'custom_ai');
    const effectiveCats =
      validCats.length > 0
        ? validCats
        : (['souvenirs', 'quotidien', 'personnalite', 'projets', 'coquin'] as CategoryId[]);

    const categoryPool = INITIAL_QUESTIONS.filter((q) => effectiveCats.includes(q.category));
    const pickedInManche = new Set<string>();
    const pickedTextInManche = new Set<string>();
    const pickedQuestions: Question[] = [];
    const updatedGlobalUsed = new Set(globalUsedIds);

    const tryAdd = (q: Question) => {
      const normText = q.question.trim().toLowerCase();
      if (!pickedInManche.has(q.id) && !pickedTextInManche.has(normText)) {
        pickedInManche.add(q.id);
        pickedTextInManche.add(normText);
        updatedGlobalUsed.add(q.id);
        pickedQuestions.push({ ...q, options: [...q.options] });
        return true;
      }
      return false;
    };

    // Priority 1: Unused questions matching category AND chosen difficulty
    const p1Pool = shuffleArray(
      categoryPool.filter((q) => !updatedGlobalUsed.has(q.id) && q.difficulty === difficulty)
    );
    for (const q of p1Pool) {
      if (pickedQuestions.length >= count) break;
      tryAdd(q);
    }

    // Priority 2: Unused questions matching category (any difficulty)
    if (pickedQuestions.length < count) {
      const p2Pool = shuffleArray(categoryPool.filter((q) => !updatedGlobalUsed.has(q.id)));
      for (const q of p2Pool) {
        if (pickedQuestions.length >= count) break;
        tryAdd(q);
      }
    }

    // Priority 3: If all questions in selected categories have been exhausted in previous rounds,
    // recycle questions from the pool, but STRICTLY exclude any question already picked in THIS manche!
    if (pickedQuestions.length < count) {
      const p3Pool = shuffleArray(categoryPool);
      for (const q of p3Pool) {
        if (pickedQuestions.length >= count) break;
        tryAdd(q);
      }
    }

    // Priority 4: Final safety net across entire 120 questions
    if (pickedQuestions.length < count) {
      const p4Pool = shuffleArray(INITIAL_QUESTIONS);
      for (const q of p4Pool) {
        if (pickedQuestions.length >= count) break;
        tryAdd(q);
      }
    }

    return { questions: pickedQuestions, nextUsedIds: updatedGlobalUsed };
  };

  // Target & Guesser players alternating each manche
  const targetPlayer = currentManche % 2 === 1 ? player1 : player2;
  const guesserPlayer = currentManche % 2 === 1 ? player2 : player1;
  const nextTarget = (currentManche + 1) % 2 === 1 ? player1 : player2;
  const nextGuesser = (currentManche + 1) % 2 === 1 ? player2 : player1;

  // Start Game: launches Manche 1 (Player 1 answers first)
  const handleStartGame = async () => {
    setIsLoadingAi(true);
    const actualCount = questionCount === 99 ? 5 : questionCount;

    let aiQuestions: Question[] = [];
    if (selectedCategories.includes('custom_ai')) {
      aiQuestions = await fetchAiQuestions(actualCount, new Set());
    }

    const neededLocalCount = Math.max(0, actualCount - aiQuestions.length);
    const { questions: builtQuestions, nextUsedIds } = buildUniqueQuestionList(
      neededLocalCount,
      new Set<string>(), // fresh session start
      globalDifficulty,
      selectedCategories
    );

    aiQuestions.forEach((q) => nextUsedIds.add(q.id));
    const combinedList = [...aiQuestions, ...builtQuestions];

    setIsLoadingAi(false);
    setUsedQuestionIds(nextUsedIds);
    setGameQuestions(combinedList);
    setP1Answers(new Array(actualCount).fill(''));
    setP2Answers(new Array(actualCount).fill(''));
    setMatchDecisions({});
    setCumulativeHistory([]);
    setCurrentQuestionIndex(0);
    setCurrentManche(1);
    setPlayer1((prev) => ({ ...prev, score: 0 }));
    setPlayer2((prev) => ({ ...prev, score: 0 }));
    setStage('p1_series');
  };

  // Change difficulty of a specific question during target answering (strictly without duplicate)
  const handleChangeQuestionDifficulty = (newDiff: DifficultyLevel) => {
    const currentQ = gameQuestions[currentQuestionIndex];
    if (!currentQ) return;

    const usedInCurrentGame = new Set(gameQuestions.map((g) => g.id));
    const { questions: replacementList } = buildUniqueQuestionList(
      1,
      usedInCurrentGame,
      newDiff,
      selectedCategories
    );

    if (replacementList.length > 0) {
      const updated = [...gameQuestions];
      updated[currentQuestionIndex] = replacementList[0];
      setGameQuestions(updated);
    }
  };

  // Change difficulty of a question in Multiplayer mode
  const handleMultiplayerChangeQuestionDifficulty = (newDiff: DifficultyLevel) => {
    if (!multi.roomState) return;
    const currentQ = multi.roomState.questions[currentQuestionIndex];
    if (!currentQ) return;

    const usedInCurrentGame = new Set(multi.roomState.questions.map((g) => g.id));
    const { questions: replacementList } = buildUniqueQuestionList(
      1,
      usedInCurrentGame,
      newDiff,
      multi.roomState.config.selectedCategories
    );

    if (replacementList.length > 0) {
      multi.replaceQuestion(currentQuestionIndex, replacementList[0]);
    }
  };

  // Target player advances through their secret questions
  const handleTargetNext = (answer: string, updatedOptions?: string[]) => {
    const updated = [...p1Answers];
    updated[currentQuestionIndex] = answer;
    setP1Answers(updated);

    if (updatedOptions) {
      setGameQuestions((prev) => {
        const nextList = [...prev];
        if (nextList[currentQuestionIndex]) {
          nextList[currentQuestionIndex] = {
            ...nextList[currentQuestionIndex],
            options: [...updatedOptions],
          };
        }
        return nextList;
      });
    }

    if (currentQuestionIndex < gameQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Target player finished all their questions! Hand over the phone to guesser
      sound.playSuccess();
      sound.vibrate([20, 40, 20]);
      setCurrentQuestionIndex(0);
      setStage('handover');
    }
  };

  const handleTargetPrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Handover done: Guesser begins guessing with immediate reveal on each question
  const handleProceedToGuesser = () => {
    setCurrentQuestionIndex(0);
    setStage('p2_turn');
  };

  // Guesser player submits their guess -> triggers IMMEDIATE reveal!
  const handleGuesserSubmitAnswer = (answer: string) => {
    const updated = [...p2Answers];
    updated[currentQuestionIndex] = answer;
    setP2Answers(updated);
    setStage('reveal_turn');
  };

  const handleGuesserPrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setStage('p2_turn');
    }
  };

  // Reveal phase actions
  const handleConfirmMatch = () => {
    setMatchDecisions((prev) => ({ ...prev, [currentQuestionIndex]: true }));
  };

  const handleRejectMatch = () => {
    setMatchDecisions((prev) => ({ ...prev, [currentQuestionIndex]: false }));
  };

  // After immediate reveal, advance to next question or complete manche
  const handleAfterRevealNext = () => {
    if (currentQuestionIndex < gameQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setStage('p2_turn');
    } else {
      // Current manche is finished! Compute score for this manche's guesser
      let mancheScore = 0;
      const currentMancheResults: RoundResult[] = gameQuestions.map((q, idx) => {
        const tAns = p1Answers[idx] || '';
        const gAns = p2Answers[idx] || '';
        const isAuto = tAns.trim().toLowerCase() === gAns.trim().toLowerCase();
        const manualDecision = matchDecisions[idx];
        const isMatch = isAuto ? manualDecision !== false : manualDecision === true;
        if (isMatch) mancheScore += 1;

        return {
          roundNumber: (currentManche - 1) * gameQuestions.length + idx + 1,
          question: q,
          targetPlayer,
          guesserPlayer,
          targetAnswer: tAns,
          guesserAnswer: gAns,
          isMatch,
          agreedAnyway: !isAuto && manualDecision === true,
        };
      });

      // Update guesser score accumulatively
      if (guesserPlayer.id === player1.id) {
        setPlayer1((prev) => ({ ...prev, score: prev.score + mancheScore }));
      } else {
        setPlayer2((prev) => ({ ...prev, score: prev.score + mancheScore }));
      }

      setLastMancheScore(mancheScore);
      setCumulativeHistory((prev) => [...prev, ...currentMancheResults]);

      sound.playFanfare();
      // Show manche score & role-switch screen to launch next manche
      setStage('round_switch');
    }
  };

  // Launch next manche: Invert roles and draw fresh unique questions
  const handleStartNextManche = async () => {
    setIsLoadingAi(true);
    const actualCount = questionCount === 99 ? 5 : questionCount;
    const nextMancheNum = currentManche + 1;

    let aiQuestions: Question[] = [];
    if (selectedCategories.includes('custom_ai')) {
      aiQuestions = await fetchAiQuestions(actualCount, usedQuestionIds);
    }

    const neededLocalCount = Math.max(0, actualCount - aiQuestions.length);
    const { questions: builtQuestions, nextUsedIds } = buildUniqueQuestionList(
      neededLocalCount,
      usedQuestionIds,
      globalDifficulty,
      selectedCategories
    );

    aiQuestions.forEach((q) => nextUsedIds.add(q.id));
    const combinedList = [...aiQuestions, ...builtQuestions];

    setIsLoadingAi(false);
    setUsedQuestionIds(nextUsedIds);
    setCurrentManche(nextMancheNum);
    setGameQuestions(combinedList);
    setP1Answers(new Array(actualCount).fill(''));
    setP2Answers(new Array(actualCount).fill(''));
    setMatchDecisions({});
    setCurrentQuestionIndex(0);
    setStage('p1_series'); // Starts Target series for nextTarget!
  };

  const handleStartMultiplayerGame = async () => {
    if (!multi.roomState) return;
    setIsLoadingAi(true);
    const count =
      multi.roomState.config.questionCount === 99 ? 5 : multi.roomState.config.questionCount;

    let aiQuestions: Question[] = [];
    if (multi.roomState.config.selectedCategories.includes('custom_ai')) {
      aiQuestions = await fetchAiQuestions(count, new Set());
    }

    const neededCount = Math.max(0, count - aiQuestions.length);
    const { questions: builtQuestions, nextUsedIds } = buildUniqueQuestionList(
      neededCount,
      new Set<string>(),
      multi.roomState.config.globalDifficulty,
      multi.roomState.config.selectedCategories
    );

    aiQuestions.forEach((q) => nextUsedIds.add(q.id));
    const combined = [...aiQuestions, ...builtQuestions];

    setIsLoadingAi(false);
    setUsedQuestionIds(nextUsedIds);
    setP1Answers(new Array(count).fill(''));
    setP2Answers(new Array(count).fill(''));
    setCurrentQuestionIndex(0);
    multi.startGame(combined);
  };

  const handleStartNextMultiplayerManche = async () => {
    if (!multi.roomState) return;
    setIsLoadingAi(true);
    const count =
      multi.roomState.config.questionCount === 99 ? 5 : multi.roomState.config.questionCount;

    let aiQuestions: Question[] = [];
    if (multi.roomState.config.selectedCategories.includes('custom_ai')) {
      aiQuestions = await fetchAiQuestions(count, usedQuestionIds);
    }

    const neededCount = Math.max(0, count - aiQuestions.length);
    const { questions: builtQuestions, nextUsedIds } = buildUniqueQuestionList(
      neededCount,
      usedQuestionIds,
      multi.roomState.config.globalDifficulty,
      multi.roomState.config.selectedCategories
    );

    aiQuestions.forEach((q) => nextUsedIds.add(q.id));
    const combined = [...aiQuestions, ...builtQuestions];

    setIsLoadingAi(false);
    setUsedQuestionIds(nextUsedIds);
    setP1Answers(new Array(count).fill(''));
    setP2Answers(new Array(count).fill(''));
    setCurrentQuestionIndex(0);
    multi.startNextManche(combined);
  };

  const handleResetToMenu = () => {
    sound.playTap();
    if (multi.roomState) {
      multi.leaveRoom();
    }
    setStage('menu');
  };

  const handleRequestQuit = () => {
    if (stage === 'summary' || multi.roomState?.stage === 'summary') {
      handleResetToMenu();
    } else {
      sound.playTap();
      setIsQuitModalOpen(true);
    }
  };

  const handleConfirmQuit = () => {
    setIsQuitModalOpen(false);
    handleResetToMenu();
  };

  const isMultiActive = !!multi.roomState && multi.roomState.stage !== 'lobby';

  const activeQuestion = isMultiActive
    ? multi.roomState?.activeQuestion
    : gameQuestions[currentQuestionIndex];

  // In reveal phase, determine match state for the current question
  const currentTargetAnswer = p1Answers[currentQuestionIndex] || '';
  const currentGuesserAnswer = p2Answers[currentQuestionIndex] || '';
  const isCurrentAutoMatch =
    currentTargetAnswer.trim().toLowerCase() === currentGuesserAnswer.trim().toLowerCase();
  const currentDecision = matchDecisions[currentQuestionIndex];
  const currentScoreAwarded = isCurrentAutoMatch
    ? currentDecision !== false
    : currentDecision === true;

  const isQuestionPhase = isMultiActive
    ? multi.roomState?.stage === 'p1_series' || multi.roomState?.stage === 'p2_turn' || multi.roomState?.stage === 'reveal_turn'
    : stage === 'p1_series' || stage === 'p2_turn' || stage === 'reveal_turn';

  return (
    <div className={`h-[100dvh] max-h-[100dvh] flex flex-col bg-zinc-950 text-zinc-100 selection:bg-rose-500 selection:text-white ${isQuestionPhase ? 'overflow-hidden' : 'overflow-y-auto'}`}>
      {/* Top Header Bar */}
      <TopNav
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onRequestQuit={handleRequestQuit}
        onOpenHelp={() => setIsRulesOpen(true)}
        currentManche={
          isMultiActive
            ? multi.roomState?.stage !== 'summary'
              ? multi.roomState?.currentManche
              : undefined
            : stage !== 'menu' && stage !== 'summary' && stage !== 'multiplayer_setup'
            ? currentManche
            : undefined
        }
        currentRound={
          isMultiActive
            ? multi.roomState?.stage !== 'summary'
              ? multi.roomState?.stage === 'p1_series'
                ? multi.isTarget
                  ? currentQuestionIndex + 1
                  : Math.min(multi.roomState?.totalQuestions || 5, (multi.roomState?.p1AnsweredCount || 0) + 1)
                : (multi.roomState?.currentQuestionIndex || 0) + 1
              : undefined
            : stage !== 'menu' && stage !== 'summary' && stage !== 'multiplayer_setup'
            ? currentQuestionIndex + 1
            : undefined
        }
        totalRounds={
          isMultiActive
            ? multi.roomState?.totalQuestions
            : gameQuestions.length > 0
            ? gameQuestions.length
            : questionCount
        }
        inGame={
          isMultiActive
            ? multi.roomState?.stage !== 'summary'
            : stage !== 'menu' && stage !== 'multiplayer_setup'
        }
        multiplayerCode={multi.roomState?.code}
      />

      {/* Main Content Viewport */}
      <main className={`flex-1 min-h-0 flex flex-col items-center w-full ${isQuestionPhase ? 'overflow-hidden justify-between' : 'overflow-y-auto justify-start'}`}>
        {/* Partner Disconnected Warning in Multiplayer */}
        {isMultiActive && multi.partnerPlayer && !multi.partnerPlayer.connected && (
          <div className="w-full max-w-lg px-4 pt-2 animate-fade-in">
            <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center gap-3 text-amber-200 text-xs shadow-lg animate-pulse">
              <span className="text-xl">⚠️</span>
              <div className="flex-1 text-left">
                <div className="font-bold text-white">
                  {multi.partnerPlayer.name} a quitté ou a un souci de connexion.
                </div>
                <div className="text-[11px] text-amber-300/90 mt-0.5">
                  La partie reste sauvegardée et reprendra dès son retour !
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Local Reconnecting Banner */}
        {multi.isReconnecting && (
          <div className="w-full max-w-lg px-4 pt-2 animate-fade-in">
            <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/40 flex items-center gap-3 text-rose-200 text-xs shadow-lg">
              <div className="w-4 h-4 border-2 border-rose-400 border-t-transparent rounded-full animate-spin shrink-0" />
              <div className="flex-1 font-medium text-left">
                Reconnexion automatique à votre salon multijoueur...
              </div>
            </div>
          </div>
        )}

        {/* MULTIPLAYER FLOW (Setup & Lobby only — hidden once game begins) */}
        {!isMultiActive && (stage === 'multiplayer_setup' || (multi.roomState && multi.roomState.stage === 'lobby')) && (
          <MultiplayerSetupScreen
            player1={player1}
            player2={player2}
            selectedCategories={selectedCategories}
            globalDifficulty={globalDifficulty}
            questionCount={questionCount}
            roomState={multi.roomState}
            isConnecting={multi.isConnecting}
            errorMessage={multi.errorMessage}
            onCreateRoom={(hostName, hostAvatar, cfg) => {
              setPlayer1((prev) => ({ ...prev, name: hostName, avatar: hostAvatar }));
              multi.createRoom(hostName, hostAvatar, cfg);
            }}
            onJoinRoom={(code, name, avatar) => {
              setPlayer2((prev) => ({ ...prev, name, avatar }));
              multi.joinRoom(code, name, avatar);
            }}
            onStartGame={handleStartMultiplayerGame}
            onBackToMenu={() => {
              multi.leaveRoom();
              setStage('menu');
            }}
          />
        )}

        {isMultiActive && (
          <>
            {/* Phase 1 in Multiplayer: Target answers secret questions */}
            {multi.roomState?.stage === 'p1_series' && (
              <>
                {multi.isTarget && multi.roomState.questions[currentQuestionIndex] ? (
                  <QuestionCard
                    key={`multi_target_m${multi.roomState.currentManche}_${currentQuestionIndex}_${multi.roomState.questions[currentQuestionIndex]?.id}`}
                    question={multi.roomState.questions[currentQuestionIndex]}
                    currentIndex={currentQuestionIndex}
                    totalCount={multi.roomState.totalQuestions}
                    activePlayer={multi.myPlayer || player1}
                    otherPlayer={multi.partnerPlayer || player2}
                    isGuesser={false}
                    initialAnswer={p1Answers[currentQuestionIndex] || ''}
                    onOptionsChange={(newOptions) => {
                      multi.updateQuestionOptions(currentQuestionIndex, newOptions);
                    }}
                    onNextQuestion={(answer, updatedOptions) => {
                      const updated = [...p1Answers];
                      updated[currentQuestionIndex] = answer;
                      setP1Answers(updated);
                      multi.submitTargetAnswer(currentQuestionIndex, answer, updatedOptions);
                      if (currentQuestionIndex < multi.roomState!.totalQuestions - 1) {
                        setCurrentQuestionIndex((prev) => prev + 1);
                      } else {
                        multi.finishTargetSeries();
                        setCurrentQuestionIndex(0);
                      }
                    }}
                    onPrevQuestion={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                    canGoPrev={currentQuestionIndex > 0}
                    currentDifficulty={multi.roomState.questions[currentQuestionIndex]?.difficulty || 'medium'}
                    onChangeDifficulty={handleMultiplayerChangeQuestionDifficulty}
                  />
                ) : (
                  <MultiplayerWaitingScreen
                    partnerPlayer={multi.partnerPlayer}
                    myPlayer={multi.myPlayer}
                    waitingFor="target_answers"
                    currentIndex={multi.roomState?.p1AnsweredCount || 0}
                    totalCount={multi.roomState?.totalQuestions || 5}
                    isCoquin={multi.roomState?.config.selectedCategories.includes('coquin')}
                  />
                )}
              </>
            )}

            {/* Phase 2 in Multiplayer: Guesser guesses Target answers */}
            {multi.roomState?.stage === 'p2_turn' && (
              <>
                {multi.isGuesser && multi.roomState.activeQuestion ? (
                  <QuestionCard
                    key={`multi_guesser_m${multi.roomState.currentManche}_${multi.roomState.currentQuestionIndex}_${multi.roomState.activeQuestion?.id}`}
                    question={multi.roomState.activeQuestion}
                    currentIndex={multi.roomState.currentQuestionIndex}
                    totalCount={multi.roomState.totalQuestions}
                    activePlayer={multi.myPlayer || player2}
                    otherPlayer={multi.partnerPlayer || player1}
                    isGuesser={true}
                    initialAnswer=""
                    onOptionsChange={(newOptions) => {
                      multi.updateQuestionOptions(multi.roomState!.currentQuestionIndex, newOptions);
                    }}
                    onNextQuestion={(answer, updatedOptions) => {
                      if (updatedOptions) {
                        multi.updateQuestionOptions(multi.roomState!.currentQuestionIndex, updatedOptions);
                      }
                      multi.submitGuesserAnswer(multi.roomState!.currentQuestionIndex, answer);
                    }}
                    onPrevQuestion={() => {}}
                    canGoPrev={false}
                    currentDifficulty={multi.roomState.activeQuestion.difficulty}
                    onChangeDifficulty={() => {}}
                  />
                ) : (
                  <MultiplayerWaitingScreen
                    partnerPlayer={multi.partnerPlayer}
                    myPlayer={multi.myPlayer}
                    waitingFor="guesser_turn"
                    currentIndex={multi.roomState?.currentQuestionIndex || 0}
                    totalCount={multi.roomState?.totalQuestions || 5}
                    isCoquin={multi.roomState?.config.selectedCategories.includes('coquin')}
                  />
                )}
              </>
            )}

            {/* Phase 3 in Multiplayer: Simultaneous Reveal */}
            {multi.roomState?.stage === 'reveal_turn' && multi.roomState.activeQuestion && (
              <RevealCard
                key={`multi_reveal_m${multi.roomState.currentManche}_${multi.roomState.currentQuestionIndex}_${multi.roomState.activeQuestion.id}`}
                question={multi.roomState.activeQuestion}
                currentIndex={multi.roomState.currentQuestionIndex}
                totalCount={multi.roomState.totalQuestions}
                targetPlayer={
                  multi.roomState.currentManche % 2 === 1
                    ? multi.roomState.player1
                    : multi.roomState.player2 || player2
                }
                guesserPlayer={
                  multi.roomState.currentManche % 2 === 1
                    ? multi.roomState.player2 || player2
                    : multi.roomState.player1
                }
                targetAnswer={multi.roomState.currentTargetAnswer || ''}
                guesserAnswer={multi.roomState.currentGuesserAnswer || ''}
                isAutoMatch={multi.roomState.isCurrentAutoMatch || false}
                scoreAwarded={
                  multi.roomState.isCurrentAutoMatch
                    ? multi.roomState.matchDecisions[multi.roomState.currentQuestionIndex] !== false
                    : multi.roomState.matchDecisions[multi.roomState.currentQuestionIndex] === true
                }
                onConfirmMatch={() => multi.resolveMatch(multi.roomState!.currentQuestionIndex, true)}
                onRejectMatch={() => multi.resolveMatch(multi.roomState!.currentQuestionIndex, false)}
                onNextRound={() => multi.nextRevealOrQuestion()}
                isLastRound={multi.roomState.currentQuestionIndex === multi.roomState.totalQuestions - 1}
              />
            )}

            {/* Phase 4 in Multiplayer: Round Switch & Manche Scores */}
            {multi.roomState?.stage === 'round_switch' && (
              <RoundSwitchScreen
                completedManche={multi.roomState.currentManche}
                player1={multi.roomState.player1}
                player2={multi.roomState.player2 || player2}
                previousTarget={
                  multi.roomState.currentManche % 2 === 1
                    ? multi.roomState.player1
                    : multi.roomState.player2 || player2
                }
                previousGuesser={
                  multi.roomState.currentManche % 2 === 1
                    ? multi.roomState.player2 || player2
                    : multi.roomState.player1
                }
                guesserScoreThisManche={multi.roomState.lastMancheScore}
                totalQuestionsThisManche={multi.roomState.totalQuestions}
                nextTarget={
                  multi.roomState.currentManche % 2 === 1
                    ? multi.roomState.player2 || player2
                    : multi.roomState.player1
                }
                nextGuesser={
                  multi.roomState.currentManche % 2 === 1
                    ? multi.roomState.player1
                    : multi.roomState.player2 || player2
                }
                onStartNextManche={handleStartNextMultiplayerManche}
                onGoToSummary={() => multi.goToSummary()}
                onReturnToMenu={handleResetToMenu}
              />
            )}

            {/* Phase 5 in Multiplayer: Final Game Summary */}
            {multi.roomState?.stage === 'summary' && (
              <GameSummary
                player1={multi.roomState.player1}
                player2={multi.roomState.player2 || player2}
                history={multi.roomState.cumulativeHistory}
                selectedCategories={multi.roomState.config.selectedCategories}
                onRestart={handleStartMultiplayerGame}
                onNewGameSetup={handleResetToMenu}
                onNextManche={handleStartNextMultiplayerManche}
                nextMancheNumber={multi.roomState.currentManche + 1}
                nextTargetName={
                  multi.roomState.currentManche % 2 === 1
                    ? multi.roomState.player2?.name || player2.name
                    : multi.roomState.player1.name
                }
              />
            )}
          </>
        )}

        {/* SINGLE PHONE (CANAPÉ) FLOW */}
        {!isMultiActive && stage !== 'multiplayer_setup' && (
          <>
            {stage === 'menu' && (
              <MainMenu
                player1={player1}
                player2={player2}
                onUpdatePlayer1={(p) => setPlayer1((prev) => ({ ...prev, ...p }))}
                onUpdatePlayer2={(p) => setPlayer2((prev) => ({ ...prev, ...p }))}
                selectedCategories={selectedCategories}
                onToggleCategory={handleToggleCategory}
                globalDifficulty={globalDifficulty}
                onChangeDifficulty={setGlobalDifficulty}
                questionCount={questionCount}
                onChangeQuestionCount={setQuestionCount}
                onStartGame={handleStartGame}
                isLoadingAi={isLoadingAi}
                onOpenMultiplayer={() => setStage('multiplayer_setup')}
                urlRoomCode={urlRoomCode}
                savedRoomCode={multi.savedRoomCode}
                onReconnectRoom={() => multi.reconnectSavedSession()}
                onClearSavedRoom={() => multi.clearSavedSession()}
                isReconnecting={multi.isReconnecting}
              />
            )}

            {/* Phase 1: Target player answers ALL questions in a row in secret (with ✏️ replacement) */}
            {stage === 'p1_series' && activeQuestion && (
              <QuestionCard
                key={`target_m${currentManche}_${currentQuestionIndex}_${activeQuestion.id}`}
                question={activeQuestion}
                currentIndex={currentQuestionIndex}
                totalCount={gameQuestions.length}
                activePlayer={targetPlayer}
                otherPlayer={guesserPlayer}
                isGuesser={false}
                initialAnswer={p1Answers[currentQuestionIndex] || ''}
                onNextQuestion={handleTargetNext}
                onPrevQuestion={handleTargetPrev}
                canGoPrev={currentQuestionIndex > 0}
                currentDifficulty={activeQuestion.difficulty}
                onChangeDifficulty={handleChangeQuestionDifficulty}
              />
            )}

            {/* Phase 2: Single Handover Screen */}
            {stage === 'handover' && (
              <HandoverScreen
                targetPlayer={targetPlayer}
                guesserPlayer={guesserPlayer}
                totalQuestions={gameQuestions.length}
                onProceed={handleProceedToGuesser}
              />
            )}

            {/* Phase 3: Guesser player guesses question -> triggers immediate reveal right after */}
            {stage === 'p2_turn' && activeQuestion && (
              <QuestionCard
                key={`guesser_m${currentManche}_${currentQuestionIndex}_${activeQuestion.id}`}
                question={activeQuestion}
                currentIndex={currentQuestionIndex}
                totalCount={gameQuestions.length}
                activePlayer={guesserPlayer}
                otherPlayer={targetPlayer}
                isGuesser={true}
                initialAnswer={p2Answers[currentQuestionIndex] || ''}
                onNextQuestion={handleGuesserSubmitAnswer}
                onPrevQuestion={handleGuesserPrev}
                canGoPrev={currentQuestionIndex > 0}
                currentDifficulty={activeQuestion.difficulty}
                onChangeDifficulty={handleChangeQuestionDifficulty}
              />
            )}

            {/* Immediate Reveal for the question Guesser just guessed! */}
            {stage === 'reveal_turn' && activeQuestion && (
              <RevealCard
                key={`reveal_m${currentManche}_${currentQuestionIndex}_${activeQuestion.id}`}
                question={activeQuestion}
                currentIndex={currentQuestionIndex}
                totalCount={gameQuestions.length}
                targetPlayer={targetPlayer}
                guesserPlayer={guesserPlayer}
                targetAnswer={currentTargetAnswer}
                guesserAnswer={currentGuesserAnswer}
                isAutoMatch={isCurrentAutoMatch}
                scoreAwarded={currentScoreAwarded}
                onConfirmMatch={handleConfirmMatch}
                onRejectMatch={handleRejectMatch}
                onNextRound={handleAfterRevealNext}
                isLastRound={currentQuestionIndex === gameQuestions.length - 1}
              />
            )}

            {/* Role Inversion Screen & Manche Score */}
            {stage === 'round_switch' && (
              <RoundSwitchScreen
                completedManche={currentManche}
                player1={player1}
                player2={player2}
                previousTarget={targetPlayer}
                previousGuesser={guesserPlayer}
                guesserScoreThisManche={lastMancheScore}
                totalQuestionsThisManche={gameQuestions.length}
                nextTarget={nextTarget}
                nextGuesser={nextGuesser}
                onStartNextManche={handleStartNextManche}
                onGoToSummary={() => setStage('summary')}
                onReturnToMenu={handleResetToMenu}
              />
            )}

            {/* Grand Final Summary combining all manches */}
            {stage === 'summary' && (
              <GameSummary
                player1={player1}
                player2={player2}
                history={cumulativeHistory}
                selectedCategories={selectedCategories}
                onRestart={handleStartGame}
                onNewGameSetup={handleResetToMenu}
                onNextManche={handleStartNextManche}
                nextMancheNumber={currentManche + 1}
                nextTargetName={nextTarget.name}
              />
            )}
          </>
        )}
      </main>

      {/* Rules & Help Modal */}
      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      {/* Non-blocking in-app Confirm Quit Modal */}
      <ConfirmQuitModal
        isOpen={isQuitModalOpen}
        onClose={() => setIsQuitModalOpen(false)}
        onConfirmQuit={handleConfirmQuit}
      />
    </div>
  );
}

