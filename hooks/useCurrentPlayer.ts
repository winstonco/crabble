import { useState, useEffect, useContext } from 'react';
import { ScrabbleContext } from '../components/ScrabbleProvider';

const useCurrentPlayer = () => {
  const scrabbleGame = useContext(ScrabbleContext);
  const [currentPlayer, setCurrentPlayer] = useState(
    scrabbleGame.currentPlayer
  );

  useEffect(() => {
    const startTurnSub = scrabbleGame.emitter.addListener('startTurn', () => {
      setCurrentPlayer(scrabbleGame.currentPlayer);
    });

    return () => {
      startTurnSub.remove();
    };
  }, [scrabbleGame]);

  return currentPlayer;
};

export default useCurrentPlayer;
