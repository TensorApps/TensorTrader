/* Exchange/Market selector */
Vue.component('market-panel', {
  template: `
<v-layout row wrap>
  <v-flex xs6>
    <v-card class="pa-3">
      <v-select id="exchange" label="EXCHANGE" :items="exchanges" v-model="exchange" multi-line autocomplete></v-select>
      <v-alert type="error" dismissible v-if="error" v-model="error">{{error}}</v-alert>
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
      // selected exchange, all exchanges
      exchange: '',
      exchanges: [],

      // selected market, all markets, indicator
      market: '',
      markets: [],
      marketsLoading: false,

      // error message/indicator
      error: ''
    };
  },

  created: function() {
    this.exchanges = this.getExchanges();

    this.exchange = this.$store.get('exchange', 'bitfinex');
    this.market = this.$store.get('market', 'BTC/USD');
  },

  watch: {
    exchange: function(exchangeId) {
      this.error = '';
      this.getMarkets(exchangeId).then(markets => (this.markets = markets));
      this.$store.set('exchange', exchangeId);
      console.log('Setting exchange to', exchangeId);
    },
    market: function(val) {
      this.$store.set('market', val);
      console.log('Setting market to', val);
    }
  },

  methods: {
    // get all exchances
    getExchanges: function() {
      // for e.g. filter favorite exchanges, see settings
      /*
      let favExchanges = [
        { text: 'Binance', value: 'binance', sort: 10 },
        { text: 'Bittrex', value: 'bittrex', sort: 30 },
        { text: 'Bitfinex', value: 'bitfinex', sort: 20 },
        { text: 'BitMex', value: 'bitmex', sort: 50 },
        { text: 'BitStamp', value: 'bitstamp', sort: 60 },
        { text: 'GDAX', value: 'gdax', sort: 40 },
        { text: 'KuCoin', value: 'kucoin', sort: 70 }
      ];
      */

      let exchanges = [];
      for (let exchangeId of ccxt.exchanges) {
        // do we really need all instances here?
        let exchange = new ccxt[exchangeId]();

        //console.log(exchange);
        exchanges.push({ text: exchange.name, value: exchange.id });
      }
      //console.log(exchanges);
      return exchanges;
    },

    // get maket from exchange
    getMarkets: async function(exchangeId) {
      let markets = [];
      this.marketsLoading = true;

      try {
        // create a new exhange
        let exchange = new ccxt[exchangeId]();
        //exchange.verbose = true;
        // specify CORS proxy
        exchange.proxy = 'https://cors-anywhere.herokuapp.com/';
        // load markets info from exchange
        await exchange.loadMarkets();
        markets = Object.keys(exchange.markets).sort();
      } catch (err) {
        // catch the error and set ui states
        console.error('Error:', err);
        this.error = err.message;
      }

      this.marketsLoading = false;
      return markets;
    }
  }
});
