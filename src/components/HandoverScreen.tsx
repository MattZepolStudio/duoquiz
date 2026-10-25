import React from 'react';
import { Smartphone, Lock, Eye, Sparkles, ShieldCheck } from 'lucide-react';
import { Player } from '../types/quiz';
import { sound } from '../utils/audio';

interface HandoverScreenProps {
  targetPlayer: Player;
  guesserPlayer: Player;
  totalQuestions: number;
  onProceed: () => void;
}

export const HandoverScreen: React.FC<HandoverScreenProps> = ({
  targetPlayer,
  guesserPlayer,
  totalQuestions,
  onProceed,
}) => {
  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-80px)] max-w-lg mx-auto w-full px-4 py-8 animate-fade-in text-center">
      {/* Top Privacy Tag */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-semibold">
        <Lock className="w-3.5 h-3.5" />
        <span>Toutes les réponses de {targetPlayer.name} sont verrouillées</span>
      </div>

      {/* Center Phone Transfer Animation / Visual */}
      <div className="my-auto flex flex-col items-center">
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-3xl bg-zinc-900 border-2 border-dashed border-rose-500/40 flex items-center justify-center text-5xl shadow-2xl shadow-rose-950/60 animate-bounce">
            {guesserPlayer.avatar}
          </div>
          <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg">
            <Smartphone className="w-5 h-5" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
          Donne le téléphone à <br />
          <span className="bg-gradient-to-r from-rose-400 to-pink-300 bg-clip-text text-transparent">
            {guesserPlayer.name}
          </span> !
        </h2>

        <p className="text-xs sm:text-sm text-zinc-400 mt-3 max-w-xs leading-relaxed">
          <strong className="text-zinc-200">{targetPlayer.name}</strong> a enregistré ses {totalQuestions} réponses en secret. <br />
          Place aux devinettes pour <strong className="text-rose-300">{guesserPlayer.name}</strong> avec révélation en direct à chaque réponse !
        </p>

        <div className="mt-6 flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900/60 px-4 py-2 rounded-full border border-zinc-800">
          <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
          <span>Regardez l'écran ensemble pour découvrir les résultats !</span>
        </div>
      </div>

      {/* Confirmation Button */}
      <div className="w-full pt-4">
        <button
          type="button"
          onClick={() => {
            sound.playTap();
            sound.vibrate(15);
            onProceed();
          }}
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-display font-bold text-base shadow-xl shadow-rose-950/50 hover:brightness-105 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <Eye className="w-5 h-5" />
          <span>C'est bon, je suis {guesserPlayer.name} !</span>
        </button>
      </div>
    </div>
  );
};
