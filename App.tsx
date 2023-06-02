import React from 'react';
import { View, StyleSheet } from 'react-native';

import { ScrabbleProvider } from './contexts/ScrabbleProvider';
import { DragEventsProvider } from './contexts/DragEventsContext';
import ScrabbleGame from './components/ScrabbleGame';

const App: React.FC = () => {
  return (
    <DragEventsProvider>
      <ScrabbleProvider>
        <View style={styles.container}>
          <ScrabbleGame />
        </View>
      </ScrabbleProvider>
    </DragEventsProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default App;
