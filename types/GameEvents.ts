import TileType from './TileType';
import WordDirection from './WordDirection';

type GameEvents = {
  startTurn: [
    {
      id: string;
      turnLength: number;
    }
  ];
  playWord: [
    {
      id: string;
      word: string;
      coords: [number, number];
      direction: WordDirection;
    }
  ];
  redraw: [
    {
      id: string;
      pieces: TileType[];
    }
  ];
  pass: [
    {
      id: string;
    }
  ];
  endTurn: [
    {
      id: string;
      score: number;
    }
  ];
};

// TO ME: Add the correct events here for playing a word, redrawing, or passing. Then add in Player.ts the listener for those. Then make the events get fired in app/index.tsx.

export type GameEventHandler<TEventName extends keyof GameEvents> = (
  ...args: GameEvents[TEventName]
) => void;

export default GameEvents;
