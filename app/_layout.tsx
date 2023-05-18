import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { Slot } from 'expo-router';
import { Helmet } from 'react-helmet';
import Head from 'expo-router/src/head/Head';
import ScrabbleContextProvider from '../components/ScrabbleContext';

const FixedHead = Head as React.FC<{ children: React.ReactNode }>;

const RootLayout = () => {
  useEffect(() => {
    document.title = 'Crabble';
  }, []);

  return (
    <ScrabbleContextProvider>
      {Platform.OS === 'web' && (
        <FixedHead>
          <title>Crabble</title>
          <meta name="description" content="A crab themed Scrabble bot" />
          <link rel="icon" type="image/x-icon" href="/assets/favicon.png" />
        </FixedHead>
      )}
      <Slot />
    </ScrabbleContextProvider>
  );
};

export default RootLayout;
