import React, { useRef } from 'react';
import { StyleSheet, Button, View, Text } from 'react-native';
import useCurrentPlayer from '../hooks/useCurrentPlayer';
import useReceivable from '../hooks/useReceivable';
import DraggableTile from './DraggableTile';
import useUpdate from '../hooks/useUpdate';

const Redraw: React.FC<{}> = () => {
  const currentPlayer = useCurrentPlayer();
  const ref = useRef(null);
  useUpdate(currentPlayer.id);

  useReceivable(ref, {
    onRelease: (payload) => {
      if (
        payload.tile === undefined ||
        typeof payload.tile !== 'string' ||
        payload.from === 'redraw' ||
        payload.indexInHand === undefined ||
        typeof payload.indexInHand !== 'number'
      ) {
        return;
      }
      currentPlayer.setRedraw(payload.tile, payload.indexInHand);
    },
  });

  const handleRedraw = () => {
    currentPlayer.redraw();
  };

  return (
    <View style={styles.container} ref={ref}>
      <Text>Drag tiles here to redraw them. This takes your turn</Text>
      <View style={styles.tiles}>
        {currentPlayer.redrawing.map((tile, index) => {
          return (
            <DraggableTile
              key={`redraw-${tile}-${index}`}
              tile={tile}
              payload={{
                tile,
                indexInRedrawing: index,
                from: 'redraw',
              }}
            />
          );
        })}
      </View>
      <View style={styles.confirm}>
        <Button onPress={handleRedraw} title="Confirm Redraw" />
      </View>
    </View>
  );
};

export default Redraw;

const styles = StyleSheet.create({
  container: {
    width: 200,
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
  },
  tiles: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  confirm: {
    marginTop: 'auto',
  },
});
