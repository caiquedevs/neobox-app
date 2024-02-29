import React from 'react';
import { StatusBar } from 'expo-status-bar';

import { GlobalProvider } from './src/context/GlobalContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { ToastProvider } from 'react-native-toast-notifications';

type Props = {};

export default function App({}: Props) {
  return (
    <ToastProvider
      placement="top"
      duration={5000}
      animationType="zoom-in"
      animationDuration={250}
      successColor="green"
      dangerColor="red"
      warningColor="orange"
      normalColor="gray"
      textStyle={{ fontSize: 20 }}
      offset={50}
      offsetTop={120}
      offsetBottom={40}
      swipeEnabled={true}
    >
      <GlobalProvider>
        <HomeScreen />
        <StatusBar style="light" />
      </GlobalProvider>
    </ToastProvider>
  );
}
