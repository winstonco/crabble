import { nanoid } from 'nanoid';

import sfns from '../types/ScrabbleFns';
import TileType, { isTile } from '../types/TileType';
import Scrabble from './Scrabble';

type TurnEndCallback = () => void;

class Player {
  readonly scrabbleGame: Scrabble;
  readonly id: string;
  name: string;
  score: number;
  hand: TileType[];
  redrawing: TileType[];
  placedTiles: sfns.PlacedTile[];
  isTakingTurn: boolean;
  turnEndCallback: TurnEndCallback;
  turnTimeoutId: NodeJS.Timeout;

  constructor(game: Scrabble, name: string) {
    this.scrabbleGame = game;
    this.id = nanoid();
    this.name = name;
    this.score = 0;
    this.hand = [];
    for (let _ of Array(7)) {
      this.hand.push(this.scrabbleGame.drawPiece());
    }
    this.redrawing = [];
    this.placedTiles = [];
    this.isTakingTurn = false;
    this.initEventListeners();
  }

  /**
   * Take the turn.
   *
   * @param turnTime The amount of time in the turn in milliseconds.
   * @returns When the turn is over.
   */
  takeTurn = async (turnTime: number, callback?: TurnEndCallback) => {
    if (this.isTakingTurn) {
      return;
    }
    return new Promise<void>((res) => {
      console.log(`${this.name}'s Turn Started`);
      this.isTakingTurn = true;
      this.turnEndCallback = () => {
        callback?.();
        res();
      };
      this.turnTimeoutId = setTimeout(() => {
        this.endTurn();
      }, turnTime);
    });
  };

  /**
   * Take the turn to place tiles on the board.
   *
   * @returns True if it was successful, false if not.
   */
  confirmPlacedTiles = (): boolean => {
    const [placementSuccessful, score] = this.scrabbleGame.checkTilePlacement(
      this.placedTiles
    );
    if (placementSuccessful) {
      this.endTurn();
      this.score += score;
      this.placedTiles = [];
      return true;
    }
    this.revertPlacedTiles();
    return false;
  };

  private revertPlacedTiles = (): void => {
    while (this.placedTiles.length > 0) {
      const placedTileToRevert = this.placedTiles.shift();
      const revertedTile = this.scrabbleGame.removeTile(placedTileToRevert);
      if (revertedTile) {
        this.hand.push(revertedTile);
      }
    }
    this.scrabbleGame.emitter.emit('updateHand', { id: this.id });
  };

  /**
   * Adds a tile to the tiles placed list.
   *
   * @param placedTile The tile type and location of the tile placed.
   * @param indexInHand The index of the tile in the hand.
   */
  placeTile = (placedTile: sfns.PlacedTile, indexInHand: number) => {
    if (indexInHand < 0 || indexInHand >= this.hand.length) {
      return;
    }
    if (this.scrabbleGame.placeTile(placedTile)) {
      this.hand.splice(indexInHand, 1);
      console.log(this.hand);
      this.scrabbleGame.emitter.emit('updateHand', { id: this.id });
      this.placedTiles.push(placedTile);
    }
  };

  pickUpTile = (placedTile: sfns.PlacedTile) => {
    const tile = this.scrabbleGame.removeTile(placedTile);
    if (tile) {
      this.placedTiles.splice(this.placedTiles.indexOf(placedTile), 1);
      this.hand.push(tile);
      this.scrabbleGame.emitter.emit('updateHand', { id: this.id });
    }
  };

  // /**
  //  * Take the turn to play a word.
  //  *
  //  * @deprecated
  //  * @param word The word to play.
  //  * @param coords The location in [x, y] where [0, 0] is the top-left of the board.
  //  * @param direction TOP_TO_BOTTOM | LEFT_TO_RIGHT
  //  * @returns True if it was successful, false if not.
  //  */
  // playWord: sfns.AddWordHandler = (word, ...args): boolean => {
  //   if (!this.isTakingTurn) {
  //     return false;
  //   }
  //   const foundLetters: { [c in TileType]?: number } = {};
  //   for (let letter of word) {
  //     if (!isTile(letter)) {
  //       return false;
  //     }
  //     const idx = this.hand.indexOf(letter, foundLetters[letter] + 1 ?? 0);
  //     if (idx === -1) {
  //       return false;
  //     }
  //     foundLetters[letter] = idx;
  //   }
  //   const wordScore = this.scrabbleGame.addWord(word, ...args);
  //   if (wordScore === sfns.ReturnTypes.INVALID_WORD) {
  //     return false;
  //   }
  //   this.score += wordScore;
  //   for (let _ of word) {
  //     this.hand.push(this.scrabbleGame.drawPiece());
  //   }
  //   this.endTurn();
  //   console.log(`${this.name} played a word`);
  //   return true;
  // };

  /**
   * Take the turn to redraw pieces.
   *
   * @returns True if it was successful, false if not.
   */
  redraw = (): boolean => {
    if (!this.isTakingTurn || this.redrawing.length === 0) {
      return false;
    }
    const removedTiles: TileType[] = [];
    const rollbackRemove = () => {
      removedTiles.forEach((tile) => this.hand.push(tile));
      return false;
    };
    this.redrawing.forEach((tile) => {
      const handIdx = this.hand.indexOf(tile);
      if (handIdx === -1) {
        rollbackRemove();
      }
      removedTiles.push(tile);
      this.hand.splice(handIdx, 1);
    });
    this.scrabbleGame.shufflePieces();
    removedTiles.forEach(() => {
      const draw = this.scrabbleGame.drawPiece();
      this.hand.push(draw);
    });
    this.endTurn();
    console.log(`${this.name} redrew pieces`);
    return true;
  };

  /**
   * Take a piece out of the player's hand and put in "redrawing group" before confirming redraw.
   *
   * @param piece The piece being selected to redraw.
   * @param indexInHand The index of the piece in `this.hand`.
   * @returns True if it was successful, false if not.
   */
  setRedraw = (piece: TileType, indexInHand: number): boolean => {
    if (indexInHand < 0 || indexInHand >= this.hand.length) {
      return false;
    }
    if (this.hand[indexInHand] !== piece) {
      return false;
    }
    this.hand.splice(indexInHand, 1);
    this.redrawing.push(piece);
    this.scrabbleGame.emitter.emit('updateHand', { id: this.id });
    return true;
  };

  /**
   * Take a piece out of the player's "redrawing group" and put in their hand.
   *
   * @param piece The piece being selected to redraw.
   * @param indexInRedrawing The index of the piece in `this.redrawing`.
   * @returns True if it was successful, false if not.
   */
  unsetRedraw = (piece: TileType, indexInRedrawing: number) => {
    if (indexInRedrawing < 0 || indexInRedrawing >= this.redrawing.length) {
      return false;
    }
    if (this.redrawing[indexInRedrawing] !== piece) {
      return false;
    }
    this.hand.push(piece);
    this.redrawing.splice(indexInRedrawing, 1);
    this.scrabbleGame.emitter.emit('updateHand', { id: this.id });
    return true;
  };

  /**
   * Pass the turn.
   *
   * @returns True
   */
  passTurn = (): boolean => {
    console.log(this.id);
    if (!this.isTakingTurn) {
      return false;
    }
    this.endTurn();
    console.log(`${this.name} passed their turn`);
    return true;
  };

  swapTwo = (index1: number, index2: number) => {
    const temp = this.hand[index1];
    this.hand[index1] = this.hand[index2];
    this.hand[index2] = temp;
    this.scrabbleGame.emitter.emit('updateHand', { id: this.id });
  };

  private drawToFull = () => {
    while (
      this.hand.length < 7 &&
      this.scrabbleGame.piecesRemaining.length > 0
    ) {
      const piece = this.scrabbleGame.drawPiece();
      this.hand.push(piece);
    }
  };

  private endTurn = () => {
    if (this.turnTimeoutId) {
      clearTimeout(this.turnTimeoutId);
    }
    this.turnTimeoutId = null;
    this.isTakingTurn = false;
    this.drawToFull();
    this.turnEndCallback?.();
    console.log(`${this.name}'s Turn Ended`);
  };

  private initEventListeners = () => {
    this.scrabbleGame.emitter.addListener('redraw', ({ id }) => {
      if (id !== this.id) {
        return;
      }
      this.redraw();
    });

    this.scrabbleGame.emitter.addListener('pass', ({ id }) => {
      if (id !== this.id) {
        return;
      }
      this.passTurn();
    });
  };
}

export default Player;
