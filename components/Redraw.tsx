import React, { useState, useContext } from 'react';
import { StyleSheet, Button, Modal, View, Text, Pressable } from 'react-native';
import { ScrabbleContext } from './ScrabbleProvider';
import TileType from '../types/TileType';
import Hand, { ClickTileHandler } from './Hand';
import useCurrentPlayer from '../hooks/useCurrentPlayer';

const Redraw: React.FC<{}> = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTiles, setSelectedTiles] = useState<TileType[]>([]);
  const scrabbleGame = useContext(ScrabbleContext);
  const currentPlayer = useCurrentPlayer();

  const redraw = (pieces: TileType[]) => {
    // scrabbleGame.emitter.emit('redraw', {
    //   id: currentPlayer.id,
    //   pieces: pieces,
    // });
    currentPlayer.redraw(pieces);
  };

  const handlePress = () => {
    setModalVisible(true);
  };

  const handleRedraw = () => {
    redraw(selectedTiles);
    handleClose();
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleClickTile: ClickTileHandler = (tile, index, selected) => {
    setSelectedTiles((prev) => {
      if (selected) {
        return [...prev, tile];
      } else {
        const indexOfTile = prev.indexOf(tile);
        if (indexOfTile !== -1) {
          return [
            ...prev.slice(0, indexOfTile),
            ...prev.slice(indexOfTile + 1, prev.length),
          ];
        }
      }
    });
  };

  return (
    <>
      <Button onPress={handlePress} title="Redraw" />
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={handleClose}
        transparent={true}
      >
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.container}>
            <Text style={{ fontSize: 16 }}>
              Select tiles below and press Redraw.
            </Text>
            <Hand
              player={scrabbleGame.currentPlayer}
              onClickTile={handleClickTile}
            />
            <View style={modalStyles.row}>
              <Pressable onPress={handleRedraw} style={modalStyles.close}>
                <Text style={{ fontSize: 16, color: 'white' }}>Redraw</Text>
              </Pressable>
              <Pressable onPress={handleClose} style={modalStyles.close}>
                <Text style={{ fontSize: 16, color: 'white' }}>Nevermind</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Redraw;

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: 'white',
    padding: 16,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'black',
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  close: {
    flex: 1,
    marginTop: 'auto',
    textAlign: 'center',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 8,
    padding: 4,
    backgroundColor: 'rgb(39, 82, 255)',
  },
});
