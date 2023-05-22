import TileType from './TileType';

export type CellType =
  | 'triple-word'
  | 'double-word'
  | 'triple-letter'
  | 'double-letter';

export type ScrabbleCell = {
  type?: CellType;
  tile?: TileType;
};

export default ScrabbleCell;
