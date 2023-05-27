import React from 'react';
import { StyleSheet, View } from 'react-native';

import Player from '../scrabble/Player';
import TileType from '../types/TileType';
import useUpdate from '../hooks/useUpdate';
import DraggableTile from './DraggableTile';

export type ClickTileHandler = (
  tile: TileType,
  indexInHand: number,
  selected: boolean
) => void;

const Hand: React.FC<{
  player: Player;
  onClickTile?: ClickTileHandler;
}> = ({ player, onClickTile }) => {
  useUpdate(player.id);
  const hand = player.hand;

  return (
    <View style={styles.hand}>
      {hand.map((tileType, idx) => (
        <DraggableTile
          key={`${tileType}-${idx}`}
          tile={tileType}
          indexInHand={idx}
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
});
