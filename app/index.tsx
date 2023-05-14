import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button, View } from 'react-native';

import Scrabble from '../scrabble/Scrabble';
import Board from '../components/Board';
import { AddWordFn } from '../types/ScrabbleFns';

const ScrabbleGame = new Scrabble();

const App = () => {
  const [update, setUpdate] = useState(false);

  const handleReset = () => {
    ScrabbleGame.resetBoard();
    setUpdate(!update);
  };

  const handleAddWord: AddWordFn = (word, coords, direction) => {
    ScrabbleGame.addWord(word, coords, direction);
    setUpdate(!update);
  };

  return (
    <View style={styles.container}>
      <Board board={ScrabbleGame.board} handleAddWord={handleAddWord} />
      <Button onPress={handleReset} title="Reset?" />
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
