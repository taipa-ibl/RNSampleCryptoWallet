import InfinitoApi from 'node-infinito-api';

export default class BitcoinAPI {
  constructor({ isTestnet = true }) {
    const opts = {
      apiKey: 'b6254946-434d-40fc-9c83-bfdf7589d284',
      secret: 'z4YkOnj7KPxV5jj7gALsJMW6qGxd0NMZ',
      // baseUrl: 'https://api.infinito.io',          // Mainnet
      // baseUrl: 'https://sandbox-api.infinito.io' // Sandbox (Testnet): support only BTC, DASH, ETH, NEO, EOS
      baseUrl: isTestnet
        ? 'https://sandbox-api.infinito.io'
        : 'https://api.infinito.io'
    };
    const api = new InfinitoApi(opts);

    this.coinAPI = api.getChainService().BTC;
  }

  async getBalance({ address }) {
    let result = await this.coinAPI.getBalance(address);
    console.log('result :', result);
    return result.data.balance;
  }

  async getUtxos({ address }) {
    const result = await this.coinAPI.getUtxo(address, 0);
    console.log(result);

    return result.data.transactions;
  }
}
