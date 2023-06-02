import React, { useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import Hand from '../Hand';
import { useScrabble } from '../../contexts/ScrabbleProvider';
import Redraw from '../Redraw';
import useCurrentPlayer from '../../hooks/useCurrentPlayer';
import TileType from '../../types/TileType';
import useUpdate from '../../hooks/useUpdate';

const GameBottomBar = () => {
  const [idxTileSelected, setIdxTileSelected] = useState(-1);
  const scrabbleGame = useScrabble();
  const currentPlayer = useCurrentPlayer();
  useUpdate();

  const handlePass = () => {
    // scrabbleGame.emitter.emit('pass', { id: currentPlayer.id });
    currentPlayer.passTurn();
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
    <View style={styles.container}>
      <Hand player={currentPlayer} onClickTile={handleSwitchTile} />
      <View style={styles.row}>
        <Redraw />
        <View>
          <Button onPress={handleConfirmPlacement} title="Confirm Placement" />
          <Button onPress={handlePass} title="Pass" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
});

export default GameBottomBar;
