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
  Pencil,
  ChevronRight,
  ShieldCheck,
  Zap,
  ArrowRight
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

  // Re-lock if names become invalid
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
      particleCount: 45,
      spread: 65,
      origin: { y: 0.35 },
      colors: ['#f43f5e', '#fb7185', '#f59e0b', '#ec4899', '#ffffff'],
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
        return <Sparkles className="w-5 h-5 text-amber-300" />;
      case 'UtensilsCrossed':
        return <UtensilsCrossed className="w-5 h-5 text-rose-300" />;
      case 'Brain':
        return <Brain className="w-5 h-5 text-pink-300" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-orange-300" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-rose-400" />;
      case 'Bot':
        return <Bot className="w-5 h-5 text-fuchsia-300" />;
      default:
        return <Heart className="w-5 h-5 text-rose-300" />;
    }
  };

  const isCoquinSelected = selectedCategories.includes('coquin');

  return (
    <div className="flex flex-col gap-5 pb-12 pt-1 max-w-lg mx-auto w-full px-4 animate-fade-in relative z-10">
      
      {/* ========================================================
          1. HERO WELCOME CARD (Sensuel & Immersif iOS)
         ======================================================== */}
      <div className="relative overflow-hidden rounded-[30px] ios-glass p-6 text-center shadow-2xl border border-white/[0.08]">
        {/* Soft background glow meshes */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center">
          {/* Logo Badge */}
          <div className="mb-3.5">
            <ParCoeurLogo variant="badge" size={46} />
          </div>

          {/* Romantic Badge Pill */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.09] text-rose-200 text-xs font-semibold mb-3 shadow-inner">
            <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400 animate-pulse" />
            <span>Quiz de complicité & confidences</span>
          </div>

          {/* High-craft Title */}
          <h1 className="text-2xl sm:text-[28px] font-display font-extrabold text-white tracking-tight leading-tight">
            Vous connaissez-vous <br />
            <span className="bg-gradient-to-r from-rose-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">
              vraiment par cœur ?
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 mt-2.5 max-w-xs leading-relaxed">
            Devinez les souvenirs, goûts secrets et fantasmes inavoués de votre partenaire.
          </p>
        </div>
      </div>

      {/* ========================================================
          RESUME SESSION / URL INVITE BANNER (if active)
         ======================================================== */}
      {savedRoomCode && (
        <div className="p-4 rounded-[24px] ios-glass-glow flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/15 text-rose-300 flex items-center justify-center shrink-0 border border-rose-500/30 text-xl">
              🔄
            </div>
            <div className="text-left flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Partie en cours trouvée</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[11px] font-extrabold border border-rose-500/30">
                  {savedRoomCode}
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                Reprenez là où vous en étiez sans perdre vos réponses !
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
                className="px-3.5 py-2 rounded-xl text-zinc-400 hover:text-white text-xs font-semibold hover:bg-white/[0.06] transition-colors active:scale-95"
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
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs shadow-md shadow-rose-950/50 active:scale-95 transition-all disabled:opacity-50"
              >
                {isReconnecting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Reconnexion...</span>
                  </>
                ) : (
                  <>
                    <span>Reprendre</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {urlRoomCode && (
        <div className="p-4 rounded-[24px] ios-glass-glow flex items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0 border border-rose-500/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white">Invitation de salon reçue</div>
              <div className="text-[11px] text-rose-300/90">Salon : <span className="font-mono font-bold text-white">{urlRoomCode}</span></div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onOpenMultiplayer();
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs shadow-md shrink-0 active:scale-95 transition-all"
          >
            Rejoindre
          </button>
        </div>
      )}

      {/* ========================================================
          2. FLOATING PLAYER INPUT CARDS (Étape 1 : Vos Pseudos)
         ======================================================== */}
      <div className={`rounded-[28px] p-5 space-y-4 transition-all duration-300 border ${
        !isPlayersConfirmed 
          ? 'ios-glass-glow' 
          : 'ios-glass'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-rose-500/15 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Smile className="w-4 h-4" />
            </div>
            <h2 className="text-xs sm:text-sm font-semibold text-white tracking-wider uppercase">
              {!isPlayersConfirmed ? 'Étape 1 : Vos Prénoms' : 'Les Joueurs'}
            </h2>
          </div>
          {!isPlayersConfirmed ? (
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 animate-pulse">
              Étape requise
            </span>
          ) : (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              Validés
            </span>
          )}
        </div>

        {/* When confirmed and collapsed */}
        {isPlayersConfirmed && !isEditingPlayers ? (
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center -space-x-1.5">
                <span className="w-9 h-9 rounded-2xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-lg shadow-sm">
                  {player1.avatar}
                </span>
                <span className="w-9 h-9 rounded-2xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-lg shadow-sm">
                  {player2.avatar}
                </span>
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="text-amber-300">{player1.name}</span>
                  <span className="text-zinc-600 font-normal">&</span>
                  <span className="text-rose-300">{player2.name}</span>
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">
                  Prêts pour tester votre complicité
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
              className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/[0.06] active:scale-95"
            >
              <Pencil className="w-3 h-3 text-rose-300" />
              <span>Modifier</span>
            </button>
          </div>
        ) : (
          /* Floating Player Form */
          <div className="space-y-4">
            {!isPlayersConfirmed && (
              <p className="text-xs text-zinc-400 text-left leading-relaxed">
                Renseignez vos prénoms pour débloquer le jeu et lancer votre manche.
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Floating Card: Joueur 1 (Warm Amber/Coral Theme) */}
              <div className={`p-4 rounded-2xl transition-all border ${
                activeAvatarPicker === 1
                  ? 'bg-amber-500/10 border-amber-500/40 ring-2 ring-amber-500/20'
                  : 'bg-black/35 border-white/[0.06] focus-within:border-amber-400/50'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-amber-400/90 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Joueur 1
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playTap();
                      setActiveAvatarPicker(activeAvatarPicker === 1 ? null : 1);
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all active:scale-95 border ${
                      activeAvatarPicker === 1
                        ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-sm'
                        : 'bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200 border-white/[0.08]'
                    }`}
                    title="Changer d'avatar"
                  >
                    <span className="text-base leading-none">{player1.avatar}</span>
                    <span className="text-[10px] text-zinc-300">Avatar</span>
                    <Pencil className="w-2.5 h-2.5 opacity-60" />
                  </button>
                </div>

                <div className="space-y-1 text-left">
                  <label htmlFor="player1-name-input" className="block text-[10px] text-zinc-400 font-medium">
                    Prénom ou surnom
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
                    className="w-full h-11 bg-black/40 border border-white/[0.08] rounded-xl px-3 font-semibold text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-amber-400/80 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Floating Card: Joueur 2 (Sensual Rose/Berry Theme) */}
              <div className={`p-4 rounded-2xl transition-all border ${
                activeAvatarPicker === 2
                  ? 'bg-rose-500/10 border-rose-500/40 ring-2 ring-rose-500/20'
                  : 'bg-black/35 border-white/[0.06] focus-within:border-rose-400/50'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-rose-400/90 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    Joueur 2
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playTap();
                      setActiveAvatarPicker(activeAvatarPicker === 2 ? null : 2);
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all active:scale-95 border ${
                      activeAvatarPicker === 2
                        ? 'bg-rose-500 text-white border-rose-400 shadow-sm'
                        : 'bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200 border-white/[0.08]'
                    }`}
                    title="Changer d'avatar"
                  >
                    <span className="text-base leading-none">{player2.avatar}</span>
                    <span className="text-[10px] text-zinc-300">Avatar</span>
                    <Pencil className="w-2.5 h-2.5 opacity-60" />
                  </button>
                </div>

                <div className="space-y-1 text-left">
                  <label htmlFor="player2-name-input" className="block text-[10px] text-zinc-400 font-medium">
                    Prénom ou surnom
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
                    placeholder="Ex: Jess"
                    maxLength={15}
                    className="w-full h-11 bg-black/40 border border-white/[0.08] rounded-xl px-3 font-semibold text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-rose-400/80 focus:ring-2 focus:ring-rose-500/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Avatar Drawer */}
            {activeAvatarPicker && (
              <div className="p-4 rounded-2xl bg-[#141419]/95 border border-white/[0.12] shadow-2xl animate-fade-in space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-white/[0.08] border border-white/[0.1] flex items-center justify-center text-base">
                      {activeAvatarPicker === 1 ? player1.avatar : player2.avatar}
                    </span>
                    <div className="text-left">
                      <h4 className="text-xs font-bold text-white">
                        Avatar pour {activeAvatarPicker === 1 ? player1.name || 'Joueur 1' : player2.name || 'Joueur 2'}
                      </h4>
                      <p className="text-[10px] text-zinc-400">
                        Touchez un avatar complice pour l'attribuer
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveAvatarPicker(null)}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-zinc-300 text-xs font-medium transition-colors border border-white/[0.06]"
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
                        className={`group relative flex flex-col items-center justify-center p-2.5 rounded-2xl transition-all active:scale-95 border ${
                          isSelected
                            ? 'bg-rose-500/20 border-rose-500/80 ring-2 ring-rose-500/30 shadow-md'
                            : 'bg-black/40 hover:bg-white/[0.06] border-white/[0.06]'
                        }`}
                        title={item.label}
                      >
                        {isSelected && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[9px] font-bold shadow">
                            ✓
                          </span>
                        )}
                        <span className="text-2xl transition-transform group-hover:scale-110">
                          {emoji}
                        </span>
                        <span className={`text-[10px] font-medium mt-1 truncate max-w-full ${
                          isSelected ? 'text-rose-300 font-bold' : 'text-zinc-400'
                        }`}>
                          {labelName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Warning if names incomplete */}
            {!canConfirmNames && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-center animate-fade-in">
                <p className="text-[11px] text-amber-300 font-medium flex items-center justify-center gap-1.5">
                  <span>✨</span>
                  <span>
                    {!p1Trimmed && !p2Trimmed
                      ? 'Renseignez un prénom pour chacun pour continuer.'
                      : !isP1Valid
                      ? 'Le prénom du Joueur 1 doit comporter au moins 2 lettres.'
                      : 'Le prénom du Joueur 2 doit comporter au moins 2 lettres.'}
                  </span>
                </p>
              </div>
            )}

            {/* ========================================================
                VALIDATION BUTTON (Grand bouton pleine largeur avec Shimmer)
               ======================================================== */}
            <button
              type="button"
              disabled={!canConfirmNames}
              onClick={handleConfirmPlayers}
              className={`w-full h-14 rounded-2xl font-display font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl transition-all active:scale-[0.98] ${
                canConfirmNames
                  ? 'bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 text-white shadow-rose-950/60 hover:brightness-105 animate-shimmer cursor-pointer border border-white/20'
                  : 'bg-white/[0.04] text-zinc-500 cursor-not-allowed border border-white/[0.04] opacity-50 pointer-events-none'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-200 fill-amber-200" />
              <span>
                {previousValidNames.p1 && previousValidNames.p2
                  ? 'Enregistrer les modifications'
                  : 'Valider nos prénoms & débloquer le jeu'}
              </span>
            </button>

            {/* Cancel Button */}
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
                  className="text-xs text-zinc-400 hover:text-white underline font-medium transition-colors py-1"
                >
                  Annuler et rétablir ({previousValidNames.p1} & {previousValidNames.p2})
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================
          3. GAME SETTINGS (Sensual Glassmorphic, Locked until validated)
         ======================================================== */}
      <div className="relative">
        {!isPlayersConfirmed && (
          <div className="p-6 rounded-[28px] ios-glass text-center flex flex-col items-center justify-center shadow-2xl mb-4 space-y-2.5 animate-fade-in border border-amber-500/25">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 shadow-md">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-white">
                Modes & Réglages protégés
              </h3>
              <p className="text-xs text-zinc-400 max-w-xs leading-relaxed mt-1">
                Validez vos deux prénoms ci-dessus pour déverrouiller le choix du mode (1 ou 2 téléphones) et lancer la partie.
              </p>
            </div>
          </div>
        )}

        <div className={`space-y-4 transition-all duration-500 ${
          !isPlayersConfirmed 
            ? 'filter blur-[6px] opacity-20 pointer-events-none select-none' 
            : 'filter-none opacity-100'
        }`}>
          {/* Game Mode Selector Card: 1 Phone vs 2 Phones */}
          <div className="rounded-[28px] ios-glass p-5 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-rose-500/15 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h2 className="text-xs sm:text-sm font-semibold text-white tracking-wider uppercase">
                  Mode de Jeu
                </h2>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                Multi-écrans disponible
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Option 1: 1 Phone (Canapé) */}
              <div className="p-4 rounded-2xl bg-black/40 border border-rose-500/50 shadow-md flex flex-col justify-between text-left relative overflow-hidden">
                <div className="absolute top-2.5 right-2.5">
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                </div>
                <div>
                  <div className="text-2xl mb-1.5">🛋️</div>
                  <div className="font-bold text-xs text-white">1 Téléphone</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5 leading-tight">
                    Passez-vous l'écran côte à côte sur le canapé.
                  </div>
                </div>
                <div className="mt-3 text-[10px] font-semibold text-rose-300 flex items-center gap-1">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>Actif</span>
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
                className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-pink-500/40 flex flex-col justify-between text-left transition-all active:scale-95 group"
              >
                <div>
                  <div className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">📱📱</div>
                  <div className="font-bold text-xs text-zinc-200 group-hover:text-pink-300 transition-colors">
                    2 Téléphones
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5 leading-tight">
                    Chacun son écran en direct avec code ou QR Code.
                  </div>
                </div>
                <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-pink-400">
                  <span>Rejoindre</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            </div>
          </div>

          {/* Difficulty selector (Segment Style) */}
          <div className="rounded-[28px] ios-glass p-5 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-amber-300">
                  <Sliders className="w-4 h-4" />
                </div>
                <h2 className="text-xs sm:text-sm font-semibold text-white tracking-wider uppercase">
                  Intensité & Difficulté
                </h2>
              </div>
              <span className="text-[10px] text-zinc-400 font-medium">Modifiable en jeu</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  onChangeDifficulty('easy');
                }}
                className={`p-3.5 rounded-2xl flex flex-col items-center text-center border transition-all active:scale-95 ${
                  globalDifficulty === 'easy'
                    ? 'bg-rose-500/20 border-rose-500/70 text-white shadow-md'
                    : 'bg-black/35 border-white/[0.06] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span className="text-xl mb-1">🌸</span>
                <span className="text-xs font-bold">Douce</span>
                <span className="text-[9px] text-zinc-400 mt-0.5">Souvenirs clairs</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  onChangeDifficulty('medium');
                }}
                className={`p-3.5 rounded-2xl flex flex-col items-center text-center border transition-all active:scale-95 ${
                  globalDifficulty === 'medium'
                    ? 'bg-amber-500/20 border-amber-500/70 text-white shadow-md'
                    : 'bg-black/35 border-white/[0.06] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span className="text-xl mb-1">💫</span>
                <span className="text-xs font-bold">Complice</span>
                <span className="text-[9px] text-zinc-400 mt-0.5">Détails subtils</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  onChangeDifficulty('spicy');
                }}
                className={`p-3.5 rounded-2xl flex flex-col items-center text-center border transition-all active:scale-95 ${
                  globalDifficulty === 'spicy'
                    ? 'bg-rose-600/25 border-rose-500 text-white shadow-md'
                    : 'bg-black/35 border-white/[0.06] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span className="text-xl mb-1">🌶️</span>
                <span className="text-xs font-bold">Pimentée</span>
                <span className="text-[9px] text-zinc-400 mt-0.5">Secrets & intime</span>
              </button>
            </div>
          </div>

          {/* Categories Selector */}
          <div className="rounded-[28px] ios-glass p-5 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-rose-500/15 border border-rose-500/20 flex items-center justify-center text-rose-300">
                  <Layers className="w-4 h-4" />
                </div>
                <h2 className="text-xs sm:text-sm font-semibold text-white tracking-wider uppercase">
                  Thèmes du Quiz
                </h2>
              </div>
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-white/[0.05] text-zinc-300 border border-white/[0.08]">
                {INITIAL_QUESTIONS.length.toLocaleString('fr-FR')} questions
              </span>
            </div>

            <div className="space-y-2.5">
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
                      sound.hapticSelection();
                      if (isCoquin && !isSelected && !showNsfwNotice) {
                        setShowNsfwNotice(true);
                      }
                      onToggleCategory(category.id);
                    }}
                    className={`w-full p-3.5 rounded-2xl flex items-center justify-between text-left transition-all border active:scale-[0.99] ${
                      isSelected
                        ? isCoquin
                          ? 'bg-rose-950/30 border-rose-500/60 shadow-lg shadow-rose-950/40'
                          : 'bg-white/[0.05] border-rose-500/40'
                        : 'bg-black/30 border-white/[0.05] hover:bg-white/[0.04] opacity-75'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                          isSelected
                            ? isCoquin
                              ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                              : 'bg-white/[0.08] text-rose-300 border-white/[0.1]'
                            : 'bg-white/[0.02] text-zinc-500 border-white/[0.04]'
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
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-rose-500/20 text-rose-400 border border-rose-500/40">
                              18+
                            </span>
                          )}
                          <span className="text-[10px] font-medium text-zinc-400 px-1.5 py-0.2 rounded bg-white/[0.04] border border-white/[0.06]">
                            {countLabel}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {category.tagline}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                        isSelected
                          ? 'bg-rose-500 border-rose-400 text-white shadow-sm'
                          : 'border-white/[0.15] bg-black/40'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Coquin Notice */}
            {isCoquinSelected && (
              <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-200 animate-fade-in text-left">
                <Flame className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-rose-300">Thème Sensuel & Coquin activé :</span> Questions intimes sur vos fantasmes et votre sensualité avec bienveillance et complicité.
                </div>
              </div>
            )}
          </div>

          {/* Question Count Setting */}
          <div className="rounded-[28px] ios-glass p-5 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-semibold text-white tracking-wider uppercase">
                Longueur de partie
              </span>
              <span className="text-xs text-zinc-400">
                {questionCount === 99 ? 'Partie illimitée' : `${questionCount} questions par manche`}
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
                  className={`py-2.5 px-3 rounded-2xl text-xs font-semibold border transition-all active:scale-95 ${
                    questionCount === count
                      ? 'bg-white text-zinc-950 border-white shadow-md'
                      : 'bg-black/35 border-white/[0.06] text-zinc-400 hover:text-white'
                  }`}
                >
                  {count === 99 ? 'Infini' : `${count} Q.`}
                </button>
              ))}
            </div>
          </div>

          {/* ========================================================
              4. LAUNCH GAME CTA (Grand bouton sensuel avec Shimmer)
             ======================================================== */}
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
              className={`w-full h-15 rounded-2xl flex items-center justify-center gap-3 font-display font-bold text-base sm:text-lg shadow-2xl transition-all active:scale-[0.98] ${
                selectedCategories.length === 0
                  ? 'bg-white/[0.05] text-zinc-500 cursor-not-allowed border border-white/[0.05]'
                  : 'bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 text-white shadow-rose-950/70 hover:brightness-105 border border-white/20 animate-shimmer cursor-pointer'
              }`}
            >
              {isLoadingAi ? (
                <span>Génération des questions complices...</span>
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

export default MainMenu;
