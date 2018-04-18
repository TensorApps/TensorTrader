/* Settings panel */
Vue.component('settings-panel', {
  template: `
<v-layout row wrap class="pa-1">
  <v-flex xs12>
    <h3><v-icon>favorite</v-icon> User Favorites</h3>
  </v-flex>
  <v-flex xs6>
    <v-card class="pa-3">
      <v-card-text>
        <v-select id="exchange" label="FAVORITE EXCHANGES" :items="exchanges" v-model="favExchanges" multi-line autocomplete chips clearable deletable-chips dense multiple>
          <template slot="selection" slot-scope="data">
            <v-chip close color="grey darken-1" @input="data.parent.selectItem(data.item)" :selected="data.selected" class="chip--select-multi" :key="data.value">
              <v-avatar tile class="exchAvatar" >
                <img :src="data.item.avatar" class="exchLogo">
              </v-avatar>
              {{ data.item.text }}
            </v-chip>
          </template>
          <template slot="item" slot-scope="data">
            <v-list-tile-avatar tile class="exchAvatar">
              <img :src="data.item.avatar" class="exchLogo">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-html="data.item.text"></v-list-tile-title>
            </v-list-tile-content>
          </template>
        </v-select>
        <v-alert type="error" dismissible v-if="exchangesError" v-model="exchangesError">{{ exchangesError }}</v-alert>
        <v-switch label="Show only favourite exchanges in Trading" v-model="favExchangesOnly"></v-switch>
      </v-card-text>
    </v-card>
  </v-flex>

  <v-flex xs6>
    <v-card class="pa-3">
      <v-card-text>
        <v-select id="market" label="FAVORITE MARKETS" hint="Please select exchange first!" :items="markets" v-model="favMarkets" :loading="marketsLoading" multi-line autocomplete chips clearable deletable-chips dense multiple></v-select>
        <v-alert type="error" dismissible v-if="marketsError" v-model="marketsError">{{ marketsError }}</v-alert>
        <v-switch label="Show only favourite markets in Trading" v-model="favMarketsOnly"></v-switch>
      </v-card-text>
    </v-card>
  </v-flex>

  <v-flex xs12>
    <h3><v-icon>vpn_key</v-icon> Exchange API Keys</h3>
  </v-flex>
  <v-flex xs12>
    <template v-if="favExchanges.length">
      <v-expansion-panel>
        <v-expansion-panel-content v-for="[exchange, config] in Object.entries(apiConfig)" :key="exchange">
          <div slot="header"><h4>{{ getExchangeName(exchange) }}</h4></div>
          <v-card class="px-2">
            <v-card-text>
              <v-form>
                <v-text-field label="API Key" v-model="config.apiKey" @change="updateExchangeInfo"></v-text-field>
                <v-text-field label="Secret" v-model="config.secret" @change="updateExchangeInfo"></v-text-field>
                <v-text-field label="Passphrase" v-model="config.password" @change="updateExchangeInfo"></v-text-field>
              </v-form>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </template>
    <template v-else>
      <v-alert color="info" icon="info" :value="true">
        <b>No favorite exchanges yet!</b><br/><small> Please select first some favorites in the Trading view.</small>
      </v-alert>
    </template>
  </v-flex>
</v-layout>`,

  data() {
    return {
      exchanges: [],
      exchangesError: '',
      favExchanges: [],
      favExchangesOnly: false,

      markets: [],
      marketsLoading: false,
      marketsError: '',
      favMarkets: [],
      favMarketsOnly: false,

      apiConfig: {}
    };
  },

  created: async function() {
    this.favExchanges = this.$store.get('favExchanges', []);
    this.favExchangesOnly = this.$store.get('favExchangesOnly', false);
    this.exchanges = this.getExchanges();

    //TODO: FINISH THIS!
    //this.marketsLoading = true;
    //this.markets = await this.getMarkets();
    //this.marketsLoading = false;
    //this.favMarkets = this.$store.get('favMarkets', []);
    //this.favMarketsOnly = this.$store.get('favMarketsOnly', false);

    //this.userPassphrase = sessionStorage.getItem('userPassphrase');
    console.log('User Passphrase: ', this.$root.userPassphrase); // TODO: REMOVE!!!
    let defaultApiConfig = {};
    for (let exchange of this.favExchanges) {
      defaultApiConfig[exchange] = { apiKey: '', secret: '', password: '' };
    }
    let secureApiConfig = this.$store.get('apiConfig');
    this.apiConfig = secureApiConfig
      ? Crypto.decrypt(Crypto.decompress(secureApiConfig), this.$root.userPassphrase)
      : defaultApiConfig;
  },

  watch: {
    favExchanges: function(exchangeIds) {
      this.exchangesError = '';
      //this.getMarkets(exchangeIds).then(markets => (this.favMarkets = markets));
      this.$store.set('favExchanges', this.favExchanges);
      console.log('Setting favExchanges to', this.favExchanges);
      // if there are no favourite exchanges, set to show all exchanges
      if (!this.favExchanges.length) this.favExchangesOnly = false;
    },
    /*
    favMarkets: function() {
      this.marketsError = '';
      this.$store.set('favMarkets', this.favMarkets);
      console.log('Setting favMarkets to', this.favMarkets);
      // if there are no favourite markets, set to show all markets
      if (!this.favMarkets.length) this.favMarketsOnly = false;
    },
    */
    favExchangesOnly: function() {
      if (!this.favExchanges.length && this.favExchangesOnly) {
        this.error = 'Select some favourite exchanges first!';
        this.favExchangesOnly = false;
      } else {
        this.$store.set('favExchangesOnly', this.favExchangesOnly);
        console.log('Setting favExchangesOnly to ', this.favExchangesOnly);
      }
    },
    favMarketsOnly: function() {
      if (!this.favMarkets.length && this.favMarketsOnly) {
        this.error = 'Select some favourite markets first!';
        this.favMarketsOnly = false;
      } else {
        this.$store.set('favMarketsOnly', this.favMarketsOnly);
        console.log('Setting favMarketsOnly to ', this.favMarketsOnly);
      }
    }
  },

  methods: {
    // get real exchange name from id
    getExchangeName: function(exchangeId) {
      let exchange = new ccxt[exchangeId]();
      return exchange.name;
    },
    // update exchange info in secure store
    updateExchangeInfo: function(val) {
      let secureApiConfig = Crypto.compress(Crypto.encrypt(this.apiConfig, this.$root.userPassphrase));
      this.$store.set('apiConfig', secureApiConfig);
    },
    // get all exchances
    getExchanges: function() {
      let exchanges = [];
      for (let exchangeId of ccxt.exchanges) {
        let exchange = new ccxt[exchangeId]();
        exchanges.push({ text: exchange.name, value: exchange.id, avatar: exchange.urls['logo'] });
      }
      // sort exchanges - favorites first
      let aFavs = this.favExchanges; //this.$store.get('favExchanges', []);
      let aFavsDetail = exchanges.filter(item => aFavs.includes(item.value));
      let aNonFav = exchanges.filter(item => !aFavs.includes(item.value));
      let aSorted = aFavsDetail.concat(aNonFav);
      return aSorted;
    },
    // get all markets
    getMarkets: async function(exchangeIds) {
      return; // TODO: FINISH THIS!
      if(!exchangeIds) return;
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
        this.marketsError = err.message;
      }
      this.marketsLoading = false;
    }
    /*
    getMarkets: async function(exchangeId) {
      let allMarkets = [];
      //for (let exchangeId of this.favExchanges) {
      let exchange = new ccxt[exchangeId]();
      exchange.proxy = 'https://cors-anywhere.herokuapp.com/';
      let markets = await exchange.loadMarkets();
      allMarkets = allMarkets.concat(Object.keys(markets));
      //}
      allMarkets = allMarkets
        .filter(function(item, pos, arr) {
          return arr.indexOf(item) == pos;
        })
        .sort();
      return allMarkets;
    }
    */
  }
});
