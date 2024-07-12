let allInstruments;
let categories;

if (sessionStorage.getItem('all_instruments') && sessionStorage.getItem('categories')) {
  allInstruments = JSON.parse(sessionStorage.getItem('all_instruments'));
  categories = JSON.parse(sessionStorage.getItem('categories'));
} else {
  const waitForSocketData = setInterval(() => {
    if (sessionStorage.getItem('all_instruments') && sessionStorage.getItem('categories')) {
      allInstruments = JSON.parse(sessionStorage.getItem('all_instruments'));
      categories = JSON.parse(sessionStorage.getItem('categories'));
      clearInterval(waitForSocketData);
    }
  }, 100);
}

const urlSearchParams = new URLSearchParams(window.location.search)
const queryParams = Object.fromEntries(urlSearchParams.entries())

if (window['market_data']?.instruments?.length > 0) {

  window['tracked_instrument_name'] = 'instrument' in queryParams ? queryParams.instrument : ''
  window['instruments_name'] = window['market_data'].instruments.filter(item => (item.is_in_table && (item.inst_country.includes('Default') || item.inst_country.includes('EU')))).map(item => item.name)
  window['win_loose_name'] = window['market_data'].instruments.filter(item => (item.win_loose_cat && (item.inst_country.includes('Default') || item.inst_country.includes('EU')))).map(item => item.name)
  window['edfs_name'] = window['market_data'].instruments.filter(item => (item.etfs_cat && (item.inst_country.includes('Default') || item.inst_country.includes('EU')))).map(item => item.name)
  window['options_name'] = window['market_data'].instruments.filter(item => (item.options_cat && (item.inst_country.includes('Default') || item.inst_country.includes('EU')))).map(item => item.name)
  window['tracked_instruments'] = []
  window['updated_instruments'] = []
  window['tracked_win_loose'] = []
  window['tracked_edfs'] = []
  window['tracked_options'] = []
  window['tracked_instrument'] = { instrument_name: window['tracked_instrument_name'], historicalData5days: [], historicalData30days: [], historicalData90days: [], historicalDataYear: [], historicalDataYTD: [], historicalDataByMins: [] }

  const waitForData = setInterval(() => {
    if (allInstruments?.length > 0) {
      window['tracked_instruments'] = filterTableInstruments(allInstruments, window['instruments_name'])
      window['tracked_win_loose'] = filterTableInstruments(allInstruments, window['win_loose_name'])
      window['tracked_edfs'] = filterTableInstruments(allInstruments, window['edfs_name'])
      window['tracked_options'] = filterTableInstruments(allInstruments, window['options_name'])
      clearInterval(waitForData)
    }
  }, 100)
}

function filterTableInstruments(data, filter) {
  const filterItems = filter.map(item => normalize(item))
  const filteredData = data.filter(instrument => {
    const instrumentName = normalize(instrument.instrument_name)
    return filterItems.indexOf(instrumentName) >= 0
  })

  return filteredData
}

function groupInstrumentsByType(instruments) {
  const groupedInstruments = {}

  for (const instrument of instruments) {
    CATEGORY_IDS[instrument.category_id] in groupedInstruments ?
      groupedInstruments[CATEGORY_IDS[instrument.category_id]].push(instrument) :
      groupedInstruments[CATEGORY_IDS[instrument.category_id]] = [instrument]
  }

  return groupedInstruments
}