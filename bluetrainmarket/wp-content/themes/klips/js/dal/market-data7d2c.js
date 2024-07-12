function processMarketData(data) {
  updateTrackedInstrument(data.instruments)
  updateTrackedInstruments(data.instruments)
}

function initialLoadMarketData(data) {
  updateTrackedInstrument(data.instruments)
}

function processHistoricMarketData(data) {
  if (window['tracked_instrument']?.instrument_status) {
    getTIHistoricalDataByMins()
      .then(() => {
        console.log("Custom API call 1 completed.");
        return getTIHistoricalDataYear();
      })
      .then(() => {
        console.log("Custom API call 2 completed.");
      })
      .catch((error) => {
        console.error("Error occurred:", error);
      });
  }
}

function updateTrackedInstrument(newData) {
  const data = newData.find(item =>
    normalize(item.instrument_name) === normalize(window['tracked_instrument'].instrument_name) ||
    item.instrument_id === window['tracked_instrument'].instrument_id)

  if (data) {
    window['tracked_instrument'] = { ...window['tracked_instrument'], ...data }        
  }
}

function liveUpdateInst(input, update) {
  let foundInst = input.find(item => (item.instrument_id === update.instrument_id));

  if (foundInst) {
    foundInst.today_change = update.today_change;
    foundInst.last_quote.ask = update.last_quote.ask;
    foundInst.last_quote.bid = update.last_quote.bid;
    foundInst.last_quote.dt.nanos = update.last_quote.dt.nanos;
  } else {
    input.push(update);
  }
}

function updateTrackedInstruments(newData) {

  if (window['tracked_instruments']?.length) {    
    window['tracked_instruments'].forEach(inst => {
      const data = newData.find(item => item.instrument_id === inst.instrument_id);
      
      if (data) {
        if ((data?.instrument_status === "ACTIVE") || (data?.instrument_status === "OK")) {
          liveUpdateInst(window['updated_instruments'], data);
        }
      }
    });    
  }
  if (window['tracked_win_loose']?.length) {
    window['tracked_win_loose'].forEach(inst => {
      const data = newData.find(item => item.instrument_id === inst.instrument_id);
      
      if (data) {
        if ((data?.instrument_status === "ACTIVE") || (data?.instrument_status === "OK")) {
          liveUpdateInst(window['updated_instruments'], data);
        }
      }
    });
  }
  if (window['tracked_edfs']?.length) {
    window['tracked_edfs'].forEach(inst => {
      const data = newData.find(item => item.instrument_id === inst.instrument_id);
      
      if (data) {
        if ((data?.instrument_status === "ACTIVE") || (data?.instrument_status === "OK")) {
          liveUpdateInst(window['updated_instruments'], data);
        }
      }
    });
  }
  if (window['tracked_options']?.length) {
    window['tracked_options'].forEach(inst => {
      const data = newData.find(item => item.instrument_id === inst.instrument_id);
      
      if (data) {
        if ((data?.instrument_status === "ACTIVE") || (data?.instrument_status === "OK")) {
          liveUpdateInst(window['updated_instruments'], data);
        }
      }
    });
  }
}

function getTIHistoricalDataYear() {
  return new Promise((resolve, reject) => {
    apiSdk.v1.ws.getHistoricalData(
      {
        request: {
          request_id: generateUUID(),
        },
        from_timestamp: Date.now() - convertTime("365d", "ms"),
        time_bracket: "1_day",
        trade_configuration_id: window['tracked_instrument'].trade_configuration_id,
        market_id: window['tracked_instrument'].feed_id,
        instrument_id: window['tracked_instrument'].instrument_id,
      },
      (data2) => {
        if (data2.historical_data && data2.historical_data.length) {
          const dayOfTheYear = Math.floor((Date.now() - Date.parse(new Date().getFullYear(), 0, 0)) / 86400000);

          window['tracked_instrument'].historicalDataYear = data2.historical_data;
          window['tracked_instrument'].historicalDataYTD = data2.historical_data.slice(-dayOfTheYear);
          window['tracked_instrument'].historicalData90days = data2.historical_data.slice(-90);
          window['tracked_instrument'].historicalData30days = data2.historical_data.slice(-30);
          window['tracked_instrument'].historicalData5days = data2.historical_data.slice(-5);
          resolve(data2);
        }        
      },
      (error) => {
        reject(error);
      }
    );
  });
}

function getTIHistoricalDataByMins() {
  return new Promise((resolve, reject) => {
    let period = '24h';

    if (window['tracked_instrument']?.instrument_status === "OOTH") {
      const dateToday = new Date();
      if (window['tracked_instrument']?.category_id === 1) {
        if (dateToday.getDay() === 1) {
          period = '24h';
        } else if (dateToday.getDay() === 0) {
          period = '2d';
        } else if (dateToday.getDay() === 6) {
          period = '1d';
        }
      } else if (window['tracked_instrument']?.category_id === 3) {

      } else {
        if (dateToday.getDay() === 1) {
          period = '3d';
        } else if (dateToday.getDay() === 0) {
          period = '2d';
        } else if (dateToday.getDay() === 6) {
          period = '1d';
        } 
      }
    }

      apiSdk.v1.ws.getHistoricalData({
        request: {
          request_id: generateUUID()
        },
        from_timestamp: Date.now() - convertTime(period, "ms"),
        time_bracket: "15_minute",
        trade_configuration_id: window['tracked_instrument'].trade_configuration_id,
        market_id: window['tracked_instrument'].feed_id,
        instrument_id: window['tracked_instrument'].instrument_id,
      },
      (data) => {
        if (data.historical_data && data.historical_data.length) {
          window['tracked_instrument'].historicalDataByMins = data.historical_data
          resolve(data);
        }
      },
      (error) => {
        reject(error);
      }
    );
  });
}