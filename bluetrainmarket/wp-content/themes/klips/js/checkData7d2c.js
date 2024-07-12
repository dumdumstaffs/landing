const CORE_API = {};
const CATEGORY_IDS = {
  1: 'forex',
  2: 'commodities',
  3: 'crypto',
  5: 'shares',
  6: 'indicies'
}

let waitForScktTick = 0;
let waitForScktTick2 = 0;
window['all_instruments'] = []
window['categories'] = []

function getMarketData2() {
  try {
    apiSdk.v1.ws.getInstrumentsAndSubscribe({
      request: {
        request_id: generateUUID()
      },
      group_id: 2,
      do_subscribe: true
    }, storeMarketData);
  } catch (error) {
    console.error('Market Data couldn\'t init.', error)
  }
}

function getCategoriesData() {
  try {
    apiSdk.v1.ws.getCategories({
      request: {
        request_id: generateUUID()
      }
    }, storeCategoriesData);
  } catch (error) {
    console.error('Market Data couldn\'t init.', error)
  }
}

function storeMarketData(data) {
  if (data?.instruments && data?.instruments?.length > 0) {
    if (data?.initial_load) {
      if (typeof initialLoadMarketData === 'function') {
        initialLoadMarketData(data);
      }
      if (!window['all_instruments'].length) {
        window['all_instruments'] = data.instruments  
        if (typeof processHistoricMarketData === 'function') {
          processHistoricMarketData(data);
        }
      }
    }
    if (typeof processMarketData === 'function') {
      processMarketData(data);
    }
    if (typeof processUpdateMarketData === 'function') {
      processUpdateMarketData(data);
    }
    if (typeof processUpdateHomeData === 'function') {
      processUpdateHomeData(data);
    }
    if (typeof processUpdateTradeData === 'function') {
      processUpdateTradeData(data);
    }
  }
}

function storeCategoriesData(data) {
  if (data?.categories?.length) {
    if (!window['categories'].length) {
      window['categories'] = data.categories   
    }
  }
}

apiSdk.wsClient.ws.on('connect', () => {
  getMarketData2();
  getCategoriesData();
});

let checkDataInterval;

function checkAndStoreData() {
  if (window['all_instruments'] && window['all_instruments'].length > 0 && window['categories'] && window['categories'].length > 0) {

    clearInterval(checkDataInterval);
    sessionStorage.setItem('all_instruments', JSON.stringify(window['all_instruments']));
    sessionStorage.setItem('categories', JSON.stringify(window['categories']));

    const allAssetIds = extractAssetIds(window['categories']);
    const instrumentIdsSet = new Set(window['all_instruments'].map(instrument => instrument.instrument_id));
    const filteredAssetIds = allAssetIds.filter(assetId => instrumentIdsSet.has(assetId));

    sessionStorage.setItem('all_ids', JSON.stringify(filteredAssetIds));
  }
}

const intervalDuration = 10;

if (!sessionStorage.getItem('all_instruments') || !sessionStorage.getItem('categories')) {
  checkDataInterval = setInterval(checkAndStoreData, intervalDuration);
}

function extractAssetIds(data) {
  const assetIds = [];

  function processItem(item) {
    if (item.asset_ids && item.asset_ids.length) {
      for (const assetId of item.asset_ids) {
        if (!assetIds.includes(assetId)) {
          assetIds.push(assetId);
        }
      }
    }

    if (item.children && item.children.length) {
      for (const child of item.children) {
        processItem(child);
      }
    }
  }

  for (const item of data) {
    processItem(item);
  }

  return assetIds;
}