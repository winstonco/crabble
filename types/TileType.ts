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

type TileType =
  | 'triple-word'
  | 'double-word'
  | 'triple-letter'
  | 'double-letter';

export default TileType;
