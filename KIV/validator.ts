/**
 * Validates if a word is within the allowed length for the Odd Hunt game.
 */
export const isValidWord = (word: string): boolean => {
  return word.length >= 4 && word.length <= 7;
};
