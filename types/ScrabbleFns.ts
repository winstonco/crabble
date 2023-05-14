import WordDirection from './WordDirection';

export type AddWordFn = (
  word: string,
  coords: [number, number],
  direction: WordDirection
) => boolean | void;
