import { useState, useEffect, useContext } from 'react';
import { ScrabbleContext } from '../components/ScrabbleContext';

const useUpdate = (id?: string) => {
  const scrabbleGame = useContext(ScrabbleContext);
  const [_, setUpdate] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setUpdate((update) => !update);

    const placeTileSub = scrabbleGame.emitter.addListener(
      'placeTile',
      handleUpdate
    );
    const removeTileSub = scrabbleGame.emitter.addListener('removeTile', () => {
      handleUpdate();
      console.log('removed tile');
    });

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
  }, [scrabbleGame]);
};

export default useUpdate;
