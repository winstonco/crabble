import TileType, { Char } from './TileType';

export type CellType =
  | 'triple-word'
  | 'double-word'
  | 'triple-letter'
  | 'double-letter';

export type ScrabbleCell = {
  type?: CellType;
  letter?: Char;
};

export default ScrabbleCell;
