/* Settings panel */
Vue.component('settings-panel', {
  template: `
<v-layout row wrap class="pa-1">
  <v-flex xs12>
    <h3><v-icon>swap_horiz</v-icon> User Exchanges</h3>
    <v-card class="pa-3">
      <v-card-text>
        <v-select id="exchange" label="EXCHANGE" :items="exchanges" v-model="favExchanges" multi-line autocomplete chips multiple>
          <template slot="selection" slot-scope="data">
            <v-chip close color="grey darken-1" @input="data.parent.selectItem(data.item)" :selected="data.selected" class="chip--select-multi" :key="data.value">
              <v-avatar tile class="exchAvatar" >
                <img :src="data.item.avatar" class="exchLogo">
              </v-avatar>
              {{data.item.text}}
            </v-chip>
          </template>
          <template slot="item" slot-scope="data">
            <v-list-tile-avatar>
              <img :src="data.item.avatar" >
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-html="data.item.text"></v-list-tile-title>
            </v-list-tile-content>
          </template>
        </v-select>
        <v-alert type="error" dismissible v-if="error" v-model="error">{{error}}</v-alert>
        <v-switch label="Show only favourite exchanges " v-model="showOnlyFav"></v-switch>
      </v-card-text>
    </v-card>
  </v-flex>

  <v-flex xs12>
    <h3><v-icon>vpn_key</v-icon> Exchange API Keys</h3>
    <template v-if="favExchanges.length">
      <v-expansion-panel popout>
        <v-expansion-panel-content v-for="[exchange, config] in Object.entries(apiConfig)" :key="exchange">
          <div slot="header"><h4>{{getExchangeName(exchange)}}</h4></div>
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
      error: '',
      showOnlyFav: false,
      favExchanges: [],
      favMarkets: [],
      apiConfig: {}
    };
  },

  created: function() {
    this.exchanges = this.getExchanges();
    this.showOnlyFav = this.$store.get('showOnlyFav', false);
    this.favExchanges = this.$store.get('favExchanges', []);
    this.favMarkets = this.$store.get('favMarkets', []);
    let defaultApiConfig = {};
    for (let exchange of this.favExchanges) {
      defaultApiConfig[exchange] = { apiKey: '', secret: '', password: '' };
    }
    let secureApiConfig = this.$store.get('apiConfig');
    this.apiConfig = secureApiConfig ? Crypto.decrypt(Crypto.decompress(secureApiConfig), userPassphrase) : defaultApiConfig;
  },

  watch: {
    favExchanges: function() {
      this.error = '';
      this.$store.set('favExchanges', this.favExchanges);
      console.log('Setting favExchanges to', this.favExchanges);
      // if there are no favourite exchanges, set to show all exchanges
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
        this.$store.set('showOnlyFav', this.showOnlyFav);
        console.log('Setting showOnlyFav to ', this.showOnlyFav);
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
      let secureApiConfig = Crypto.compress(Crypto.encrypt(this.apiConfig, userPassphrase));
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
      let aFavs = this.$store.get('favExchanges', []);
      let aFavsDetail = exchanges.filter(item => aFavs.includes(item.value));
      let aNonFav = exchanges.filter(item => !aFavs.includes(item.value));
      let aSorted = aFavsDetail.concat(aNonFav);
      return aSorted;
    }
  }
});
