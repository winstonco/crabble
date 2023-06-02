import React, { useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import ScrabbleCell from '../types/ScrabbleCell';
import { useScrabble } from '../contexts/ScrabbleProvider';
import useCurrentPlayer from '../hooks/useCurrentPlayer';
import useReceivable from '../hooks/useReceivable';
import TileType from '../types/TileType';
import DraggableTile from './DraggableTile';
import useUpdate from '../hooks/useUpdate';

const Cell: React.FC<{
  cell: ScrabbleCell;
  coords: [number, number];
}> = ({ cell, coords }) => {
  const scrabbleGame = useScrabble();
  const ref = useRef<View>(null);
  useUpdate();
  const currentPlayer = useCurrentPlayer();
  const [turnPlaced, setTurnPlaced] = useState(0);

  useReceivable(
    ref,
    {
      onRelease: (payload) => {
        if (
          payload.indexInHand === undefined ||
          typeof payload.indexInHand !== 'number'
        ) {
          return;
        }
        currentPlayer.placeTile(
          {
            tile: payload.tile as TileType,
            x: coords[0],
            y: coords[1],
          },
          payload.indexInHand
        );
        setTurnPlaced(scrabbleGame.turnNumber);
      },
    },
    [currentPlayer]
  );

  return <View ref={ref} style={[styles.cell, styles[cell.type]]}></View>;
};

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    aspectRatio: '1 / 1',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#777',
    justifyContent: 'center',
    alignItems: 'center',
  },
  'triple-word': {
    backgroundColor: 'red',
  },
  'double-word': {
    backgroundColor: 'pink',
  },
  'triple-letter': {
    backgroundColor: 'blue',
  },
  'double-letter': {
    backgroundColor: 'lightblue',
  },
  text: {
    lineHeight: 0,
    fontSize: 20,
  },
});

export default Cell;
