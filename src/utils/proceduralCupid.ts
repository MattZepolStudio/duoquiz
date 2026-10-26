import { Question, CategoryId, DifficultyLevel } from '../types/quiz';

interface CupidTemplate {
  baseQuestion: string;
  targetQuestion: string;
  guesserQuestion: string;
  options: string[];
  hint: string;
  difficulty?: DifficultyLevel;
}

const CUPID_TEMPLATES: CupidTemplate[] = [
  {
    baseQuestion: "Quel est le petit péché mignon ou la manie secrète que {partner} connaît le mieux chez toi ?",
    targetQuestion: "Parmi ces manies ou petits péchés mignons, lequel {partner} te reproche ou adore le plus chez toi ?",
    guesserQuestion: "Selon toi, quel est le petit péché mignon ou la manie la plus évidente de {target} ?",
    options: [
      "Grignoter un carré de chocolat en cachette la nuit",
      "Scroller sur son téléphone pendant des heures sous la couette",
      "Laisser traîner un vêtement ou une tasse sur la table",
      "Chanter à tue-tête sous la douche ou en voiture"
    ],
    hint: "Pense aux petits détails du quotidien partagé qui font toujours sourire (ou râler gentiment) !"
  },
  {
    baseQuestion: "Si {partner} te préparait un dîner réconfortant parfait ce soir, ce serait quoi ?",
    targetQuestion: "Quel dîner préparé avec amour par {partner} te ferait le plus plaisir après une longue journée ?",
    guesserQuestion: "Quel repas réconfortant ferais-tu à {target} pour lui redonner le sourire à coup sûr ?",
    options: [
      "Un bon plat de pâtes maison généreux et bien crémeux",
      "Une pizza croustillante avec tous ses ingrédients fétiches",
      "Un burger gourmand avec frites et petite sauce secrète",
      "Un dessert maison bien chocolaté et gourmand"
    ],
    hint: "Le chemin du cœur passe souvent par les papilles !"
  },
  {
    baseQuestion: "Quelle a été la première chose qui a fait craquer {partner} chez toi au début ?",
    targetQuestion: "À ton avis, qu'est-ce qui a fait fondre le cœur de {partner} lors de vos tout premiers instants ?",
    guesserQuestion: "Qu'est-ce qui t'a le plus charmé(e) chez {target} lors de votre toute première rencontre ?",
    options: [
      "Son regard pétillant et son sourire communicatif",
      "Son sens de l'humour et ses petites maladresses touchantes",
      "Sa gentillesse naturelle et son écoute sincère",
      "Son style, sa voix et son charme irrésistible"
    ],
    hint: "Rappelle-toi l'étincelle des premiers regards !"
  },
  {
    baseQuestion: "Si vous deviez partir en voyage surprise demain matin, quelle destination choisirait {partner} ?",
    targetQuestion: "Si {partner} t'offrait un billet d'avion surprise pour demain, où rêverais-tu d'atterrir ?",
    guesserQuestion: "Vers quelle destination de rêve devrais-tu emmener {target} pour le ou la combler de bonheur ?",
    options: [
      "Un chalet cosy sous la neige avec feu de cheminée",
      "Une crique sauvage turquoise baignée de soleil",
      "Une capitale animée pour se perdre dans les ruelles et restos",
      "Un road-trip en van au milieu des grands espaces"
    ],
    hint: "Plutôt farniente au soleil, grand air sauvage ou aventure urbaine ?"
  },
  {
    baseQuestion: "Quel est le super-pouvoir secret de {partner} au sein de votre couple ?",
    targetQuestion: "Quel est le talent magique que tu apprécies le plus chez {partner} au quotidien ?",
    guesserQuestion: "Selon toi, quel est ton plus grand super-pouvoir qui fait craquer {target} ?",
    options: [
      "Désamorcer n'importe quelle dispute avec un câlin ou une blague",
      "Trouver le mot juste et réconfortant quand ça ne va pas",
      "Organiser des sorties surprises et des moments mémorables",
      "Transformer un dimanche pluvieux en journée magique"
    ],
    hint: "Ce petit quelque chose d'unique qui n'appartient qu'à votre duo."
  },
  {
    baseQuestion: "Quel rituel à deux est absolument sacré pour votre duo ?",
    targetQuestion: "Quel est ce moment complice avec {partner} dont tu ne pourrais jamais te passer ?",
    guesserQuestion: "À ton avis, quel moment ou rituel quotidien est le plus précieux pour {target} ?",
    options: [
      "Le câlin du matin avant de poser le pied par terre",
      "Le débrief de nos journées affalés sur le canapé le soir",
      "Le rituel café / thé le week-end sans regarder l'heure",
      "Nos séries préférées regardées collés sous le plaid"
    ],
    hint: "Un petit rendez-vous d'amour qui rythme votre quotidien."
  },
  {
    baseQuestion: "Face à une décision imprévue, qui de vous deux prend les choses en main le plus vite ?",
    targetQuestion: "Quand un imprévu survient, comment réagis-tu habituellement aux côtés de {partner} ?",
    guesserQuestion: "Selon toi, comment {target} réagit-il/elle face à un imprévu de dernière minute ?",
    options: [
      "Garder son calme olympien et trouver la solution logique",
      "Paniquer 30 secondes puis en rigoler ensemble",
      "Faire confiance aveugle à l'autre pour trancher",
      "Prendre les devants avec enthousiasme et énergie"
    ],
    hint: "Pensez à vos anecdotes de valises perdues ou de train raté !"
  },
  {
    baseQuestion: "Quel est le surnom le plus mignon (ou ridicule) qui décrit le mieux {target} ?",
    targetQuestion: "Si {partner} devait choisir un surnom secret plein de tendresse pour toi, ce serait quoi ?",
    guesserQuestion: "Quel petit surnom complice correspond le plus fidèlement au caractère de {target} ?",
    options: [
      "Mon petit rayon de soleil (toujours d'humeur rayonnante)",
      "Mon koala d'amour (toujours collé(e) en quête de câlins)",
      "Mon petit chef (toujours à organiser le planning du week-end)",
      "Mon petit renard espiègle (toujours une bêtise ou une taquinerie en tête)"
    ],
    hint: "Un surnom qui résume parfaitement sa personnalité d'amoureux !"
  },
  {
    baseQuestion: "Si {partner} devait te surprendre ce week-end, quelle attention te toucherait le plus ?",
    targetQuestion: "Quelle délicate attention de la part de {partner} te ferait instantanément fondre ?",
    guesserQuestion: "Quelle surprise devrais-tu organiser pour faire briller les yeux de {target} ?",
    options: [
      "Un petit mot doux glissé en cachette dans mes affaires",
      "Un petit-déjeuner au lit avec jus frais et viennoiseries",
      "Une réservation secrète dans un resto intimiste aux chandelles",
      "Une journée 100% cocooning et massages sans contrainte"
    ],
    hint: "Les attentions les plus simples sont souvent les plus marquantes."
  },
  {
    baseQuestion: "Quel est le souvenir le plus fou ou émouvant que vous partagez tous les deux ?",
    targetQuestion: "Quel moment fort partagé avec {partner} reste gravé pour toujours dans ta mémoire ?",
    guesserQuestion: "Selon toi, quel souvenir marquant revient toujours en tête de {target} quand on parle de votre histoire ?",
    options: [
      "La toute première fois où on s'est dit « je t'aime »",
      "Ce fou rire incontrôlable au milieu d'un moment sérieux",
      "Notre premier voyage ensemble loin de tout",
      "Ce moment de complicité silencieuse les yeux dans les yeux"
    ],
    hint: "Un instant suspendu dans le temps qui a soudé votre amour."
  },
  {
    baseQuestion: "Quelle est la plus grande preuve d'amour au quotidien selon toi ?",
    targetQuestion: "Pour toi, quelle action de {partner} te prouve le plus son attachement profond ?",
    guesserQuestion: "Selon toi, qu'est-ce qui prouve le plus à {target} que tu tiens à lui/elle ?",
    options: [
      "Être là pour écouter sans juger après une dure épreuve",
      "Se souvenir des moindres petits détails et anecdotes",
      "Préparer une petite attention sans que rien ne soit demandé",
      "Un regard protecteur et complice au milieu d'une foule"
    ],
    hint: "L'amour se vit dans les petits gestes invisibles."
  },
  {
    baseQuestion: "Si vous deviez définir votre duo en un mot, quel serait-il ?",
    targetQuestion: "Quel mot ou devise résume le mieux l'énergie de votre couple avec {partner} ?",
    guesserQuestion: "Quel mot magique choisirait {target} pour décrire votre alchimie de couple ?",
    options: [
      "Télépathique (on se comprend d'un simple clignement d'œil)",
      "Passionné (beaucoup d'étincelles et d'émotions intenses)",
      "Complice (les meilleurs amis et les meilleurs amants)",
      "Aventurier (toujours prêts à relever de nouveaux défis ensemble)"
    ],
    hint: "Ce qui caractérise la force indestructible de votre couple."
  }
];

// Shuffle helper
function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Procedurally generates high-quality Cupid questions tailored to player names.
 * 100% free, 0 external API calls, instantaneous, zero cost, zero quota risk.
 */
export function generateProceduralCupidQuestions(
  player1Name: string,
  player2Name: string,
  count: number = 5,
  difficulty: DifficultyLevel = 'medium'
): Question[] {
  const p1 = (player1Name || 'Joueur 1').trim();
  const p2 = (player2Name || 'Joueur 2').trim();

  const shuffledTemplates = shuffle(CUPID_TEMPLATES);
  const selectedTemplates = shuffledTemplates.slice(0, Math.min(count, shuffledTemplates.length));

  return selectedTemplates.map((tpl, index) => {
    // Alternate target/partner between questions
    const isTargetP1 = index % 2 === 0;
    const target = isTargetP1 ? p1 : p2;
    const partner = isTargetP1 ? p2 : p1;

    const formattedBase = tpl.baseQuestion
      .replace(/{target}/g, target)
      .replace(/{partner}/g, partner);

    const formattedTarget = tpl.targetQuestion
      .replace(/{target}/g, target)
      .replace(/{partner}/g, partner);

    const formattedGuesser = tpl.guesserQuestion
      .replace(/{target}/g, target)
      .replace(/{partner}/g, partner);

    const randomizedOptions = shuffle(tpl.options);

    return {
      id: `cupid_proc_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 6)}`,
      category: 'custom_ai' as CategoryId,
      difficulty,
      question: formattedBase,
      targetQuestion: formattedTarget,
      guesserQuestion: formattedGuesser,
      options: randomizedOptions,
      hint: tpl.hint,
      isAiGenerated: true,
    };
  });
}
