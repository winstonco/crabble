import Player from './Player';
import Scrabble from './Scrabble';

class Bot extends Player {
  constructor(game: Scrabble, name: string) {
    super(game, name);
  }

  /**
   * Play the best move (greedy).
   */
  playBest = async () => {
    await new Promise<void>((res) => {
      setTimeout(res, 2000);
    });
    console.log(``);
  };

  /**
   * Take the turn.
   */
  takeTurn: () => Promise<void> = async () => {
    await this.playBest();
  };
}

export default Bot;
