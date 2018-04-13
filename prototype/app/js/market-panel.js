/* Exchange/Market selector */
Vue.component('market-panel', {
  template: `
<v-layout row wrap>
  <v-flex xs6>
    <v-card class="pa-3">
      <v-select id="exchange" label="EXCHANGE" :items="exchanges" v-model="exchange" multi-line autocomplete></v-select>
    </v-card>
  </v-flex>
  <v-flex xs6>
    <v-card class="pa-3">
      <v-select id="market" label="MARKET" :items="markets" v-model="market" :loading="marketsLoading" multi-line autocomplete></v-select>
    </v-card>
  </v-flex>
</v-layout>`,
  data() {
    return {
      exchanges: this.getExchanges(),
      markets: [],
      marketsLoading: false,
      exchange: '',
      market: ''
    };
  },
  methods: {
    getExchanges: function() {
      let exchanges = [];
      for (let exchangeId of ccxt.exchanges) {
        let exchange = new ccxt[exchangeId]();
        exchanges.push({ text: exchange.name, value: exchange.id });
      }
      //console.log(exchanges);
      return exchanges;
      /*
      return [
        { text: 'Binance', value: 'binance' },
        { text: 'Bittrex', value: 'bittrex' },
        { text: 'Bitfinex', value: 'bitfinex' },
        { text: 'BitMex', value: 'bitmex' },
        { text: 'BitStamp', value: 'bitstamp' },
        { text: 'GDAX', value: 'gdax' },
        { text: 'KuCoin', value: 'kucoin' }
      ];
      */
    },
    getMarkets: async function(exchangeId) {
      this.marketsLoading = true;
      let exchange = new ccxt[exchangeId]();
      exchange.proxy = 'https://cors-anywhere.herokuapp.com/';
      await exchange.loadMarkets();
      let markets = Object.keys(await exchange.markets).sort();
      //console.log(markets);
      this.marketsLoading = false;
      return markets;
    }
  },
  watch: {
    exchange: function(exchangeId) {
      this.getMarkets(exchangeId).then(markets => (this.markets = markets));
    }
  }
});
