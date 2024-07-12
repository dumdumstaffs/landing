let tableDataTicks = 0;
let instrumentDataTicks = 0;
let graphDataTicks = 0;
let graphDataTicks2 = 0;
let latestInstrumentData;
let allInstrumentData;
let tableRowsLimit = 11;

const unavailableModalWindow = document.getElementById("unavailableModal");

window.addEventListener('DOMContentLoaded', (event) => {

  const waitForTableData = setInterval(() => {

    tableDataTicks++;
    document.getElementById("lock-modal2").style.display = "block";
    document.getElementById("loading-circle2").style.display = "block";

    if (window['tracked_instruments']?.length) {

      populateTable(window['tracked_instruments'], 0, 'tableTrending');
      populateTable(window['tracked_instruments'], 1, 'tableCurrencies');
      populateTable(window['tracked_instruments'], 2, 'tableCommodities');
      populateTable(window['tracked_instruments'], 3, 'tableCrypto');
      populateTable(window['tracked_instruments'], 5, 'tableShares');
      populateTable(window['tracked_instruments'], 6, 'tableIndices');

      if (window['tracked_win_loose']?.length) {
        populateTable(window['tracked_win_loose'], 0, 'tableWinLoose');
      }
      if (window['tracked_edfs']?.length) {
        populateTable(window['tracked_edfs'], 0, 'tableETFs');
      }
      if (window['tracked_options']?.length) {
        populateTable(window['tracked_options'], 0, 'tableOptions');
      }

      document.getElementById("lock-modal2").style.display = "none";
      document.getElementById("loading-circle2").style.display = "none";

      const tableLimitRows = tablesHolder.querySelectorAll('.instrumentsTable');
      tableLimitRows.forEach(tt => {
        let x = tt.rows.length;

        if (x > tableRowsLimit) {
          for (let i = tableRowsLimit; i < x; i++) {
            tt.rows.item(i).style.display = "none";
          }
          if (tt.id === "tableTrending") {

            const loadMore = document.getElementById('load-more'+tt.id.substring(5));
            loadMore.style.display = "block";
          
            const loadMoreBtn = loadMore.querySelector('.btn');
            loadMoreBtn.addEventListener('click', ee => {
              ee.preventDefault();
              for (let ii = tableRowsLimit; ii < x; ii++) {
                tt.rows.item(ii).style.display = "table-row";
              }
              loadMore.style.display = "none";
            });
          }  
        }        
      });

      clearInterval(waitForTableData)
    }
    if (tableDataTicks === 180) {
      clearInterval(waitForTableData)
      document.getElementById('unavHistDataTable').style.display = "flex";
      document.getElementById("lock-modal2").style.display = "none";
      document.getElementById("loading-circle2").style.display = "none";
      document.getElementById("instrumentsTitleHolder").style.display = "none";
      document.getElementById("switchInstruments").style.display = "none";
      document.getElementById("tablesHolder").style.display = "none";      
    }
  }, 100);

  const waitInstrumentData = setInterval(() => {

    instrumentDataTicks++;
    if (window['tracked_instrument']?.instrument_name) {
      document.title = window['tracked_instrument']?.instrument_name + " | Single instrument";
      document.getElementById('buySellAssetName').innerHTML = '<span class="noBorder">'+ window['tracked_instrument']?.instrument_name +'</span>';
    }
    if (window['tracked_instrument']?.ibc && window['tracked_instrument']?.margin_initial) {

      latestInstrumentData = deepClone(window['tracked_instrument']);
      let instSymbolLink = window['tracked_instrument']?.ibc + window['tracked_instrument']?.qc;
      populateBuySell(latestInstrumentData);
      populateInfoAsset(latestInstrumentData);
      populateAboutAsset(window['tracked_instrument'], window['tracked_instrument']?.instrument_name,latestInstrumentData['category_id']);
      document.getElementById('btnAssetBuy').dataset.symbol = window['tracked_instrument']?.ibc + window['tracked_instrument']?.qc;
      document.getElementById('btnAssetSell').dataset.symbol = window['tracked_instrument']?.ibc + window['tracked_instrument']?.qc;
      // document.getElementById('btnAssetBuy').href = '/trading/?symbol='+instSymbolLink+'&category=all&view=market&dir=buy&sortdir=asc&subcategory=all';
      // document.getElementById('btnAssetSell').href = '/trading/?symbol='+instSymbolLink+'&category=all&view=market&dir=sell&sortdir=asc&subcategory=all';

      clearInterval(waitInstrumentData);
    } 
    if (instrumentDataTicks === 200) {
      unavailableModalWindow.style.display = "block";
      clearInterval(waitInstrumentData);
    }
  }, 100);

  const waitHistoricalInstrumentData = setInterval(() => {
    document.getElementById("lock-modal1").style.display = "block";
    document.getElementById("loading-circle1").style.display = "block";
    
    graphDataTicks++;
    if (window['tracked_instrument']?.instrument_status) {

      if ((window['tracked_instrument']?.instrument_status === "ACTIVE") || (window['tracked_instrument']?.instrument_status === "OK")) {
        if (window['tracked_instrument']?.historicalDataByMins?.length) {

          populateCandleGraph(window['tracked_instrument'],1);

          document.getElementById("lock-modal1").style.display = "none";
          document.getElementById("loading-circle1").style.display = "none";

          clearInterval(waitHistoricalInstrumentData);          
        }
        if (graphDataTicks > 220) {

          if (window['tracked_instrument']?.historicalData5days?.length) {
            populateCandleGraph(window['tracked_instrument'],5);

            document.getElementById("lock-modal1").style.display = "none";
            document.getElementById("loading-circle1").style.display = "none";

            clearInterval(waitHistoricalInstrumentData);
          } else if (window['tracked_instrument']?.historicalData30days?.length) {

            populateCandleGraph(window['tracked_instrument'],30);

            document.getElementById("lock-modal1").style.display = "none";
            document.getElementById("loading-circle1").style.display = "none";

            clearInterval(waitHistoricalInstrumentData);
          }
        }
      
        if (graphDataTicks > 230) {
          clearInterval(waitHistoricalInstrumentData);
          document.getElementById('unavHistDataChart').style.display = "flex";
          document.getElementById("lock-modal1").style.display = "none";
          document.getElementById("loading-circle1").style.display = "none";
          document.querySelector(".action_h").style.display = "none";
        }
      } else {

        if (window['tracked_instrument']?.historicalDataByMins?.length) {

          populateCandleGraph(window['tracked_instrument'],1);

          let lastWorkingHour = window['tracked_instrument']?.historicalDataByMins?.slice(-1);

          document.getElementById('assetInfSpot10').innerHTML = lastWorkingHour[0]?.bid?.max ? +(lastWorkingHour[0]?.bid?.max).toFixed(4) : '';
          document.getElementById('assetInfSpot11').innerHTML = lastWorkingHour[0]?.bid?.min ? +(lastWorkingHour[0]?.bid?.min).toFixed(4) : '' ;

          document.getElementById("lock-modal1").style.display = "none";
          document.getElementById("loading-circle1").style.display = "none";

          clearInterval(waitHistoricalInstrumentData);         
        }
        if (graphDataTicks > 220) {
          if (window['tracked_instrument']?.historicalData5days?.length) {
            populateCandleGraph(window['tracked_instrument'],5);

            let lastWorkingDay = window['tracked_instrument']?.historicalData5days?.slice(-1);

            document.getElementById('assetInfSpot10').innerHTML = lastWorkingDay[0]?.bid?.max ? +(lastWorkingDay[0]?.bid?.max).toFixed(4) : '';
            document.getElementById('assetInfSpot11').innerHTML = lastWorkingDay[0]?.bid?.min ? +(lastWorkingDay[0]?.bid?.min).toFixed(4) : '' ;
            
            document.getElementById("lock-modal1").style.display = "none";
            document.getElementById("loading-circle1").style.display = "none";

            clearInterval(waitHistoricalInstrumentData);

          } else if (window['tracked_instrument']?.historicalData30days?.length) {

            populateCandleGraph(window['tracked_instrument'],30);

            let lastWorkingDay = window['tracked_instrument']?.historicalData30days?.slice(-1);

            document.getElementById('assetInfSpot10').innerHTML = lastWorkingDay[0]?.max ? +(lastWorkingDay[0]?.max).toFixed(4) : '';
            document.getElementById('assetInfSpot11').innerHTML = lastWorkingDay[0]?.min ? +(lastWorkingDay[0]?.min).toFixed(4) : '' ;

            document.getElementById("lock-modal1").style.display = "none";
            document.getElementById("loading-circle1").style.display = "none";

            clearInterval(waitHistoricalInstrumentData);
          }
        }
        if (graphDataTicks > 230) {
          clearInterval(waitHistoricalInstrumentData);
          document.getElementById('unavHistDataChart').style.display = "flex";
          document.getElementById("lock-modal1").style.display = "none";
          document.getElementById("loading-circle1").style.display = "none";
          document.querySelector(".action_h").style.display = "none";
        }
      }      
    }
    if (graphDataTicks > 240) {
      clearInterval(waitHistoricalInstrumentData);
      document.getElementById('unavHistDataChart').style.display = "flex";
      document.getElementById("lock-modal1").style.display = "none";
      document.getElementById("loading-circle1").style.display = "none";
      document.querySelector(".action_h").style.display = "none";
    }
  }, 100);

  const checkForInstrumentUpdate = setInterval(() => {
    if (JSON.stringify(latestInstrumentData) != JSON.stringify(window['tracked_instrument'])) {

      latestInstrumentData = deepClone(window['tracked_instrument']);      
      if ((latestInstrumentData?.instrument_status === "ACTIVE") || (latestInstrumentData?.instrument_status === "OK")) {
        updateBuySell(latestInstrumentData);
        populateInfoAsset(latestInstrumentData);
      }
    }
    if (JSON.stringify(allInstrumentData) != JSON.stringify(window['updated_instruments'])) {
      allInstrumentData = deepClone(window['updated_instruments']);

      updateTable(allInstrumentData);      
    }
  }, 1000);

});

function populateTable(data, cat, id) {
  let table = document.getElementById(id);
  let tableBody = document.createElement("tbody");
  let i = 0;

  data.forEach(item => {

    if (cat == 0 || cat == item.category_id) {

      i++;
      let isLoggedIn;
      let instSymbol = item.ibc + item.qc;
      let displaySymbol = '';
      let inst_ico = '';

      displaySymbol = item?.instrument_name;
      
      let tableRow = document.createElement("tr");
      let tableCell1 = document.createElement("td");
      let tableCell2 = document.createElement("td");
      let tableCell3 = document.createElement("td");
      let tableCell4 = document.createElement("td");
      
      tableCell1.setAttribute('scope', 'row');
      tableCell1.setAttribute('data-label', 'Instrument');

      if (item?.icon_url) {
        let imgUrl = 'https://'+ asset_data.platform_url +'/images/instrument/icons/'+ item?.icon_url?.slice(9);
        
        imageExists(imgUrl, (exists) => {
          if (exists) {
            inst_ico = '<img src="'+imgUrl+'" alt="'+item.instrument_name+'" title="'+item.instrument_name+'" width="52" height="52" />';
            tableCell1.innerHTML = inst_ico+' <span>'+displaySymbol+'</span>';
          } else {
            inst_ico = '<img src="../wp-content/themes/klips/styles/images/default-icon.svg" alt="'+item.instrument_name+'" title="'+item.instrument_name+'" class="icoDefault" width="52" height="52" />';
            tableCell1.innerHTML = inst_ico+' <span>'+displaySymbol+'</span>';
          }
        });
      }            

      tableCell2.setAttribute('data-label', 'Price');
      tableCell2.innerHTML = item?.last_quote?.ask ? '<span class="'+item?.instrument_id+'_buy">'+ item?.last_quote?.ask  : '<span>N/A</span>';

      tableCell3.setAttribute('data-label', 'Change');

      if ((item?.instrument_status === "OK") || (item?.instrument_status === "ACTIVE")) {

        if (isPositiveFloat(item?.today_change)) {
          const classes = 'instGreen '+item?.instrument_id+'_change';
          tableCell3.setAttribute('class', classes);
          tableCell3.innerHTML = item?.today_change.toFixed(4) +'%';
        } else if (item?.today_change === 0) {
          tableCell3.setAttribute('class', item?.instrument_id+'_change');
          tableCell3.innerHTML = item?.today_change +'%';
        } else {
          const classes = 'instRed '+item?.instrument_id+'_change';
          tableCell3.setAttribute('class', classes);
          tableCell3.innerHTML = item?.today_change.toFixed(4) +'%';
        }
      } else {
        tableCell3.innerHTML = '0%';
      }

      tableCell4.innerHTML = '<a href="?instrument='+ item.instrument_name +'" title="More details" class="btn solid tradeInstrument" data-type="'+item.instrument_name+'" data-position="IN_PAGE">More details</a>';

      tableRow.appendChild(tableCell1);
      tableRow.appendChild(tableCell2);
      tableRow.appendChild(tableCell3);
      tableRow.appendChild(tableCell4);

      tableBody.appendChild(tableRow);
    }
  });

  if (i === 0) {
    let tableRow = document.createElement("tr");
    let tableCell1 = document.createElement("td");

    tableCell1.setAttribute('scope', 'row');
    tableCell1.setAttribute('colspan', '4');
    tableCell1.innerHTML = 'No Results';
    tableRow.appendChild(tableCell1);
    tableBody.appendChild(tableRow);
  }

  table.appendChild(tableBody);
  // fireModal();
}

function updateTable(data) {
  const tablesHolder = document.getElementById('tablesHolder');
  
  data.forEach(item => {

    const buyID = item?.instrument_id+'_buy';
    const changeID = item?.instrument_id+'_change';
    const instBuyPriceId = document.getElementsByClassName(buyID);
    const instChangePriceId = document.getElementsByClassName(changeID);

    if (instBuyPriceId) { 
      for(i=0; i < instBuyPriceId.length; i++) {
        instBuyPriceId[i].innerHTML = item?.last_quote?.ask;
      }
    }
    if (instChangePriceId) { 
      if (isPositiveFloat(item?.today_change)) {
        for(i=0; i < instChangePriceId.length; i++) {
          if (instChangePriceId[i].classList.contains('instRed')) {
            instChangePriceId[i].classList.replace('instRed', 'instGreen');
          } else if (instChangePriceId[i].classList.contains('instGreen')) {

          } else {
            instChangePriceId[i].classList.add('instGreen');
          }
          instChangePriceId[i].innerHTML = item?.today_change.toFixed(4) +'%';
        }
      } else if (item?.today_change === 0) {
        for(i=0; i < instChangePriceId.length; i++) {
          if (instChangePriceId[i].classList.contains('instGreen')) {
            instChangePriceId[i].classList.remove('instGreen');
          } else if (instChangePriceId[i].classList.contains('instRed')) {
            instChangePriceId[i].classList.remove('instRed');
          }
          instChangePriceId[i].innerHTML = item?.today_change +'%';
        }
      } else {
        for(i=0; i < instChangePriceId.length; i++) {
          if (instChangePriceId[i].classList.contains('instGreen')) {
            instChangePriceId[i].classList.replace('instGreen', 'instRed');
          } else if (instChangePriceId[i].classList.contains('instRed')) {

          } else {
            instChangePriceId[i].classList.add('instRed');
          }
          instChangePriceId[i].innerHTML = item?.today_change.toFixed(4) +'%';
        }
      }  
    }
  });
}

function populateBuySell(data) {

  let holder = document.getElementById('buySell');
  let data_ibc = data?.ibc ? data?.ibc : '';
  let img = document.getElementById('buySellImg');
  let quotePrecis = data?.quote_precision ? data?.quote_precision : 5;
  const dateToday = new Date();
  
  document.getElementById('buySellAssetName').innerHTML = '<span class="noBorder">'+ data.instrument_name +'</span>';

  if (data?.icon_url) {
    let imgUrl = 'https://'+ asset_data.platform_url +'/images/instrument/icons/'+ data?.icon_url?.slice(9);

    imageExists(imgUrl, (exists) => {
      if (exists) {
        img.setAttribute('src', imgUrl);
      } else {
        img.setAttribute('src', '../wp-content/themes/klips/styles/images/default-icon.svg');
        img.classList.add("icoDefault");
      }
    });
  }
  img.setAttribute('alt', data.instrument_name);
  img.setAttribute('title', data.instrument_name);

  if ((data?.instrument_status === "ACTIVE") || (data?.instrument_status === "OK")) {
    if (data?.today_change) {
      if (isPositiveFloat(data?.today_change)) {
        holder.querySelector('.assetRate').innerHTML = data?.last_quote?.ask + '<span class="change rateGreen"><span class="change rateGreen icon-arrow-up2"></span>'+ +(data?.today_change).toFixed(quotePrecis) +' %</span>';
      } else if (data?.today_change === 0) {
        holder.querySelector('.assetRate').innerHTML = data?.last_quote?.ask + '<span class="change"><span class="change"></span>'+ data?.today_change +'</span>';
      } else {
        holder.querySelector('.assetRate').innerHTML = data?.last_quote?.ask + '<span class="change rateRed"><span class="change rateRed icon-arrow-down2"></span>'+ +(data?.today_change).toFixed(quotePrecis) +' %</span>';
      }
    }
    holder.querySelector('.openClose_h').innerHTML = 'Market Open';
  } else {
    holder.querySelector('.assetRate').innerHTML = '<span class="marketClose">Market Closed</span>';
    let ddayToday = dateToday.getDate();
    if (ddayToday < 10) { ddayToday = '0'+ddayToday; }    
    
    // if (dayOfTheWeek === 1) {
    //   let pastDay = new Date(new Date().setDate(dateToday.getDate() - 3));
    //   let dday = pastDay.toLocaleString("default", { day: "2-digit" });  
    //   let stringDate = '';
      
    //   if (data?.trading_hours_v2?.length === 10) {      
    //     if (gmtTimeNow < data?.trading_hours_v2[0]?.end?.time) {
    //       stringDate = year+'-'+monthShortNum+'-'+dday+'T'+data?.trading_hours_v2[9]?.end?.time+':00Z';
    //     } else if ((gmtTimeNow > data?.trading_hours_v2[0]?.end?.time) && (gmtTimeNow < data?.trading_hours_v2[1]?.end?.time)) {
    //       stringDate = year+'-'+monthShortNum+'-'+ddayToday+'T'+data?.trading_hours_v2[0]?.end?.time+':00Z';
    //     } else if (gmtTimeNow > data?.trading_hours_v2[1]?.end?.time) {
    //       stringDate = year+'-'+monthShortNum+'-'+ddayToday+'T'+data?.trading_hours_v2[1]?.end?.time+':00Z';
    //     }
    //   } else if (data?.trading_hours_v2?.length === 1) {
    //     stringDate = year+'-'+monthShortNum+'-'+dday+'T'+data?.trading_hours_v2[0]?.end?.time+':00Z';
    //   } else {
    //     stringDate = year+'-'+monthShortNum+'-'+dday+'T'+data?.trading_hours_v2[4]?.end?.time+':00Z';
    //   }

    //   let theDate = new Date(stringDate);

    //   displayDate = convertToDate(theDate, 'long')+' '+convertToHour(theDate)+' '+timezone;
    // } else if (dayOfTheWeek === 0) {
    //   let pastDay = new Date(new Date().setDate(dateToday.getDate() - 2));
    //   let dday = pastDay.toLocaleString("default", { day: "2-digit" });
    //   let stringDate = '';

    //   if (data?.trading_hours_v2?.length === 10) { 
    //     stringDate = year+'-'+monthShortNum+'-'+dday+'T'+data?.trading_hours_v2[9]?.end?.time+':00Z';
    //   } else if (data?.trading_hours_v2?.length === 1) {
    //     stringDate = year+'-'+monthShortNum+'-'+dday+'T'+data?.trading_hours_v2[0]?.end?.time+':00Z';
    //   } else {
    //     stringDate = year+'-'+monthShortNum+'-'+dday+'T'+data?.trading_hours_v2[4]?.end?.time+':00Z';
    //   }

    //   let theDate = new Date(stringDate);

    //   displayDate = convertToDate(theDate, 'long')+' '+convertToHour(theDate)+' '+timezone;
    // } else if (dayOfTheWeek === 6) {
    //   let pastDay = new Date(new Date().setDate(dateToday.getDate() - 1));
    //   let dday = pastDay.toLocaleString("default", { day: "2-digit" });
    //   let stringDate = '';

    //   if (data?.trading_hours_v2?.length === 10) { 
    //     stringDate = year+'-'+monthShortNum+'-'+dday+'T'+data?.trading_hours_v2[9]?.end?.time+':00Z';
    //   } else if (data?.trading_hours_v2?.length === 1) {
    //     stringDate = year+'-'+monthShortNum+'-'+dday+'T'+data?.trading_hours_v2[0]?.end?.time+':00Z';
    //   } else { 
    //     stringDate = year+'-'+monthShortNum+'-'+dday+'T'+data?.trading_hours_v2[4]?.end?.time+':00Z';
    //   }

    //   let theDate = new Date(stringDate);

    //   displayDate = convertToDate(theDate, 'long')+' '+convertToHour(theDate)+' '+timezone;
    // } else {
    //   let pastDay = new Date(new Date().setDate(dateToday.getDate() - 1));
    //   let dday = pastDay.toLocaleString("default", { day: "2-digit" });  

    //   if (data?.trading_hours_v2?.length === 1) {
    //     if (data?.trading_hours_v2[0]?.alwaysOpen) {
    //       if (data?.instrument_status === "SUS") {
    //         holder.querySelector('.openClose_h').innerHTML = 'Instrumen Temporarily Suspended';
    //       } else {
    //         holder.querySelector('.openClose_h').innerHTML = 'Market Open Mon 00:00 - Sun 23:59';
    //       }
    //     } else {
    //       let stringDate = '';       
    //       stringDate = year+'-'+monthShortNum+'-'+dday+'T'+data?.trading_hours_v2[0]?.end?.time+':00Z';          
    //       let theDateForConv = new Date(stringDate);

    //       displayDate = convertToDate(theDateForConv, 'long')+' '+convertToHour(theDateForConv)+' '+timezone;
    //     }
    //   } else if (data?.trading_hours_v2?.length === 5) {
    //     let stringDate = '';
    //     if (gmtTimeNow > data?.trading_hours_v2[dayOfTheWeek-1]?.end?.time) {          
    //       stringDate = year+'-'+monthShortNum+'-'+ddayToday+'T'+data?.trading_hours_v2[dayOfTheWeek-1]?.end?.time+':00Z';
    //     } else {          
    //       stringDate = year+'-'+monthShortNum+'-'+dday+'T'+data?.trading_hours_v2[dayOfTheWeek-1]?.end?.time+':00Z';
    //     }

    //     let theDateForConv = new Date(stringDate);          

    //     displayDate = convertToDate(theDateForConv, 'long')+' '+convertToHour(theDateForConv)+' '+timezone;        
    //   } else if (data?.trading_hours_v2?.length === 10) {
    //     let stringDate = '';

    //     if (dayOfTheWeek == 2) {
    //       if (gmtTimeNow < data?.trading_hours_v2[2]?.end?.time) {
    //         stringDate = year+'-'+monthShortNum+'-'+dday+'T'+data?.trading_hours_v2[1]?.end?.time+':00Z';
    //       } else if ((gmtTimeNow > data?.trading_hours_v2[2]?.end?.time) && (gmtTimeNow < data?.trading_hours_v2[3]?.end?.time)) {
    //         stringDate = year+'-'+monthShortNum+'-'+ddayToday+'T'+data?.trading_hours_v2[2]?.end?.time+':00Z';
    //       } else if (gmtTimeNow > data?.trading_hours_v2[3]?.end?.time) {
    //         stringDate = year+'-'+monthShortNum+'-'+ddayToday+'T'+data?.trading_hours_v2[3]?.end?.time+':00Z';
    //       }
    //     } else if (dayOfTheWeek == 3) {
    //       if (gmtTimeNow < data?.trading_hours_v2[4]?.end?.time) {
    //         stringDate = year+'-'+monthShortNum+'-'+dday+'T'+data?.trading_hours_v2[3]?.end?.time+':00Z';
    //       } else if ((gmtTimeNow > data?.trading_hours_v2[4]?.end?.time) && (gmtTimeNow < data?.trading_hours_v2[5]?.end?.time)) {
    //         stringDate = year+'-'+monthShortNum+'-'+ddayToday+'T'+data?.trading_hours_v2[4]?.end?.time+':00Z';
    //       } else if (gmtTimeNow > data?.trading_hours_v2[5]?.end?.time) {
    //         stringDate = year+'-'+monthShortNum+'-'+ddayToday+'T'+data?.trading_hours_v2[5]?.end?.time+':00Z';
    //       }
    //     } else if (dayOfTheWeek == 4) {
    //       if (gmtTimeNow < data?.trading_hours_v2[6]?.end?.time) {
    //         stringDate = year+'-'+monthShortNum+'-'+dday+'T'+data?.trading_hours_v2[5]?.end?.time+':00Z';
    //       } else if ((gmtTimeNow > data?.trading_hours_v2[6]?.end?.time) && (gmtTimeNow < data?.trading_hours_v2[7]?.end?.time)) {
    //         stringDate = year+'-'+monthShortNum+'-'+ddayToday+'T'+data?.trading_hours_v2[6]?.end?.time+':00Z';
    //       } else if (gmtTimeNow > data?.trading_hours_v2[7]?.end?.time) {
    //         stringDate = year+'-'+monthShortNum+'-'+ddayToday+'T'+data?.trading_hours_v2[7]?.end?.time+':00Z';
    //       }
    //     } else if (dayOfTheWeek == 5) {
    //       if (gmtTimeNow < data?.trading_hours_v2[8]?.end?.time) {
    //         stringDate = year+'-'+monthShortNum+'-'+dday+'T'+data?.trading_hours_v2[7]?.end?.time+':00Z';
    //       } else if ((gmtTimeNow > data?.trading_hours_v2[8]?.end?.time) && (gmtTimeNow < data?.trading_hours_v2[9]?.end?.time)) {
    //         stringDate = year+'-'+monthShortNum+'-'+ddayToday+'T'+data?.trading_hours_v2[8]?.end?.time+':00Z';
    //       } else if (gmtTimeNow > data?.trading_hours_v2[9]?.end?.time) {
    //         stringDate = year+'-'+monthShortNum+'-'+ddayToday+'T'+data?.trading_hours_v2[9]?.end?.time+':00Z';
    //       }
    //     }
    //     let theDateForConv = new Date(stringDate);          

    //     displayDate = convertToDate(theDateForConv, 'long')+' '+convertToHour(theDateForConv)+' '+timezone; 
    //   }
    // }
    // holder.querySelector('.openClose_h').innerHTML = 'At close: '+displayDate;
  }

  if (asset_data.lang === 'pl_PL') {
    document.getElementById('buySellAssetHSell').innerHTML = data?.last_quote?.bid ? 'Wartość: '+ data?.last_quote?.bid : '-';
    document.getElementById('buySellAssetHBuy').innerHTML = data?.last_quote?.ask ? 'Wartość: '+ data?.last_quote?.ask : '-';
  } else if (asset_data.lang === 'cs_CZ') {
    document.getElementById('buySellAssetHSell').innerHTML = data?.last_quote?.bid ? 'Hodnota: '+ data?.last_quote?.bid : '-';
    document.getElementById('buySellAssetHBuy').innerHTML = data?.last_quote?.ask ? 'Hodnota: '+ data?.last_quote?.ask : '-';
  } else if (asset_data.lang === 'sk_SK') {
    document.getElementById('buySellAssetHSell').innerHTML = data?.last_quote?.bid ? 'Hodnota: '+ data?.last_quote?.bid : '-';
    document.getElementById('buySellAssetHBuy').innerHTML = data?.last_quote?.ask ? 'Hodnota: '+ data?.last_quote?.ask : '-';
  } else {
    document.getElementById('buySellAssetHSell').innerHTML = data?.last_quote?.bid ? 'Value: '+ data?.last_quote?.bid : '-';
    document.getElementById('buySellAssetHBuy').innerHTML = data?.last_quote?.ask ? 'Value: '+ data?.last_quote?.ask : '-';
  }
}

function updateBuySell(data) {
  let holder = document.getElementById('buySell');
  let quotePrecis = data?.quote_precision ? data?.quote_precision : 5;
 
  if (data?.today_change) {
    if (isPositiveFloat(data?.today_change)) {
      holder.querySelector('.assetRate').innerHTML = data?.last_quote?.ask + '<span class="change rateGreen"><span class="change rateGreen icon-arrow-up2"></span>'+ +(data?.today_change).toFixed(quotePrecis) +' %</span>';
    } else if (data?.today_change === 0) {
      holder.querySelector('.assetRate').innerHTML = data?.last_quote?.ask + '<span class="change"><span class="change"></span>'+ data?.today_change +'</span>';
    } else {
      holder.querySelector('.assetRate').innerHTML = data?.last_quote?.ask + '<span class="change rateRed"><span class="change rateRed icon-arrow-down2"></span>'+ +(data?.today_change).toFixed(quotePrecis) +' %</span>';
    }
  }

  if (asset_data.lang === 'pl_PL') {
    document.getElementById('buySellAssetHSell').innerHTML = data?.last_quote?.bid ? 'Wartość: '+ data?.last_quote?.bid : '-';
    document.getElementById('buySellAssetHBuy').innerHTML = data?.last_quote?.ask ? 'Wartość: '+ data?.last_quote?.ask : '-';
  } else if (asset_data.lang === 'cs_CZ') {
    document.getElementById('buySellAssetHSell').innerHTML = data?.last_quote?.bid ? 'Hodnota: '+ data?.last_quote?.bid : '-';
    document.getElementById('buySellAssetHBuy').innerHTML = data?.last_quote?.ask ? 'Hodnota: '+ data?.last_quote?.ask : '-';
  } else if (asset_data.lang === 'sk_SK') {
    document.getElementById('buySellAssetHSell').innerHTML = data?.last_quote?.bid ? 'Hodnota: '+ data?.last_quote?.bid : '-';
    document.getElementById('buySellAssetHBuy').innerHTML = data?.last_quote?.ask ? 'Hodnota: '+ data?.last_quote?.ask : '-';
  } else {
    document.getElementById('buySellAssetHSell').innerHTML = data?.last_quote?.bid ? 'Value: '+ data?.last_quote?.bid : '-';
    document.getElementById('buySellAssetHBuy').innerHTML = data?.last_quote?.ask ? 'Value: '+ data?.last_quote?.ask : '-';
  }

}

const truncatePositiveDecimal = (number, visiblePositiveDecimals = 1, minPrecision = 1) => {
  if (isNaN(Number(number)) || Number(number) === 0) {
    return number;
  } else {
    const stringified = String(number);

    if (stringified.includes("e-")) {
      /** Dealing with 7.2e-7 type of number */
      // TODO: Revisit exponential numbers with the newer implementation of "toNonExponential"
      const parts = stringified.split("e-");
      const decimalPart = parts[0].replace(/\./g, "").substr(0, visiblePositiveDecimals);
      const zerosCount = Number(parts[1]) - 1;

      return Number(`0.${Array(zerosCount).fill("0").join("")}${decimalPart}`);
    } else if (stringified.includes(".")) {
      const parts = stringified.split(".");
      const wholeNumberPart = parts[0];
      const decimalPart = parts[1];
      const positiveDecimalIndex = decimalPart.match(/[1-9]/).index;
      const index = visiblePositiveDecimals + positiveDecimalIndex;
      const truncatedDecimals = decimalPart.substr(0, index < minPrecision ? minPrecision : index);

      return Number(`${wholeNumberPart}.${truncatedDecimals}`);
    } else {
      return number;
    }
  }
};

const getPipValue = (rate, pip) => {
  const priceDigitsCount = String(Math.trunc(rate)).length;
  const multiplierZerosCount = pip - priceDigitsCount;
  const multiplier = multiplierZerosCount !== 0 ? Math.pow(10, multiplierZerosCount) : 1;

  return rate / (rate*multiplier);
};

function populateInfoAsset(data) {

    const weekday = ["-", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let quotePrecis = data?.quote_precision ? data?.quote_precision : 5;
    let marg_init = data?.margin_initial ? +(+(data?.margin_initial) * 100).toFixed(quotePrecis) : '';
    let spr = '';
    let pipDisplay = '';

    if (data?.ask_type == 0) {
       spr = data?.ask_val ? data?.ask_val + data?.bid_val : '';
    }
    if (data?.ask_type == 1) {
      spr = data?.ask_val ? parseFloat(((data?.ask_val + data?.bid_val) * 100).toFixed(quotePrecis)) + '%' : ''
    }

    let marg_maint = data?.margin_maintenance ? +(+(data?.margin_maintenance) * 100).toFixed(quotePrecis) : '';    

    const getPipValue2 = (rate, pip, q, ex) => {
      const pipValue = getPipValue(rate, pip);
      let test = q*pipValue*ex;
      return truncatePositiveDecimal(test);
    };

    if (data?.last_quote?.ask && data?.pip && data?.qty_min && data?.user_currency_ex_rate) {
      pipDisplay = getPipValue2(data?.last_quote?.ask, data?.pip, data?.qty_min, data?.user_currency_ex_rate);
    } else {
      pipDisplay = 'N/A';
    }

    document.getElementById('assetInfSpot1').innerHTML = spr;
    document.getElementById('assetInfSpot2').innerHTML = pipDisplay;
    document.getElementById('assetInfSpot4').innerHTML = data?.sell_overnight_commission ? +(data?.sell_overnight_commission / 360).toFixed(4) + '%' : '';
    document.getElementById('assetInfSpot3').innerHTML = data?.buy_overnight_commission ? +(data?.buy_overnight_commission / 360).toFixed(4) + '%' : '';
    document.getElementById('assetInfSpot5').innerHTML = data?.margin_initial ? marg_init + '%' : '';
    document.getElementById('assetInfSpot6').innerHTML = data?.margin_maintenance ? marg_maint + '%' : '';
    document.getElementById('assetInfSpot7').innerHTML = data?.margin_initial ? '1:' + ~~((1 / (data?.margin_initial / 100)) / 100) : '';
    document.getElementById('assetInfSpot9').innerHTML = data?.qty_min ? data?.qty_min : '';

    if (data?.trading_hours_v2[0]?.alwaysOpen) {
      document.getElementById('assetInfSpot8').innerHTML = 'GMT Mon 00:00 - Sun 23:59';
    } else {
      document.getElementById('assetInfSpot8').innerHTML = 'GMT '+ data?.trading_hours_v2[0]?.start?.day +' '+ data?.trading_hours_v2[0]?.start?.time +' - '+ data?.trading_hours_v2[0]?.end?.day +' '+ data?.trading_hours_v2[0]?.end?.time;
    }
    document.getElementById('assetInfSpot10').innerHTML = data?.daily?.highBid ? data?.daily?.highBid : '';
    document.getElementById('assetInfSpot11').innerHTML = data?.daily?.lowBid ? data?.daily?.lowBid : '' ;
}

function populateAboutAsset(data, inst, categoryId) {

  let charLimit = 530;
  let instSymbol = data.ibc + data.qc;
  let langType = 'en_US';
  let instDescription = '';

  if (asset_data?.lang?.length > 0) {
    langType = asset_data?.lang;
  }

  if (langType === 'en_US') {
    instDescription = data?.description;
  } else {
    instDescription = asset_data?.translations[instSymbol];
  }
 
  if (instDescription?.length > 0) {  
    if(instDescription?.length > charLimit) {
      let showStr = instDescription.slice(0, charLimit);
      let hideStr = instDescription.slice(charLimit);

      document.getElementById('aboutAsset').querySelector('.aboutAsset_h').innerHTML = showStr + '<span class="morePoints">...</span> <span class="trimmed">' + hideStr + '</span> <span class="read-more"><a href="#" class="more"></a></span>';
    } else {
      document.getElementById('aboutAsset').querySelector('.aboutAsset_h').innerHTML = instDescription;
    }
  }
}

let myChart;

function populateCandleGraph(data,period) {

  let ctx = document.getElementById('chart').getContext('2d');
  ctx.canvas.width = 700;
  ctx.canvas.height = 250;
  let customHeight = 250;
  let customDotSize = 2.5;
  if (window.screen.width < 440) {
    customHeight = 110;
    customDotSize = 1;
  }
  
  const colors = {
    green: {
      default: "rgba(19, 131, 54, 1)",
      start: "rgba(19, 131, 54, 0.8)",
      half: "rgba(19, 131, 54, 0.6)",
      quarter: "rgba(19, 131, 54, 0.3)",
      zero: "rgba(19, 131, 54, 0)"
    },
    red: {
      default: "rgba(184, 0, 0, 1)",
      start: "rgba(184, 0, 0, 0.8)",
      half: "rgba(184, 0, 0, 0.6)",
      quarter: "rgba(184, 0, 0, 0.3)",
      zero: "rgba(184, 0, 0, 0)"
    },
    grey: {
      default: "rgba(65, 65, 65, 1)",
      start: "rgba(65, 65, 65, 0.8)",
      half: "rgba(65, 65, 65, 0.6)",
      quarter: "rgba(65, 65, 65, 0.3)",
      zero: "rgba(65, 65, 65, 0)"
    }
  };

  gradient = ctx.createLinearGradient(0, 14, 0, customHeight);
  
  let setLabels = [];
  let setData = [];
  let lineGraphColor = '#821ec8';
  let dataPeriodArray = [];
  let gridColor = '';

  const allTabs = document.querySelectorAll('.changeGraph');
  allTabs.forEach(b => {
    b.classList.remove('active');
  });
  if (period === 1) {
    dataPeriodArray = data.historicalDataByMins;
    // dataPeriodArray = data.quoteChanges;
    let activeTabSet = document.querySelector('[data-period="1"]');
    activeTabSet.classList.add("active");
  } else if (period === 5) {
    dataPeriodArray = data.historicalData5days;
    let activeTabSet = document.querySelector('[data-period="5"]');
    activeTabSet.classList.add("active");
  } else if (period === 30) {
    dataPeriodArray = data.historicalData30days;
    let activeTabSet = document.querySelector('[data-period="30"]');
    activeTabSet.classList.add("active");
  }
   
  // if (period === 1) {
  //   Object.entries(dataPeriodArray).forEach(([dateString, value]) => {
  //     setLabels.push(convertToHour2(dateString));
  //     setData.push(+value.toFixed(5));
  //   });
  // } else {
  //   dataPeriodArray.forEach(item => {
  //     setLabels.push(convertToDate(item.dt.nanos));
  //     setData.push(+item.close.toFixed(5));
  //   });
  // }
  dataPeriodArray.forEach(item => {
    if (period === 1) {
      setLabels.push(convertToHour(item.dt.nanos));
    } else {
      setLabels.push(convertToDate(item.dt.nanos));
    }
    setData.push(+item.close.toFixed(5));
  });

  let firstValue = setData[0];
  let lastValue = setData[setData.length - 1];

  if (firstValue > lastValue) {
    lineGraphColor = 'red';
    gridColor = colors.red.quarter;
  } else if (firstValue < lastValue) {
    lineGraphColor = 'green';
    gridColor = colors.green.quarter;
  } else {
    lineGraphColor = 'grey';
    gridColor = colors.grey.quarter;
  }

  let defaultValue;
  if (lineGraphColor === 'green') {
    gradient.addColorStop(0, colors.green.start);
    gradient.addColorStop(0.4, colors.green.half);
    gradient.addColorStop(0.8, colors.green.quarter);
    gradient.addColorStop(1, colors.green.zero);
    defaultValue = colors.green.default;
  } else if (lineGraphColor === 'red') {
    gradient.addColorStop(0, colors.red.start);
    gradient.addColorStop(0.4, colors.red.half);
    gradient.addColorStop(0.8, colors.red.quarter);
    gradient.addColorStop(1, colors.red.zero);
    defaultValue = colors.red.default;
  } else if (lineGraphColor === 'grey') {
    gradient.addColorStop(0, colors.grey.start);
    gradient.addColorStop(0.4, colors.grey.half);
    gradient.addColorStop(0.8, colors.grey.quarter);
    gradient.addColorStop(1, colors.grey.zero);
    defaultValue = colors.grey.default;
  }

  myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: setLabels,
      datasets: [
        {
          data: setData,
          fill: true,
          backgroundColor: gradient,
          pointBackgroundColor: defaultValue,
          borderColor: defaultValue,
          lineTension: 0.1,
          borderWidth: 1,
          pointRadius: customDotSize
        }
      ]
    },
    options: {
      maintainAspectRatio: true,
      responsive: true,
      plugins: {
        legend: {
          display: false,
          labels: {
            display: false
          }
        },
        tooltips: {
          display: true
        }
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: true,
            color: gridColor
          }
        },
        y: {
          display: true,
          grid: {
            display: false,
          }
        }
      },
    }
  });
}

function changeCandleGraph(data, period = '1') {

  myChart.destroy();

  let ctx = document.getElementById('chart').getContext('2d');
  ctx.canvas.width = 700;
  ctx.canvas.height = 250;
  let customHeight = 250;
  let customDotSize = 2.5;
  if (window.screen.width < 440) {
    customHeight = 110;
    customDotSize = 1.5;
  }
  
  let dataPeriodArray = [];

  if (period == '1') {
    dataPeriodArray = data.historicalDataByMins;
  } else if (period == '5') {
    dataPeriodArray = data.historicalData5days;
  } else if (period == '30') {
    dataPeriodArray = data.historicalData30days;
  } else if (period == '90') {
    dataPeriodArray = data.historicalData90days;    
  } else if (period == '365') {
    dataPeriodArray = data.historicalDataYear;
    customDotSize = 1;    
  } else if (period == 'ytd') {
    dataPeriodArray = data.historicalDataYTD;
  }

  const colors = {
    green: {
      default: "rgba(19, 131, 54, 1)",
      start: "rgba(19, 131, 54, 0.8)",
      half: "rgba(19, 131, 54, 0.6)",
      quarter: "rgba(19, 131, 54, 0.3)",
      zero: "rgba(19, 131, 54, 0)"
    },
    red: {
      default: "rgba(184, 0, 0, 1)",
      start: "rgba(184, 0, 0, 0.8)",
      half: "rgba(184, 0, 0, 0.6)",
      quarter: "rgba(184, 0, 0, 0.3)",
      zero: "rgba(184, 0, 0, 0)"
    },
    grey: {
      default: "rgba(65, 65, 65, 1)",
      start: "rgba(65, 65, 65, 0.8)",
      half: "rgba(65, 65, 65, 0.6)",
      quarter: "rgba(65, 65, 65, 0.3)",
      zero: "rgba(65, 65, 65, 0)"
    }
  };
  gradient = ctx.createLinearGradient(0, 14, 0, customHeight);
  
  let setLabels = [];
  let setData = [];
  let lineGraphColor = '#821ec8';
  let gridColor = '';
   
  dataPeriodArray.forEach(item => {
    if (period == '1') {
      setLabels.push(convertToHour(item.dt.nanos));
    } else {
      setLabels.push(convertToDate(item.dt.nanos));
    }
    setData.push(+item.close.toFixed(5));
  });

  let firstValue = setData[0];
  let lastValue = setData[setData.length - 1];

  if (firstValue > lastValue) {
    lineGraphColor = 'red';
    gridColor = colors.red.quarter;
  } else if (firstValue < lastValue) {
    lineGraphColor = 'green';
    gridColor = colors.green.quarter;
  } else {
    lineGraphColor = 'grey';
    gridColor = colors.grey.quarter;
  }

  let defaultValue;
  if (lineGraphColor === 'green') {
    gradient.addColorStop(0, colors.green.start);
    gradient.addColorStop(0.4, colors.green.half);
    gradient.addColorStop(0.8, colors.green.quarter);
    gradient.addColorStop(1, colors.green.zero);
    defaultValue = colors.green.default;
  } else if (lineGraphColor === 'red') {
    gradient.addColorStop(0, colors.red.start);
    gradient.addColorStop(0.4, colors.red.half);
    gradient.addColorStop(0.8, colors.red.quarter);
    gradient.addColorStop(1, colors.red.zero);
    defaultValue = colors.red.default;
  } else if (lineGraphColor === 'grey') {
    gradient.addColorStop(0, colors.grey.start);
    gradient.addColorStop(0.4, colors.grey.half);
    gradient.addColorStop(0.8, colors.grey.quarter);
    gradient.addColorStop(1, colors.grey.zero);
    defaultValue = colors.grey.default;
  }

  myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: setLabels,
      datasets: [
        {
          data: setData,
          fill: true,
          backgroundColor: gradient,
          pointBackgroundColor: defaultValue,
          borderColor: defaultValue,
          lineTension: 0.1,
          borderWidth: 1,
          pointRadius: customDotSize
        }
      ]
    },
    options: {
      maintainAspectRatio: true,
      responsive: true,
      plugins: {
        legend: {
          display: false,
          labels: {
            display: false
          }
        },
        tooltips: {
          display: true
        }
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: true,
            color: gridColor
          }
        },
        y: {
          display: true,
          grid: {
            display: false,
          }
        }
      },
    }
  });
}

function initTabsSection() {
  new Swiper('.switchInstMobileSwiper', {
    pagination: {
      el: '.tab-swiper-nav .tab-pagination',
      clickable: true,
    },
    slidesPerView: 'auto',
    spaceBetween: 20,
  });
}

window.addEventListener('DOMContentLoaded', () => {

  initTabsSection();
  
  const graphActionHolder = document.querySelector('.actions');

  graphActionHolder.addEventListener('click', e => {
    if (e.target.classList.contains('changeGraph')) {
      const buttons = graphActionHolder.querySelectorAll('.changeGraph');
      buttons.forEach(b => {
        b.classList.remove('active');
      });
      e.target.classList.add("active");
      changeCandleGraph(window['tracked_instrument'],e.target.dataset.period);
    }
  });

  document.getElementById('aboutAsset').querySelector('.aboutAsset_h').addEventListener('click', e => {
    if (e.target.matches('.more')) {
      e.preventDefault();
      e.target.parentElement.parentElement.classList.toggle('showAll');
    }
  });

  if (isMobile()) {
    const bHolder = document.getElementById('switchInstrumentsMobile');
    const tablesHolder = document.getElementById('tablesHolder');
    const instTitlesHolder = document.getElementById('instrumentsTitleHolder');

    bHolder.addEventListener('click', e => {
      e.preventDefault();
      if (e.target.classList.contains('button')) {

        const buttons = bHolder.querySelectorAll('.button');

        buttons.forEach(b => {
          b.classList.remove('active');
        });
        e.target.classList.add("active");
        let buttonCategory = e.target.dataset.categoty;

        const tableChange = tablesHolder.querySelectorAll('.instrumentsTable');
        tableChange.forEach(t => {
          t.classList.remove('active');
          let x = t.rows.length;
          const loadMore = document.getElementById('load-more'+t.id.substring(5));
          loadMore.style.display = "none";

          if (t.id == 'table'+buttonCategory) {
            t.classList.add('active');
            if (x > tableRowsLimit) {
              for (let i = tableRowsLimit; i < x; i++) {
                t.rows.item(i).style.display = "none";
              }
              loadMore.style.display = "block";
              const loadMoreBtn = loadMore.querySelector('.btn');
              loadMoreBtn.addEventListener('click', ee => {
                ee.preventDefault();
                for (let ii = tableRowsLimit; ii < x; ii++) {
                  t.rows.item(ii).style.display = "table-row";
                }
                loadMore.style.display = "none";
              });
            }
          }
        });

        const instTitleChange = instTitlesHolder.querySelectorAll('.instTitle');
        instTitleChange.forEach(n => {
          n.classList.remove('active');
          let titleCat = n.dataset.categoty;
          if (titleCat == buttonCategory) {
            n.classList.add('active');
          }
        });
      }
    });
  } else {
    const bHolder = document.getElementById('switchInstruments');
    const tablesHolder = document.getElementById('tablesHolder');
    const instTitlesHolder = document.getElementById('instrumentsTitleHolder');

    bHolder.addEventListener('click', e => {
      e.preventDefault();
      if (e.target.classList.contains('button')) {

        const buttons = bHolder.querySelectorAll('.button');

        buttons.forEach(b => {
          b.classList.remove('active');
        });
        e.target.classList.add("active");
        let buttonCategory = e.target.dataset.categoty;

        const tableChange = tablesHolder.querySelectorAll('.instrumentsTable');
        tableChange.forEach(t => {
          t.classList.remove('active');
          let x = t.rows.length;
          const loadMore = document.getElementById('load-more'+t.id.substring(5));
          loadMore.style.display = "none";

          if (t.id == 'table'+buttonCategory) {
            t.classList.add('active');
            if (x > tableRowsLimit) {
              for (let i = tableRowsLimit; i < x; i++) {
                t.rows.item(i).style.display = "none";
              }
              loadMore.style.display = "block";
              const loadMoreBtn = loadMore.querySelector('.btn');
              loadMoreBtn.addEventListener('click', ee => {
                ee.preventDefault();
                for (let ii = tableRowsLimit; ii < x; ii++) {
                  t.rows.item(ii).style.display = "table-row";
                }
                loadMore.style.display = "none";
              });
            }
          }
        });

        const instTitleChange = instTitlesHolder.querySelectorAll('.instTitle');
        instTitleChange.forEach(n => {
          n.classList.remove('active');
          let titleCat = n.dataset.categoty;
          if (titleCat == buttonCategory) {
            n.classList.add('active');
          }
        });
      }
    });
  }

  // dataLayer related code for GTM
  let loadTableInterval = setInterval(getTradeInstrumentInfo, 300);
  function getTradeInstrumentInfo() {
    let tableContent = document.querySelector('#tablesHolder #tableTrending tbody');
    if ( tableContent ) {
      stopLoadTableInterval();
    }
  }
  function stopLoadTableInterval() {
    clearInterval(loadTableInterval);
    document.querySelectorAll('a').forEach(btn => {
      btn.addEventListener('click', (e) => {
        let btnDataType = btn.getAttribute('data-type');
        if (btn.classList.contains('tradeInstrument')) {
          window.dataLayer.push({
            'instrument_name': btnDataType,
          });
        }
      });
    });
  }
});

function convertToDate (el, format = 'short') {
  let theDate = new Date(el);

  let year = theDate.toLocaleString("default", { year: "numeric" });
  let month = theDate.toLocaleString("default", { month: format });
  let day = theDate.toLocaleString("default", { day: "2-digit" });
  let formattedDate = [day, month].join(" ");

  return formattedDate;
}

function convertToHour (el) {
  let theDate = new Date(el);
  let localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let formattedTime = theDate.toLocaleTimeString("fr-FR", {timeZone: localZone, hour: "2-digit", minute: "2-digit"});

  return formattedTime;
}

function convertToHour2(dateString) {
  const date = new Date(dateString);

  const formattedDate = date.toLocaleString('en-US', { 
    day: 'numeric',
    month: 'short',   
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return formattedDate;
}