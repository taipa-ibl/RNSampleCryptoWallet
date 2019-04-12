/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, Text, View, Button } from 'react-native';
import bip39 from 'bip39';
import crypto from 'crypto';
import Bitcoin from './src/libs/bitcoin';

export default function App(props) {
  const [seed, setSeed] = useState('');
  const [btc, setBtc] = useState('');
  let bitcoin = null;

  const generateSeed = () => {
    const mnemonic = bip39.generateMnemonic();
    // bip39.validateMnemonic('timber predict session remind glory drum great meat spend sleep ostrich order')
    setSeed(mnemonic);

    const result = bitcoin.createWalletFromSeed({ mnemonic });
    console.warn(result)
  };

  useEffect(() => {
    bitcoin = new Bitcoin({ isTestnet: false });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome to React Native!</Text>
      <Text style={styles.instructions}>{seed}</Text>

      <Button onPress={generateSeed} title="Gen Seed" color="#841584" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
});
