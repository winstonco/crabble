export type Char =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z';

export const isChar = (c: string): c is Char => {
  return /^[a-z]$/.test(c);
};

export const isChars = (word: string[]): word is Char[] => {
  for (const letter of word) {
    if (!isChar(letter)) {
      return false;
    }
  }
  return true;
};

type TileType = Char | ' ';

export const isTile = (c: string): c is TileType => {
  return /^[a-z]$/.test(c) || c === ' ';
};

export default TileType;
