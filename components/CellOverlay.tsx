import React, { useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import ScrabbleCell from '../types/ScrabbleCell';
import { useScrabble } from '../contexts/ScrabbleProvider';
import useCurrentPlayer from '../hooks/useCurrentPlayer';
import useReceivable from '../hooks/useReceivable';
import TileType from '../types/TileType';
import DraggableTile from './DraggableTile';
import useUpdate from '../hooks/useUpdate';

const CellOverlay: React.FC<{
  cell: ScrabbleCell;
  coords: [number, number];
}> = ({ cell, coords }) => {
  const scrabbleGame = useScrabble();
  const ref = useRef<View>(null);
  // useUpdate();
  const currentPlayer = useCurrentPlayer();
  const [turnPlaced, setTurnPlaced] = useState(0);

  useReceivable(
    ref,
    {
      onRelease: (payload) => {
        currentPlayer.placeTile(
          {
            tile: payload.tile as TileType,
            x: coords[0],
            y: coords[1],
          },
          payload.indexInHand
        );
        setTurnPlaced(scrabbleGame.turnNumber);
        console.log(coords);
      },
    },
    [currentPlayer]
  );

  return (
    <View ref={ref} style={[styles.cell]}>
      {cell.tile && (
        <DraggableTile
          tile={cell.tile}
          payload={{
            placedTile: {
              tile: cell.tile,
              x: coords[0],
              y: coords[1],
            },
          }}
          draggable={turnPlaced === scrabbleGame.turnNumber}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    aspectRatio: '1 / 1',
    backgroundColor: 'transparent',
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    lineHeight: 0,
    fontSize: 20,
  },
});

export default CellOverlay;
