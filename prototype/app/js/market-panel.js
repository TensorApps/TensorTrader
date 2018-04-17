/* Exchange/Market selector */
Vue.component('market-panel', {
  template: `
<v-layout row wrap>
  <v-flex xs6>
    <v-card class="pa-3">
      <v-select id="exchange" label="EXCHANGE" :items="exchanges" v-model="exchange" multi-line autocomplete>
        <template slot="item" slot-scope="data">
          <v-list-tile-action>
            <v-btn icon ripple @click.stop="toggleToFavExch(data.item.value)">  
              <v-icon color="lime darken-2">{{ getFavIconExch(data.item.value) }}</v-icon>
            </v-btn>
          </v-list-tile-action>           
          <v-list-tile-content>
            <v-list-tile-title v-html="data.item.text"></v-list-tile-title>
          </v-list-tile-content>       
        </template>
      </v-select>
      <v-alert type="error" dismissible v-if="error" v-model="error">{{error}}</v-alert>
    </v-card>
  </v-flex>
  <v-flex xs6>
    <v-card class="pa-3">
      <v-select id="market" label="MARKET" :items="markets" v-model="market" :loading="marketsLoading" multi-line autocomplete>
        <template slot="item" slot-scope="data">
          <v-list-tile-action>
            <v-btn icon ripple @click.stop="toggleToFavMarket(data.item)">  
              <v-icon color="yellow darken">{{ getFavIconMarket(data.item) }}</v-icon>
            </v-btn>
          </v-list-tile-action>           
          <v-list-tile-content>
            <v-list-tile-title v-html="data.item"></v-list-tile-title>
          </v-list-tile-content>       
        </template>      
      </v-select>
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

      // favorites
      favExchanges: [],
      favMarkets: [],

      // error message/indicator
      error: ''
    };
  },

  created: function() {
    this.exchanges = this.getExchanges();

    this.exchange = this.$store.get('exchange', 'bitfinex');
    this.market = this.$store.get('market', 'BTC/USD');

    this.favExchanges = this.$store.get('favExchanges', []);
    this.favMarkets = this.$store.get('favMarkets', []);
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
    // get favorite icons
    getFavIconExch: function(exchId) {
      return this.favExchanges.includes(exchId) ? 'star' : 'star_outline';
    },
    getFavIconMarket: function(mktId) {
      return this.favMarkets.includes(mktId) ? 'star' : 'star_outline';
    },
    //
    toggleToFavExch: function(exchId) {
      // if exchange is already favorite - remove it from favorites
      if (this.favExchanges.includes(exchId)) {
        this.favExchanges = this.favExchanges.filter(item => item !== exchId);
      } else {
        this.favExchanges.push(exchId);
      }
      // store the changed favExchanges
      this.$store.set('favExchanges', this.favExchanges);
    },
    toggleToFavMarket: function(mktId) {
      // if market is already favorite - remove it from favorites
      if (this.favMarkets.includes(mktId)) {
        this.favMarkets = this.favMarkets.filter(item => item !== mktId);
      } else {
        this.favMarkets.push(mktId);
      }
      // store the changed favExchanges
      this.$store.set('favMarkets', this.favMarkets);
    },
    // get all exchanges
    getExchanges: function() {
      let exchanges = [];
      for (let exchangeId of ccxt.exchanges) {
        let exchange = new ccxt[exchangeId]();
        exchanges.push({ text: exchange.name, value: exchange.id });
      }
      // sort exchanges - favorites first
      let aFavs = this.$store.get('favExchanges', []);
      let aFavsDetail = exchanges.filter(item => aFavs.includes(item.value));
      let aNonFav = exchanges.filter(item => !aFavs.includes(item.value));
      let aSorted = aFavsDetail.concat(aNonFav);
      return aSorted;
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
      // sort markets - favorites first
      let aFavs = this.$store.get('favMarkets', []);
      let aFavsDetail = markets.filter(item => aFavs.includes(item));
      let aNonFav = markets.filter(item => !aFavs.includes(item));
      let aSorted = aFavsDetail.concat(aNonFav);
      return aSorted;
    }
  }
});
