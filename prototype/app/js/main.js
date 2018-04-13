/* Pages config */
const NotFound = {
  template: `
<v-container fluid grid-list-lg>
  <settings-panel></settings-panel>
</v-container>`
};

const TradingPage = {
  template: `
<v-container fluid grid-list-lg>
  <market-panel></market-panel>
  <trade-panel></trade-panel>
  <details-panel></details-panel>
</v-container>`
};

const SettingsPage = {
  template: `
<v-container fluid grid-list-lg>
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

/* Vue config */
new Vue({
  el: '#app',
  router,
  data: {
    drawer: false,
    loading: true,
    title: 'TRADING',
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
  },
  mounted() {
    this.loading = false;
  }
});
