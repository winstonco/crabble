import React, { useState, useRef, useContext } from 'react';
import { View, Modal, Pressable, Text, StyleSheet } from 'react-native';
import { useHover } from 'react-native-web-hooks';
import ScrabbleCell from '../types/ScrabbleCell';
import { ScrabbleContext } from './ScrabbleProvider';
import useCurrentPlayer from '../hooks/useCurrentPlayer';
import Hand, { ClickTileHandler } from './Hand';

const Cell: React.FC<{
  cell: ScrabbleCell;
  coords: [number, number];
}> = ({ cell, coords }) => {
  const scrabbleGame = useContext(ScrabbleContext);
  const [modalVisible, setModalVisible] = useState(false);
  const ref = useRef(null);
  const isHovered = useHover(ref);
  const currentPlayer = useCurrentPlayer();

  const handlePressCell = () => {
    setModalVisible(true);
  };

  const handleClickTile: ClickTileHandler = (tile) => {
    currentPlayer.placeTile({ tile, x: coords[0], y: coords[1] });
    setModalVisible(false);
    console.log({ tile, x: coords[0], y: coords[1] });
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Pressable
        ref={ref}
        onPress={handlePressCell}
        style={[
          styles.cell,
          styles[cell.type],
          isHovered && {
            backgroundColor: 'rgb(247, 225, 102)',
          },
        ]}
      >
        <Text style={styles.text}>{cell.tile?.toUpperCase()}</Text>
      </Pressable>
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
        transparent={true}
        style={modalStyles.modal}
      >
        <View style={modalStyles.centeredBottomView}>
          <View style={modalStyles.enterWordContainer}>
            <Text>Place a tile in this cell</Text>
            <Hand player={currentPlayer} onClickTile={handleClickTile} />
            <Pressable onPress={handleClose}>
              <Text>Nevermind</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    aspectRatio: '1 / 1',
    backgroundColor: 'white',
    borderWidth: 1,
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

const modalStyles = StyleSheet.create({
  modal: {},
  centeredBottomView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  enterWordContainer: {
    marginBottom: 16,
    backgroundColor: 'white',
    padding: 30,
    rowGap: 16,
    borderWidth: 2,
    borderColor: 'black',
  },
  textInput: {
    fontSize: 24,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 8,
    padding: 10,
  },
  picker: {
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 8,
    padding: 10,
    fontSize: 20,
  },
  confirmButton: {
    textAlign: 'center',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 8,
    padding: 4,
    backgroundColor: 'rgb(39, 82, 255)',
  },
});

export default Cell;
