import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Smartphone, 
  Users, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  QrCode, 
  Trophy, 
  ArrowRight,
  ShieldCheck,
  Check,
  Vibrate,
  AlertTriangle,
  Info
} from 'lucide-react';
import { sound } from '../utils/audio';
import { ParCoeurLogo } from './ParCoeurLogo';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'modes' | 'scoring' | 'haptics'>('modes');
  const [testStatus, setTestStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTestVibration = () => {
    sound.playTap();
    const hasVibrate = typeof window !== 'undefined' && 'navigator' in window && typeof navigator.vibrate === 'function';
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    if (isIos) {
      setTestStatus("ios_blocked");
      return;
    }

    if (!hasVibrate) {
      setTestStatus("api_unavailable");
      return;
    }

    try {
      // Strong 3-pulse vibration test pattern
      const accepted = navigator.vibrate([120, 60, 180, 60, 240]);
      if (accepted) {
        setTestStatus("sent_success");
      } else {
        setTestStatus("sent_rejected");
      }
    } catch (e) {
      setTestStatus("error");
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/75 backdrop-blur-xl animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          sound.playTap();
          onClose();
        }
      }}
    >
      <div className="bg-[#121217]/95 backdrop-blur-2xl border border-white/[0.08] rounded-[30px] w-full max-w-lg p-5 sm:p-6 text-zinc-100 shadow-2xl overflow-y-auto max-h-[90vh] flex flex-col space-y-4 animate-scale-up">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shadow-md">
              <ParCoeurLogo size={24} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-display font-bold text-white flex items-center gap-1.5">
                <span>Règles & Aide</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300">
                  ParCœur
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400">
                Paramètres, modes et retours haptiques
              </p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center text-zinc-400 hover:text-white transition-colors active:scale-90"
            title="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-black/50 rounded-2xl border border-white/[0.06]">
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setActiveTab('modes');
            }}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'modes'
                ? 'bg-white/[0.1] text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-rose-400" />
            <span>Modes</span>
          </button>
          
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setActiveTab('scoring');
            }}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'scoring'
                ? 'bg-white/[0.1] text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Points</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setActiveTab('haptics');
            }}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'haptics'
                ? 'bg-white/[0.1] text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Vibrate className="w-3.5 h-3.5 text-rose-400" />
            <span>Vibrations</span>
          </button>
        </div>

        {/* Tab 1: Modes de jeu */}
        {activeTab === 'modes' && (
          <div className="space-y-3.5 text-xs text-zinc-300 animate-fade-in text-left">
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] space-y-1">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5 fill-rose-400" />
                <span>Avant de commencer</span>
              </div>
              <p className="text-zinc-300 leading-relaxed text-[11px]">
                Renseignez vos deux prénoms et choisissez vos avatars préférés. Cela personnalise chaque question et débloque le lancement de votre partie !
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <Smartphone className="w-3.5 h-3.5" />
                </div>
                <h4 className="font-bold text-white text-xs">
                  Mode 1 Smartphone (Passez le téléphone)
                </h4>
              </div>

              <div className="space-y-1.5 pl-2 border-l-2 border-rose-500/30 text-[11px] text-zinc-300">
                <p>
                  <strong className="text-white">1. Tour secret :</strong> Le Joueur 1 répond en secret sur ce qu'il ferait ou préfère.
                </p>
                <p>
                  <strong className="text-white">2. Passez l'écran :</strong> Un écran de transition protège la réponse et invite à donner le téléphone au Joueur 2.
                </p>
                <p>
                  <strong className="text-white">3. Devinette & Révélation en direct :</strong> Le Joueur 2 devine le choix du Joueur 1. La carte révèle immédiatement si c'est un <strong>Match parfait (+1 point)</strong> !
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <h4 className="font-bold text-white text-xs">
                  Mode 2 Smartphones (Chacun son écran en direct)
                </h4>
              </div>

              <div className="space-y-1.5 pl-2 border-l-2 border-pink-500/30 text-[11px] text-zinc-300">
                <p>
                  <strong className="text-white">1. Créez un salon :</strong> L'Hôte choisit les thèmes et génère un <strong>Code à 4 lettres</strong> ou un <strong>QR Code</strong>.
                </p>
                <p>
                  <strong className="text-white">2. Rejoignez sans installer :</strong> Le partenaire scanne le QR Code ou entre le code sur son propre téléphone.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Scoring */}
        {activeTab === 'scoring' && (
          <div className="space-y-3.5 text-xs text-zinc-300 animate-fade-in text-left">
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <h4 className="font-bold text-white text-xs">
                  Comptage des points & Télépathie
                </h4>
              </div>

              <div className="space-y-2 pl-2 border-l-2 border-emerald-500/30 text-[11px] text-zinc-300">
                <p>
                  <strong className="text-emerald-300">✓ Match parfait :</strong> Si vous choisissez exactement la même réponse, le point est attribué automatiquement !
                </p>
                <p>
                  <strong className="text-amber-300">🤝 Accord mutuel (« Valider quand même ») :</strong> Si vos réponses diffèrent par les mots mais que vous étiez d'accord sur le fond, vous pouvez accorder le point d'un clic.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <h4 className="font-bold text-white text-xs">
                  Alternance des rôles
                </h4>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                Les rôles s'inversent automatiquement à chaque manche : en manche 1, on devine les goûts du Joueur 1 ; en manche 2, c'est au tour du Joueur 2 !
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Diagnostic Vibreur / Haptique */}
        {activeTab === 'haptics' && (
          <div className="space-y-3 text-xs text-zinc-300 animate-fade-in text-left">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Vibrate className="w-4 h-4 text-rose-400" />
                  <span className="font-bold text-white text-xs">Testeur Haptique Matériel</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {typeof window !== 'undefined' && 'navigator' in window && typeof navigator.vibrate === 'function' ? 'API détectée' : 'API absente'}
                </span>
              </div>

              <p className="text-[11px] text-zinc-300 leading-relaxed">
                Touchez le bouton ci-dessous pour forcer une séquence de vibration forte sur votre appareil :
              </p>

              <button
                type="button"
                onClick={handleTestVibration}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
              >
                <Vibrate className="w-4 h-4 animate-bounce" />
                <span>Tester la vibration maintenant</span>
              </button>

              {/* Diagnostic Results */}
              {testStatus === "ios_blocked" && (
                <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-white">
                    <Info className="w-4 h-4 text-amber-400" />
                    <span>Appareil détecté : iPhone / iOS</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-200/90">
                    Sur iPhone, Apple <strong>bloque strictement le vibreur</strong> pour tous les navigateurs (Chrome et Safari). Seules les applications téléchargées depuis l'App Store sont autorisées par Apple à faire vibrer l'iPhone.
                  </p>
                </div>
              )}

              {testStatus === "sent_success" && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Signal de vibration envoyé avec succès !</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-emerald-200/90">
                    Si votre téléphone n'a pas vibré physiquement, vérifiez vos paramètres Android : <br />
                    1. <strong>Retours tactiles</strong> : <em>Paramètres &gt; Sons &gt; Vibrations système &gt; Interactions tactiles</em> doit être activé.<br />
                    2. <strong>Mode Économie d'énergie</strong> : désactivez-le s'il est actif (il coupe le vibreur web).
                  </p>
                </div>
              )}

              {testStatus === "sent_rejected" && (
                <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-white">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span>Vibration bloquée par le système du téléphone</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-red-200/90">
                    Le navigateur Chrome a transmis la requête mais le système d'exploitation l'a refusée (mode Ne pas déranger, économie de batterie ou retours tactiles désactivés dans les réglages système).
                  </p>
                </div>
              )}

              {testStatus === "api_unavailable" && (
                <div className="p-3 rounded-xl bg-zinc-800 text-zinc-300 text-xs">
                  L'API `navigator.vibrate` n'est pas exposée par ce navigateur ou cette fenêtre d'affichage.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              sound.playSuccess();
              onClose();
            }}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 font-display font-bold text-xs sm:text-sm text-white shadow-lg shadow-rose-950/50 hover:brightness-105 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Fermer</span>
          </button>
        </div>

      </div>
    </div>
  );
};
