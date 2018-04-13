/* Settings panel */
Vue.component('settings-panel', {
  template: `
<v-layout row wrap>
  <v-flex xs12>
    <v-card class="pa-3">
      <h3>User Settings</h3>
    </v-card>
  </v-flex>
</v-layout>`,
  data() {
    return {
      favExchanges: ['Binance', 'Bittrex', 'Bitfinex', 'GDAX', 'KuCoin'],
      favMarkets: ['BTC/USD', 'ETH/USD', 'LTC/USD', 'NEO/USD', 'STRAT/USD'],
      apiKeys: { Binance: { apiKey: 'XXX', apiSecret: 'XXXXX' } }
    };
  }
});
