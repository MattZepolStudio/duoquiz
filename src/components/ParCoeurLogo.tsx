import React from 'react';

interface ParCoeurLogoProps {
  className?: string;
  size?: number;
  variant?: 'icon' | 'badge' | 'full';
  showSparkle?: boolean;
}

/**
 * Concept 1: "Les Deux Cœurs Entrelacés & Complices"
 * Deux cœurs en rubans fluides entrelacés formant un symbole d'infini et d'amour,
 * avec dégradé Rose Framboise / Corail Ambré et étincelle dorée au point de complicité.
 */
export const ParCoeurLogo: React.FC<ParCoeurLogoProps> = ({
  className = '',
  size = 36,
  variant = 'icon',
  showSparkle = true,
}) => {
  // SVG ID unique prefix to avoid gradient collisions if multiple instances are rendered
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
        {/* Dégradé Cœur 1 (Rose Framboise / Fushia passion) */}
        <linearGradient
          id={`rose-grad-${id}`}
          x1="15"
          y1="20"
          x2="65"
          y2="85"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="45%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#be123c" />
        </linearGradient>

        {/* Dégradé Cœur 2 (Corail Chaleureux / Pêche lumineux) */}
        <linearGradient
          id={`coral-grad-${id}`}
          x1="85"
          y1="20"
          x2="35"
          y2="85"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="50%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>

        {/* Halo doré pour l'étincelle centrale */}
        <linearGradient
          id={`sparkle-grad-${id}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>

        {/* Lueur diffuse */}
        <filter id={`glow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Ombre portée douce sous les rubans entrelacés */}
        <filter id={`shadow-${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#881337" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Halo d'ambiance d'arrière-plan */}
      <circle
        cx="50"
        cy="50"
        r="34"
        fill={`url(#rose-grad-${id})`}
        opacity="0.12"
        filter={`url(#glow-${id})`}
      />

      <g filter={`url(#shadow-${id})`}>
        {/* ========================================================
            CŒUR GAUCHE (Rose Framboise) :
            Forme le cœur gauche et passe sous le cœur droit en bas, 
            puis enlace par le haut.
           ======================================================== */}
        <path
          d="M 47,82 C 34,73 14,56 14,35 C 14,21 24,12 36,12 C 43,12 49,16 52,22 C 50,26 47,31 43,37 C 38,44 32,53 47,72 Z"
          fill={`url(#rose-grad-${id})`}
          opacity="0.95"
        />

        {/* ========================================================
            CŒUR DROIT (Corail Vibrant) :
            Forme le cœur droit et enlace élégamment le premier cœur,
            créant le ruban infini continu.
           ======================================================== */}
        <path
          d="M 53,82 C 66,73 86,56 86,35 C 86,21 76,12 64,12 C 57,12 51,16 48,22 C 51,28 56,35 60,42 C 65,51 68,62 53,82 Z"
          fill={`url(#coral-grad-${id})`}
          opacity="0.95"
        />

        {/* ========================================================
            RUBAN CENTRAL D'ENTRELACEMENT (Tressage en boucle infinie) :
            Le passage avant qui verrouille l'entrelacement des deux cœurs
           ======================================================== */}
        <path
          d="M 36,12 C 43,12 48.5,17 50,23 C 51.5,17 57,12 64,12 C 72,12 80,18 82,27 C 76,27 68,29 60,36 C 53,42 47,52 42,63 C 35,51 24,38 24,28 C 24,19 29,12 36,12 Z"
          fill={`url(#rose-grad-${id})`}
        />

        <path
          d="M 43,26 C 46.5,20 53.5,20 57,26 C 61,33 55,46 50,53 C 45,46 39,33 43,26 Z"
          fill={`url(#coral-grad-${id})`}
          opacity="0.9"
        />

        {/* Finition de pointe inférieure unie formant la pointe du cœur principal */}
        <path
          d="M 50,86 C 47,82 43,76 39,69 C 45,74 55,74 61,69 C 57,76 53,82 50,86 Z"
          fill="#e11d48"
        />

        {/* Reflets lumineux sur les courbures supérieures */}
        <path
          d="M 23,24 C 23,17 29,14 36,14 C 40,14 43,16 46,19"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeOpacity="0.45"
        />
        <path
          d="M 77,24 C 77,17 71,14 64,14 C 60,14 57,16 54,19"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeOpacity="0.45"
        />
      </g>

      {/* ========================================================
          ÉTINCELLE CENTRALE DE COMPLICITÉ (Golden Sparkle)
          Placée au cœur de l'intersection
         ======================================================== */}
      {showSparkle && (
        <g transform="translate(50, 36)">
          {/* Halo d'étincelle */}
          <circle cx="0" cy="0" r="7" fill="#fef08a" opacity="0.4" filter={`url(#glow-${id})`} />
          {/* Étoile à 4 branches effilées */}
          <path
            d="M 0,-8 Q 0.5,-1.5 5,-0.5 Q 0.5,0.5 0,8 Q -0.5,0.5 -5,-0.5 Q -0.5,-1.5 0,-8 Z"
            fill={`url(#sparkle-grad-${id})`}
            className="animate-pulse"
            style={{ animationDuration: '2.5s' }}
          />
          {/* Cœur de lumière blanc */}
          <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
          {/* Mini satellite d'étincelle */}
          <circle cx="6.5" cy="-5.5" r="1" fill="#fef08a" opacity="0.9" />
          <circle cx="-5.5" cy="5.5" r="0.8" fill="#fb923c" opacity="0.8" />
        </g>
      )}
    </svg>
  );

  if (variant === 'badge') {
    return (
      <div
        className={`relative inline-flex items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-zinc-900 border border-rose-500/30 shadow-lg shadow-rose-950/40 backdrop-blur-md group hover:border-rose-400/50 transition-all ${className}`}
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-rose-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        {iconSvg}
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        <div className="relative inline-flex items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border border-rose-500/30 shadow-md shadow-rose-950/50">
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
