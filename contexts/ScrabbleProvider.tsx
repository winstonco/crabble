import React, { createContext, useRef, useContext } from 'react';
import Scrabble from '../scrabble/Scrabble';

const scrabbleGameInstance = new Scrabble({ botCount: 0, playerCount: 2 });
export const ScrabbleContext = createContext<Scrabble>(scrabbleGameInstance);

export const useScrabble = () => useContext(ScrabbleContext);

export const ScrabbleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const scrabble = useRef(scrabbleGameInstance).current;

  return (
    <ScrabbleContext.Provider value={scrabble}>
      {children}
    </ScrabbleContext.Provider>
  );
};

export default ScrabbleContext;
