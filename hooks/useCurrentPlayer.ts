import { useState, useEffect } from 'react';
import { useScrabble } from '../contexts/ScrabbleProvider';
import { GameEventHandler } from '../types/GameEvents';

const useCurrentPlayer = () => {
  const scrabbleGame = useScrabble();
  const [currentPlayer, setCurrentPlayer] = useState(
    scrabbleGame.currentPlayer
  );

  useEffect(() => {
    const handleStartTurn: GameEventHandler<'startTurn'> = () => {
      setCurrentPlayer(scrabbleGame.currentPlayer);
    };

    scrabbleGame.emitter.addListener('startTurn', handleStartTurn);

    return () => {
      scrabbleGame.emitter.removeListener('startTurn', handleStartTurn);
    };
  }, [scrabbleGame]);

  return currentPlayer;
};

export default useCurrentPlayer;
