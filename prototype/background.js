chrome.runtime.onInstalled.addListener(function() {
    // Storage
    //chrome.storage.sync.set({ exchange: 'Binance' });
    //chrome.storage.sync.set({ pair: 'BTC/USD' });
    // Page Load
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { urlMatches: '(www.)*tensorcharts.com' }
                    })
                ],
                actions: [new chrome.declarativeContent.ShowPageAction()]
            }
        ]);
    });
});
