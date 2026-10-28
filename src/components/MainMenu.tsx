import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Flame, 
  Brain, 
  UtensilsCrossed, 
  Compass, 
  Bot, 
  Heart, 
  Check, 
  Sliders, 
  Smile, 
  Play,
  Layers,
  Smartphone,
  QrCode,
  Users,
  Lock,
  Pencil
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CategoryId, DifficultyLevel, Player } from '../types/quiz';
import { CATEGORIES, AVATAR_OPTIONS, INITIAL_QUESTIONS } from '../data/questions';
import { sound } from '../utils/audio';
import { ParCoeurLogo } from './ParCoeurLogo';

interface MainMenuProps {
  player1: Player;
  player2: Player;
  onUpdatePlayer1: (p: Partial<Player>) => void;
  onUpdatePlayer2: (p: Partial<Player>) => void;
  selectedCategories: CategoryId[];
  onToggleCategory: (cat: CategoryId) => void;
  globalDifficulty: DifficultyLevel;
  onChangeDifficulty: (diff: DifficultyLevel) => void;
  questionCount: number;
  onChangeQuestionCount: (count: number) => void;
  onStartGame: () => void;
  isLoadingAi?: boolean;
  onOpenMultiplayer: () => void;
  urlRoomCode?: string;
  savedRoomCode?: string | null;
  onReconnectRoom?: () => void;
  onClearSavedRoom?: () => void;
  isReconnecting?: boolean;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  player1,
  player2,
  onUpdatePlayer1,
  onUpdatePlayer2,
  selectedCategories,
  onToggleCategory,
  globalDifficulty,
  onChangeDifficulty,
  questionCount,
  onChangeQuestionCount,
  onStartGame,
  isLoadingAi,
  onOpenMultiplayer,
  urlRoomCode,
  savedRoomCode,
  onReconnectRoom,
  onClearSavedRoom,
  isReconnecting,
}) => {
  const [activeAvatarPicker, setActiveAvatarPicker] = useState<1 | 2 | null>(null);
  const [showNsfwNotice, setShowNsfwNotice] = useState<boolean>(false);

  const p1Trimmed = (player1.name || '').trim();
  const p2Trimmed = (player2.name || '').trim();
  // Name must be at least 2 characters and not default placeholder names
  const isP1Valid = p1Trimmed.length >= 2 && p1Trimmed !== 'Joueur 1' && p1Trimmed !== 'Moi';
  const isP2Valid = p2Trimmed.length >= 2 && p2Trimmed !== 'Joueur 2' && p2Trimmed !== 'Mon Amour';
  const canConfirmNames = isP1Valid && isP2Valid;

  const [isPlayersConfirmed, setIsPlayersConfirmed] = useState<boolean>(() => {
    try {
      const confirmed = localStorage.getItem('duoquiz_players_confirmed');
      if (confirmed === 'true' && isP1Valid && isP2Valid) return true;
    } catch {}
    return false;
  });

  const [isEditingPlayers, setIsEditingPlayers] = useState<boolean>(!isPlayersConfirmed);
  const [previousValidNames, setPreviousValidNames] = useState<{ p1: string; p2: string }>({
    p1: isP1Valid ? p1Trimmed : '',
    p2: isP2Valid ? p2Trimmed : '',
  });

  // If a player clears or shortens either name below 2 characters, immediately invalidate confirmation and re-lock
  useEffect(() => {
    if (!canConfirmNames && isPlayersConfirmed) {
      setIsPlayersConfirmed(false);
      setIsEditingPlayers(true);
      try {
        localStorage.removeItem('duoquiz_players_confirmed');
      } catch {}
    }
  }, [canConfirmNames, isPlayersConfirmed]);

  const handleConfirmPlayers = () => {
    if (!canConfirmNames) return;
    sound.playSuccess();
    sound.vibrate(25);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.35 },
    });
    onUpdatePlayer1({ name: p1Trimmed });
    onUpdatePlayer2({ name: p2Trimmed });
    setPreviousValidNames({ p1: p1Trimmed, p2: p2Trimmed });
    setIsPlayersConfirmed(true);
    setIsEditingPlayers(false);
    try {
      localStorage.setItem('duoquiz_players_confirmed', 'true');
    } catch {}
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'UtensilsCrossed':
        return <UtensilsCrossed className="w-5 h-5" />;
      case 'Brain':
        return <Brain className="w-5 h-5" />;
      case 'Compass':
        return <Compass className="w-5 h-5" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-rose-400" />;
      case 'Bot':
        return <Bot className="w-5 h-5 text-fuchsia-400" />;
      default:
        return <Heart className="w-5 h-5" />;
    }
  };

  const isCoquinSelected = selectedCategories.includes('coquin');

  return (
    <div className="flex flex-col gap-6 pb-10 pt-2 max-w-lg mx-auto w-full px-4 animate-fade-in">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-950/60 via-zinc-900 to-zinc-900 border border-rose-500/20 p-5 sm:p-6 text-center shadow-xl">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-pink-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Logo Badge Concept 1 */}
          <div className="mb-3">
            <ParCoeurLogo variant="badge" size={44} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold mb-2">
            <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
            <span>Quiz de complicité & secrets</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            Vous connaissez-vous <br />
            <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
              vraiment par cœur ?
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 mt-2 max-w-xs">
            Devinez les souvenirs, goûts et fantasmes de votre partenaire !
          </p>
        </div>
      </div>

      {/* Resume Active Multiplayer Game Banner if session exists */}
      {savedRoomCode && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-rose-950/90 via-zinc-900 to-zinc-900 border-2 border-rose-500/60 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0 border border-rose-500/30 text-xl">
              🔄
            </div>
            <div className="text-left flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Partie en cours trouvée !</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[11px] font-extrabold border border-rose-500/30">
                  {savedRoomCode}
                </span>
              </div>
              <div className="text-[11px] text-zinc-300 mt-0.5">
                Vous avez quitté par mégarde ? Reprenez sans perdre vos réponses ni vos scores !
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
            {onClearSavedRoom && (
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  onClearSavedRoom();
                }}
                className="px-3 py-2 rounded-xl text-zinc-400 hover:text-zinc-200 text-xs font-semibold hover:bg-zinc-800 transition-colors active:scale-95"
              >
                Ignorer
              </button>
            )}
            {onReconnectRoom && (
              <button
                type="button"
                disabled={isReconnecting}
                onClick={() => {
                  sound.playTap();
                  onReconnectRoom();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs shadow-md shadow-rose-950/50 active:scale-95 transition-all disabled:opacity-50"
              >
                {isReconnecting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Reconnexion...</span>
                  </>
                ) : (
                  <>
                    <span>Reprendre la partie</span>
                    <span>➜</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* URL Room Code Invitation Alert if present */}
      {urlRoomCode && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-rose-950/80 to-zinc-900 border border-rose-500/50 flex items-center justify-between gap-3 shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Invitation de salon reçue !</div>
              <div className="text-[11px] text-rose-300">Salon : <span className="font-mono font-bold">{urlRoomCode}</span></div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onOpenMultiplayer();
            }}
            className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md shrink-0 active:scale-95 transition-all"
          >
            Rejoindre
          </button>
        </div>
      )}

      {/* 1. Players Section: Pseudos & Avatars */}
      <div className={`rounded-3xl p-4 space-y-3.5 shadow-sm transition-all border ${
        !isPlayersConfirmed 
          ? 'bg-zinc-900/90 border-rose-500/60 shadow-lg shadow-rose-950/30' 
          : 'bg-zinc-900/80 border-zinc-800'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smile className="w-4 h-4 text-rose-400" />
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
              {!isPlayersConfirmed ? 'Étape 1 : Vos Pseudos' : 'Les Joueurs'}
            </h2>
          </div>
          {!isPlayersConfirmed ? (
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
              Étape obligatoire
            </span>
          ) : (
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Prénoms validés
            </span>
          )}
        </div>

        {/* When confirmed and collapsed */}
        {isPlayersConfirmed && !isEditingPlayers ? (
          <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center -space-x-1">
                <span className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-base">
                  {player1.avatar}
                </span>
                <span className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-base">
                  {player2.avatar}
                </span>
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="text-rose-300">{player1.name}</span>
                  <span className="text-zinc-500">&</span>
                  <span className="text-pink-300">{player2.name}</span>
                </div>
                <div className="text-[10px] text-zinc-400">
                  Prêts pour le quiz (1 ou 2 téléphones)
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                sound.playTap();
                setPreviousValidNames({ p1: player1.name, p2: player2.name });
                setIsEditingPlayers(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Pencil className="w-3 h-3" />
              <span>Modifier</span>
            </button>
          </div>
        ) : (
          /* Form for entering / editing names */
          <div className="space-y-3">
            {!isPlayersConfirmed && (
              <p className="text-xs text-zinc-400 text-left">
                Renseignez vos prénoms pour débloquer le mode 1 ou 2 téléphones et démarrer votre quiz.
              </p>
            )}

            <div className="grid grid-cols-2 gap-3">
              {/* Player 1 Card */}
              <div className={`p-3 rounded-2xl bg-zinc-950/70 border transition-all ${
                activeAvatarPicker === 1
                  ? 'border-rose-500/80 ring-2 ring-rose-500/20 bg-rose-950/10'
                  : 'border-zinc-800 focus-within:border-rose-500/50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                    Joueur 1
                  </span>

                  {/* Explicit Avatar Button */}
                  <button
                    type="button"
                    onClick={() => {
                      sound.playTap();
                      setActiveAvatarPicker(activeAvatarPicker === 1 ? null : 1);
                    }}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                      activeAvatarPicker === 1
                        ? 'bg-rose-500 text-white ring-2 ring-rose-400 shadow-sm'
                        : 'bg-zinc-850 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80'
                    }`}
                    title="Changer d'avatar"
                  >
                    <span className="text-base leading-none">{player1.avatar}</span>
                    <span className="text-[10px] font-medium text-rose-200">Avatar</span>
                    <Pencil className="w-2.5 h-2.5 text-rose-300" />
                  </button>
                </div>

                <div className="space-y-1">
                  <label htmlFor="player1-name-input" className="block text-[10px] text-zinc-400 font-medium">
                    Prénom
                  </label>
                  <input
                    id="player1-name-input"
                    type="text"
                    value={player1.name}
                    onChange={(e) => onUpdatePlayer1({ name: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (canConfirmNames) handleConfirmPlayers();
                      }
                    }}
                    placeholder="Ex: Matt"
                    maxLength={15}
                    className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-2.5 py-1.5 font-medium text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-rose-500/80 transition-colors"
                  />
                </div>
              </div>

              {/* Player 2 Card */}
              <div className={`p-3 rounded-2xl bg-zinc-950/70 border transition-all ${
                activeAvatarPicker === 2
                  ? 'border-pink-500/80 ring-2 ring-pink-500/20 bg-pink-950/10'
                  : 'border-zinc-800 focus-within:border-pink-500/50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-pink-400 uppercase tracking-wider">
                    Joueur 2
                  </span>

                  {/* Explicit Avatar Button */}
                  <button
                    type="button"
                    onClick={() => {
                      sound.playTap();
                      setActiveAvatarPicker(activeAvatarPicker === 2 ? null : 2);
                    }}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                      activeAvatarPicker === 2
                        ? 'bg-pink-500 text-white ring-2 ring-pink-400 shadow-sm'
                        : 'bg-zinc-850 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80'
                    }`}
                    title="Changer d'avatar"
                  >
                    <span className="text-base leading-none">{player2.avatar}</span>
                    <span className="text-[10px] font-medium text-pink-200">Avatar</span>
                    <Pencil className="w-2.5 h-2.5 text-pink-300" />
                  </button>
                </div>

                <div className="space-y-1">
                  <label htmlFor="player2-name-input" className="block text-[10px] text-zinc-400 font-medium">
                    Prénom
                  </label>
                  <input
                    id="player2-name-input"
                    type="text"
                    value={player2.name}
                    onChange={(e) => onUpdatePlayer2({ name: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (canConfirmNames) handleConfirmPlayers();
                      }
                    }}
                    placeholder="Ex: Julie"
                    maxLength={15}
                    className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-2.5 py-1.5 font-medium text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-pink-500/80 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Dedicated Avatar Picker Panel */}
            {activeAvatarPicker && (
              <div className="p-3.5 rounded-2xl bg-zinc-950/95 border border-zinc-700 shadow-2xl animate-fade-in space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 border border-rose-500/30 flex items-center justify-center text-base">
                      {activeAvatarPicker === 1 ? player1.avatar : player2.avatar}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>Choisir l'avatar de</span>
                        <span className={activeAvatarPicker === 1 ? 'text-rose-400 font-extrabold' : 'text-pink-400 font-extrabold'}>
                          {activeAvatarPicker === 1 ? player1.name || 'Joueur 1' : player2.name || 'Joueur 2'}
                        </span>
                      </h4>
                      <p className="text-[10px] text-zinc-400">
                        Touchez un avatar ci-dessous pour l'attribuer
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveAvatarPicker(null)}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors"
                  >
                    Fermer ✕
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2 max-h-52 overflow-y-auto pr-0.5">
                  {AVATAR_OPTIONS.map((item) => {
                    const [emoji, ...nameParts] = item.label.split(' ');
                    const labelName = nameParts.join(' ');
                    const currentAvatar = activeAvatarPicker === 1 ? player1.avatar : player2.avatar;
                    const isSelected = currentAvatar === emoji;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          sound.playTap();
                          if (activeAvatarPicker === 1) {
                            onUpdatePlayer1({ avatar: emoji });
                          } else {
                            onUpdatePlayer2({ avatar: emoji });
                          }
                          setActiveAvatarPicker(null);
                        }}
                        className={`group relative flex flex-col items-center justify-center p-2 rounded-xl transition-all active:scale-95 ${
                          isSelected
                            ? activeAvatarPicker === 1
                              ? 'bg-rose-500/20 border-2 border-rose-500 ring-2 ring-rose-500/30 shadow-md'
                              : 'bg-pink-500/20 border-2 border-pink-500 ring-2 ring-pink-500/30 shadow-md'
                            : 'bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700'
                        }`}
                        title={item.label}
                      >
                        {isSelected && (
                          <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-white flex items-center justify-center text-[9px] font-bold shadow ${
                            activeAvatarPicker === 1 ? 'bg-rose-500' : 'bg-pink-500'
                          }`}>
                            ✓
                          </span>
                        )}
                        <span className="text-2xl transition-transform group-hover:scale-110">
                          {emoji}
                        </span>
                        <span className={`text-[10px] font-medium mt-1 truncate max-w-full ${
                          isSelected 
                            ? (activeAvatarPicker === 1 ? 'text-rose-300 font-bold' : 'text-pink-300 font-bold') 
                            : 'text-zinc-400 group-hover:text-zinc-200'
                        }`}>
                          {labelName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Validation warning if names are too short or empty */}
            {!canConfirmNames && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center animate-fade-in">
                <p className="text-[11px] text-amber-300 font-medium flex items-center justify-center gap-1.5">
                  <span>⚠️</span>
                  <span>
                    {!p1Trimmed && !p2Trimmed
                      ? 'Renseignez un prénom (au moins 2 lettres) pour chaque joueur.'
                      : !isP1Valid
                      ? (p1Trimmed === 'Joueur 1' || p1Trimmed === 'Moi'
                          ? 'Veuillez choisir un vrai prénom pour le Joueur 1.'
                          : 'Le prénom du Joueur 1 doit comporter au moins 2 lettres.')
                      : (p2Trimmed === 'Joueur 2' || p2Trimmed === 'Mon Amour'
                          ? 'Veuillez choisir un vrai prénom pour le Joueur 2.'
                          : 'Le prénom du Joueur 2 doit comporter au moins 2 lettres.')}
                  </span>
                </p>
              </div>
            )}

            {/* Validation / Action Button: strictly disabled if !canConfirmNames */}
            <button
              type="button"
              disabled={!canConfirmNames}
              onClick={handleConfirmPlayers}
              className={`w-full py-3.5 px-4 rounded-2xl font-display font-bold text-sm flex items-center justify-center gap-2 shadow-xl transition-all active:scale-[0.98] ${
                canConfirmNames
                  ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white shadow-rose-950/50 hover:brightness-105 animate-pulse cursor-pointer'
                  : 'bg-zinc-800/80 text-zinc-500 cursor-not-allowed border border-zinc-800 opacity-60 pointer-events-none'
              }`}
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>
                {previousValidNames.p1 && previousValidNames.p2
                  ? 'Enregistrer les modifications ✓'
                  : 'Valider nos prénoms & débloquer le jeu ✨'}
              </span>
            </button>

            {/* Cancel Button: restores previous valid names if available */}
            {previousValidNames.p1 && previousValidNames.p2 && isEditingPlayers && (
              <div className="flex justify-center pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    sound.playTap();
                    onUpdatePlayer1({ name: previousValidNames.p1 });
                    onUpdatePlayer2({ name: previousValidNames.p2 });
                    setIsPlayersConfirmed(true);
                    setIsEditingPlayers(false);
                    try {
                      localStorage.setItem('duoquiz_players_confirmed', 'true');
                    } catch {}
                  }}
                  className="text-xs text-zinc-400 hover:text-zinc-200 underline font-medium transition-colors py-1"
                >
                  Annuler et rétablir ({previousValidNames.p1} & {previousValidNames.p2})
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Rest of the Settings: Blurred & Locked if players are not confirmed */}
      <div className="relative">
        {!isPlayersConfirmed && (
          <div className="p-5 rounded-3xl bg-zinc-950/90 border border-rose-500/40 text-center flex flex-col items-center justify-center shadow-2xl mb-4 space-y-2 animate-fade-in">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-md">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-white">
                Modes & Réglages verrouillés
              </h3>
              <p className="text-xs text-zinc-400 max-w-xs leading-relaxed mt-1">
                Renseigne et valide vos deux prénoms dans l'<strong>Étape 1</strong> ci-dessus pour débloquer le choix du mode (1 ou 2 téléphones) et lancer la partie !
              </p>
            </div>
          </div>
        )}

        <div className={`space-y-5 transition-all duration-500 ${!isPlayersConfirmed ? 'filter blur-[5px] opacity-25 pointer-events-none select-none' : 'filter-none opacity-100'}`}>
          {/* Game Mode Selector Card: 1 Phone vs 2 Phones */}
          <div className="rounded-3xl bg-zinc-900/80 border border-zinc-800 p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-rose-400" />
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
              Mode de Jeu
            </h2>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Nouveau : 2 Téléphones !
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Option 1: 1 Phone (Canapé) */}
          <div className="p-3.5 rounded-2xl bg-zinc-950/90 border border-rose-500/60 shadow-md shadow-rose-950/30 flex flex-col justify-between text-left relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
            </div>
            <div>
              <div className="text-xl mb-1">📱</div>
              <div className="font-bold text-xs text-white">1 Téléphone</div>
              <div className="text-[10px] text-zinc-400 mt-0.5 leading-tight">
                Passe-et-joue sur un seul écran ensemble.
              </div>
            </div>
            <div className="mt-2 text-[10px] font-semibold text-rose-400">
              ✓ Mode actif
            </div>
          </div>

          {/* Option 2: 2 Phones (Multiplayer) */}
          <button
            type="button"
            disabled={!canConfirmNames}
            onClick={() => {
              if (!canConfirmNames) {
                sound.playTap();
                setIsPlayersConfirmed(false);
                setIsEditingPlayers(true);
                return;
              }
              sound.playTap();
              onOpenMultiplayer();
            }}
            className="p-3.5 rounded-2xl bg-zinc-950/50 hover:bg-zinc-950/80 border border-zinc-800 hover:border-pink-500/50 flex flex-col justify-between text-left transition-all active:scale-95 group"
          >
            <div>
              <div className="text-xl mb-1 group-hover:scale-110 transition-transform">📱📱</div>
              <div className="font-bold text-xs text-zinc-200 group-hover:text-pink-300 transition-colors">
                2 Téléphones
              </div>
              <div className="text-[10px] text-zinc-400 mt-0.5 leading-tight">
                Chacun son écran avec code ou QR Code !
              </div>
            </div>
            <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-pink-400">
              <span>Jouer à deux</span>
              <span>→</span>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Difficulty selector */}
      <div className="rounded-3xl bg-zinc-900/80 border border-zinc-800 p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-rose-400" />
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
              Difficulté par manche
            </h2>
          </div>
          <span className="text-[11px] text-zinc-400">Modifiable pendant le jeu</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onChangeDifficulty('easy');
            }}
            className={`p-3 rounded-2xl flex flex-col items-center text-center border transition-all ${
              globalDifficulty === 'easy'
                ? 'bg-rose-500/15 border-rose-500/60 text-white shadow-sm'
                : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span className="text-base mb-1">🌸</span>
            <span className="text-xs font-bold">Douce</span>
            <span className="text-[10px] text-zinc-400 mt-0.5">Souvenirs clairs</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onChangeDifficulty('medium');
            }}
            className={`p-3 rounded-2xl flex flex-col items-center text-center border transition-all ${
              globalDifficulty === 'medium'
                ? 'bg-amber-500/15 border-amber-500/60 text-white shadow-sm'
                : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span className="text-base mb-1">💫</span>
            <span className="text-xs font-bold">Complice</span>
            <span className="text-[10px] text-zinc-400 mt-0.5">Détails subtils</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onChangeDifficulty('spicy');
            }}
            className={`p-3 rounded-2xl flex flex-col items-center text-center border transition-all ${
              globalDifficulty === 'spicy'
                ? 'bg-red-500/20 border-red-500/70 text-white shadow-sm'
                : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span className="text-base mb-1">🌶️</span>
            <span className="text-xs font-bold">Pimentée</span>
            <span className="text-[10px] text-zinc-400 mt-0.5">Secrets & intime</span>
          </button>
        </div>
      </div>

      {/* 3. Thematic Categories Section */}
      <div className="rounded-3xl bg-zinc-900/80 border border-zinc-800 p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-rose-400" />
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
              Catégories Thématiques
            </h2>
          </div>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20">
            {INITIAL_QUESTIONS.length.toLocaleString('fr-FR')} questions inédites
          </span>
        </div>

        <div className="space-y-2">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategories.includes(category.id);
            const isCoquin = category.id === 'coquin';
            const categoryCount = INITIAL_QUESTIONS.filter((q) => q.category === category.id).length;
            const countLabel = category.id === 'custom_ai' ? 'IA infinie' : `${categoryCount} questions`;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  sound.playTap();
                  if (isCoquin && !isSelected && !showNsfwNotice) {
                    setShowNsfwNotice(true);
                  }
                  onToggleCategory(category.id);
                }}
                className={`w-full p-3.5 rounded-2xl flex items-center justify-between text-left transition-all border ${
                  isSelected
                    ? isCoquin
                      ? 'bg-rose-950/40 border-rose-500/60 shadow-md shadow-rose-950/40'
                      : 'bg-zinc-950/80 border-rose-500/50'
                    : 'bg-zinc-950/40 border-zinc-800/60 hover:bg-zinc-950/60 opacity-80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? isCoquin
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                          : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                        : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                    }`}
                  >
                    {getCategoryIcon(category.icon)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-white">
                        {category.name}
                      </span>
                      {isCoquin && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-500/20 text-rose-400 border border-rose-500/40">
                          18+
                        </span>
                      )}
                      <span className="text-[10px] font-medium text-zinc-400 px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800">
                        {countLabel}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {category.tagline}
                    </p>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                    isSelected
                      ? isCoquin
                        ? 'bg-rose-500 border-rose-500 text-white'
                        : 'bg-rose-500 border-rose-500 text-white'
                      : 'border-zinc-700 bg-zinc-900'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Coquin Notice banner if selected */}
        {isCoquinSelected && (
          <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-200 animate-fade-in">
            <Flame className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Mode Coquin actif :</span> Les questions aborderont des fantasmes, l'intimité sous la couette et la sensualité avec bienveillance et complicité !
            </div>
          </div>
        )}
      </div>

      {/* 4. Number of rounds setting */}
      <div className="rounded-3xl bg-zinc-900/80 border border-zinc-800 p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-white tracking-wide uppercase">
            Longueur de partie
          </span>
          <span className="text-xs text-zinc-400">
            {questionCount === 99 ? 'Partie illimitée' : `${questionCount} questions`}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[5, 10, 15, 99].map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => {
                sound.playTap();
                onChangeQuestionCount(count);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                questionCount === count
                  ? 'bg-zinc-100 text-zinc-900 border-zinc-100 shadow-sm'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {count === 99 ? 'Infini' : `${count} Q.`}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Launch Game Button - Positioned cleanly after settings, never blocking difficulty */}
      <div className="pt-2">
        <button
          type="button"
          disabled={selectedCategories.length === 0 || isLoadingAi || !canConfirmNames}
          onClick={() => {
            if (!canConfirmNames) {
              sound.playTap();
              setIsPlayersConfirmed(false);
              setIsEditingPlayers(true);
              return;
            }
            sound.playSuccess();
            sound.vibrate(25);
            onStartGame();
          }}
          className={`w-full h-14 rounded-2xl flex items-center justify-center gap-2.5 font-display font-bold text-base shadow-xl transition-all active:scale-[0.98] ${
            selectedCategories.length === 0
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white shadow-rose-950/50 hover:brightness-105 shadow-lg shadow-rose-500/25 ring-1 ring-rose-400/30'
          }`}
        >
          {isLoadingAi ? (
            <span>Génération des questions magiques...</span>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>Lancer le Quiz de Couple</span>
            </>
          )}
        </button>
      </div>
      </div>
      </div>
    </div>
  );
};
