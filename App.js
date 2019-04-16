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
import BitcoinAPI from './src/libs/bitcoin.api';

export default function App(props) {
  const [seed, setSeed] = useState('');
  const [btc, setBtc] = useState('');
  const [balance, setBalance] = useState(0);
  const [utxos, setUtxos] = useState([]);
  const [priKey, setPrikey] = useState('');
  const [rawTx, setRawTx] = useState('');
  const [signedMsg, setSignedMsg] = useState('');
  const [verifyMsgResult, setverifyMsgResult] = useState('NG');

  let bitcoin = new Bitcoin({ isTestnet: true });
  let bitcoinApi = new BitcoinAPI({ isTestnet: true });

  const generateSeed = async () => {
    // const mnemonic = bip39.generateMnemonic();
    // bip39.validateMnemonic('timber predict session remind glory drum great meat spend sleep ostrich order')
    const mnemonic =
      'timber predict session remind glory drum great meat spend sleep ostrich order'; // Testnet: mrdDuignqKSpThHDx7HnzX6DarQrkHFYxg
    const mnemonic2 =
      'saddle marriage volcano stool organ federal february elbow art extra wood thunder'; // Testnet: mofeJgJsMctuu6CUozmQ3rvpu11By8CihQ

    setSeed(mnemonic2);

    const result = bitcoin.createWalletFromSeed({ mnemonic: mnemonic2 });
    setBtc(result.address);
    setPrikey(result.privateKey);
    console.log(result.address);

    const balanceValue = await bitcoinApi.getBalance({
      address: result.address
    });
    setBalance(balanceValue);
  };

  const getUtxos = async () => {
    const _utxos = await bitcoinApi.getUtxos({ address: btc });
    console.log(_utxos);
    setUtxos(_utxos);
  };

  const createRawTx = async () => {
    const txParams = {
      from: btc,
      to: 'mrdDuignqKSpThHDx7HnzX6DarQrkHFYxg',
      amount: 5000000, // ~ 0.05BTC Value in Satoshi
      utxos: utxos,
      feeRate: 150, // satoshi per byte,
      privateKey: priKey
    };

    const { txHex } = bitcoin.createRawTx({ txParams });
    setRawTx(txHex);
    console.log('txHex', txHex);
  };

  const signMsg = () => {
    const msg = 'hello infinito wallet';
    const signMsg = bitcoin.signMessage({ message: msg, privateKey: priKey });
    setSignedMsg(signMsg);
  };

  const verifyMsg = () => {
    const msg = 'hello infinito wallet';
    const result = bitcoin.verifyMessage({ message: msg, address: btc, signature: signedMsg });
    console.log(result);
    setverifyMsgResult(result ? "TRUE" : "FALSE");
  };

  // useEffect(() => {
  //   bitcoin = new Bitcoin({ isTestnet: true });
  //   bitcoinApi = new BitcoinAPI({ isTestnet: true });
  //   console.log('useEffect');
  // }, []);

  return (
    <View style={styles.container}>
      <Button
        onPress={generateSeed}
        title="Gen Seed, Address, Get Balance"
        color="#841584"
      />
      <Text style={styles.instructions}>Passphrases: {seed}</Text>
      <Text style={styles.instructions}>BTC Address: {btc}</Text>
      <Text style={styles.instructions}>Balance: {balance}</Text>
      <Button onPress={getUtxos} title="Get Utxos" />
      <Text style={styles.instructions}>Utxos: {utxos.length}</Text>
      <Button onPress={createRawTx} title="Create Raw Tx" />
      <Text style={styles.instructions} numberOfLines={2}>
        RawTx: {rawTx}
      </Text>
      <Button onPress={signMsg} title="Sign Message" />
      <Text style={styles.instructions} numberOfLines={2}>
        Siged MSG: {signedMsg}
      </Text>
      <Button onPress={verifyMsg} title="Verify Message" />
      <Text style={styles.instructions} numberOfLines={2}>
        Verify MSG: {verifyMsgResult}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
    paddingTop: 40
  },
  instructions: {
    // textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
});
