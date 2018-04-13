/* Exchange/Market selector */
Vue.component('market-panel', {
  template: `
<v-layout row wrap>
  <v-flex xs6>
    <v-card class="pa-3">
      <v-select id="exchange" label="EXCHANGE" :items="exchanges" multi-line></v-select>
    </v-card>
  </v-flex>
  <v-flex xs6>
    <v-card class="pa-3">
      <v-select id="market" label="MARKET" :items="markets" multi-line></v-select>
    </v-card>
  </v-flex>
</v-layout>`,
  data() {
    return {
      exchanges: ['Binance', 'Bittrex', 'Bitfinex', 'GDAX', 'KuCoin'],
      markets: ['BTC/USD', 'ETH/USD', 'LTC/USD', 'NEO/USD', 'STRAT/USD'],
      amount: 0.0,
      price: 0.0
    };
  }
});
