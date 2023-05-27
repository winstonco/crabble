import React, { useRef } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import TileType from '../types/TileType';
import useDraggable from '../hooks/useDraggable';
import useReceivable from '../hooks/useReceivable';

const DraggableTile: React.FC<{
  tile: TileType;
  indexInHand: number;
}> = ({ tile, indexInHand }) => {
  const viewRef = useRef<View>(null);

  const { panResponder, conditionalStyles } = useDraggable(
    viewRef,
    {
      // onMove: (ev) => console.log(ev),
    },
    tile
  );

  useReceivable(
    viewRef,
    {
      onRelease: (payload) => {
        console.log(payload);
        console.log(tile);
      },
    },
    [viewRef]
  );

  return (
    <Animated.View
      ref={viewRef}
      style={[...conditionalStyles, styles.cell]}
      {...panResponder.panHandlers}
    >
      <Text style={styles.text}>{tile?.toUpperCase()}</Text>
    </Animated.View>
  );
};

export default DraggableTile;

const styles = StyleSheet.create({
  cell: {
    width: 30,
    aspectRatio: '1 / 1',
    backgroundColor: 'rgb(255, 223, 97)',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    userSelect: 'none',
  },
  text: {
    lineHeight: 0,
    fontSize: 20,
  },
});
