import TileType from './TileType';
import WordDirection from './WordDirection';

export namespace sfns {
  export type PlacedTile = { tile: TileType; x: number; y: number };

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

  export type CheckTilePlacementFn = (
    placedTiles: PlacedTile[]
  ) => [boolean, number];

  export type PlaceTileFn = (placedTile: PlacedTile) => boolean;

  export type RemoveTileFn = (placedTile: PlacedTile) => TileType | false;
}

export default sfns;
