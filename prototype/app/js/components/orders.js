/* Orders table */
const Orders = Vue.component('orders', {
  template: `
<v-data-table class="elevation-2 orders-table" :headers="headers" :items="items" hide-actions>
  <template slot="items" slot-scope="props">
    <tr :class="tableLineClass(props.item.id)">
      <td class="text-xs-left ">{{ props.item.datetime }}</td>
      <td class="text-xs-left ">{{ props.item.exchange }}</td>
      <td class="text-xs-left ">{{ props.item.pair }}</td>
      <td class="text-xs-left ">{{ props.item.price }}</td>
      <td class="text-xs-left ">{{ props.item.amount }}</td>
      <td class="text-xs-left ">{{ props.item.status }}</td>
      <td class="text-xs-left ">{{ props.item.type }}</td>
    </tr>
  </template>
  <template slot="no-data">
    <v-alert color="info" icon="info" :value="true">
      <b>No exchange/market selected!</b><br/><small> Please select exchange and market.</small>
    </v-alert>
  </template>
</v-data-table>`,

  data() {
    return {
      exchange: '', //selected exchange
      headers: [
        {
          text: 'TIMESTAMP',
          value: 'datetime'
        },        
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
        },
        {
          text: 'STATUS',
          value: 'status'
        },
        {
          text: 'TYPE',
          value: 'type'
        }                
      ],
      items: [
        // {
        //   value: false,
        //   exchange: 'Binance',
        //   pair: 'BTC/USD',
        //   price: 7123,
        //   amount: 1.23
        // },
        // {
        //   value: false,
        //   exchange: 'Binance',
        //   pair: 'ETH/USD',
        //   price: 350,
        //   amount: 4.56
        // },
        // {
        //   value: false,
        //   exchange: 'Binance',
        //   pair: 'NEO/USD',
        //   price: 53,
        //   amount: 78.9
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
    this.market = this.$store.get('market','');
    if (this.exchange) {
      this.items = await this.getOrders(this.exchange);
    }
  },
  methods: {
    //set the table line color
    tableLineClass: function(id) {
      const item = this.items.filter((item) => item.id == id)[0];
      if (item.status === "open" || item.status === "closed") {
        if (item.side === "buy") return "table-item-buy";
        if (item.side === "sell") return "table-item-sell";
      }
      if (item.status === "canceled") {
        return "table-item-canceled";
      }
      
    },
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
    //get balance data for given exchange and market
    //TODO alert when market is not selected
    getOrders: async function(exchangeId) {
      const exchange = this.getSecureExchange(exchangeId);
      const orders = await exchange.fetchOrders(symbol=this.market);
      // const keys = Object.keys(balance);
      const aRet = orders
        .map(itemOrder => {
          let retItem = {};
          retItem['id'] = itemOrder.id;
          retItem['datetime'] = itemOrder.datetime;
          retItem['value'] = false;
          retItem['exchange'] = exchangeId;
          retItem['pair'] = itemOrder.symbol;
          retItem['price'] = this.formatAmount(itemOrder.price);
          retItem['amount'] = this.formatAmount(itemOrder.amount);
          retItem['status'] = itemOrder.status;
          retItem['type'] = itemOrder.amount;
          retItem['side'] = itemOrder.side;
          return retItem;
        })
        .filter(item => item != undefined);
      return aRet;
    }
  }  
});
