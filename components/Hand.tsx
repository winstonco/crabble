import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';

import Player from '../scrabble/Player';
import TileType from '../types/TileType';

export type ClickTileHandler = (
  tile: TileType,
  indexInHand: number,
  selected: boolean
) => void;

const HandTile: React.FC<{
  tile: TileType;
  indexInHand: number;
  onClick?: ClickTileHandler;
}> = ({ tile, indexInHand, onClick }) => {
  const [selected, setSelected] = useState(false);

  const handlePressHandTile = () => {
    setSelected(!selected);
    onClick?.(tile, indexInHand, !selected);
  };

  return (
    <Pressable
      onPress={handlePressHandTile}
      style={[styles.cell, selected && styles.selected]}
    >
      <Text style={styles.text}>{tile?.toUpperCase()}</Text>
    </Pressable>
  );
};

const Hand: React.FC<{
  player: Player;
  onClickTile?: ClickTileHandler;
}> = ({ player, onClickTile }) => {
  return (
    <View style={styles.hand}>
      {player.hand.map((tileType, idx) => (
        <HandTile
          key={`${tileType}-${idx}`}
          tile={tileType}
          indexInHand={idx}
          onClick={onClickTile}
        />
      ))}
    </View>
  );
};

export default Hand;

const styles = StyleSheet.create({
  hand: {
    flexDirection: 'row',
    gap: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  cell: {
    width: 30,
    aspectRatio: '1 / 1',
    backgroundColor: 'rgb(255, 223, 97)',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    borderColor: 'rgb(255, 77, 0)',
    borderWidth: 2,
  },
  text: {
    lineHeight: 0,
    fontSize: 20,
  },
});
