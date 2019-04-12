import bitcoinjs from 'bitcoinjs-lib';
import bip39 from 'bip39';
import bip32 from 'bip32';

export default class Bitcoin {
  isTestnet = true;
  network = bitcoinjs.networks.testnet;
  DEFAULT_FEE_PER_BYTE = 80; // Satoshi per byte

  constructor({ isTestnet }) {
    this.isTestnet = isTestnet;
    this.hdPathString = this.isTestNet ? "m/44'/1'/0'/0" : "m/44'/0'/0'/0";
    this.network = this.isTestNet
      ? bitcoinjs.networks.testnet
      : bitcoinjs.networks.bitcoin;
  }

  createWalletFromSeed({ mnemonic, child = 0 }) {
    const seed = bip39.mnemonicToSeed(mnemonic);
    const root = bip32.fromSeed(seed);
    const node = root.derivePath(this.hdPathString).derive(child);
    // const _network = network
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

  createWalletFromPrivateKey(privateKey) {
    const keyPair = bitcoinjs.ECPair.fromWIF(privateKey);
    const { address } = bitcoinjs.payments.p2pkh({ pubkey: keyPair.publicKey });
    return {
      address: address,
      publicKey: keyPair.publicKey,
      privateKey: privateKey
    };
  }

  validateAddress(address) {
    try {
      bitcoinjs.address.toOutputScript(address, this.network);
      return true;
    } catch (error) {
      return false;
    }
  }

  validatePrivateKey(privateKey) {
    return true;
  }

  estimateTransactionFee({
    amount,
    amountSatoshi,
    listUnspent,
    feePerByte = this.DEFAULT_FEE_PER_BYTE,
    isSendMax = false,
    address = ''
  }) {
    return 100; // fee value in satoshi
  }

  createRawTx(params) {
    // let param = {
    //   from: '',
    //   to: '',
    //   amount: '', // value in BTC
    //   utxos: [], // upspent output lists
    //   isSendMax: false, //
    //   feeRate: 100, // satoshi per byte
    //   privateKey: ''
    // }
    return {
      txHex: '',
      fee: 100
    };
  }

  signMessage(message, privateKey) {
    let signedMsg = '';
    return signedMsg;
  }

  verifyMessage(message, address, signature) {
    return true;
  }
}

// import BitcoinCore from './BitcoinCore'
// import { DEFAULT_FEE_PER_BYTE } from './utils/common'
// const bitcoinjs = require('bitcoinjs-lib')

// const Bitcoin = {
//   testnet: false,
//   hdPathString: "m/44'/0'/0'/0",
//   hdPathStringTest: "m/44'/1'/0'/0",
//   network: bitcoinjs.networks.bitcoin,
//   networkTest: bitcoinjs.networks.testnet,
//   createWalletFromSeed: function ({ mnemonic, child = 0 }) {
//     return BitcoinCore.createWalletFromSeed({
//       mnemonic,
//       child,
//       network: this.testnet ? this.networkTest : this.network,
//       hdPathString: this.testnet ? this.hdPathStringTest : this.hdPathString
//     })
//   },
//   createWalletFromPrivateKey: function (privateKey) {
//     return BitcoinCore.createWalletFromPrivateKey({
//       privateKey,
//       network: this.testnet ? this.networkTest : this.network
//     })
//   },
//   validateAddress: function (address) {
//     return BitcoinCore.validateAddress({
//       address,
//       testnet: this.testnet
//     })
//   },
//   validatePrivateKey: function (privateKey) {
//     const network = this.testnet ? this.networkTest : this.network
//     try {
//       const keyPair = bitcoinjs.ECPair.fromWIF(privateKey, network)
//       const address = keyPair.getAddress()
//       return this.validateAddress(address)
//     } catch (e) {
//       return false
//     }
//   },
//   estimateTransactionFee: function ({
//     amount,
//     listUnspent,
//     feePerByte = DEFAULT_FEE_PER_BYTE,
//     isSendMax = false,
//     address = ''
//   }) {
//     return BitcoinCore.estimateTransactionFee({
//       amount,
//       listUnspent,
//       feePerByte,
//       isSendMax,
//       address
//     })
//   },
//   createRawTx: function (params) {
//     return BitcoinCore.createRawTx(params, this.testnet ? this.networkTest : this.network)
//   },
//   convertToSatoshi: function (amount) {
//     return BitcoinCore.convertToSatoshi(amount)
//   },
//   convertToBitcoin: function (amount) {
//     return BitcoinCore.convertToBitcoin(amount)
//   },
//   signMessage: function (message, privateKey) {
//     const network = this.testnet ? this.networkTest : this.network
//     return BitcoinCore.signMessage({message, privateKey, network})
//   },
//   verifyMessage: function (message, address, signature) {
//     const network = this.testnet ? this.networkTest : this.network
//     return BitcoinCore.verifyMessage({message, address, signature, network})
//   }
// }

// export default Bitcoin
