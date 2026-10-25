import { Question } from '../types/quiz';

/**
 * Formats question text dynamically based on whether the reader is:
 * - 'target' : the player answering about themselves (e.g. "Quel est ton plat réconfortant suprême...")
 * - 'guesser' : the player guessing about their partner (e.g. "Quel est le plat réconfortant suprême de Lucas...")
 * - 'reveal' : both players reviewing together
 */
export function getFormattedQuestion(
  question: Question,
  mode: 'target' | 'guesser' | 'reveal',
  targetName: string,
  guesserName: string
): string {
  const safeTarget = targetName?.trim() || 'ton/ta partenaire';
  const safeGuesser = guesserName?.trim() || 'toi';

  // 1. If explicit template is provided on the question object
  if (mode === 'guesser' || mode === 'reveal') {
    if (question.guesserQuestion) {
      return question.guesserQuestion
        .replace(/\{target\}/g, safeTarget)
        .replace(/\{guesser\}/g, safeGuesser)
        .replace(/\{partner\}/g, safeGuesser);
    }
  }

  if (mode === 'target') {
    if (question.targetQuestion) {
      return question.targetQuestion
        .replace(/\{target\}/g, safeTarget)
        .replace(/\{guesser\}/g, safeGuesser)
        .replace(/\{partner\}/g, safeGuesser);
    }
  }

  // 2. Fallback smart grammatical transformer for French couple questions
  let raw = question.question;

  if (mode === 'guesser' || mode === 'reveal') {
    // Transform from "mon/ma/mes" (first person) into third person about targetName
    // Specifically handling the user's explicit case:
    // "Quel est le compliment de ta part qui fait le plus fondre mon cœur"
    // -> "Quel est le compliment de ma part qui fait le plus fondre le cœur de [target]"
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

    return raw;
  }

  // If mode === 'target' (answering about yourself)
  raw = raw
    .replace(/mon cœur/gi, 'ton cœur')
    .replace(/de ta part/gi, `de la part de ${safeGuesser}`)
    .replace(/sur toi/gi, `sur ${safeGuesser}`)
    .replace(/avec toi/gi, `avec ${safeGuesser}`)
    .replace(/te faire soupirer/gi, `faire soupirer ${safeGuesser}`)
    .replace(/te donne/gi, `te donne`)
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

  return raw;
}
