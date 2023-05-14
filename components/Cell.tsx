import React, { useRef } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useHover } from 'react-native-web-hooks';
import ScrabbleCell from '../types/ScrabbleCell';
import { isChar } from '../types/TileType';

const Cell: React.FC<{ cell: ScrabbleCell }> = ({ cell }) => {
  const ref = useRef(null);
  const isHovered = useHover(ref);

  const handlePress = () => {
    const letter = prompt('What letter?').toLowerCase();
    if (isChar(letter)) {
      cell.letter = letter;
    }
  };

  return (
    <Pressable
      ref={ref}
      onPress={handlePress}
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

export default Cell;
