import { useState, useEffect, useContext } from 'react';
import { ScrabbleContext } from '../components/ScrabbleProvider';

/**
 * A hook to rerender on receiving game events.
 *
 * @param id (Optional) The id of the player for hand updates.
 */
const useUpdate = (id?: string) => {
  const scrabbleGame = useContext(ScrabbleContext);
  const [_, setUpdate] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setUpdate((update) => !update);

    const placeTileSub = scrabbleGame.emitter.addListener(
      'placeTile',
      handleUpdate
    );
    const removeTileSub = scrabbleGame.emitter.addListener(
      'removeTile',
      handleUpdate
    );

    const startTurnSub = scrabbleGame.emitter.addListener(
      'startTurn',
      handleUpdate
    );

    const updateHandSub = scrabbleGame.emitter.addListener(
      'updateHand',
      ({ id: toCheck }) => {
        if (id && id === toCheck) {
          handleUpdate();
        }
      }
    );

    return () => {
      startTurnSub.remove();
      placeTileSub.remove();
      removeTileSub.remove();
      updateHandSub.remove();
    };
  }, [scrabbleGame, id]);
};

export default useUpdate;
