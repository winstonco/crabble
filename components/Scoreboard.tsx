import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { GameEventHandler } from '../types/GameEvents';
import { useScrabble } from '../contexts/ScrabbleProvider';
import useCurrentPlayer from '../hooks/useCurrentPlayer';

type PlayerScores = {
  id: string;
  name: string;
  score: number;
}[];

const Scoreboard: React.FC<{}> = () => {
  const scrabbleGame = useScrabble();
  const currentPlayer = useCurrentPlayer();

  const [playerScores, setPlayerScores] = useState<PlayerScores>(
    scrabbleGame.players
  );

  const handleEndTurn: GameEventHandler<'endTurn'> = useCallback(
    ({ id, score: newScore }) => {
      setPlayerScores(
        playerScores.map((player) =>
          player.id === id ? { ...player, score: newScore } : player
        )
      );
    },
    [playerScores]
  );

  useEffect(() => {
    scrabbleGame.emitter.addListener('endTurn', handleEndTurn);

    return () => {
      scrabbleGame.emitter.removeListener('endTurn', handleEndTurn);
    };
  }, [handleEndTurn]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scoreboard</Text>
      <View style={styles.horizontalLine} />
      {playerScores.map((player) => (
        <View style={styles.row} key={player.id}>
          {currentPlayer && player.id === currentPlayer.id && (
            <Entypo name="chevron-right" size={24} color="black" />
          )}
          <Text style={styles.name}>{player.name}</Text>
          <Text style={styles.score}>{player.score}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  title: {
    fontSize: 20,
  },
  horizontalLine: {
    borderStyle: 'solid',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: 'row',
  },
  name: {
    fontSize: 16,
  },
  score: {
    fontSize: 16,
    marginLeft: 'auto',
  },
});

export default Scoreboard;
