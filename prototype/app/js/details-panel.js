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
    </v-tabs>
  </v-flex>
</v-layout>`,
  data() {
    return {};
  }
});
