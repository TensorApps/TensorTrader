/* Cache exchange info */
/* TODO!!!
let Exchanges = {};
async function cacheExchangeInfo() {
  for (let exchangeId of ccxt.exchanges) {
    let exchange = new ccxt[exchangeId]();
    Exchanges[exchange.id] = {
      name: exchange.name,
      id: exchange.id,
      logo: exchange.urls['logo'],
      fees: exchange.fees.trading,
      timeframes: exchange.timeframes
    };
  }
  //console.log('Caching exchange info', Exchanges);
}
cacheExchangeInfo();
*/

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

// Progress
router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});
router.afterEach((to, from) => {
  NProgress.done();
});

/* Storage config */
/*
Vue.use(VueStorage, {
  namespace: 'trader__', // key prefix
  name: 'store', // name variable Vue.[ls] or this.[$ls],
  storage: 'local' // storage type: session, local, memory
});
*/
Vue.prototype.$store = new Store(StoreType.Local, 'trader__');
Vue.prototype.$session = new Store(StoreType.Session, 'trader__');
Vue.prototype.$secureSession = new SecureStore(StoreType.Local, 'trader__');

/* Vue config */
Vue.config.productionTip = false;
Vue.config.debug = true; // turn on debugging mode

const App = new Vue({
  el: '#app',
  router,

  data() {
    return {
      /* UI settings */
      drawer: false,
      loading: true,
      title: 'TRADING',
      navItems: [
        { icon: 'import_export', title: 'Trading', path: '/trading' },
        { icon: 'settings', title: 'Settings', path: '/settings' }
      ]
    };
  },

  created() {
    //
  },

  mounted() {
    this.loading = false;
  }
});
/*
Vue[_options.name] = SessionStore;
Object.defineProperty(Vue.prototype, '$session', {
  get() {
    return SessionStore;
  }
});
*/
