/* Settings panel */
Vue.component('settings-panel', {
  template: `
<v-layout row wrap>
  <v-flex xs12>
    <v-card class="pa-3">
      <v-card-title>
        <h3><v-icon>swap_horiz</v-icon> User Exchanges</h3>
      </v-card-title>
      <v-card-text>
        <v-select id="exchange" label="EXCHANGE" :items="exchanges" v-model="favExchanges" multi-line autocomplete chips multiple></v-select>
        <v-alert type="error" dismissible v-if="error" v-model="error">{{error}}</v-alert>
        <v-switch label="Show only favourite exchanges " v-model="showOnlyFav"></v-switch>
      </v-card-text>
    </v-card>
  </v-flex>
  <v-flex xs12>
    <v-card class="pa-3">
      <v-card-title>
        <h3><v-icon>vpn_key</v-icon> Exchange API Keys</h3>
      </v-card-title>
      <v-card-text>
        TODO
      </v-card-text>
    </v-card>
  </v-flex>
</v-layout>`,

  data() {
    return {
      error: '',
      showOnlyFav: false,
      favExchanges: ['binance', 'bittrex', 'bitfinex', 'gdax', 'kucoin'],
      favMarkets: ['BTC/USD', 'ETH/USD', 'LTC/USD', 'NEO/USD', 'STRAT/USD'],
      apiKeys: { Binance: { apiKey: 'XXX', apiSecret: 'XXXXX' } }
    };
  },

  created: function() {
    this.exchanges = this.getExchanges();

    this.favExchanges = this.$store.get('favExchanges', []);
    this.favMarkets = this.$store.get('favMarkets', []);
    this.showOnlyFav = this.$store.get('showOnlyFav',false);
  },

  watch: {
    favExchanges: function() {
      this.error = '';
      this.$store.set('favExchanges', this.favExchanges);
      console.log('Setting favExchanges to', this.favExchanges);
      //if there are no favourite exchanges, set to show all exchanges
      if (!this.favExchanges.length) this.showOnlyFav = false; 
    },
    favMarkets: function() {
      this.error = '';
      this.$store.set('favMarkets', this.favMarkets);
      console.log('Setting favMarkets to', this.favMarkets);
    },
    showOnlyFav: function() {
      if (!this.favExchanges.length && this.showOnlyFav) {
        this.error = 'Set some favourite exchanges first!';
        this.showOnlyFav = false;
        // return;
      } else {
        this.$store.set('showOnlyFav',this.showOnlyFav);
        console.log('Setting showOnlyFav to ', this.showOnlyFav);
      }       
      
    }
  },

  methods: {
    // get all exchances
    getExchanges: function() {
      let exchanges = [];
      for (let exchangeId of ccxt.exchanges) {
        let exchange = new ccxt[exchangeId]();
        exchanges.push({ text: exchange.name, value: exchange.id, avatar: exchange.urls['logo'] });
      }

      //sort exchanges - favorites first
      let aFavs = this.$store.get('favExchanges',[]);
      let aFavsDetail = exchanges.filter(item => aFavs.includes(item.value));
      let aNonFav = exchanges.filter(item => !aFavs.includes(item.value));
      let aSorted = aFavsDetail.concat(aNonFav);
      return aSorted;
    }
  }
});
