import React from 'react';
import { X, Heart, Smartphone, Flame, Award, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md p-6 text-zinc-100 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h3 className="text-lg font-display font-bold">Règles de DuoQuiz</h3>
          </div>
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 py-4 text-sm text-zinc-300">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white">1. Tour secret sur un seul smartphone</h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Le Joueur 1 prend le téléphone et répond en secret à une question sur ses goûts ou ses souvenirs.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white">2. Passez le téléphone !</h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Le Joueur 2 récupère le téléphone et tente de deviner ce que son partenaire a répondu !
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white">3. Révélation complice</h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Les deux réponses s'affichent face-à-face. Si c'est identique, vous marquez un point ! Vous pouvez aussi valider manuellement si vous êtes d'accord sur le fond.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white">4. Catégorie Coquine & Difficulté</h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Activez la catégorie Coquine pour faire monter la température ! Vous pouvez ajuster la difficulté (Douce, Complice, Pimentée) à chaque manche.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playTap();
            onClose();
          }}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 font-semibold text-white shadow-lg shadow-rose-900/30 hover:opacity-95 transition-all active:scale-[0.98]"
        >
          C'est compris, jouons ! 💕
        </button>
      </div>
    </div>
  );
};
