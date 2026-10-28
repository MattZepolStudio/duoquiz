import React from 'react';
import { Home, AlertTriangle, X, Play } from 'lucide-react';
import { sound } from '../utils/audio';

interface ConfirmQuitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmQuit: () => void;
}

export const ConfirmQuitModal: React.FC<ConfirmQuitModalProps> = ({
  isOpen,
  onClose,
  onConfirmQuit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl animate-fade-in">
      <div 
        className="relative w-full max-w-sm rounded-[30px] bg-[#121217]/95 backdrop-blur-2xl border border-white/[0.08] p-6 shadow-2xl space-y-4 animate-scale-up text-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quit-modal-title"
      >
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playTap();
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon */}
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div>
          <h3 id="quit-modal-title" className="text-lg font-display font-bold text-white">
            Quitter la partie ?
          </h3>
          <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
            Votre progression sur cette manche sera réinitialisée et vous reviendrez au menu principal.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onConfirmQuit();
            }}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 hover:brightness-105 active:scale-95 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Oui, retourner au menu</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="w-full h-11 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-300 font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Play className="w-3.5 h-3.5 text-zinc-400" />
            <span>Continuer la partie</span>
          </button>
        </div>
      </div>
    </div>
  );
};
