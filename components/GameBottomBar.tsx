import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import Hand from './Hand';
import { ScrabbleContext } from './ScrabbleContext';
import Redraw from './Redraw';
import Player from '../scrabble/Player';
import { GameEventHandler } from '../types/GameEvents';
import useCurrentPlayer from '../hooks/useCurrentPlayer';
import TileType from '../types/TileType';

const GameBottomBar = () => {
  const [idxTileSelected, setIdxTileSelected] = useState(-1);
  const scrabbleGame = useContext(ScrabbleContext);
  const currentPlayer = useCurrentPlayer();

  const handlePass = () => {
    scrabbleGame.emitter.emit('pass', { id: currentPlayer.id });
    console.log(currentPlayer.name);
  };

  const handleSwitchTile = (tileType: TileType, index: number) => {
    if (idxTileSelected === -1) {
      setIdxTileSelected(index);
    } else if (idxTileSelected === index) {
      setIdxTileSelected(-1);
    } else {
      // Switch them
      let temp = currentPlayer.hand[idxTileSelected];
      currentPlayer.hand[idxTileSelected] = currentPlayer.hand[index];
      currentPlayer.hand[index] = temp;
      setIdxTileSelected(-1);
    }
  };

  const handleConfirmPlacement = () => {
    currentPlayer.confirmPlacedTiles();
  };

  return (
    <View style={styles.bar}>
      <Button onPress={handlePass} title="Pass" />
      <Hand player={currentPlayer} onClickTile={handleSwitchTile} />
      <Button onPress={handleConfirmPlacement} title="Confirm Placement" />
      <Redraw />
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
});

export default GameBottomBar;
