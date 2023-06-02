import { View, StyleSheet } from 'react-native';

import Scoreboard from '../Scoreboard';
import CountdownTimer from '../CountdownTimer';

const GameTopBar = () => {
  return (
    <View style={styles.container}>
      <Scoreboard />
      <CountdownTimer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});

export default GameTopBar;
