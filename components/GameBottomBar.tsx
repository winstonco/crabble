import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import Hand from './Hand';
import { ScrabbleContext } from './ScrabbleContext';
import Redraw from './Redraw';
import Player from '../scrabble/Player';
import { GameEventHandler } from '../types/GameEvents';
import useCurrentPlayer from '../hooks/useCurrentPlayer';

const GameBottomBar = () => {
  const scrabbleGame = useContext(ScrabbleContext);
  const currentPlayer = useCurrentPlayer();

  const handlePass = () => {
    scrabbleGame.emitter.emit('pass', { id: currentPlayer.id });
    console.log(currentPlayer.name);
  };

  return (
    <View style={styles.bar}>
      <Button onPress={handlePass} title="Pass" />
      <Hand player={currentPlayer} />
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
