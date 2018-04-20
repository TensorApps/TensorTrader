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
        <v-select id="exchange" label="FAVORITE EXCHANGES" :items="exchanges" v-model="favExchanges" multi-line autocomplete clearable chips deletable-chips dense multiple>
          <template slot="selection" slot-scope="data">
            <v-chip close @input="data.parent.selectItem(data.item)" :selected="data.selected" class="chip--select-multi" :key="data.value">
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
        <v-switch label="Show only favourite exchanges in Trading" v-model="favExchangesOnly"></v-switch>
        <v-alert type="error" dismissible v-if="exchangesError" v-model="exchangesError">{{ exchangesError }}</v-alert>
      </v-card-text>
    </v-card>
  </v-flex>

  <v-flex xs6>
    <v-card class="pa-3">
      <v-card-text>
        <v-select id="market" label="FAVORITE MARKETS" hint="Please select exchange first!" :items="markets" v-model="favMarkets" :loading="marketsLoading" multi-line autocomplete clearable chips deletable-chips dense multiple></v-select>
        <v-switch label="Show only favourite markets in Trading" v-model="favMarketsOnly"></v-switch>
        <v-alert type="error" dismissible v-if="marketsError" v-model="marketsError">{{ marketsError }}</v-alert>
      </v-card-text>
    </v-card>
  </v-flex>

  <v-flex xs12>
    <h3><v-icon>vpn_key</v-icon> Exchange API Keys</h3>
  </v-flex>
  <v-flex xs12>
    <template v-if="favExchanges.length">
      <v-expansion-panel>
        <v-expansion-panel-content v-for="exchange in favExchanges" :key="exchange">
          <div slot="header" valign="top">
           <v-chip>
              <v-avatar tile class="exchAvatar" >
                <img :src="exchangeInfo[exchange].logo" class="exchLogo">
              </v-avatar>
              {{ exchangeInfo[exchange].name }}
            </v-chip>
          </div>
          <v-card class="px-2">
            <v-card-text>
              <v-form>
                <v-text-field label="API Key" v-model="apiConfig[exchange].apiKey" @change="updateApiConfig()" :append-icon="passHiddenAPI ? 'visibility' : 'visibility_off'" :append-icon-cb="() => (passHiddenAPI = !passHiddenAPI)" :type="passHiddenAPI ? 'password' : 'text'"></v-text-field>
                <v-text-field label="Secret" v-model="apiConfig[exchange].secret" @change="updateApiConfig()" :append-icon="passHiddenSecret ? 'visibility' : 'visibility_off'" :append-icon-cb="() => (passHiddenSecret = !passHiddenSecret)" :type="passHiddenSecret ? 'password' : 'text'"></v-text-field>
                <v-text-field label="Passphrase" v-model="apiConfig[exchange].password" @change="updateApiConfig()" :append-icon="passHiddenPass ? 'visibility' : 'visibility_off'" :append-icon-cb="() => (passHiddenPass = !passHiddenPass)" :type="passHiddenPass ? 'password' : 'text'"></v-text-field>
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

  <v-flex xs12 class="text-xs-right">
    <v-btn color="red" :disabled="!userPassphrase" @click="deleteUserPassphrase">Delete User Passphrase</v-btn>
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

      userPassphrase: '',
      apiKey: [],
      secret: [],
      password: [],
      exchangeInfo: {},
      apiConfig: {},

      passHiddenAPI: true,
      passHiddenSecret: true,
      passHiddenPass: true
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

    this.userPassphrase = this.$session.get('userPassphrase');
    console.log('User Passphrase: ', this.userPassphrase); // TODO: REMOVE!!!

    this.apiConfig = this.$secureStore.get('apiConfig', this.userPassphrase, {});

    this.syncExchangeInfo();
  },

  watch: {
    favExchanges: function(exchangeIds) {
      this.exchangesError = '';
      //this.getMarkets(exchangeIds).then(markets => (this.favMarkets = markets));
      this.$store.set('favExchanges', this.favExchanges);
      console.log('Setting favExchanges to', this.favExchanges);
      // if there are no favourite exchanges, set to show all exchanges
      if (!this.favExchanges.length) this.favExchangesOnly = false;

      this.syncExchangeInfo();
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
        console.log('Setting favExchangesOnly to', this.favExchangesOnly);
      }
    },
    favMarketsOnly: function() {
      if (!this.favMarkets.length && this.favMarketsOnly) {
        this.error = 'Select some favourite markets first!';
        this.favMarketsOnly = false;
      } else {
        this.$store.set('favMarketsOnly', this.favMarketsOnly);
        console.log('Setting favMarketsOnly to', this.favMarketsOnly);
      }
    } /*,
    apiConfig: {
      handler: function(val, oldVal) {
        this.$secureStore.set('apiConfig', this.apiConfig, this.userPassphrase);
        //console.log('Setting apiConfig to ', this.apiConfig);
      },
      deep: true
    }
    */
  },

  methods: {
    syncExchangeInfo: function() {
      // get information about favorite exchanges
      for (let exchangeId of this.favExchanges) {
        // retrieve exchange name and logo
        let exchange = new ccxt[exchangeId]();
        this.$set(this.exchangeInfo, exchangeId, { id: exchange.id, name: exchange.name, logo: exchange.urls['logo'] });
        // initialize API config for exchange, if not defined yet
        if (!this.apiConfig[exchangeId])
          this.$set(this.apiConfig, exchangeId, { apiKey: '', secret: '', password: '' }); // TODO: check which security properties are required by individual exchanges!
      }

      // clean up obsolete API config settings for removed exchanges
      for (let exchangeId of Object.keys(this.apiConfig)) {
        if (!this.favExchanges.includes(exchangeId)) delete this.apiConfig[exchangeId];
      }
    },
    // update exchange API configuration info in secure store
    updateApiConfig: function() {
      console.log('Setting exchange API info to', this.apiConfig);
      this.$secureStore.set('apiConfig', this.apiConfig, this.userPassphrase);
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
      if (!exchangeIds) return;
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
    },
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
    },
    */
    // delete user passphrase from session storage
    deleteUserPassphrase: function() {
      this.$session.remove('userPassphrase');
    }
  }
});
