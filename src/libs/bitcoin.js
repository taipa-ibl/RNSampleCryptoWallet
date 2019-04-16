import bitcoinjs from 'bitcoinjs-lib';
import bip39 from 'bip39';
import bip32 from 'bip32';
import bitcoinMessage from 'bitcoinjs-message';
import coinSelect from 'coinselect';
import _ from 'lodash';

export default class Bitcoin {
  constructor({ isTestnet }) {
    this.isTestnet = isTestnet;
    this.hdPathString = isTestnet ? "m/44'/1'/0'/0" : "m/44'/0'/0'/0";
    this.network = isTestnet
      ? bitcoinjs.networks.testnet
      : bitcoinjs.networks.bitcoin;
  }

  createWalletFromSeed({ mnemonic, child = 0 }) {
    const seed = bip39.mnemonicToSeed(mnemonic);
    const root = bip32.fromSeed(seed, this.network);
    const node = root.derivePath(this.hdPathString).derive(child);
    const { address } = bitcoinjs.payments.p2pkh({
      pubkey: node.publicKey,
      network: this.network
    });

    return {
      address: address,
      publicKey: node.publicKey.toString('hex'),
      privateKey: node.toWIF().toString('hex')
    };
  }

  createWalletFromPrivateKey({ privateKey }) {
    const keyPair = bitcoinjs.ECPair.fromWIF(privateKey, this.network);
    const { address } = bitcoinjs.payments.p2pkh({ pubkey: keyPair.publicKey });
    return {
      address: address,
      publicKey: keyPair.publicKey,
      privateKey: privateKey
    };
  }

  validateAddress({ address }) {
    try {
      bitcoinjs.address.toOutputScript(address, this.network);
      return true;
    } catch (error) {
      return false;
    }
  }

  validatePrivateKey({ privateKey }) {
    return true;
  }

  estimateTransactionFee({ txParams }) {
    // txParams = {
    //   amount,
    //   amountSatoshi,
    //   listUnspent,
    //   feePerByte = this.DEFAULT_FEE_PER_BYTE,
    //   isSendMax = false,
    //   address = ''
    // }
    return 100; // fee value in satoshi
  }

  createRawTx({ txParams }) {
    // let txParams = {
    //   from: '',
    //   to: '',
    //   amount: '', // value in satoshi
    //   utxos: [{amount, tx_id, vout}], // upspent output lists, amount in satoshi
    //   isSendMax: false, //
    //   feeRate: 150, // satoshi per byte
    //   privateKey: ''
    // }
    const targets = [{ address: txParams.to, value: txParams.amount }];
    const utxos = _.map(txParams.utxos, item => {
      return {
        txId: item.tx_id,
        value: item.amount,
        vout: item.vout
      };
    });

    const feeRate = txParams.feeRate ? txParams.feeRate : 150;
    let { inputs, outputs, fee } = coinSelect(utxos, targets, feeRate);

    // .inputs and .outputs will be undefined if no solution was found
    if (!inputs || !outputs) return;

    const txb = new bitcoinjs.TransactionBuilder(this.network);
    txb.setVersion(1);

    inputs.forEach(input => txb.addInput(input.txId, input.vout));

    outputs.forEach(output => {
      // watch out, outputs may have been added that you need to provide
      // an output address/script for
      if (!output.address) {
        output.address = txParams.from;
      }

      txb.addOutput(output.address, output.value);
    });

    const keyPair = bitcoinjs.ECPair.fromWIF(txParams.privateKey, this.network);

    for (i = 0; i < inputs.length; i++) {
      txb.sign(i, keyPair);
    }

    return {
      txHex: txb.build().toHex(),
      fee
    };
  }

  signMessage({ message, privateKey }) {
    const keyPair = bitcoinjs.ECPair.fromWIF(privateKey, this.network);
    const priKey = keyPair.privateKey;
    const signature = bitcoinMessage.sign(message, priKey, keyPair.compressed);

    return signature.toString('base64');
  }

  verifyMessage({ message, address, signature }) {
    return bitcoinMessage.verify(message, address, signature);
  }
}
