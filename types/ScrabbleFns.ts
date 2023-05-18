import WordDirection from './WordDirection';

export enum ReturnTypes {
  INVALID_WORD = -1,
}

export type AddWordFn = (
  word: string,
  coords: [number, number],
  direction: WordDirection
) => number;

export type AddWordHandler = (
  word: string,
  coords: [number, number],
  direction: WordDirection
) => any;
