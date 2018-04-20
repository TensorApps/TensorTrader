/* History table */
const History = Vue.component('history', {
  template: `
<v-data-table class="elevation-2 orders-table" :headers="headers" :items="items" hide-actions>
  <template slot="items" slot-scope="props">
    <td class="text-xs-left ">{{ props.item.exchange }}</td>
    <td class="text-xs-left ">{{ props.item.pair }}</td>
    <td class="text-xs-left ">{{ props.item.price }}</td>
    <td class="text-xs-left ">{{ props.item.amount }}</td>
  </template>
</v-data-table>`,

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
