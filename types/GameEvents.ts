import TileType from './TileType';
import sfns from './ScrabbleFns';
import WordDirection from './WordDirection';

type GameEvents = {
  updateHand: [{ id: string }];
  startTurn: [
    {
      id: string;
      turnLength: number;
    }
  ];
  placeTile: [];
  removeTile: [];
  redraw: [
    {
      id: string;
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

export type GameEventHandler<TEventName extends keyof GameEvents> = (
  ...args: GameEvents[TEventName]
) => void;

export default GameEvents;
