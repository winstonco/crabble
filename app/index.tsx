import { useState, useEffect, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button, View, Text } from 'react-native';

import Board from '../components/Board';
import Legend from '../components/Legend';
import Scoreboard from '../components/Scoreboard';
import { GameEventHandler } from '../types/GameEvents';
import { ScrabbleContext } from '../components/ScrabbleContext';
import GameBottomBar from '../components/GameBottomBar';
import CountdownTimer from '../components/CountdownTimer';
import useCurrentPlayer from '../hooks/useCurrentPlayer';

const App = () => {
  const [update, setUpdate] = useState(false);
  const scrabbleGame = useContext(ScrabbleContext);
  const currentPlayer = useCurrentPlayer();

  const handleReset = () => {
    scrabbleGame.resetGame();
    setUpdate(!update);
  };

  const handleStartGame = () => {
    scrabbleGame.startGame();
  };

  return (
    <View style={styles.main}>
      <View style={styles.sidebar}>
        <Scoreboard />
      </View>
      <View style={styles.game}>
        {<CountdownTimer />}
        <Text style={{ fontSize: 20 }}>
          Current Player: {currentPlayer.name}
        </Text>
        <Board />
        <GameBottomBar />
        <View style={styles.buttons}>
          <Button onPress={handleReset} title="Reset" />
          <Button onPress={handleStartGame} title="Start Game" />
          <Legend />
        </View>
        <StatusBar style="auto" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  sidebar: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  game: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttons: {
    flexDirection: 'row',
    gap: 16,
  },
});

export default App;
