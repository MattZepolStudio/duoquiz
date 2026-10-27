/**
 * Generator script to expand Duo Quiz categories to 105+ questions per difficulty level:
 * - Souvenirs: 105 easy, 105 medium, 105 spicy (315 total)
 * - Quotidien: 105 easy, 105 medium, 105 spicy (315 total)
 * - Personnalité: 105 easy, 105 medium, 105 spicy (315 total)
 * - Projets: 105 easy, 105 medium, 105 spicy (315 total)
 * - Coquin: 105 easy, 105 medium, 105 spicy (315 total)
 * Total: 1,575 high-quality questions!
 */

import * as fs from 'fs';
import * as path from 'path';
import { SOUVENIRS_QUESTIONS } from '../src/data/categories/souvenirs';
import { QUOTIDIEN_QUESTIONS } from '../src/data/categories/quotidien';
import { PERSONNALITE_QUESTIONS } from '../src/data/categories/personnalite';
import { PROJETS_QUESTIONS } from '../src/data/categories/projets';
import { COQUIN_QUESTIONS } from '../src/data/categories/coquin';
import { Question, CategoryId, DifficultyLevel } from '../src/types/quiz';

interface QuestionTemplate {
  q: string;
  target?: string;
  guesser?: string;
  opts: [string, string, string, string];
  hint: string;
}

// Helper to auto-format target/guesser questions if not specified
function makeQuestion(
  id: string,
  category: CategoryId,
  difficulty: DifficultyLevel,
  tpl: QuestionTemplate
): Question {
  const targetQ = tpl.target || tpl.q
    .replace(/vous/g, 'toi et {partner}')
    .replace(/votre/g, 'ton')
    .replace(/vos/g, 'tes');
  const guesserQ = tpl.guesser || tpl.q
    .replace(/vous/g, 'toi et {target}')
    .replace(/votre/g, 'le goût de {target} pour votre')
    .replace(/vos/g, 'les');

  return {
    id,
    category,
    difficulty,
    question: tpl.q,
    targetQuestion: targetQ,
    guesserQuestion: guesserQ,
    options: tpl.opts,
    hint: tpl.hint,
  };
}

console.log('Script loaded successfully');
