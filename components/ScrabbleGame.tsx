import { StyleSheet, Button, View } from 'react-native';

import Board from './Board';
import Legend from './Legend';
import { useScrabble } from '../contexts/ScrabbleProvider';
import GameBottomBar from './layout/GameBottomBar';
import useUpdate from '../hooks/useUpdate';
import GameTopBar from './layout/GameTopBar';

const ScrabbleGame = () => {
  useUpdate();
  const scrabbleGame = useScrabble();

  const handleStartGame = () => {
    scrabbleGame.startGame();
  };

  return (
    <View style={styles.game}>
      <GameTopBar />
      <Board />
      <GameBottomBar />
      <View style={styles.buttons}>
        <Button onPress={handleStartGame} title="Start Game" />
        <Legend />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default ScrabbleGame;
