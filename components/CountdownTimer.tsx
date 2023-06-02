import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';

import { GameEventHandler } from '../types/GameEvents';
import { useScrabble } from '../contexts/ScrabbleProvider';

const CountdownTimer: React.FC<{}> = () => {
  const scrabbleGame = useScrabble();
  const [running, setRunning] = useState(false);
  const [duration, setDuration] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const handleStartTurn: GameEventHandler<'startTurn'> = ({ turnLength }) => {
      setDuration(turnLength / 1000);
      setRunning(true);
      setKey((prevKey) => prevKey + 1);
    };

    const handleEndTurn: GameEventHandler<'endTurn'> = () => {
      setRunning(false);
    };

    scrabbleGame.emitter.addListener('startTurn', handleStartTurn);

    scrabbleGame.emitter.addListener('endTurn', handleEndTurn);

    return () => {
      scrabbleGame.emitter.removeListener('startTurn', handleStartTurn);
      scrabbleGame.emitter.removeListener('endTurn', handleEndTurn);
    };
  }, []);

  return (
    <CountdownCircleTimer
      key={key}
      isPlaying={running}
      duration={duration}
      colors={['#FFFFFF', '#FFFFFF']}
      colorsTime={[0, 0]}
      size={100}
      strokeLinecap="butt"
    >
      {({ remainingTime }) => <Text style={styles.text}>{remainingTime}</Text>}
    </CountdownCircleTimer>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 30,
    aspectRatio: '1 / 1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});

export default CountdownTimer;
