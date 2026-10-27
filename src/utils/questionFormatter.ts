import { Question } from '../types/quiz';

/**
 * Formats question text dynamically based on who is viewing / answering:
 * - 'target' : the player answering about themselves (e.g. Lucas answering his secret answer)
 * - 'guesser' : the player guessing their partner's answer (e.g. Julie guessing what Lucas chose)
 * - 'reveal' : both players reviewing the result together during debrief
 */
export function getFormattedQuestion(
  question: Question,
  mode: 'target' | 'guesser' | 'reveal',
  targetName: string,
  guesserName: string
): string {
  const safeTarget = targetName?.trim() || 'ton/ta partenaire';
  const safeGuesser = guesserName?.trim() || 'toi';

  // =========================================================================
  // 1. TARGET MODE (The target player answers about themselves)
  // =========================================================================
  if (mode === 'target') {
    let text = question.targetQuestion || question.question;

    // 1.1 Specific awkward robotic prefixes overhaul
    text = text
      .replace(/Quelle est ton habitude face à la façon de faire son lit le matin(\s+avec \{partner\})?\s*\?/gi, 'Comment fais-tu ton lit le matin ?')
      .replace(/Quelle est ton habitude face à la manière d'étaler le beurre sur sa tartine(\s+avec \{partner\})?\s*\?/gi, 'Comment étales-tu le beurre sur ta tartine ?')
      .replace(/Quelle est ton habitude face à la gestion de la batterie de son smartphone(\s+avec \{partner\})?\s*\?/gi, 'Comment gères-tu la batterie de ton smartphone ?')
      .replace(/Quelle est ton habitude face à la façon de ranger ses chaussures dans l'entrée(\s+avec \{partner\})?\s*\?/gi, 'Comment ranges-tu tes chaussures dans l’entrée ?')
      .replace(/Quelle est ton habitude face à le rituel pour choisir ses vêtements le matin(\s+avec \{partner\})?\s*\?/gi, 'Comment choisis-tu tes vêtements le matin ?')
      .replace(/Quelle est ton habitude face à le comportement quand on égare ses lunettes ou son téléphone(\s+avec \{partner\})?\s*\?/gi, 'Comment réagis-tu quand tu perds tes clés ou ton téléphone ?')
      .replace(/Quelle est ton habitude face à la réaction face à un gâteau cuisiné par son partenaire(\s+avec \{partner\})?\s*\?/gi, 'Comment réagis-tu quand {partner} te cuisine un gâteau ?')
      .replace(/Quelle est ton habitude face à la réaction face à une mauvaise nouvelle professionnelle(\s+avec \{partner\})?\s*\?/gi, 'Comment réagis-tu face à une mauvaise nouvelle professionnelle ?')
      .replace(/Quelle est ton habitude face à la façon de préparer sa valise(\s+avec \{partner\})?\s*\?/gi, 'Comment prépares-tu ta valise avant de partir ?')
      .replace(/Quelle est ton habitude face à (la|le|l'|les) /gi, (m, art) => `Quelle est ton habitude concernant ${art} `)
      .replace(/Comment ton caractère s'exprime-t-il face à (la|le|l'|les) /gi, (m, art) => `Quelle est ta réaction face à ${art} `);

    // 1.2 Personality & Sensuality smoothers
    text = text
      .replace(/Quelle facette de ta sensualité révèle ce qui rend son charme le plus dévastateur(\s+en soirée)?(\s+avec \{partner\})?\s*\?/gi, 'Qu’est-ce qui rend ton charme le plus irrésistible en soirée ?')
      .replace(/Quelle facette de ta sensualité révèle son attitude face au jeu de la séduction(\s+avec \{partner\})?\s*\?/gi, 'Quelle est ton attitude face au jeu de la séduction ?')
      .replace(/Quelle facette de ta sensualité révèle sa façon de faire monter la température d'un simple regard(\s+avec \{partner\})?\s*\?/gi, 'Comment aimes-tu faire monter la température d’un simple regard ?')
      .replace(/Quelle facette de ta sensualité révèle son côté joueur et séducteur sous la couette(\s+avec \{partner\})?\s*\?/gi, 'Quel est ton côté joueur et séducteur sous la couette ?')
      .replace(/Quelle facette de ta sensualité révèle sa sensibilité aux ambiances lumineuses(\s+avec \{partner\})?\s*\?/gi, 'Quelle est ta sensibilité aux ambiances lumineuses pour faire l’amour ?')
      .replace(/Quelle facette de ta sensualité révèle son goût pour les préliminaires prolongés(\s+avec \{partner\})?\s*\?/gi, 'Quelle importance ont les préliminaires prolongés pour toi ?')
      .replace(/Quelle facette de ta sensualité révèle /gi, 'Quelle facette de ta sensualité exprime ');

    // 1.3 Projects smoothers
    text = text
      .replace(/Quel est ton projet ou rêve concernant (la|le|l'|les) /gi, (m, art) => `Quel est ton rêve concernant ${art} `);

    // 1.4 Misplaced 3rd-person pronouns in target questions
    text = text
      .replace(/\bde son smartphone\b/gi, 'de ton smartphone')
      .replace(/\bsur sa tartine\b/gi, 'sur ta tartine')
      .replace(/\bses chaussures\b/gi, 'tes chaussures')
      .replace(/\bses vêtements\b/gi, 'tes vêtements')
      .replace(/\bses lunettes ou son téléphone\b/gi, 'tes lunettes ou ton téléphone')
      .replace(/\bson lit\b/gi, 'ton lit')
      .replace(/\bson caractère\b/gi, 'ton caractère')
      .replace(/\bsa sensibilité\b/gi, 'ta sensibilité')
      .replace(/\bson charme\b/gi, 'ton charme')
      .replace(/\bsa façon\b/gi, 'ta façon')
      .replace(/\bson côté\b/gi, 'ton côté')
      .replace(/\bson attitude\b/gi, 'ton attitude')
      .replace(/\bsa réaction\b/gi, 'ta réaction')
      .replace(/\bsa tendance\b/gi, 'ta tendance')
      .replace(/\bson énergie\b/gi, 'ton énergie')
      .replace(/\bsa pire\b/gi, 'ta pire')
      .replace(/\bsa plus grande peur\b/gi, 'ta plus grande peur')
      .replace(/\bson désaccord\b/gi, 'ton désaccord')
      .replace(/\bsa contrariété\b/gi, 'ta contrariété')
      .replace(/\bses torts\b/gi, 'tes torts');

    // 1.5 Misplaced 1st-person pronouns in target questions
    text = text
      .replace(/\bma boisson signature\b/gi, 'ta boisson signature')
      .replace(/\bpour me séduire\b/gi, `pour séduire ${safeGuesser}`)
      .replace(/\bpour me plaire\b/gi, `pour plaire à ${safeGuesser}`)
      .replace(/\ben essayant de me plaire\b/gi, `en essayant de plaire à ${safeGuesser}`)
      .replace(/\ben essayant de me séduire\b/gi, `en essayant de séduire ${safeGuesser}`)
      .replace(/\bface à moi\b/gi, `face à ${safeGuesser}`)
      .replace(/\bavec moi\b/gi, `avec ${safeGuesser}`);

    // 1.6 Remove pleonastic or redundant 'avec {partner}'
    text = text
      .replace(/ensemble avec \{partner\}/gi, 'ensemble')
      .replace(/à deux avec \{partner\}/gi, 'à deux')
      .replace(/entre vous deux avec \{partner\}/gi, 'entre vous deux')
      .replace(/dans votre couple avec \{partner\}/gi, 'dans votre couple')
      .replace(/dans votre futur chez-vous avec \{partner\}/gi, 'dans votre futur chez-vous')
      .replace(/dans votre histoire avec \{partner\}/gi, 'dans votre histoire')
      .replace(/pour votre première escapade avec \{partner\}\s*\?/gi, 'pour votre première escapade ?')
      .replace(/votre premier rendez-vous avec \{partner\}\s*\?/gi, 'votre premier rendez-vous ?')
      .replace(/vos premiers baisers avec \{partner\}\s*\?/gi, 'vos premiers baisers ?')
      .replace(/votre première chamaillerie avec \{partner\}\s*\?/gi, 'votre première chamaillerie ?')
      .replace(/avez-vous pris avec \{partner\}\s*\?/gi, 'avez-vous pris ?')
      .replace(/avez-vous partagé avec \{partner\}\s*\?/gi, 'avez-vous partagé ?')
      .replace(/commandiez-vous toujours au début avec \{partner\}\s*\?/gi, 'commandiez-vous toujours au tout début ?')
      .replace(/après une journée difficile avec \{partner\}\s*\?/gi, 'après une journée difficile ?')
      .replace(/en trouvant un emballage vide avec \{partner\}\s*\?/gi, 'en trouvant un emballage vide ?')
      .replace(/devant la télé avec \{partner\}\s*\?/gi, 'devant la télé ?')
      .replace(/devant un film ou documentaire bouleversant avec \{partner\}\s*\?/gi, 'devant un film bouleversant ?')
      .replace(/au réveil le matin avec \{partner\}\s*\?/gi, 'au réveil le matin ?')
      .replace(/au quotidien avec \{partner\}\s*\?/gi, 'au quotidien ?')
      .replace(/dans la vie avec \{partner\}\s*\?/gi, 'dans la vie ?')
      .replace(/dans ta vie avec \{partner\}\s*\?/gi, 'dans ta vie ?')
      .replace(/en cuisine avec \{partner\}\s*\?/gi, 'en cuisine ?')
      .replace(/sous la couette avec \{partner\}\s*\?/gi, 'sous la couette ?')
      .replace(/pour rompre la monotonie avec \{partner\}\s*\?/gi, 'pour rompre la monotonie ?')
      .replace(/pour fêter un événement marquant à deux avec \{partner\}\s*\?/gi, 'pour fêter un événement marquant à deux ?')
      .replace(/d'une grosse remise en question personnelle avec \{partner\}\s*\?/gi, 'd’une grosse remise en question personnelle ?')
      .replace(/face à la plus grande peur secrète dans la vie avec \{partner\}\s*\?/gi, 'face à ta plus grande peur secrète dans la vie ?')
      .replace(/en soirée avec \{partner\}\s*\?/gi, 'en soirée ?');

    // 1.7 Fallback conversions from neutral question text if targetQuestion was missing
    text = text
      .replace(/mon cœur/gi, 'ton cœur')
      .replace(/de ta part/gi, `de la part de ${safeGuesser}`)
      .replace(/sur toi/gi, `sur ${safeGuesser}`)
      .replace(/avec toi/gi, `avec ${safeGuesser}`)
      .replace(/te faire soupirer/gi, `faire soupirer ${safeGuesser}`)
      .replace(/mon plat/gi, 'ton plat')
      .replace(/ma boisson/gi, 'ta boisson')
      .replace(/ma pire/gi, 'ta pire')
      .replace(/mon dimanche/gi, 'ton dimanche')
      .replace(/ma tendance/gi, 'ta tendance')
      .replace(/mon timing/gi, 'ton timing')
      .replace(/mon désir/gi, 'ton désir')
      .replace(/suis-je/gi, 'es-tu')
      .replace(/ai-je/gi, 'as-tu')
      .replace(/serais-je/gi, 'serais-tu')
      .replace(/choisirais-je/gi, 'choisirais-tu')
      .replace(/irais-je/gi, 'irais-tu')
      .replace(/tiendrais-je/gi, 'tiendrais-tu')
      .replace(/adore-je/gi, 'adores-tu');

    // 1.8 Interpolate partner / target placeholders
    text = text
      .replace(/\{target\}/g, safeTarget)
      .replace(/\{guesser\}/g, safeGuesser)
      .replace(/\{partner\}/g, safeGuesser)
      .replace(/\s{2,}/g, ' ')
      .trim();

    return text;
  }

  // =========================================================================
  // 2. GUESSER & REVEAL MODES (Asking guesser about target's choice or debrief)
  // =========================================================================
  let raw = question.guesserQuestion || question.question;

  // 2.1 Smooth guesser robotic formulations
  raw = raw
    .replace(/Quelle est l'habitude de \{target\} face à la façon de faire son lit le matin(\s+avec \{target\})?\s*\?/gi, `Comment ${safeTarget} fait-il/elle son lit le matin ?`)
    .replace(/Quelle est l'habitude de \{target\} face à la manière d'étaler le beurre sur sa tartine\s*\?/gi, `Comment ${safeTarget} étale-t-il/elle le beurre sur sa tartine ?`)
    .replace(/Quelle est l'habitude de \{target\} face à la gestion de la batterie de son smartphone\s*\?/gi, `Comment ${safeTarget} gère-t-il/elle la batterie de son smartphone ?`)
    .replace(/Quelle est l'habitude de \{target\} face à la façon de ranger ses chaussures dans l'entrée\s*\?/gi, `Comment ${safeTarget} range-t-il/elle ses chaussures dans l’entrée ?`)
    .replace(/Quelle est l'habitude de \{target\} face à le rituel pour choisir ses vêtements le matin\s*\?/gi, `Comment ${safeTarget} choisit-il/elle ses vêtements le matin ?`)
    .replace(/Quelle est l'habitude de \{target\} face à le comportement quand on égare ses lunettes ou son téléphone\s*\?/gi, `Comment réagit ${safeTarget} en égarant ses clés ou son téléphone ?`)
    .replace(/Quelle est l'habitude de \{target\} face à la réaction face à un gâteau cuisiné par son partenaire\s*\?/gi, `Comment réagit ${safeTarget} quand tu lui cuisines un gâteau ?`)
    .replace(/Selon toi, comment le caractère de \{target\} s'exprime-t-il face à /gi, `Selon toi, comment réagit ${safeTarget} face à `)
    .replace(/Selon toi, quelle facette de sa sensualité révèle ce qui rend son charme le plus dévastateur chez \{target\}\s*\?/gi, `Selon toi, qu’est-ce qui rend le charme de ${safeTarget} le plus irrésistible en soirée ?`)
    .replace(/Selon toi, quelle facette de sa sensualité révèle son attitude face au jeu de la séduction chez \{target\}\s*\?/gi, `Selon toi, quelle est l’attitude de ${safeTarget} face au jeu de la séduction ?`)
    .replace(/Selon toi, quelle facette de sa sensualité révèle sa façon de faire monter la température chez \{target\}\s*\?/gi, `Selon toi, comment ${safeTarget} fait-il/elle monter la température d’un simple regard ?`)
    .replace(/ensemble avec \{target\}/gi, 'ensemble')
    .replace(/à deux avec \{target\}/gi, 'à deux')
    .replace(/dans votre couple avec \{target\}/gi, 'dans votre couple');

  // 2.2 Conversions from 1st person question to 3rd person about target
  raw = raw
    .replace(/de ta part qui fait le plus fondre mon cœur/gi, `de ma part qui fait le plus fondre le cœur de ${safeTarget}`)
    .replace(/qui fait le plus fondre mon cœur/gi, `qui fait le plus fondre le cœur de ${safeTarget}`)
    .replace(/de ma part te donne/gi, `de ta part donne à ${safeTarget}`)
    .replace(/te donne immédiatement des frissons/gi, `donne immédiatement des frissons à ${safeTarget}`)
    .replace(/chez moi a le don de t’émoustiller/gi, `chez toi a le don d’émoustiller ${safeTarget}`)
    .replace(/chez moi a le don de t'émoustiller/gi, `chez toi a le don d'émoustiller ${safeTarget}`)
    .replace(/adore-je particulièrement que tu me fasses/gi, `${safeTarget} adore particulièrement que tu lui fasses`)
    .replace(/adore-je/gi, `${safeTarget} adore`)
    .replace(/mon plat réconfortant suprême/gi, `le plat réconfortant suprême de ${safeTarget}`)
    .replace(/mon péché mignon/gi, `le péché mignon de ${safeTarget}`)
    .replace(/ma boisson favorite/gi, `la boisson favorite de ${safeTarget}`)
    .replace(/ma pire petite manie/gi, `la pire petite manie de ${safeTarget}`)
    .replace(/ma pire habitude/gi, `la pire habitude de ${safeTarget}`)
    .replace(/ma pire manie/gi, `la pire manie de ${safeTarget}`)
    .replace(/mon dimanche idéal/gi, `le dimanche idéal de ${safeTarget}`)
    .replace(/ma tendance naturelle/gi, `la tendance naturelle de ${safeTarget}`)
    .replace(/mon plus grand talent/gi, `le plus grand talent de ${safeTarget}`)
    .replace(/mon timing préféré/gi, `le timing préféré de ${safeTarget}`)
    .replace(/mon désir/gi, `le désir de ${safeTarget}`)
    .replace(/mon envie/gi, `l'envie de ${safeTarget}`)
    .replace(/mon tempo favori/gi, `le tempo favori de ${safeTarget}`)
    .replace(/mon corps/gi, `le corps de ${safeTarget}`)
    .replace(/suis-je généralement/gi, `est ${safeTarget} généralement`)
    .replace(/suis-je/gi, `est ${safeTarget}`)
    .replace(/ai-je réalisé/gi, `${safeTarget} a réalisé`)
    .replace(/ai-je gardé/gi, `${safeTarget} a gardé`)
    .replace(/ai-je/gi, `a ${safeTarget}`)
    .replace(/serais-je prêt\(e\)/gi, `serait ${safeTarget} prêt(e)`)
    .replace(/serais-je capable/gi, `serait ${safeTarget} capable`)
    .replace(/serais-je/gi, `serait ${safeTarget}`)
    .replace(/choisirais-je/gi, `choisirait ${safeTarget}`)
    .replace(/irais-je/gi, `irait ${safeTarget}`)
    .replace(/tiendrais-je/gi, `tiendrait ${safeTarget}`)
    .replace(/m’attirerait/gi, `attirerait ${safeTarget}`)
    .replace(/m'attirerait/gi, `attirerait ${safeTarget}`)
    .replace(/m’a le plus marqué/gi, `a le plus marqué ${safeTarget}`)
    .replace(/m'a le plus marqué/gi, `a le plus marqué ${safeTarget}`)
    .replace(/dans notre couple/gi, `dans votre couple`)
    .replace(/notre histoire/gi, `votre histoire`)
    .replace(/notre relation/gi, `votre relation`)
    .replace(/notre premier/gi, `votre premier`)
    .replace(/notre première/gi, `votre première`)
    .replace(/notre futur/gi, `votre futur`);

  // 2.3 Interpolate placeholders
  raw = raw
    .replace(/\{target\}/g, safeTarget)
    .replace(/\{guesser\}/g, safeGuesser)
    .replace(/\{partner\}/g, safeGuesser)
    .replace(/\s{2,}/g, ' ')
    .trim();

  return raw;
}
