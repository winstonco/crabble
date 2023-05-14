import ScrabbleBoard from '../types/ScrabbleBoard';
import TileType, { isChars } from '../types/TileType';
import WORD_LIST from './scrabble-word-list';
import LETTER_VALUES from './letter-values.json';
import { AddWordFn } from '../types/ScrabbleFns';

type SpecialTilesList = [[number, number], TileType][];

class Scrabble {
  board: ScrabbleBoard;
  specialTiles: SpecialTilesList;

  constructor(length = 15, width = 15, specialTiles?: SpecialTilesList) {
    this.board = Array.from({ length }, () =>
      Array.from({ length: width }, () => ({}))
    );
    this.specialTiles = specialTiles ?? DEFAULT_SPECIAL_TILES;
    this.resetBoard();
  }

  resetBoard = () => {
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
  };

  isValidWord = (word: string) => {
    return this.getWords().includes(word);
  };

  addWord: AddWordFn = (word, start, direction): boolean => {
    const chars = word.split('');
    const [y, x] = start;
    // Checks
    if (
      !/^[0-9]{1,2}$/.test(`${x}`) ||
      !/^[0-9]{1,2}$/.test(`${y}`) ||
      !(x >= 0 && x <= this.board[0].length) ||
      !(y >= 0 && y <= this.board.length) ||
      !isChars(chars) ||
      !this.isValidWord(word)
    ) {
      return false;
    }

    if (direction === 'LEFT_TO_RIGHT') {
      // Check boundaries
      if (x + word.length > this.board[0].length) {
        return false;
      }
      // Add word
      chars.forEach((char, index) => {
        this.board[y][x + index].letter = char;
      });
    } else {
      // Check boundaries
      if (y + word.length > this.board.length) {
        return false;
      }
      // Add word
      chars.forEach((char, index) => {
        this.board[y + index][x].letter = char;
      });
    }
    return true;
  };

  calcWordScore = (word: string) => {
    return word
      .split('')
      .reduce((score, letter) => (score += LETTER_VALUES[letter]), 0);
  };

  private getWords = () => {
    return WORD_LIST.trim().split('\n');
  };
}

export default Scrabble;

const DEFAULT_SPECIAL_TILES: SpecialTilesList = [
  [[0, 0], 'triple-word'],
  [[7, 0], 'triple-word'],
  [[14, 0], 'triple-word'],
  [[0, 7], 'triple-word'],
  [[14, 7], 'triple-word'],
  [[0, 14], 'triple-word'],
  [[7, 14], 'triple-word'],
  [[14, 14], 'triple-word'],
  [[1, 1], 'double-word'],
  [[2, 2], 'double-word'],
  [[3, 3], 'double-word'],
  [[4, 4], 'double-word'],
  [[1, 13], 'double-word'],
  [[2, 12], 'double-word'],
  [[3, 11], 'double-word'],
  [[4, 10], 'double-word'],
  [[10, 10], 'double-word'],
  [[11, 11], 'double-word'],
  [[12, 12], 'double-word'],
  [[13, 13], 'double-word'],
  [[13, 1], 'double-word'],
  [[12, 2], 'double-word'],
  [[11, 3], 'double-word'],
  [[10, 4], 'double-word'],
  [[7, 7], 'double-word'],
  [[5, 1], 'triple-letter'],
  [[9, 1], 'triple-letter'],
  [[1, 5], 'triple-letter'],
  [[5, 5], 'triple-letter'],
  [[9, 5], 'triple-letter'],
  [[13, 5], 'triple-letter'],
  [[1, 9], 'triple-letter'],
  [[5, 9], 'triple-letter'],
  [[9, 9], 'triple-letter'],
  [[13, 9], 'triple-letter'],
  [[5, 13], 'triple-letter'],
  [[9, 13], 'triple-letter'],
  [[3, 0], 'double-letter'],
  [[11, 0], 'double-letter'],
  [[6, 2], 'double-letter'],
  [[8, 2], 'double-letter'],
  [[7, 3], 'double-letter'],
  [[0, 3], 'double-letter'],
  [[14, 3], 'double-letter'],
  [[2, 6], 'double-letter'],
  [[2, 8], 'double-letter'],
  [[3, 7], 'double-letter'],
  [[6, 6], 'double-letter'],
  [[6, 8], 'double-letter'],
  [[8, 6], 'double-letter'],
  [[8, 8], 'double-letter'],
  [[11, 7], 'double-letter'],
  [[12, 6], 'double-letter'],
  [[12, 8], 'double-letter'],
  [[0, 11], 'double-letter'],
  [[14, 11], 'double-letter'],
  [[7, 11], 'double-letter'],
  [[6, 12], 'double-letter'],
  [[8, 12], 'double-letter'],
  [[3, 14], 'double-letter'],
  [[11, 14], 'double-letter'],
];
