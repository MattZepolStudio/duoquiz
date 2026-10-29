import React from 'react';
import { Smartphone, Lock, Eye, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
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
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-80px)] max-w-lg mx-auto w-full px-4 py-6 sm:py-8 animate-fade-in text-center select-none relative z-10">
      
      {/* Top Privacy Tag (Sleek Glass Pill) */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full ios-glass border border-white/[0.08] text-rose-200 text-xs font-semibold shadow-md">
        <Lock className="w-3.5 h-3.5 text-rose-400" />
        <span>Les {totalQuestions} réponses de <strong className="text-white">{targetPlayer.name}</strong> sont verrouillées</span>
      </div>

      {/* Dramatic Theatrical Center Transition */}
      <div className="my-auto flex flex-col items-center relative py-6">
        
        {/* Concentric Pulsing Light Rings & Wave */}
        <div className="relative mb-7 flex items-center justify-center">
          {/* Outer Ripple Wave */}
          <div className="absolute w-44 h-44 rounded-full bg-rose-500/10 animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute w-36 h-36 rounded-full bg-gradient-to-tr from-rose-500/20 via-pink-500/15 to-amber-500/20 blur-xl animate-pulse" />

          {/* Glowing Avatar Squircle */}
          <div className="relative w-32 h-32 rounded-[32px] ios-glass-glow flex items-center justify-center text-6xl shadow-2xl border-2 border-rose-400/50">
            <span>{guesserPlayer.avatar}</span>

            {/* Smartphone Badge Floating on corner */}
            <div className="absolute -top-3 -right-3 w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-rose-950/60 border border-white/20">
              <Smartphone className="w-5 h-5 animate-bounce" style={{ animationDuration: '2s' }} />
            </div>

            {/* Secret Shield Floating at bottom */}
            <div className="absolute -bottom-2.5 px-3 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/[0.1] text-[10px] font-bold text-amber-300 flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>À toi de deviner !</span>
            </div>
          </div>
        </div>

        {/* Romantic Handover Headline */}
        <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight leading-tight">
          Donne le téléphone à <br />
          <span className="bg-gradient-to-r from-rose-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">
            {guesserPlayer.name}
          </span> !
        </h2>

        <p className="text-xs sm:text-sm text-zinc-300/90 mt-3 max-w-xs leading-relaxed">
          <strong className="text-white">{targetPlayer.name}</strong> a secrètement enregistré ses choix. <br />
          Place à la devinette pour <strong className="text-rose-300">{guesserPlayer.name}</strong> avec révélation complice en direct !
        </p>

        {/* Tip Pill */}
        <div className="mt-5 inline-flex items-center gap-2 text-xs text-zinc-300 px-4 py-2 rounded-2xl ios-glass border border-white/[0.08] shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span>Regardez l'écran ensemble pour découvrir vos matchs !</span>
        </div>
      </div>

      {/* Confirmation CTA Button (Large Shimmering Button) */}
      <div className="w-full pt-2">
        <button
          type="button"
          onClick={() => {
            sound.playTap();
            sound.vibrate(15);
            onProceed();
          }}
          className="w-full h-15 rounded-full btn-sensual-cta text-white font-display font-bold text-base sm:text-lg transition-all flex items-center justify-center gap-2.5 active:scale-[0.98] animate-shimmer cursor-pointer"
        >
          <Eye className="w-5 h-5" />
          <span>C'est bon, je suis {guesserPlayer.name} !</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default HandoverScreen;
