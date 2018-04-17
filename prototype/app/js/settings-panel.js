/* Settings panel */
Vue.component('settings-panel', {
  template: `
<v-layout row wrap class="pa-1">
  <h3><v-icon>vpn_key</v-icon> Exchange API Keys</h3>
  <v-flex xs12>
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
      favExchanges: [],
      favMarkets: [],
      apiConfig: {}
    };
  },

  created: function() {
    this.favExchanges = this.$store.get('favExchanges', []);
    this.favMarkets = this.$store.get('favMarkets', []);

    let defaultApiConfig = {};
    for (let exchange of this.favExchanges) {
      defaultApiConfig[exchange] = { apiKey: '', secret: '', password: '' };
    }

    let secureApiConfig = this.$store.get('apiConfig');
    this.apiConfig = secureApiConfig ? Crypto.decrypt(Crypto.decompress(secureApiConfig), userPassphrase) : defaultApiConfig;
  },

  methods: {
    getExchangeName: function(exchangeId) {
      let exchange = new ccxt[exchangeId]();
      return exchange.name;
    },
    updateExchangeInfo: function(val) {
      let secureApiConfig = Crypto.compress(Crypto.encrypt(this.apiConfig, userPassphrase));
      this.$store.set('apiConfig', secureApiConfig);
    }
  }
});
