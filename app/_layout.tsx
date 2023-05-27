import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { Slot } from 'expo-router';
import { Helmet } from 'react-helmet';
import Head from 'expo-router/src/head/Head';
import ScrabbleProvider from '../components/ScrabbleProvider';
import DragEventsProvider from '../components/DragEventsProvider';

const FixedHead = Head as React.FC<{ children: React.ReactNode }>;

const RootLayout = () => {
  useEffect(() => {
    document.title = 'Crabble';
  }, []);

  return (
    <DragEventsProvider>
      <ScrabbleProvider>
        {Platform.OS === 'web' && (
          <FixedHead>
            <title>Crabble</title>
            <meta name="description" content="A crab themed Scrabble bot" />
            <link rel="icon" type="image/x-icon" href="/assets/favicon.png" />
          </FixedHead>
        )}
        <Slot />
      </ScrabbleProvider>
    </DragEventsProvider>
  );
};

export default RootLayout;
