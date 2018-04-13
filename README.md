# TensorTrader

## Web App

Currently available as prototype (proof of concept, based on **VueJS** framework) under `prototype`

In order to quickly see and test the prototype, you can use `live-server` npm module:

```bash
> npm install -g live-server
> cd prototype
> live-server app
```

This should open the web page on default port 8080.

## Browser Extension

To test the app as Chrome browser extension follow these steps:

1.  Type `chrome://extensions` in the Chrome address bar
2.  Make sure **Developer mode** is switched ON
3.  Click on **LOAD UNPACKED** and point to the `prototype` folder location
4.  A TensorTrader icon (disabled/greyed out) should appear in the browser header
5.  Open tensorcharts.com and make sure the TensorTrader icon becomes enabled (colorful)
6.  Click on the icon to call the TensorTrader popup window

### TODO Features

1.  Refactor the prototype code, split into multiple vue templates
2.  Add persistence, entering exchange API keys
3.  Add business logic, bind ccxt data (for exchange and pair lookup)
4.  Implement order submission via ccxt (Market, Limit and Stop orders)
5.  Implement real Positions, Orders and History panels data
6.  Integrate with TensorCharts (price, exchange, pair)
7.  Protect all user data using encryption

## Electron Desktop App

TODO
