import { nanoid } from 'nanoid';

import { AddWordHandler, ReturnTypes } from '../types/ScrabbleFns';
import TileType, { isTile } from '../types/TileType';
import Scrabble from './Scrabble';

type TurnEndCallback = () => void;

class Player {
  scrabbleGame: Scrabble;
  id: string;
  name: string;
  score: number;
  hand: TileType[];
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
   * Take the turn to play a word.
   *
   * @param word The word to play.
   * @param coords The location in [x, y] where [0, 0] is the top-left of the board.
   * @param direction TOP_TO_BOTTOM | LEFT_TO_RIGHT
   * @returns True if it was successful, false if not.
   */
  playWord: AddWordHandler = (word, ...args): boolean => {
    if (!this.isTakingTurn) {
      return false;
    }
    const foundLetters: { [c in TileType]?: number } = {};
    for (let letter of word) {
      if (!isTile(letter)) {
        return false;
      }
      const idx = this.hand.indexOf(letter, foundLetters[letter] + 1 ?? 0);
      if (idx === -1) {
        return false;
      }
      foundLetters[letter] = idx;
    }
    const wordScore = this.scrabbleGame.addWord(word, ...args);
    if (wordScore === ReturnTypes.INVALID_WORD) {
      return false;
    }
    this.score += wordScore;
    this.redraw(word.split('') as TileType[]);
    this.endTurn();
    console.log(`${this.name} played a word`);
    return true;
  };

  /**
   * Take the turn to redraw pieces.
   *
   * @param pieces The array of pieces to redraw. They must be in the hand.
   * @returns True if it was successful, false if not.
   */
  redraw = (pieces: TileType[]): boolean => {
    if (!this.isTakingTurn) {
      return false;
    }
    const removedTiles: TileType[] = [];
    const rollbackRemove = () => {
      removedTiles.forEach((tile) => this.hand.push(tile));
      return false;
    };
    pieces.forEach((tile) => {
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

  private endTurn = () => {
    if (this.turnTimeoutId) {
      clearTimeout(this.turnTimeoutId);
    }
    this.turnTimeoutId = null;
    this.isTakingTurn = false;
    this.turnEndCallback?.();
    console.log(`${this.name}'s Turn Ended`);
  };

  private initEventListeners = () => {
    this.scrabbleGame.emitter.addListener(
      'playWord',
      ({ id, word, coords, direction }) => {
        if (id !== this.id) {
          return;
        }
        this.playWord(word, coords, direction);
      }
    );

    this.scrabbleGame.emitter.addListener('redraw', ({ id, pieces }) => {
      if (id !== this.id) {
        return;
      }
      this.redraw(pieces);
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
