import React from 'react';

interface ParCoeurLogoProps {
  className?: string;
  size?: number;
  variant?: 'icon' | 'badge' | 'full';
}

/**
 * Option 2 Affinée : Le Double Cœur Décalé (Style App Store / iOS)
 * - Deux cœurs aux teintes distinctes : Ambre Solaire/Corail chaud & Rose Baie/Magenta électrique.
 * - Découpe nette pour que les deux cœurs soient immédiatement identifiables au premier coup d'œil.
 * - Point blanc supprimé selon la demande.
 */
export const ParCoeurLogo: React.FC<ParCoeurLogoProps> = ({
  className = '',
  size = 36,
  variant = 'icon',
}) => {
  const id = React.useId().replace(/:/g, '');

  const iconSvg = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 overflow-visible"
      aria-label="Logo ParCœur"
    >
      <defs>
        {/* Cœur 1 : Ambre Doré & Corail Chaleureux (très distinct, éclat solaire) */}
        <linearGradient
          id={`amber-coral-${id}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="55%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>

        {/* Cœur 2 : Rose Framboise & Magenta Électrique (profond et romantique) */}
        <linearGradient
          id={`magenta-rose-${id}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#be123c" />
        </linearGradient>

        {/* Ombre portée douce */}
        <filter id={`shadow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Cœur 1 (Gauche - Ambre Doré & Corail) */}
      <g
        transform="translate(36, 48) rotate(-16) scale(0.66) translate(-50, -50)"
        filter={`url(#shadow-${id})`}
      >
        <path
          d="M 50,30 C 50,19 40,13 30,13 C 18,13 10,22 10,36 C 10,54 30,69 50,87 C 70,69 90,54 90,36 C 90,22 82,13 70,13 C 60,13 50,19 50,30 Z"
          fill={`url(#amber-coral-${id})`}
        />
      </g>

      {/* Cœur 2 (Droit - Rose Framboise & Magenta) 
          Un fin contour sombre sépare nettement les deux formes pour une lisibilité parfaite */}
      <g
        transform="translate(64, 52) rotate(16) scale(0.66) translate(-50, -50)"
        filter={`url(#shadow-${id})`}
      >
        <path
          d="M 50,30 C 50,19 40,13 30,13 C 18,13 10,22 10,36 C 10,54 30,69 50,87 C 70,69 90,54 90,36 C 90,22 82,13 70,13 C 60,13 50,19 50,30 Z"
          fill={`url(#magenta-rose-${id})`}
          stroke="#18181b"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );

  if (variant === 'badge') {
    return (
      <div
        className={`relative inline-flex items-center justify-center p-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-lg shadow-black/40 group hover:border-rose-500/40 transition-all ${className}`}
      >
        {iconSvg}
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        <div className="relative inline-flex items-center justify-center p-2 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-md">
          {iconSvg}
        </div>
        <div className="flex flex-col text-left">
          <span className="font-display font-extrabold text-xl tracking-tight text-white leading-none">
            Par<span className="bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">Cœur</span>
          </span>
          <span className="text-[10px] tracking-widest text-zinc-400 font-semibold uppercase mt-0.5">
            Le Jeu de Couple
          </span>
        </div>
      </div>
    );
  }

  return <div className={`inline-flex items-center justify-center ${className}`}>{iconSvg}</div>;
};

export default ParCoeurLogo;
