import React, { createContext, useState } from 'react';
import Scrabble from '../scrabble/Scrabble';

const scrabbleGameInstance = new Scrabble({ botCount: 0, playerCount: 2 });
export const ScrabbleContext = createContext<Scrabble>(scrabbleGameInstance);

const ScrabbleContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [scrabble, setScrabble] = useState(scrabbleGameInstance);

  return (
    <ScrabbleContext.Provider value={scrabble}>
      {children}
    </ScrabbleContext.Provider>
  );
};

export default ScrabbleContextProvider;
