import { WordEntry, wordPool } from '../data/words';

export const TURKISH_ALPHABET = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'.split('');
export const MAX_WRONG_GUESSES = 6;

const openCharacters = new Set([' ', '-']);
const locale = 'tr-TR';

export const normalizeLetter = (value: string) => value.trim().toLocaleUpperCase(locale);

export const pickRandomWord = (previousWord?: string): WordEntry => {
  if (wordPool.length === 1) {
    return wordPool[0];
  }

  let next = wordPool[Math.floor(Math.random() * wordPool.length)];

  while (next.word === previousWord) {
    next = wordPool[Math.floor(Math.random() * wordPool.length)];
  }

  return next;
};

export const getWrongGuessCount = (word: string, guessedLetters: string[]) =>
  guessedLetters.filter((letter) => !word.includes(letter)).length;

export const getRevealedCharacters = (word: string, guessedLetters: string[]) =>
  word.split('').map((character) => {
    if (openCharacters.has(character)) {
      return character;
    }

    return guessedLetters.includes(character) ? character : '';
  });

export const getUniqueLetters = (word: string) =>
  Array.from(new Set(word.split('').filter((character) => TURKISH_ALPHABET.includes(character))));

export const getGameStatus = (word: string, guessedLetters: string[]) => {
  const wrongGuessCount = getWrongGuessCount(word, guessedLetters);
  const uniqueLetters = getUniqueLetters(word);
  const hasWon = uniqueLetters.every((letter) => guessedLetters.includes(letter));
  const hasLost = wrongGuessCount >= MAX_WRONG_GUESSES;

  return {
    wrongGuessCount,
    remainingAttempts: Math.max(0, MAX_WRONG_GUESSES - wrongGuessCount),
    hasWon,
    hasLost,
    isFinished: hasWon || hasLost,
  };
};
