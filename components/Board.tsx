import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import Cell from './Cell';
import { ScrabbleContext } from './ScrabbleContext';

const Board: React.FC<{}> = () => {
  const { board } = useContext(ScrabbleContext);

  return (
    <View style={styles.board}>
      {board.map((row, rowNum) => {
        return (
          <View style={{ flexDirection: 'row' }} key={`row-${rowNum}`}>
            {row.map((cell, index) => {
              return (
                <Cell
                  cell={cell}
                  coords={[rowNum, index]}
                  key={`cell-${rowNum}-${index}`}
                />
              );
            })}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    minWidth: 600,
    maxWidth: 800,
    width: '80%',
    aspectRatio: '1 / 1',
  },
});

export default Board;
