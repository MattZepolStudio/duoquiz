import { Question } from '../../types/quiz';
import { SOUVENIRS_QUESTIONS } from './souvenirs';
import { QUOTIDIEN_QUESTIONS } from './quotidien';
import { PERSONNALITE_QUESTIONS } from './personnalite';
import { PROJETS_QUESTIONS } from './projets';
import { COQUIN_QUESTIONS } from './coquin';

export const ALL_THEMED_QUESTIONS: Question[] = [
  ...SOUVENIRS_QUESTIONS,
  ...QUOTIDIEN_QUESTIONS,
  ...PERSONNALITE_QUESTIONS,
  ...PROJETS_QUESTIONS,
  ...COQUIN_QUESTIONS,
];
