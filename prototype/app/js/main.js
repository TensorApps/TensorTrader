/* App object */
const App = {};

/* Secure store + cryptography */
const Crypto = {
  compress: function(value) {
    return LZString.compress(value);
  },
  decompress: function(value) {
    return LZString.decompress(value);
  },
  encrypt: function(value, password) {
    return CryptoJS.AES.encrypt(JSON.stringify(value), password).toString();
  },
  decrypt: function(value, password) {
    return JSON.parse(CryptoJS.AES.decrypt(value, password).toString(CryptoJS.enc.Utf8));
  }
};
//App.Crypto = Crypto;

/* Cache exchange info */
let Exchanges = {};
async function cacheExchangeInfo() {
  for (let exchangeId of ccxt.exchanges) {
    let exchange = new ccxt[exchangeId]();
    Exchanges[exchange.id] = { name: exchange.name, id: exchange.id, logo: exchange.urls['logo'], fees: exchange.fees.trading, timeframes: exchange.timeframes };
  }
  //console.log('Caching exchange info', Exchanges);
}
cacheExchangeInfo();

/* Pages config */
const TradingPage = {
  template: `
<v-container fluid grid-list-lg>
  <passphrase-popup></passphrase-popup>
  <market-panel></market-panel>
  <trade-panel></trade-panel>
  <details-panel></details-panel>
</v-container>`
};

const SettingsPage = {
  template: `
<v-container fluid grid-list-lg>
  <passphrase-popup></passphrase-popup>
  <settings-panel></settings-panel>
</v-container>`
};


/* Router config */
const router = new VueRouter({
  routes: [
    {
      path: '/trading',
      component: TradingPage
    },
    {
      path: '/settings',
      component: SettingsPage
    },
    { path: '*', redirect: '/trading' }
  ]
});

/* Storage config */
Vue.use(VueStorage, {
  namespace: 'trader__', // key prefix
  name: 'store', // name variable Vue.[ls] or this.[$ls],
  storage: 'local' // storage type: session, local, memory
});
Vue.use(VueStorage, {
  namespace: 'trader__', // key prefix
  name: 'cache', // name variable Vue.[ls] or this.[$ls],
  storage: 'session' // storage type: session, local, memory
});


/* Passphrase popup - in beginning of a new session */
Vue.component('passphrase-popup', {
  template: `
  <v-layout row justify-center>
    <v-dialog persistent max-width="290" v-model="popup">
      <v-card>
        <v-card-title class="headline"><v-icon>vpn_key</v-icon> Provide Passphrase</v-card-title>
        <v-card-text>
          <p>In order to use this application you need to provide a passphrase. It will be used for encrypting all sensitive user data.</p>
          <v-text-field label="User Passphrase" v-model="$root.userPassphrase"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-flex class="text-xs-center"><v-btn color="green" @click.native="popup = false" :disabled="!$root.userPassphrase">OK</v-btn></v-flex>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>`,

  data () {
    return {
      popup: (!this.$root.userPassphrase),
    };
  }
});


/* Vue config */
Vue.config.productionTip = false;
Vue.config.debug = true; // turn on debugging mode

new Vue({
  el: '#app',
  router,

  data() {
    return {
      drawer: false,
      loading: true,
      title: 'TRADING',
      userPassphrase: '',
      navItems: [
        {
          icon: 'import_export',
          title: 'Trading',
          path: '/trading'
        },
        {
          icon: 'settings',
          title: 'Settings',
          path: '/settings'
        }
      ]
    };
  },

  watch: {
    userPassphrase: function() {
      if(this.userPassphrase) {
        sessionStorage.setItem('userPassphrase', this.userPassphrase); 
      } else {
        sessionStorage.removeItem('userPassphrase')
      }
    }
  },

  created() {
    this.userPassphrase = sessionStorage.getItem('userPassphrase');
  },

  mounted() {
    this.loading = false;
  }
});
