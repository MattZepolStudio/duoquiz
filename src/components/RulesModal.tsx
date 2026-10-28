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
  Check
} from 'lucide-react';
import { sound } from '../utils/audio';
import { ParCoeurLogo } from './ParCoeurLogo';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'modes' | 'scoring'>('modes');

  if (!isOpen) return null;

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
      <div className="bg-[#121217]/90 backdrop-blur-2xl border border-white/[0.08] rounded-[30px] w-full max-w-lg p-5 sm:p-6 text-zinc-100 shadow-2xl overflow-y-auto max-h-[90vh] flex flex-col space-y-4 animate-scale-up">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shadow-md">
              <ParCoeurLogo size={24} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-display font-bold text-white flex items-center gap-1.5">
                <span>Règles de</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300">
                  ParCœur
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400">
                Le jeu complice pour tester votre couple
              </p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors active:scale-90"
            title="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-zinc-950 rounded-2xl border border-zinc-800/80">
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setActiveTab('modes');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'modes'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-rose-400" />
            <span>1 ou 2 Téléphones</span>
          </button>
          
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setActiveTab('scoring');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'scoring'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Points & Complices</span>
          </button>
        </div>

        {/* Tab 1: Modes de jeu */}
        {activeTab === 'modes' && (
          <div className="space-y-3.5 text-xs text-zinc-300 animate-fade-in">
            {/* Step 0: Prénoms & Avatars */}
            <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5 fill-rose-400" />
                <span>Avant de commencer</span>
              </div>
              <p className="text-zinc-300 leading-relaxed text-[11px]">
                Renseignez vos deux prénoms et choisissez vos avatars préférés. Cela personnalise chaque question et débloque le lancement de votre partie !
              </p>
            </div>

            {/* Mode 1: Pass & Play */}
            <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-rose-500/20 space-y-2">
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
                  <strong className="text-white">3. La prédiction :</strong> Le Joueur 2 choisit ce qu'il pense que son partenaire a répondu.
                </p>
                <p>
                  <strong className="text-white">4. Révélation :</strong> Les réponses se dévoilent côte à côte !
                </p>
              </div>
            </div>

            {/* Mode 2: Multi-screen */}
            <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-pink-500/20 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <h4 className="font-bold text-white text-xs">
                  Mode 2 Téléphones (En direct & synchronisé)
                </h4>
              </div>

              <div className="space-y-1.5 pl-2 border-l-2 border-pink-500/30 text-[11px] text-zinc-300">
                <p>
                  <strong className="text-white">1. Connexion express :</strong> Créez une salle et faites scanner le <strong>QR Code</strong> par votre partenaire (ou entrez le code à 4 lettres).
                </p>
                <p>
                  <strong className="text-white">2. Chacun son écran :</strong> Répondez simultanément sans risquer de voir les réponses de l'autre !
                </p>
                <p>
                  <strong className="text-white">3. Synchronisation live :</strong> Dès que vous avez tous les deux voté, les réponses se révèlent en même temps sur vos 2 écrans.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Scoring & Rules */}
        {activeTab === 'scoring' && (
          <div className="space-y-3.5 text-xs text-zinc-300 animate-fade-in">
            {/* Scoring & Validation */}
            <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-emerald-500/20 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <h4 className="font-bold text-white text-xs">
                  Points & Validation complice
                </h4>
              </div>

              <div className="space-y-1.5 pl-2 border-l-2 border-emerald-500/30 text-[11px] text-zinc-300">
                <p>
                  <strong className="text-emerald-300">✓ Match parfait :</strong> Si vous choisissez exactement la même réponse, le point est attribué automatiquement !
                </p>
                <p>
                  <strong className="text-amber-300">🤝 Accord mutuel (« Valider quand même ») :</strong> Si vos réponses diffèrent par les mots mais que vous êtes d'accord sur le fond, vous pouvez accorder le point manuellement d'un clic. Le but est de rire et d'échanger !
                </p>
              </div>
            </div>

            {/* Alternance des rôles */}
            <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-amber-500/20 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <h4 className="font-bold text-white text-xs">
                  Alternance des rôles
                </h4>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                Les rôles s'inversent automatiquement à chaque manche : en manche 1, on devine les goûts du Joueur 1 ; en manche 2, c'est au tour du Joueur 2 d'être au centre des questions !
              </p>
            </div>

            {/* Catégories & IA */}
            <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-rose-500/20 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <Flame className="w-3.5 h-3.5" />
                </div>
                <h4 className="font-bold text-white text-xs">
                  Catégories & Générateur IA
                </h4>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                Mixez vos 5 catégories thématiques (Souvenirs, Quotidien, Personnalité, Projets et la catégorie <strong>Coquine 🔥</strong>) avec plus de <strong>1 500 questions inédites</strong> (+100 questions disponibles pour chaque niveau de difficulté !). Activez aussi le <strong>Générateur IA Cupid</strong> pour des questions infinies générées sur-mesure.
              </p>
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
            <span>C'est tout compris, place au quiz ! 💕</span>
          </button>
        </div>

      </div>
    </div>
  );
};
