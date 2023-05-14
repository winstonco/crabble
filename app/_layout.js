import { Slot } from 'expo-router';
import Head from 'expo-router/head';

const RootLayout = () => {
  return (
    <>
      {/* <Head>
        <title>Crabble</title>
        <meta name="description" content="A crab themed Scrabble bot" />
        <link rel="icon" type="image/x-icon" href="/assets/favicon.png" />
      </Head> */}
      <Slot />
    </>
  );
};

export default RootLayout;
