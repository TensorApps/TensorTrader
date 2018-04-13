Vue.component('page', {
    template: '#page',
    data() {
        return {
            exchanges: ['Binance', 'Bittrex', 'GDAX', 'KuCoin'],
            markets: ['BTC/USD', 'ETH/USD', 'LTC/USD', 'NEO/USD']
        };
    }
});

Vue.component('positions', {
    template: '#positions',
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

new Vue({
    el: '#app',
    data: {
        drawer: false,
        navItems: [
            {
                icon: 'dashboard',
                title: 'Dashboard'
            },
            {
                icon: 'settings',
                title: 'Settings'
            }
        ],
        title: 'TRADING'
    }
});
