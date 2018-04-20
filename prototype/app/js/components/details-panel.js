/* Router config */
/*
const detailsRouter = new VueRouter({
  name: 'details',
  routes: [
    {
      path: '/positions',
      component: Positions
    },
    {
      path: '/orders',
      component: Orders
    },
    {
      path: '/history',
      component: History
    },
    {
      path: '/balance',
      component: Balance
    },
    { path: '*', redirect: '/positions' }
  ]
});
*/

/* Details panel (Positions/Orders/History) */
const DetailsPanel = Vue.component('details-panel', {
  template: `
<v-layout row wrap>
  <v-flex xs12>
    <v-tabs color="transparent" grow v-model="detailsActiveTab">
      <v-tab active-class="default-class selected-tab" to="/trading/orders">
        <h3>ORDERS</h3>
      </v-tab>
      <v-tab active-class="default-class selected-tab" to="/trading/history">
        <h3>HISTORY</h3>
      </v-tab>
      <v-tab active-class="default-class selected-tab" to="/trading/balance">
        <h3>BALANCE</h3>
      </v-tab>
    </v-tabs>
    <v-card>
      <v-card-text>
        <router-view :exchange="exchange"></router-view>
      </v-card-text>
    </v-card>
  </v-flex>
</v-layout>`,

  props: ['exchange'],

  data() {
    return { detailsActiveTab: '/trading/orders' };
  },

  created: function() {
    this.detailsActiveTab = this.$store.get('detailsActiveTab', '/trading/orders');
    console.log('Setting detailsActiveTab to', this.detailsActiveTab);
  },

  watch: {
    detailsActiveTab: function() {
      this.$store.set('detailsActiveTab', this.detailsActiveTab);
      console.log('Setting detailsActiveTab to', this.detailsActiveTab);
    }
  },

  methods: {}
});
