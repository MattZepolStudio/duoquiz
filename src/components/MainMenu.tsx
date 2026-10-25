import React, { useState } from 'react';
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
  Users
} from 'lucide-react';
import { CategoryId, DifficultyLevel, Player } from '../types/quiz';
import { CATEGORIES, AVATAR_OPTIONS } from '../data/questions';
import { sound } from '../utils/audio';

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
}) => {
  const [activeAvatarPicker, setActiveAvatarPicker] = useState<1 | 2 | null>(null);
  const [showNsfwNotice, setShowNsfwNotice] = useState<boolean>(false);

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
    <div className="flex flex-col gap-6 pb-24 pt-2 max-w-lg mx-auto w-full px-4 animate-fade-in">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-950/60 via-zinc-900 to-zinc-900 border border-rose-500/20 p-5 text-center shadow-xl">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-pink-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold mb-2">
            <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
            <span>Quiz de complicité & secrets</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            Vous connaissez-vous <br />
            <span className="bg-gradient-to-r from-rose-400 to-pink-300 bg-clip-text text-transparent">
              vraiment par cœur ?
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 mt-2 max-w-xs">
            Devinez les souvenirs, goûts et fantasmes de votre partenaire !
          </p>
        </div>
      </div>

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
            onClick={() => {
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

      {/* 1. Players Section: Pseudos & Avatars */}
      <div className="rounded-3xl bg-zinc-900/80 border border-zinc-800 p-4 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smile className="w-4 h-4 text-rose-400" />
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
              Les Joueurs (Pseudos)
            </h2>
          </div>
          <span className="text-xs text-zinc-400">Touchez pour personnaliser</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Player 1 Card */}
          <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800 focus-within:border-rose-500/50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                Joueur 1
              </span>
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  setActiveAvatarPicker(activeAvatarPicker === 1 ? null : 1);
                }}
                className="w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 flex items-center justify-center text-lg active:scale-95 transition-transform"
                title="Changer d'avatar"
              >
                {player1.avatar}
              </button>
            </div>
            <input
              type="text"
              value={player1.name}
              onChange={(e) => onUpdatePlayer1({ name: e.target.value })}
              placeholder="Ton prénom"
              maxLength={15}
              className="w-full bg-transparent font-medium text-white placeholder-zinc-500 text-sm focus:outline-none"
            />
          </div>

          {/* Player 2 Card */}
          <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800 focus-within:border-pink-500/50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-pink-400 uppercase tracking-wider">
                Joueur 2
              </span>
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  setActiveAvatarPicker(activeAvatarPicker === 2 ? null : 2);
                }}
                className="w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 flex items-center justify-center text-lg active:scale-95 transition-transform"
                title="Changer d'avatar"
              >
                {player2.avatar}
              </button>
            </div>
            <input
              type="text"
              value={player2.name}
              onChange={(e) => onUpdatePlayer2({ name: e.target.value })}
              placeholder="Son prénom"
              maxLength={15}
              className="w-full bg-transparent font-medium text-white placeholder-zinc-500 text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Quick Avatar Drawer if active */}
        {activeAvatarPicker && (
          <div className="p-3 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-400 font-medium">
                Choisis l'avatar pour {activeAvatarPicker === 1 ? player1.name || 'Joueur 1' : player2.name || 'Joueur 2'} :
              </span>
              <button
                onClick={() => setActiveAvatarPicker(null)}
                className="text-xs text-rose-400 font-semibold"
              >
                Fermer
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {AVATAR_OPTIONS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    sound.playTap();
                    const emoji = item.label.split(' ')[0];
                    if (activeAvatarPicker === 1) {
                      onUpdatePlayer1({ avatar: emoji });
                    } else {
                      onUpdatePlayer2({ avatar: emoji });
                    }
                    setActiveAvatarPicker(null);
                  }}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-center text-lg active:scale-90 transition-all border border-zinc-800/60"
                >
                  {item.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        )}
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
            120+ questions inédites
          </span>
        </div>

        <div className="space-y-2">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategories.includes(category.id);
            const isCoquin = category.id === 'coquin';
            const countLabel = category.id === 'custom_ai' ? 'IA infinie' : '24 questions';

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

      {/* 5. Sticky Bottom Play Button (Thumb Reach Zone) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent z-40 max-w-lg mx-auto">
        <button
          type="button"
          disabled={selectedCategories.length === 0 || isLoadingAi}
          onClick={() => {
            sound.playSuccess();
            sound.vibrate(25);
            onStartGame();
          }}
          className={`w-full h-14 rounded-2xl flex items-center justify-center gap-2 font-display font-bold text-base shadow-xl transition-all active:scale-[0.98] ${
            selectedCategories.length === 0
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white shadow-rose-950/50 hover:brightness-105'
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
  );
};
