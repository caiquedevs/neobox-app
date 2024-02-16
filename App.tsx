import React, { useRef } from "react";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";

import {
  StyleSheet,
  View,
  Alert,
  BackHandler,
} from "react-native";
import { WebView } from "react-native-webview";

export default function App() {
  const webViewRef = useRef<any>(null);
  const hasNavigationHistory = useRef(false);

  React.useEffect(() => {
    const backAction = () => {
      if (
        webViewRef.current &&
        hasNavigationHistory.current
      ) {
        webViewRef.current.goBack();
        return true;
      } else {
        Alert.alert(
          "Aviso",
          "Deseja sair do aplicativo?",
          [
            {
              text: "Cancelar",
              onPress: () => null,
              style: "cancel",
            },
            {
              text: "Sim",
              onPress: () =>
                BackHandler.exitApp(),
            },
          ]
        );
        return true;
      }
    };

    const backHandler =
      BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <WebView
        ref={webViewRef}
        onNavigationStateChange={(navState) => {
          hasNavigationHistory.current =
            navState.canGoBack;
        }}
        source={{
          uri: "http://192.168.1.10:3000/?render=render-stock-list-now-6473c006849ea6826f57ff12",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#24262a",
  },
});
