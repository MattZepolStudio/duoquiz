import React from 'react';

interface ParCoeurLogoProps {
  className?: string;
  size?: number;
  variant?: 'icon' | 'badge' | 'full';
}

/**
 * Option 2: Le Double Cœur Décalé (Style App Store / iOS)
 * Deux cœurs épurés, modernes et géométriques qui se superposent
 * avec un jeu de transparence élégant (Rose Électrique & Corail Lumineux).
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
        {/* Dégradé Cœur 1 : Corail Pêche Chaleureux */}
        <linearGradient
          id={`coral-${id}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="60%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>

        {/* Dégradé Cœur 2 : Rose Framboise Électrique */}
        <linearGradient
          id={`rose-${id}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#be123c" />
        </linearGradient>

        {/* Ombre portée douce et nette style app iOS */}
        <filter id={`shadow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Cœur 1 (Partenaire gauche - Corail / Rose chaud) */}
      <g
        transform="translate(42, 47) rotate(-14) scale(0.65) translate(-50, -50)"
        filter={`url(#shadow-${id})`}
      >
        <path
          d="M 50,30 C 50,20 40,14 30,14 C 18,14 10,23 10,37 C 10,54 30,68 50,86 C 70,68 90,54 90,37 C 90,23 82,14 70,14 C 60,14 50,20 50,30 Z"
          fill={`url(#coral-${id})`}
          opacity="0.9"
        />
      </g>

      {/* Cœur 2 (Partenaire droit - Rose / Framboise) superposé */}
      <g
        transform="translate(58, 53) rotate(14) scale(0.65) translate(-50, -50)"
        filter={`url(#shadow-${id})`}
      >
        <path
          d="M 50,30 C 50,20 40,14 30,14 C 18,14 10,23 10,37 C 10,54 30,68 50,86 C 70,68 90,54 90,37 C 90,23 82,14 70,14 C 60,14 50,20 50,30 Z"
          fill={`url(#rose-${id})`}
          opacity="0.92"
        />
      </g>

      {/* Point de contact / étincelle subtile à l'intersection */}
      <circle cx="50" cy="50" r="2.5" fill="#ffffff" opacity="0.9" />
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
