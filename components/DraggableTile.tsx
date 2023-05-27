import React, { useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  NativeSyntheticEvent,
} from 'react-native';
import TileType from '../types/TileType';
import useDraggable from '../hooks/useDraggable';
import useReceivable from '../hooks/useReceivable';
import useCurrentPlayer from '../hooks/useCurrentPlayer';

type DraggableTileProps = {
  tile: TileType;
  payload: any;
  onMove?: (ev: NativeSyntheticEvent<unknown>) => void;
  onRelease?: (payload: any) => void;
  draggable?: boolean;
};

const DraggableTile: React.FC<DraggableTileProps> = ({
  draggable = true,
  ...props
}) => {
  const viewRef = useRef<View>(null);
  const currentPlayer = useCurrentPlayer();

  const { panResponder, conditionalStyles } = useDraggable(
    viewRef,
    {
      onMove: props.onMove,
    },
    props.payload
  );

  useReceivable(
    viewRef,
    {
      onRelease: props.onRelease,
      exclude: [viewRef],
    },
    [currentPlayer]
  );

  return (
    <Animated.View
      ref={viewRef}
      style={[...(draggable ? conditionalStyles : []), styles.cell]}
      {...(draggable ? panResponder.panHandlers : [])}
    >
      <Text style={styles.text}>{props.tile?.toUpperCase()}</Text>
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
