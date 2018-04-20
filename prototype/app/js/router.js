/* Router config */
const router = new VueRouter({
  //mode: 'history',
  routes: [
    {
      path: '/trading',
      component: TradingPage,
      children: [
        { path: 'orders', component: Orders },
        { path: 'history', component: History },
        { path: 'balance', component: Balance, props: true }
      ]
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