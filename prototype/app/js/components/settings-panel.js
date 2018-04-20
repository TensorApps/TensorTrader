/* Settings panel */
const SettingsPanel = Vue.component('settings-panel', {
  template: `
<v-layout row wrap class="pa-1">
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
                <v-text-field label="API Key" v-model="apiConfig[exchange].apiKey" @change="updateApiConfig()"></v-text-field>
                <v-text-field label="Secret" v-model="apiConfig[exchange].secret" @change="updateApiConfig()"></v-text-field>
                <v-text-field label="Passphrase" v-model="apiConfig[exchange].password" @change="updateApiConfig()"></v-text-field>
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
    <v-btn color="red" :disabled="!apiConfig" @click="deleteApiConfig">Delete API Config</v-btn>
    <v-btn color="red" :disabled="!userPassphrase" @click="deleteUserPassphrase">Delete User Passphrase</v-btn>
  </v-flex>
</v-layout>`,

  data() {
    return {
      userPassphrase: '',
      favExchanges: [],
      exchangeInfo: {},
      apiConfig: {}
    };
  },

  created: async function() {
    this.userPassphrase = this.$session.get('userPassphrase');
    this.apiConfig = this.$secureStore.get('apiConfig', this.userPassphrase, {});
    this.favExchanges = this.$store.get('favExchanges');
    this.syncExchangeInfo();
  },

  watch: {
    /*
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
    // update stored API configuration
    updateApiConfig: function() {
      this.$secureStore.set('apiConfig', this.apiConfig, this.userPassphrase);
    },
    // delete stored API configuration
    deleteApiConfig: function() {
      this.$secureStore.remove('apiConfig');
    },
    // delete stored user passphrase
    deleteUserPassphrase: function() {
      this.$session.remove('userPassphrase');
    }
  }
});
