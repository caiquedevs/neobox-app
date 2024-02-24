import React from 'react';
import { StatusBar } from 'expo-status-bar';

import { GlobalProvider } from './src/context/GlobalContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

type Props = {};

export default function App({}: Props) {
  return (
    <GlobalProvider>
      <HomeScreen />
      <StatusBar style="light" />
    </GlobalProvider>
  );
}
