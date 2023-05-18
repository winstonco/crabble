import { NativeEventEmitter } from 'react-native/types';
import ScrabbleBoard from '../types/ScrabbleBoard';
import TileType, { Char, isChars } from '../types/TileType';
import WORD_LIST from './scrabble-word-list';
import LETTER_VALUES from './letter-values.json';
import { AddWordFn, ReturnTypes } from '../types/ScrabbleFns';
import ScrabbleCell from '../types/ScrabbleCell';
import {
  DEFAULT_SPECIAL_TILES_LIST,
  DEFAULT_TILE_DISTRIBUTION,
  DEFAULT_TURN_LENGTH,
  SpecialTilesList,
  TileDistribution,
} from './defaults';
import Player from './Player';
import Bot from './Bot';
import shuffleArray from '../helpers/shuffleArray';
import TypedNativeEventEmitter from '../types/TypedNativeEventEmitter';
import GameEvents from '../types/GameEvents';

type ScrabbleOptions = {
  length?: number;
  width?: number;
  playerCount?: number;
  botCount?: number;
  startingSpecialTiles?: SpecialTilesList;
  startingTileDistribution?: TileDistribution;
};

class Scrabble {
  readonly board: ScrabbleBoard;
  readonly emitter: TypedNativeEventEmitter<GameEvents>;
  readonly piecesRemaining: TileType[];
  readonly players: Player[];

  private _roundNumber: number;
  private currentPlayerIndex: number;
  private _isInGame: boolean;
  private specialTiles: SpecialTilesList;

  constructor({
    length = 15,
    width = 15,
    playerCount = 1,
    botCount = 1,
    startingSpecialTiles = DEFAULT_SPECIAL_TILES_LIST,
    startingTileDistribution = DEFAULT_TILE_DISTRIBUTION,
  }: ScrabbleOptions) {
    // Set up event emitter
    this.emitter = new TypedNativeEventEmitter();

    // Set up board
    this.board = Array.from({ length }, () =>
      Array.from({ length: width }, () => ({}))
    );
    this.specialTiles = startingSpecialTiles ?? DEFAULT_SPECIAL_TILES_LIST;

    // Set up bag
    this.piecesRemaining = (
      Object.entries(startingTileDistribution ?? DEFAULT_TILE_DISTRIBUTION) as [
        TileType,
        number
      ][]
    ).flatMap(([tile, count]) => Array.from({ length: count }, () => tile));
    this.shufflePieces();

    // Set up players
    this.players = [];
    for (let i = 1; i <= playerCount; i++) {
      this.players.push(new Player(this, `Player ${i}`));
    }
    for (let i = 1; i <= botCount; i++) {
      this.players.push(new Bot(this, `Bot ${i}`));
    }
    this.shufflePlayers();

    // Set up initial game data
    this.currentPlayerIndex = 0;
    this._roundNumber = 0;
    this._isInGame = false;

    this.resetGame();
  }

  /**
   * Draws a piece from the bag.
   *
   * @returns The next piece in the bag. If the bag is empty, the game ends.
   */
  drawPiece = (): TileType => {
    const nextPiece = this.piecesRemaining.shift();
    if (nextPiece) {
      return nextPiece;
    } else {
      this.endGame();
    }
  };

  /**
   * Resets the game.
   */
  resetGame = () => {
    const length = this.board.length;
    const width = this.board[0].length;

    this.specialTiles.forEach(([coords, type]) => {
      const [y, x] = coords;
      this.board[x][y].type = type;
    });

    for (let i = 0; i < length; i++) {
      for (let j = 0; j < width; j++) {
        this.board[i][j].letter = undefined;
      }
    }

    this.shufflePieces();
    this.shufflePlayers();
  };

  /**
   * Shuffles the remaining pieces.
   */
  shufflePieces = () => {
    shuffleArray(this.piecesRemaining);
  };

  /**
   * Shuffles the players.
   */
  shufflePlayers = () => {
    shuffleArray(this.players);
  };

  /**
   * Each player takes a turn.
   *
   * @returns The player that won or null.
   */
  playRound: () => Promise<Player | null> = async () => {
    for (let player of this.players) {
      if (player instanceof Bot) {
        await player.takeTurn();
      } else {
        this.emitter.emit('startTurn', {
          id: player.id,
          turnLength: DEFAULT_TURN_LENGTH,
        });
        await player.takeTurn(DEFAULT_TURN_LENGTH);
        this.emitter.emit('endTurn', { id: player.id, score: player.score });
      }
      this.currentPlayerIndex =
        (this.currentPlayerIndex + 1) % this.players.length;
    }

    this._roundNumber++;

    return null;
  };

  /**
   * Game startup function.
   */
  startGame = async () => {
    if (this._isInGame) {
      return;
    }
    this.resetGame();
    console.log('Starting Game');
    this._isInGame = true;
    while (!this.isGameOver()) {
      await this.playRound();
    }
  };

  /**
   * Game cleanup function that is called when game end triggers happen.
   */
  endGame = () => {
    this.resetGame();
    console.log('Game Over');
    this._isInGame = false;
  };

  /**
   * @returns Whether the game is over.
   */
  isGameOver = (): boolean => {
    return false;
  };

  /**
   * Checks if a word is in the official Scrabble US dictionary.
   *
   * @param word The word to check.
   * @returns True if the word is valid. False if not.
   */
  isValidWord = (word: string) => {
    return this.getWords().includes(word);
  };

  /**
   * Adds a word to the board.
   *
   * @returns -1 if the add fails. Otherwise, returns the value of the added word.
   */
  addWord: AddWordFn = (word, start, direction): number => {
    const chars = word.split('');
    const [y, x] = start;
    // Checks
    const xyRegex = /^[0-9]{1,2}$/;
    const xIsValid = x >= 0 && x <= this.board[0].length;
    const yIsValid = y >= 0 && y <= this.board.length;
    if (
      !xyRegex.test(`${x}`) ||
      !xyRegex.test(`${y}`) ||
      !xIsValid ||
      !yIsValid ||
      !isChars(chars) ||
      !this.isValidWord(word)
    ) {
      return ReturnTypes.INVALID_WORD;
    }

    let wordScore = 0;
    let wordMultiplier = 1;

    const addLetter = (tile: ScrabbleCell, letter: Char) => {
      tile.letter = letter;

      let letterMultiplier = 1;
      if (tile) {
        switch (tile.type) {
          case 'double-letter':
            letterMultiplier = 2;
            break;
          case 'triple-letter':
            letterMultiplier = 3;
            break;
          case 'double-word':
            wordMultiplier = 2;
            break;
          case 'triple-word':
            wordMultiplier = 3;
            break;
        }
      }
      wordScore += LETTER_VALUES[letter] * letterMultiplier;
    };

    if (direction === 'LEFT_TO_RIGHT') {
      // Check boundaries
      if (x + word.length > this.board[0].length) {
        return ReturnTypes.INVALID_WORD;
      }
      // Add word
      chars.forEach((char, index) => addLetter(this.board[y][x + index], char));
    } else {
      // Check boundaries
      if (y + word.length > this.board.length) {
        return ReturnTypes.INVALID_WORD;
      }
      // Add word
      chars.forEach((char, index) => addLetter(this.board[y + index][x], char));
    }

    return wordScore * wordMultiplier;
  };

  private getWords = () => {
    return WORD_LIST.trim().split('\n');
  };

  get roundNumber() {
    return this._roundNumber;
  }

  get currentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  get isInGame() {
    return this._isInGame;
  }
}

export default Scrabble;
