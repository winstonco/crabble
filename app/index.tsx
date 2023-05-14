import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button, View } from 'react-native';
import Scrabble from '../scrabble/Scrabble';
import Board from '../components/Board';
import { useState } from 'react';

const App = () => {
  const scrabbleGame = new Scrabble();
  const [reset, setReset] = useState(0);

  const handleReset = () => {
    scrabbleGame.resetBoard();
    setReset(reset + 1);
  };

  return (
    <View style={styles.container}>
      <Board board={scrabbleGame.board} />
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
