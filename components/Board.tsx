import React from 'react';
import { View, StyleSheet } from 'react-native';
import ScrabbleBoard from '../types/ScrabbleBoard';
import Cell from './Cell';
import { AddWordFn } from '../types/ScrabbleFns';

const Board: React.FC<{
  board: ScrabbleBoard;
  handleAddWord: AddWordFn;
}> = ({ board, handleAddWord }) => {
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
                  handleAddWord={handleAddWord}
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
    minWidth: 300,
    maxWidth: 800,
    width: '80%',
    aspectRatio: '1 / 1',
  },
});

export default Board;
