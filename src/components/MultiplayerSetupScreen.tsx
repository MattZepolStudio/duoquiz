import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  Users, 
  QrCode, 
  Copy, 
  Check, 
  ArrowLeft, 
  Play, 
  Sparkles, 
  Share2, 
  Loader2, 
  AlertCircle,
  Smartphone,
  ShieldCheck,
  Heart,
  Globe
} from 'lucide-react';
import { CategoryId, DifficultyLevel, Player } from '../types/quiz';
import { RoomConfig, RoomState } from '../types/multiplayer';
import { sound } from '../utils/audio';
import { getPublicRoomUrl, initAppUrl } from '../utils/appUrl';

interface MultiplayerSetupScreenProps {
  player1: Player;
  player2: Player;
  selectedCategories: CategoryId[];
  globalDifficulty: DifficultyLevel;
  questionCount: number;
  roomState: RoomState | null;
  isHost?: boolean;
  isConnecting: boolean;
  errorMessage: string | null;
  onCreateRoom: (hostName: string, hostAvatar: string, config: RoomConfig) => void;
  onJoinRoom: (code: string, playerName: string, playerAvatar: string) => void;
  onStartGame: () => void;
  onBackToMenu: () => void;
}

export const MultiplayerSetupScreen: React.FC<MultiplayerSetupScreenProps> = ({
  player1,
  player2,
  selectedCategories,
  globalDifficulty,
  questionCount,
  roomState,
  isHost = true,
  isConnecting,
  errorMessage,
  onCreateRoom,
  onJoinRoom,
  onStartGame,
  onBackToMenu,
}) => {
  // Check if room code or prefilled guest name was passed in URL query param or saved from previous session
  const urlParams = new URLSearchParams(window.location.search);
  const urlRoomCode = urlParams.get('room') || '';
  const urlP2Name = urlParams.get('p2') || '';
  const urlP2Avatar = urlParams.get('av') || '';

  const savedCode = (() => {
    try {
      return localStorage.getItem('duoquiz_multi_room_code') || '';
    } catch {
      return '';
    }
  })();

  const [activeTab, setActiveTab] = useState<'create' | 'join'>(
    urlRoomCode || savedCode ? 'join' : 'create'
  );
  const [joinCodeInput, setJoinCodeInput] = useState<string>(
    (urlRoomCode || savedCode).toUpperCase()
  );
  const [guestName, setGuestName] = useState<string>(
    urlP2Name || (player2.name && player2.name !== 'Mon Amour' ? player2.name : player2.name || 'Joueur 2')
  );
  const [guestAvatar, setGuestAvatar] = useState<string>(
    urlP2Avatar || player2.avatar || '🐱'
  );
  const [hostName, setHostName] = useState<string>(player1.name || 'Joueur 1');
  const [hostAvatar, setHostAvatar] = useState<string>(player1.avatar || '🦊');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [publicUrlString, setPublicUrlString] = useState<string>('');

  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize public URL on mount
  useEffect(() => {
    initAppUrl().then((url) => {
      setPublicUrlString(getPublicRoomUrl(roomState?.code, player2.name, player2.avatar));
    });
  }, [roomState?.code, player2.name, player2.avatar]);

  // Generate QR Code with public preview URL
  useEffect(() => {
    if (roomState?.code) {
      const shareUrl = getPublicRoomUrl(roomState.code, player2.name, player2.avatar);
      setPublicUrlString(shareUrl);
      QRCode.toDataURL(shareUrl, {
        width: 240,
        margin: 2,
        color: {
          dark: '#09090b',
          light: '#ffffff',
        },
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => console.error('Failed to generate QR code', err));
    }
  }, [roomState?.code, player2.name, player2.avatar]);

  const handleCopyCode = () => {
    if (!roomState?.code) return;
    sound.playTap();
    navigator.clipboard?.writeText(roomState.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleShareLink = async () => {
    if (!roomState?.code) return;
    sound.playTap();
    const shareUrl = getPublicRoomUrl(roomState.code, player2.name, player2.avatar);

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Rejoins-moi sur ParCœur !',
          text: `Rejoins ma partie ParCœur en direct :`,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }

    navigator.clipboard?.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCreateSubmit = () => {
    sound.playTap();
    onCreateRoom(hostName, hostAvatar, {
      selectedCategories,
      globalDifficulty,
      questionCount,
    });
  };

  const handleJoinSubmit = () => {
    if (!joinCodeInput.trim()) return;
    sound.playTap();
    onJoinRoom(joinCodeInput.trim().toUpperCase(), guestName, guestAvatar);
  };

  // If a game is active in this room, do not render setup screen
  if (roomState && roomState.stage !== 'lobby') {
    return null;
  }

  // If room is already created and in lobby state
  if (roomState && roomState.stage === 'lobby') {
    const isBothConnected = roomState.player1.connected && !!roomState.player2?.connected;

    return (
      <div className="flex flex-col gap-5 pb-24 pt-2 max-w-lg mx-auto w-full px-4 animate-fade-in">
        {/* Back button */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onBackToMenu();
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Changer de mode</span>
          </button>

          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Salon Ouvert
          </span>
        </div>

        {/* Big Code Card with QR Code */}
        <div className="rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-rose-950/40 border border-rose-500/30 p-5 shadow-xl text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mode 2 Téléphones</span>
            </div>
          </div>

          <div>
            <h2 className="text-sm text-zinc-400 font-medium">Code secret du salon :</h2>
            <div className="mt-1 flex items-center justify-center gap-2">
              <span className="font-mono text-4xl sm:text-5xl font-black text-white tracking-widest bg-zinc-950 px-5 py-2 rounded-2xl border border-rose-500/40 shadow-inner">
                {roomState.code}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 active:scale-95 transition-all"
                title="Copier le code"
              >
                {copiedCode ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* QR Code display */}
          <div className="flex flex-col items-center justify-center pt-1">
            <div className="p-3 bg-white rounded-2xl shadow-lg border border-zinc-200">
              {qrCodeDataUrl ? (
                <img
                  src={qrCodeDataUrl}
                  alt={`QR Code Salon ${roomState.code}`}
                  className="w-40 h-40 rounded-lg"
                />
              ) : (
                <div className="w-40 h-40 flex items-center justify-center text-zinc-400">
                  <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
                </div>
              )}
            </div>
            <p className="text-[11px] text-zinc-300 mt-2 max-w-xs font-medium">
              📸 Scanne ce QR code avec l'appareil photo du 2e téléphone pour rejoindre directement !
            </p>
          </div>

          {/* Public Link Box */}
          <div className="p-3 bg-zinc-950/80 rounded-2xl border border-zinc-800 text-left text-xs space-y-2">
            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1.5 text-zinc-300 font-semibold">
                <Globe className="w-3.5 h-3.5 text-rose-400" />
                Lien de la partie :
              </span>
            </div>

            <div className="font-mono text-[11px] text-zinc-300 truncate bg-zinc-900 px-3 py-2 rounded-xl border border-zinc-800 select-all">
              {publicUrlString || getPublicRoomUrl(roomState.code)}
            </div>

            <div>
              <button
                type="button"
                onClick={handleShareLink}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-500/20 to-pink-500/20 hover:from-rose-500/30 hover:to-pink-500/30 border border-rose-500/40 text-rose-200 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Lien copié dans le presse-papier !</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Envoyer le lien (WhatsApp / SMS)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Players Status in Lobby */}
        <div className="rounded-3xl bg-zinc-900/80 border border-zinc-800 p-4 space-y-3 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Joueurs connectés (2 nécessaires) :
          </h3>

          <div className="space-y-2">
            {/* Host Card */}
            <div className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-xl">
                  {roomState.player1.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm text-white flex items-center gap-2">
                    <span>{roomState.player1.name}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300">
                      Hôte (Toi)
                    </span>
                  </div>
                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Prêt
                  </span>
                </div>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>

            {/* Guest Partner Card */}
            <div
              className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                roomState.player2 && roomState.player2.connected
                  ? 'bg-zinc-950/80 border-pink-500/40'
                  : 'bg-zinc-950/40 border-dashed border-zinc-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border ${
                    roomState.player2 && roomState.player2.connected
                      ? 'bg-pink-500/20 border-pink-500/30'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                  }`}
                >
                  {roomState.player2?.avatar || player2.avatar || '🐱'}
                </div>
                <div>
                  <div className="font-semibold text-sm text-white">
                    {roomState.player2?.name || (player2.name && player2.name !== 'Mon Amour' ? player2.name : player2.name || 'Deuxième joueur')}
                  </div>
                  {roomState.player2 && roomState.player2.connected ? (
                    <span className="text-xs text-pink-400 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
                      Connecté(e) et prêt(e) ! 🎉
                    </span>
                  ) : (
                    <span className="text-xs text-amber-400 font-medium flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      En attente de connexion...
                    </span>
                  )}
                </div>
              </div>

              {roomState.player2 && roomState.player2.connected && (
                <Check className="w-5 h-5 text-pink-400" />
              )}
            </div>
          </div>
        </div>

        {/* Start Game Action (Only Host can launch, guest sees waiting status) */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent z-40 max-w-lg mx-auto">
          {isHost ? (
            <button
              type="button"
              disabled={!isBothConnected}
              onClick={() => {
                sound.playSuccess();
                onStartGame();
              }}
              className={`w-full h-15 rounded-full flex items-center justify-center gap-2.5 font-display font-bold text-base text-white transition-all active:scale-[0.98] ${
                isBothConnected
                  ? 'btn-sensual-cta animate-shimmer cursor-pointer'
                  : 'bg-white/[0.05] text-zinc-500 cursor-not-allowed border border-white/[0.05] rounded-full'
              }`}
            >
              {isBothConnected ? (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>Lancer la partie à 2 téléphones !</span>
                </>
              ) : (
                <span className="text-xs font-semibold">
                  En attente du deuxième téléphone pour lancer...
                </span>
              )}
            </button>
          ) : (
            <div className="w-full h-14 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 text-zinc-300 font-display font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-lg">
              {isBothConnected ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                  <span>En attente de l'hôte ({roomState?.player1.name || 'Hôte'}) pour lancer...</span>
                </>
              ) : (
                <span className="text-zinc-500">Connexion des deux joueurs en cours...</span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Not in a room yet: Tabs "Créer un salon" / "Rejoindre"
  return (
    <div className="flex flex-col gap-5 pb-24 pt-2 max-w-lg mx-auto w-full px-4 animate-fade-in">
      {/* Top back button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            sound.playTap();
            onBackToMenu();
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Mode 1 téléphone (Canapé)</span>
        </button>

        <span className="text-xs font-semibold text-zinc-400">
          Synchronisation en direct
        </span>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-950/70 via-zinc-900 to-zinc-900 border border-rose-500/30 p-5 text-center shadow-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold mb-2">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Chacun son écran</span>
        </div>

        <h1 className="text-2xl font-display font-extrabold text-white tracking-tight">
          Mode 2 Téléphones
        </h1>

        <p className="text-xs text-zinc-300 mt-2 max-w-xs mx-auto">
          Répondez à vos secrets en toute discrétion et découvrez vos révélations synchronisées au même instant !
        </p>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 gap-2 mt-4 bg-zinc-950/80 p-1 rounded-2xl border border-zinc-800">
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setActiveTab('create');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'create'
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md shadow-rose-950/50'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Créer un salon
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setActiveTab('join');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'join'
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md shadow-rose-950/50'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Rejoindre un salon
          </button>
        </div>
      </div>

      {/* Error alert if any */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 flex items-center gap-3 text-xs text-red-200 animate-shake">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Tab 1: Create Room */}
      {activeTab === 'create' && (
        <div className="rounded-3xl bg-zinc-900/80 border border-zinc-800 p-4 space-y-4 shadow-sm animate-fade-in">
          <div>
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
              1. Ton pseudo d'hôte
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              C'est toi qui génères le code pour ton partenaire.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800 flex items-center gap-3">
            <span className="text-2xl">{hostAvatar}</span>
            <input
              type="text"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              placeholder="Ton prénom"
              maxLength={15}
              className="w-full bg-transparent font-medium text-white placeholder-zinc-500 text-sm focus:outline-none"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 text-xs text-zinc-300 space-y-1">
            <div className="flex items-center gap-2 font-semibold text-rose-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Réglages de la partie :</span>
            </div>
            <p className="text-zinc-400">
              • {selectedCategories.length} catégorie(s) sélectionnée(s)
              <br />
              • Difficulté : {globalDifficulty === 'easy' ? 'Douce' : globalDifficulty === 'medium' ? 'Complice' : 'Pimentée'}
              <br />
              • Longueur : {questionCount === 99 ? 'Partie illimitée' : `${questionCount} questions`}
            </p>
          </div>

          <button
            type="button"
            disabled={isConnecting || !hostName.trim()}
            onClick={handleCreateSubmit}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 active:scale-95 transition-all"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Création du salon en cours...</span>
              </>
            ) : (
              <>
                <QrCode className="w-4 h-4" />
                <span>Générer le Code & QR Code</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Tab 2: Join Room */}
      {activeTab === 'join' && (
        <div className="rounded-3xl bg-zinc-900/80 border border-zinc-800 p-4 space-y-4 shadow-sm animate-fade-in">
          <div>
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
              Rejoindre la partie
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Entre le code à 4 lettres affiché sur le premier téléphone.
            </p>
          </div>

          {urlRoomCode && (
            <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Salon <strong>{urlRoomCode}</strong> détecté via le QR code / lien ! Choisis ton prénom et clique ci-dessous pour entrer.
              </span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300 uppercase">
              Code du Salon
            </label>
            <input
              type="text"
              value={joinCodeInput}
              onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
              placeholder="Ex: LOVE"
              maxLength={6}
              className="w-full bg-zinc-950 border border-zinc-700 focus:border-rose-500 font-mono text-center text-3xl font-black text-rose-400 placeholder-zinc-700 py-3 rounded-2xl tracking-widest focus:outline-none uppercase"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300 uppercase">
              Ton prénom
            </label>
            <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800 flex items-center gap-3">
              <span className="text-2xl">{guestAvatar}</span>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Ton prénom"
                maxLength={15}
                className="w-full bg-transparent font-medium text-white placeholder-zinc-500 text-sm focus:outline-none"
              />
            </div>
          </div>

          <button
            type="button"
            disabled={isConnecting || !joinCodeInput.trim() || !guestName.trim()}
            onClick={handleJoinSubmit}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 active:scale-95 transition-all"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Connexion au salon...</span>
              </>
            ) : (
              <>
                <Users className="w-4 h-4" />
                <span>Rejoindre la partie</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
