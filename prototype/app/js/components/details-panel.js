/* Positions table */
Vue.component('positions', {
  template: `
<v-data-table class="elevation-2 orders-table" :headers="headers" :items="items" hide-actions>
  <template slot="items" slot-scope="props">
    <td class="text-xs-left ">{{ props.item.exchange }}</td>
    <td class="text-xs-left ">{{ props.item.pair }}</td>
    <td class="text-xs-left ">{{ props.item.price }}</td>
    <td class="text-xs-left ">{{ props.item.amount }}</td>
  </template>
</v-data-table>
`,
  data() {
    return {
      headers: [
        {
          text: 'EXCHANGE',
          value: 'exchange'
        },
        {
          text: 'PAIR',
          value: 'pair'
        },
        {
          text: 'PRICE',
          value: 'price'
        },
        {
          text: 'AMOUNT',
          value: 'amount'
        }
      ],
      items: [
        {
          value: false,
          exchange: 'Binance',
          pair: 'BTC/USD',
          price: 7123,
          amount: 1.23
        },
        {
          value: false,
          exchange: 'Binance',
          pair: 'ETH/USD',
          price: 350,
          amount: 4.56
        },
        {
          value: false,
          exchange: 'Binance',
          pair: 'NEO/USD',
          price: 53,
          amount: 78.9
        }
      ]
    };
  }
});

/* Orders table */
Vue.component('orders', {
  template: `
<v-data-table class="elevation-2 orders-table" :headers="headers" :items="items" hide-actions>
  <template slot="items" slot-scope="props">
    <td class="text-xs-left ">{{ props.item.exchange }}</td>
    <td class="text-xs-left ">{{ props.item.pair }}</td>
    <td class="text-xs-left ">{{ props.item.price }}</td>
    <td class="text-xs-left ">{{ props.item.amount }}</td>
  </template>
</v-data-table>
`,
  data() {
    return {
      headers: [
        {
          text: 'EXCHANGE',
          value: 'exchange'
        },
        {
          text: 'PAIR',
          value: 'pair'
        },
        {
          text: 'PRICE',
          value: 'price'
        },
        {
          text: 'AMOUNT',
          value: 'amount'
        }
      ],
      items: [
        {
          value: false,
          exchange: 'Binance',
          pair: 'BTC/USD',
          price: 7123,
          amount: 1.23
        },
        {
          value: false,
          exchange: 'Binance',
          pair: 'ETH/USD',
          price: 350,
          amount: 4.56
        },
        {
          value: false,
          exchange: 'Binance',
          pair: 'NEO/USD',
          price: 53,
          amount: 78.9
        }
      ]
    };
  }
});

/* History table */
Vue.component('history', {
  template: `
<v-data-table class="elevation-2 orders-table" :headers="headers" :items="items" hide-actions>
  <template slot="items" slot-scope="props">
    <td class="text-xs-left ">{{ props.item.exchange }}</td>
    <td class="text-xs-left ">{{ props.item.pair }}</td>
    <td class="text-xs-left ">{{ props.item.price }}</td>
    <td class="text-xs-left ">{{ props.item.amount }}</td>
  </template>
</v-data-table>
`,
  data() {
    return {
      headers: [
        {
          text: 'EXCHANGE',
          value: 'exchange'
        },
        {
          text: 'PAIR',
          value: 'pair'
        },
        {
          text: 'PRICE',
          value: 'price'
        },
        {
          text: 'AMOUNT',
          value: 'amount'
        }
      ],
      items: [
        {
          value: false,
          exchange: 'Binance',
          pair: 'BTC/USD',
          price: 7123,
          amount: 1.23
        },
        {
          value: false,
          exchange: 'Binance',
          pair: 'ETH/USD',
          price: 350,
          amount: 4.56
        },
        {
          value: false,
          exchange: 'Binance',
          pair: 'NEO/USD',
          price: 53,
          amount: 78.9
        }
      ]
    };
  }
});

/* Balance table */
Vue.component('balance', {
  template: `
<v-data-table class="elevation-2 orders-table" :headers="headers" :items="items" hide-actions>
  <template slot="items" slot-scope="props">
    <td class="text-xs-left ">{{ props.item.exchange }}</td>
    <td class="text-xs-left ">{{ props.item.currency }}</td>
    <td class="text-xs-left ">{{ props.item.free }}</td>
    <td class="text-xs-left ">{{ props.item.used }}</td>
    <td class="text-xs-left ">{{ props.item.total }}</td>
  </template>
</v-data-table>
`,
  data() {
    return {
      exchange : "", //selected exchange
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
  created: async function () {
    this.exchange = this.$store.get('exchange','');
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
        this.apiConfig = this.$secureSession.get('apiConfig', this.userPassphrase, {});
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
      return amount == undefined ? 0.00 : amount;
    },
    //get balance data for given exchange
    getBalance: async function(exchangeId) {
      const exchange = this.getSecureExchange(exchangeId);
      const balance = await exchange.fetchBalance();
      const keys = Object.keys(balance);
      const aRet = keys.map(itemKey => {
        let retItem = {};
        if (balance[itemKey].total) {
            retItem["value"] = false;
            retItem["exchange"] = exchangeId;
            retItem["currency"] = itemKey;
            retItem["free"] = this.formatAmount(balance[itemKey].free);
            retItem["used"] = this.formatAmount(balance[itemKey].balance);
            retItem["total"] = this.formatAmount(balance[itemKey].total);
          return retItem;
        }
      }).filter(item => item != undefined);
      return aRet;
    }
  }
});

/* Details panel (Positions/Orders/History) */
Vue.component('details-panel', {
  template: `
<v-layout row wrap>
  <v-flex xs12>
    <v-tabs color="transparent" grow>
      <v-tab active-class="default-class selected-tab">
        <h3>POSITIONS</h3>
      </v-tab>
      <v-tab active-class="default-class selected-tab">
        <h3>ORDERS</h3>
      </v-tab>
      <v-tab active-class="default-class selected-tab">
        <h3>HISTORY</h3>
      </v-tab>
      <v-tab active-class="default-class selected-tab">
        <h3>BALANCE</h3>
      </v-tab>      
      <v-tab-item>
        <v-card>
          <v-card-text>
            <positions></positions>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card>
          <v-card-text>
            <orders></orders>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card>
          <v-card-text>
            <history></history>
          </v-card-text>
        </v-card>
      </v-tab-item>      
      <v-tab-item>
        <v-card>
          <v-card-text>
            <balance></balance>
          </v-card-text>
        </v-card>
      </v-tab-item>

    </v-tabs>
  </v-flex>
</v-layout>`,
  data() {
    return {};
  }
});
