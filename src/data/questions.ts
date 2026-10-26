import { CategoryInfo, Question } from '../types/quiz';
import { ALL_THEMED_QUESTIONS } from './categories/index';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'souvenirs',
    name: 'Souvenirs & Débuts',
    tagline: 'Le premier baiser, les débuts et nos fous rires',
    icon: 'Sparkles',
    color: 'from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30',
  },
  {
    id: 'quotidien',
    name: 'Goûts & Quotidien',
    tagline: 'Plats fétiches, petites manies et dimanches au lit',
    icon: 'UtensilsCrossed',
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30',
  },
  {
    id: 'personnalite',
    name: 'Personnalité & Dilemmes',
    tagline: 'Super-pouvoir, gestion des disputes et secrets',
    icon: 'Brain',
    color: 'from-sky-500/20 to-indigo-500/20 text-sky-300 border-sky-500/30',
  },
  {
    id: 'projets',
    name: 'Projets & Rêves',
    tagline: 'Voyages de rêve, maison idéale et bucket list',
    icon: 'Compass',
    color: 'from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30',
  },
  {
    id: 'coquin',
    name: 'Coquin & Intimité',
    tagline: 'Ambiance sous la couette, fantasmes et sensualité',
    icon: 'Flame',
    color: 'from-rose-500/20 to-red-600/20 text-rose-300 border-rose-500/30',
    isNsfw: true,
  },
  {
    id: 'custom_ai',
    name: 'Générateur IA Cupid',
    tagline: 'Questions infinies créées par Gemini pour votre duo',
    icon: 'Bot',
    color: 'from-fuchsia-500/20 to-violet-500/20 text-fuchsia-300 border-fuchsia-500/30',
  },
];

export const AVATAR_OPTIONS = [
  { id: 'fox', label: '🦊 Renard' },
  { id: 'cat', label: '🐱 Chat' },
  { id: 'bear', label: '🐻 Ours' },
  { id: 'lion', label: '🦁 Lion' },
  { id: 'panda', label: '🐼 Panda' },
  { id: 'koala', label: '🐨 Koala' },
  { id: 'rabbit', label: '🐰 Lapin' },
  { id: 'crown', label: '👑 Couronne' },
  { id: 'croissant', label: '🥐 Croissant' },
  { id: 'coffee', label: '☕ Café' },
  { id: 'avocado', label: '🥑 Avocat' },
  { id: 'fire', label: '🔥 Flamme' },
  { id: 'sparkle', label: '✨ Étoile' },
  { id: 'rocket', label: '🚀 Fusée' },
  { id: 'heart', label: '❤️ Cœur' },
];

/**
 * 525 curated questions (105+ questions per category)
 * Balanced across 3 difficulties: easy (35), medium (35), spicy (35) per category.
 */
export const INITIAL_QUESTIONS: Question[] = ALL_THEMED_QUESTIONS;
