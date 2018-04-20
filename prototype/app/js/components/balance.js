/* Balance table */
const Balance = Vue.component('balance', {
  template: `
<v-data-table class="elevation-2 orders-table" :headers="headers" :items="items" hide-actions>
  <template slot="items" slot-scope="props">
    <td class="text-xs-left ">{{ props.item.exchange }}</td>
    <td class="text-xs-left ">{{ props.item.currency }}</td>
    <td class="text-xs-left ">{{ props.item.free }}</td>
    <td class="text-xs-left ">{{ props.item.used }}</td>
    <td class="text-xs-left ">{{ props.item.total }}</td>
  </template>
</v-data-table>`,

  data() {
    return {
      exchange: '', //selected exchange
      headers: [
        {
          text: 'EXCHANGE',
          value: 'exchange'
        },
        {
          text: 'CURRENCY',
          value: 'currency'
        },
        {
          text: 'FREE',
          value: 'free'
        },
        {
          text: 'USED',
          value: 'used'
        },
        {
          text: 'TOTAL',
          value: 'total'
        }
      ],
      items: [
        // {
        //   value: false,
        //   exchange: 'Binance',
        //   currency: 'BTC',
        //   free: 1.22,
        //   used: 7.23,
        //   total: 8.45
        // },
        // {
        //   value: false,
        //   exchange: 'Binance',
        //   currency: 'ETH',
        //   free: 11.2,
        //   used: 4.55,
        //   total: 15.75
        // },
        // {
        //   value: false,
        //   exchange: 'Binance',
        //   currency: 'NEO',
        //   free: 53,
        //   used: 4,
        //   total: 57
        // }
      ],

      userPassphrase: '',
      apiKey: [],
      secret: [],
      password: [],
      exchangeInfo: {},
      apiConfig: {}
    };
  },
  created: async function() {
    this.exchange = this.$store.get('exchange', '');
    if (this.exchange) {
      this.items = await this.getBalance(this.exchange);
    }
  },
  methods: {
    //get exchange instance with secure info
    //TODO check for existence of secure info with alert
    getSecureExchange: function(exchangeId) {
      //get secure info for exchange
      this.userPassphrase = this.$session.get('userPassphrase');
      this.apiConfig = this.$secureStore.get('apiConfig', this.userPassphrase, {});
      // create a new exhange
      const exchange = new ccxt[exchangeId]();
      //set secure info for exchange
      exchange.apiKey = this.apiConfig[exchangeId].apiKey;
      exchange.secret = this.apiConfig[exchangeId].secret;
      // specify CORS proxy
      exchange.proxy = 'https://cors-anywhere.herokuapp.com/';
      return exchange;
    },
    formatAmount: function(amount) {
      return amount == undefined ? 0.0 : amount;
    },
    //get balance data for given exchange
    getBalance: async function(exchangeId) {
      const exchange = this.getSecureExchange(exchangeId);
      const balance = await exchange.fetchBalance({ recvWindow: 600000 });
      const keys = Object.keys(balance);
      const aRet = keys
        .map(itemKey => {
          let retItem = {};
          if (balance[itemKey].total) {
            retItem['value'] = false;
            retItem['exchange'] = exchangeId;
            retItem['currency'] = itemKey;
            retItem['free'] = this.formatAmount(balance[itemKey].free);
            retItem['used'] = this.formatAmount(balance[itemKey].balance);
            retItem['total'] = this.formatAmount(balance[itemKey].total);
            return retItem;
          }
        })
        .filter(item => item != undefined);
      return aRet;
    }
  }
});
