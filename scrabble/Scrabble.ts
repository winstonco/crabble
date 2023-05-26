import ScrabbleBoard from '../types/ScrabbleBoard';
import TileType, { Char, isChar, isChars } from '../types/TileType';
import WORD_LIST from './scrabble-word-list';
import LETTER_VALUES from './letter-values.json';
import sfns from '../types/ScrabbleFns';
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
  /** board[y][x].tile is undefined if no tile on it */
  readonly board: ScrabbleBoard;
  readonly emitter: TypedNativeEventEmitter<GameEvents>;
  readonly piecesRemaining: TileType[];
  readonly players: Player[];

  /** Starts at 1 */
  private _roundNumber: number;
  /** Starts at 1 */
  private _turnNumber: number;
  private currentPlayerIndex: number;
  private _isInGame: boolean;
  private specialTiles: SpecialTilesList;
  private firstWordPlaced: boolean;

  constructor({
    length = 15,
    width = 15,
    playerCount = 1,
    botCount = 1,
    startingSpecialTiles = DEFAULT_SPECIAL_TILES_LIST,
    startingTileDistribution = DEFAULT_TILE_DISTRIBUTION,
  }: ScrabbleOptions) {
    if (length % 2 === 0 || width % 2 === 0) return;

    // Set up event emitter
    this.emitter = new TypedNativeEventEmitter();

    // Set up board
    this.board = Array.from({ length }, () =>
      Array.from({ length: width }, () => ({}))
    );
    this.specialTiles = startingSpecialTiles;
    this.specialTiles.forEach(([coords, type]) => {
      const [y, x] = coords;
      this.board[x][y].type = type;
    });

    // Set up bag
    this.piecesRemaining = (
      Object.entries(startingTileDistribution) as [TileType, number][]
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
    this._turnNumber = 0;
    this.firstWordPlaced = false;
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

    for (let i = 0; i < length; i++) {
      for (let j = 0; j < width; j++) {
        this.board[i][j].tile = undefined;
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
    this._roundNumber++;

    for (let player of this.players) {
      this._turnNumber++;
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
   * Calculate the score of a word.
   *
   * @param startLetterCoords [x, y] of the last letter.
   * @param endLetterCoords [x, y] of the first letter.
   * @returns The score of the word or -1 if failed.
   */
  calcWordScoreByCoords = (
    word: string,
    startLetterCoords: [number, number],
    endLetterCoords: [number, number]
  ): number => {
    const [x1, y1] = startLetterCoords;
    const [x2, y2] = endLetterCoords;

    if (!this.isValidWord(word) || x2 < x1 || y2 < y1) {
      return -1;
    }

    let wordScore = 0;
    let wordMultiplier = 1;

    const addLetter = (cell: ScrabbleCell, letter: Char) => {
      let letterMultiplier = 1;
      if (cell) {
        switch (cell.type) {
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

    if (y1 === y2) {
      // Row
      if (x2 - x1 + 1 !== word.length) {
        return -1;
      }
      word.split('').forEach((letter, index) => {
        if (isChar(letter)) {
          addLetter(this.board[x1 + index][y1], letter);
        }
      });
    } else if (x1 === x2) {
      // Column
      if (y2 - y1 + 1 !== word.length) {
        return -1;
      }
      word.split('').forEach((letter, index) => {
        if (isChar(letter)) {
          addLetter(this.board[x1][y1 + index], letter);
        }
      });
    } else {
      return -1;
    }

    return wordScore * wordMultiplier;
  };

  /**
   * If possible, places a tile on the board.
   *
   * @param placedTile The tile type and location of the placed tile.
   * @returns True if the tile was added. False if it was not.
   */
  placeTile: sfns.PlaceTileFn = ({ tile, x, y }) => {
    const xyRegex = /^[0-9]{1,2}$/;
    const xIsValid = x >= 0 && x <= this.board[0].length;
    const yIsValid = y >= 0 && y <= this.board.length;
    if (
      !xyRegex.test(`${x}`) ||
      !xyRegex.test(`${y}`) ||
      !xIsValid ||
      !yIsValid
    ) {
      return false;
    }
    if (this.board[y][x].tile) {
      return false;
    }
    this.emitter.emit('placeTile');
    this.board[y][x].tile = tile;
  };

  removeTile: sfns.RemoveTileFn = ({ tile, x, y }) => {
    const xyRegex = /^[0-9]{1,2}$/;
    const xIsValid = x >= 0 && x <= this.board[0].length;
    const yIsValid = y >= 0 && y <= this.board.length;
    if (
      !xyRegex.test(`${x}`) ||
      !xyRegex.test(`${y}`) ||
      !xIsValid ||
      !yIsValid
    ) {
      return false;
    }
    if (!this.board[y][x].tile) {
      return false;
    }
    const pickedUp = this.board[y][x].tile;
    this.board[y][x].tile = undefined;
    if (tile !== pickedUp) {
      return false;
    }
    this.emitter.emit('removeTile');
    return pickedUp;
  };

  /**
   * Checks if all placed tiles are in a row or column, that they
   * make at least 1 word, and they don't make any invalid words.
   *
   * @param placedTiles The tiles to check.
   * @returns An array containing\
   * [0] A boolean of whether the placed tiles are valid.\
   * [1] The score of the placed tiles.
   */
  checkTilePlacement: sfns.CheckTilePlacementFn = (placedTiles) => {
    const wordsAffected: {
      word: string;
      startCoords: [number, number];
      endCoords: [number, number];
    }[] = [];
    let score = 0;
    if (placedTiles.length > 1) {
      const tileOnCenter = placedTiles.some(({ x, y }) => x === 7 && y === 7);
      const isRow = placedTiles.every(({ y }) => y === placedTiles[0].y);
      const isCol = placedTiles.every(({ x }) => x === placedTiles[0].x);

      // isRow XOR isCol
      if (
        !((isRow || isCol) && !(isRow && isCol)) ||
        (!this.firstWordPlaced && !tileOnCenter)
      ) {
        return [false, score];
      }
    }

    let wordCreated = false;
    let invalidWord = false;
    placedTiles.forEach(({ x, y }) => {
      // check for any horizontal word created from this tile
      let horizontalWordStartX = x;
      while (this.board[y][horizontalWordStartX - 1]?.tile) {
        horizontalWordStartX--;
      }
      let horizontalWord = this.board[y][horizontalWordStartX].tile;
      let nextLetterX = horizontalWordStartX + 1;
      while (this.board[y][nextLetterX]?.tile) {
        horizontalWord += this.board[y][nextLetterX]?.tile;
        nextLetterX++;
      }
      if (this.isValidWord(horizontalWord)) {
        wordCreated = true;
        const toAdd = {
          word: horizontalWord,
          startCoords: [horizontalWordStartX, y] as [number, number],
          endCoords: [nextLetterX - 1, y] as [number, number],
        };
        if (
          !wordsAffected.some(
            ({ startCoords, endCoords }) =>
              startCoords.every((num, i) => num === toAdd.startCoords[i]) &&
              endCoords.every((num, i) => num === toAdd.endCoords[i])
          )
        ) {
          wordsAffected.push(toAdd);
        }
      } else if (horizontalWord.length > 1) {
        invalidWord = true;
      }
      // check for any vertical word created from this tile
      let verticalWordStartY = y;
      while (this.board[verticalWordStartY - 1][x]?.tile) {
        verticalWordStartY--;
      }
      let verticalWord = this.board[verticalWordStartY][x].tile;
      let nextLetterY = verticalWordStartY + 1;
      while (this.board[nextLetterY][x]?.tile) {
        verticalWord += this.board[nextLetterY][x]?.tile;
        nextLetterY++;
      }
      if (this.isValidWord(verticalWord)) {
        wordCreated = true;
        const toAdd = {
          word: verticalWord,
          startCoords: [x, verticalWordStartY] as [number, number],
          endCoords: [x, nextLetterY - 1] as [number, number],
        };
        if (
          !wordsAffected.some(
            ({ startCoords, endCoords }) =>
              startCoords.every((num, i) => num === toAdd.startCoords[i]) &&
              endCoords.every((num, i) => num === toAdd.endCoords[i])
          )
        ) {
          wordsAffected.push(toAdd);
        }
      } else if (verticalWord.length > 1) {
        invalidWord = true;
      }
    });

    if (wordCreated && !invalidWord) {
      wordsAffected.forEach(({ word, startCoords, endCoords }) => {
        score += this.calcWordScoreByCoords(word, startCoords, endCoords);
      });
      this.firstWordPlaced = true;
      return [true, score];
    }
    return [false, 0];
  };

  /**
   * Adds a word to the board.
   *
   * @returns -1 if the add fails. Otherwise, returns the value of the added word.
   */
  addWord: sfns.AddWordFn = (word, start, direction): number => {
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
      return sfns.ReturnTypes.INVALID_WORD;
    }

    let wordScore = 0;
    let wordMultiplier = 1;

    const addLetter = (cell: ScrabbleCell, letter: Char) => {
      cell.tile = letter;

      let letterMultiplier = 1;
      if (cell) {
        switch (cell.type) {
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
      const wordIsOutOfBounds = x + word.length > this.board[0].length;
      const wordIsAdjacentToAnother =
        this.board[y][x - 1]?.tile !== undefined ||
        chars.some(
          (_, index) =>
            this.board[y + 1][x + index]?.tile !== undefined ||
            this.board[y - 1][x + index]?.tile !== undefined
        ) ||
        this.board[y][x + word.length]?.tile !== undefined;
      const firstWordOnCenter = chars.some(
        (_, index) =>
          x + index === (this.board[0].length - 1) / 2 &&
          y === (this.board.length - 1) / 2
      );
      if (
        wordIsOutOfBounds ||
        (this.firstWordPlaced && !wordIsAdjacentToAnother) ||
        (!this.firstWordPlaced && !firstWordOnCenter)
      ) {
        return sfns.ReturnTypes.INVALID_WORD;
      }
      // Add word
      chars.forEach((char, index) => addLetter(this.board[y][x + index], char));
    } else {
      const wordIsOutOfBounds = y + word.length > this.board.length;
      const wordIsAdjacentToAnother =
        this.board[y - 1][x]?.tile !== undefined ||
        chars.some(
          (_, index) =>
            this.board[y + index][x + 1]?.tile !== undefined ||
            this.board[y + index][x - 1]?.tile !== undefined
        ) ||
        this.board[y + word.length][x]?.tile !== undefined;
      const firstWordOnCenter = chars.some(
        (_, index) =>
          x === (this.board[0].length - 1) / 2 &&
          y + index === (this.board.length - 1) / 2
      );
      if (
        wordIsOutOfBounds ||
        (this.firstWordPlaced && !wordIsAdjacentToAnother) ||
        (!this.firstWordPlaced && !firstWordOnCenter)
      ) {
        return sfns.ReturnTypes.INVALID_WORD;
      }
      // Add word
      chars.forEach((char, index) => addLetter(this.board[y + index][x], char));
    }

    this.firstWordPlaced = true;
    return wordScore * wordMultiplier;
  };

  private getWords = () => {
    return WORD_LIST.trim().split('\n');
  };

  get roundNumber() {
    return this._roundNumber;
  }

  get turnNumber() {
    return this._turnNumber;
  }

  get currentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  get isInGame() {
    return this._isInGame;
  }
}

export default Scrabble;
