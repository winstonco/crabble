import React, { useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import Cell from './Cell';
import { ScrabbleContext } from './ScrabbleProvider';
import useUpdate from '../hooks/useUpdate';
import DraggableTile from './DraggableTile';
import CellOverlay from './CellOverlay';

const Board: React.FC<{}> = () => {
  useUpdate();
  const { board } = useContext(ScrabbleContext);

  return (
    <View style={styles.container}>
      {/* {board.map((row, rowNum) => {
        return (
          <View style={{ flexDirection: 'row' }} key={`row-${rowNum}`}>
            {row.map((cell, index) => {
              return (
                <Cell
                  cell={cell}
                  coords={[index, rowNum]}
                  key={`cell-${rowNum}-${index}`}
                />
              );
            })}
          </View>
        );
      })} */}
      <FlatList
        style={[styles.board]}
        data={board.flat()}
        renderItem={({ item, index }) => {
          const cell = item;
          const coords: [number, number] = [
            index % board[0].length,
            Math.floor(index / board[0].length),
          ];

          return <Cell cell={cell} coords={coords} />;
        }}
        numColumns={board[0].length}
        extraData={board}
        key={board.length}
      />
      <FlatList
        style={[styles.board, styles.overlay]}
        data={board.flat()}
        renderItem={({ item, index }) => {
          const cell = item;
          const coords: [number, number] = [
            index % board[0].length,
            Math.floor(index / board[0].length),
          ];

          return (
            <>
              {/* {cell.tile && (
                <DraggableTile
                  tile={cell.tile}
                  payload={{
                    placedTile: {
                      tile: cell.tile,
                      x: coords[0],
                      y: coords[1],
                    },
                  }}
                  draggable={turnPlaced === scrabbleGame.turnNumber}
                />
              )} */}
              <CellOverlay cell={cell} coords={coords} />
            </>
          );
        }}
        numColumns={board[0].length}
        extraData={board}
        key={board.length}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    minWidth: 600,
    maxWidth: 800,
    aspectRatio: '1 / 1',
    width: '80%',
  },
  board: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
  },
  overlay: {
    backgroundColor: 'transparent',
  },
});

export default Board;
