import React from 'react';
import { View, StyleSheet } from 'react-native';
import ScrabbleBoard from '../types/ScrabbleBoard';
import Cell from './Cell';

const Board: React.FC<{ board: ScrabbleBoard }> = ({ board }) => {
  return (
    <View style={styles.board}>
      {board.map((row, rowNum) => {
        return (
          <View style={{ flexDirection: 'row' }} key={`row-${rowNum}`}>
            {row.map((cell, index) => {
              return <Cell cell={cell} key={`cell-${rowNum}-${index}`} />;
            })}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    width: '80%',
    aspectRatio: '1 / 1',
  },
});

export default Board;
