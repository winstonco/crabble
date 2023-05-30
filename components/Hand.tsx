import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import Player from '../scrabble/Player';
import TileType from '../types/TileType';
import useUpdate from '../hooks/useUpdate';
import DraggableTile from './DraggableTile';
import useReceivable from '../hooks/useReceivable';

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
  const ref = useRef<View>(null);

  useReceivable(ref, {
    onRelease: (payload) => {
      if (payload.indexInHand !== undefined) {
        return;
      }
      if (payload.from === 'redraw') {
        player.unsetRedraw(payload.tile, payload.indexInRedrawing);
        return;
      }
      player.pickUpTile(payload.placedTile);
    },
  });

  return (
    <View style={styles.hand} ref={ref}>
      {hand.map((tileType, idx) => (
        <DraggableTile
          key={`${tileType}-${idx}`}
          tile={tileType}
          payload={{
            tile: tileType,
            indexInHand: idx,
          }}
          onRelease={(payload) => {
            if (payload.indexInHand !== undefined) {
              player.swapTwo(payload.indexInHand, idx);
            }
          }}
        />
      ))}
    </View>
  );
};

export default Hand;

const styles = StyleSheet.create({
  hand: {
    width: 292,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
});
