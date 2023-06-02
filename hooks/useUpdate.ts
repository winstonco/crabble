import { useState, useEffect } from 'react';
import { useScrabble } from '../contexts/ScrabbleProvider';
import { GameEventHandler } from '../types/GameEvents';

/**
 * A hook to rerender on receiving game events.
 *
 * @param id (Optional) The id of the player for hand updates.
 */
const useUpdate = (id?: string) => {
  const scrabbleGame = useScrabble();
  const [_, setUpdate] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setUpdate((update) => !update);

    scrabbleGame.emitter.addListener('startTurn', handleUpdate);
    scrabbleGame.emitter.addListener('placeTile', handleUpdate);
    scrabbleGame.emitter.addListener('removeTile', handleUpdate);

    const handleUpdateHand: GameEventHandler<'updateHand'> = ({
      id: toCheck,
    }) => {
      if (id && id === toCheck) {
        handleUpdate();
      }
    };

    scrabbleGame.emitter.addListener('updateHand', handleUpdateHand);

    return () => {
      scrabbleGame.emitter.removeListener('startTurn', handleUpdate);
      scrabbleGame.emitter.removeListener('placeTile', handleUpdate);
      scrabbleGame.emitter.removeListener('removeTile', handleUpdate);
      scrabbleGame.emitter.removeListener('updateHand', handleUpdateHand);
    };
  }, [scrabbleGame, id]);
};

export default useUpdate;
