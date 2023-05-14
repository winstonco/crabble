import React, { useState, useRef } from 'react';
import {
  View,
  Modal,
  SafeAreaView,
  TextInput,
  Pressable,
  Text,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useHover } from 'react-native-web-hooks';
import ScrabbleCell from '../types/ScrabbleCell';
import { AddWordFn } from '../types/ScrabbleFns';
import WordDirection from '../types/WordDirection';

const Cell: React.FC<{
  cell: ScrabbleCell;
  coords: [number, number];
  handleAddWord: AddWordFn;
}> = ({ cell, coords, handleAddWord }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [wordInput, setWordInput] = useState('');
  const [selectedDirection, setSelectedDirection] =
    useState<WordDirection>('LEFT_TO_RIGHT');
  const ref = useRef(null);
  const isHovered = useHover(ref);

  const handlePressCell = () => {
    setModalVisible(true);
  };

  const handleConfirm = () => {
    setModalVisible(false);
    handleAddWord(wordInput, coords, selectedDirection);
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
        <Text style={styles.text}>{cell.letter?.toUpperCase()}</Text>
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
            <SafeAreaView>
              <TextInput
                value={wordInput}
                onChangeText={setWordInput}
                placeholder="Enter word"
                style={modalStyles.textInput}
              />
            </SafeAreaView>
            <Picker
              selectedValue={selectedDirection}
              onValueChange={(itemValue) => {
                setSelectedDirection(itemValue);
              }}
            >
              <Picker.Item label="Left -> Right ➡️" value={'LEFT_TO_RIGHT'} />
              <Picker.Item label="Top -> Bottom ⬇️" value={'TOP_TO_BOTTOM'} />
            </Picker>
            <Pressable
              onPress={handleConfirm}
              style={modalStyles.confirmButton}
            >
              <Text style={{ fontSize: 24, color: 'white' }}>Confirm</Text>
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
