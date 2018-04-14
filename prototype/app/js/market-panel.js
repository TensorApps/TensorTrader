/* Exchange/Market selector */
Vue.component('market-panel', {
  template: `
<v-layout row wrap>
  <v-flex xs6>
    <v-card class="pa-3">
      <v-select id="exchange" label="EXCHANGE" :items="exchanges" v-model="exchange" multi-line autocomplete></v-select>
      <v-alert type="error" dismissible v-model="exchangeError"> {{exchangeErrorText}} </v-alert>
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
      
      // error indicator, message
      exchangeError: false,
      exchangeErrorText: "",
    };
  },
  created() {
    // could something go wrong?
    this.exchanges = this.getExchanges();
    
    // select the first fav exhange (bitfinex hardcored for now)
    // this.exchange = this.exchanges.find( e => e.value == 'defaultExchange' ).value;
    this.exchange = this.exchanges.length ? 'bitfinex' : '';
  },
  methods: {
    // get all exchances
    getExchanges: function() {
    
      // for e.g. some favorite exhanges see settings
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
    
    // get maket from exhance
    getMarkets: async function(exchangeId) {
      let markets = []
      try {
        // change indicator
        this.exchangeError = false;
        this.marketsLoading = true;
        
        // we need to cache sth. here?
        // create a new exhange
        let exchange = new ccxt[exchangeId]();
 
        // be more verbose
        //exchange.verbose = true;
        
        // dyttc?
        exchange.proxy = 'https://cors-anywhere.herokuapp.com/';
        
        // another try/catch block??
        await exchange.loadMarkets();
        //console.log(exchange.markets);

        // sort markets
        markets = Object.keys(exchange.markets).sort();

      } catch (err) {
        // catch the error and set ui states
        console.log('err: ',err);
        this.exchangeError = true;
        this.exchangeErrorText = err.message;
      }
      
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
