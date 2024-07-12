let allInstruments;
let categories;
let latestInstrumentData = [];
let updatedInst = [];
let DataTicks = 0;

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

window['tracked_hotlist'] = [];
window['tracked_commodities'] = [];
window['tracked_currencies'] = [];
window['tracked_indicies'] = [];
window['tracked_shares'] = [];

window.addEventListener('DOMContentLoaded', () => {
  if (Array.isArray(window['hotlist_data']?.instruments) && window['hotlist_data']?.instruments.length > 0) {
    // window['hotlist_names'] = window['hotlist_data'].instruments.filter(item => item.hot_list_country.includes(window['country'][0])).map(item => item.instrument);
    const countryInstruments = window['hotlist_data'].instruments.filter(item => item.tr_inst_country.includes(window['country'][0]));
    window['hotlist_names'] = countryInstruments.length > 0 ? countryInstruments : window['hotlist_data'].instruments.filter(item => item.tr_inst_country.includes('Default'));
    window['hotlist_names'] = window['hotlist_names'].map(item => item.tr_inst_name);
    document.getElementById("lock-modal1").style.display = "block";
    document.getElementById("loading-circle1").style.display = "block";

    const waitForData = setInterval(() => {
      if (allInstruments?.length > 0) {
        window['tracked_hotlist'] = filterTableInstruments(allInstruments, window['hotlist_names']);
        createSwiperElement(window['tracked_hotlist'], 'hotlist');
        document.getElementById("lock-modal1").style.display = "none";
        document.getElementById("loading-circle1").style.display = "none";
        clearInterval(waitForData);
      }
    }, 100);
  }
  if (Array.isArray(window['currencies_data']?.instruments) && window['currencies_data']?.instruments.length > 0) {
    const countryInstruments2 = window['currencies_data'].instruments.filter(item => item.tr_inst_country.includes(window['country'][0]));
    window['currencies_names'] = countryInstruments2.length > 0 ? countryInstruments2 : window['currencies_data'].instruments.filter(item => item.tr_inst_country.includes('Default'));
    window['currencies_names'] = window['currencies_names'].map(item => item.tr_inst_name);
    document.getElementById("lock-modal2").style.display = "block";
    document.getElementById("loading-circle2").style.display = "block";

    const waitForData = setInterval(() => {
      if (allInstruments?.length > 0) {
        window['tracked_currencies'] = filterTableInstruments(allInstruments, window['currencies_names']);
        createSwiperElement(window['tracked_currencies'], 'currencies');
        document.getElementById("lock-modal2").style.display = "none";
        document.getElementById("loading-circle2").style.display = "none";
        clearInterval(waitForData);
      }
    }, 100);
  }
  if (Array.isArray(window['commodities_data']?.instruments) && window['commodities_data']?.instruments.length > 0) {
    const countryInstruments3 = window['commodities_data'].instruments.filter(item => item.tr_inst_country.includes(window['country'][0]));
    window['commodities_names'] = countryInstruments3.length > 0 ? countryInstruments3 : window['commodities_data'].instruments.filter(item => item.tr_inst_country.includes('Default'));
    window['commodities_names'] = window['commodities_names'].map(item => item.tr_inst_name);
    document.getElementById("lock-modal3").style.display = "block";
    document.getElementById("loading-circle3").style.display = "block";

    const waitForData = setInterval(() => {
      if (allInstruments?.length > 0) {
        window['tracked_commodities'] = filterTableInstruments(allInstruments, window['commodities_names']);
        createSwiperElement(window['tracked_commodities'], 'commodities');
        document.getElementById("lock-modal3").style.display = "none";
        document.getElementById("loading-circle3").style.display = "none";
        clearInterval(waitForData);
      }
    }, 100);
  }
  if (Array.isArray(window['indicies_data']?.instruments) && window['indicies_data']?.instruments.length > 0) {
    const countryInstruments4 = window['indicies_data'].instruments.filter(item => item.tr_inst_country.includes(window['country'][0]));
    window['indicies_names'] = countryInstruments4.length > 0 ? countryInstruments4 : window['indicies_data'].instruments.filter(item => item.tr_inst_country.includes('Default'));
    window['indicies_names'] = window['indicies_names'].map(item => item.tr_inst_name);
    document.getElementById("lock-modal4").style.display = "block";
    document.getElementById("loading-circle4").style.display = "block";

    const waitForData = setInterval(() => {
      if (allInstruments?.length > 0) {
        window['tracked_indicies'] = filterTableInstruments(allInstruments, window['indicies_names']);
        createSwiperElement(window['tracked_indicies'], 'indicies');
        document.getElementById("lock-modal4").style.display = "none";
        document.getElementById("loading-circle4").style.display = "none";
        clearInterval(waitForData);
      }
    }, 100);
  }
  if (Array.isArray(window['shares_data']?.instruments) && window['shares_data']?.instruments.length > 0) {
    const countryInstruments5 = window['shares_data'].instruments.filter(item => item.tr_inst_country.includes(window['country'][0]));
    window['shares_names'] = countryInstruments5.length > 0 ? countryInstruments5 : window['shares_data'].instruments.filter(item => item.tr_inst_country.includes('Default'));
    window['shares_names'] = window['shares_names'].map(item => item.tr_inst_name);
    document.getElementById("lock-modal5").style.display = "block";
    document.getElementById("loading-circle5").style.display = "block";

    const waitForData = setInterval(() => {
      if (allInstruments?.length > 0) {
        window['tracked_shares'] = filterTableInstruments(allInstruments, window['shares_names']);
        createSwiperElement(window['tracked_shares'], 'shares');
        document.getElementById("lock-modal5").style.display = "none";
        document.getElementById("loading-circle5").style.display = "none";
        clearInterval(waitForData);
      }
    }, 100);
  }
});

function processUpdateTradeData(data) {
  updateInstruments(data.instruments);
}

function liveUpdateInst(input, update) {
  let foundInst = input.find(item => (item.instrument_id === update.instrument_id));

  if (foundInst) {
    foundInst.today_change = update.today_change;
    foundInst.last_quote.ask = update.last_quote.ask;
  } else {
    input.push(update);
  }
}

function updateInstruments(newData) {
  if (window['tracked_hotlist']?.length > 0) {    
    window['tracked_hotlist'].forEach(inst => {
      const data = newData.find(item => item.instrument_id === inst.instrument_id);
      
      if (data) {
        if ((data?.instrument_status === "ACTIVE") || (data?.instrument_status === "OK")) {
          liveUpdateInst(updatedInst, data);
        }
      }
    });    
  }
  if (window['tracked_currencies']?.length > 0) {    
    window['tracked_currencies'].forEach(inst => {
      const data = newData.find(item => item.instrument_id === inst.instrument_id);
      
      if (data) {
        if ((data?.instrument_status === "ACTIVE") || (data?.instrument_status === "OK")) {
          liveUpdateInst(updatedInst, data);
        }
      }
    });    
  }
  if (window['tracked_commodities']?.length > 0) {    
    window['tracked_commodities'].forEach(inst => {
      const data = newData.find(item => item.instrument_id === inst.instrument_id);
      
      if (data) {
        if ((data?.instrument_status === "ACTIVE") || (data?.instrument_status === "OK")) {
          liveUpdateInst(updatedInst, data);
        }
      }
    });    
  }
  if (window['tracked_indicies']?.length > 0) {    
    window['tracked_indicies'].forEach(inst => {
      const data = newData.find(item => item.instrument_id === inst.instrument_id);
      
      if (data) {
        if ((data?.instrument_status === "ACTIVE") || (data?.instrument_status === "OK")) {
          liveUpdateInst(updatedInst, data);
        }
      }
    });    
  }
  if (window['tracked_shares']?.length > 0) {    
    window['tracked_shares'].forEach(inst => {
      const data = newData.find(item => item.instrument_id === inst.instrument_id);
      
      if (data) {
        if ((data?.instrument_status === "ACTIVE") || (data?.instrument_status === "OK")) {
          liveUpdateInst(updatedInst, data);
        }
      }
    });    
  }
}

function updateInstrumentsBoxes(data) {
  data.forEach(item => {
    const askID = 'instLP' + item?.instrument_id;
    const changeID = 'instCH' + item?.instrument_id;
    const holderID = 'instH' + item?.instrument_id;

    const instAskPriceElements = document.getElementsByClassName(askID);
    const instChangePriceElements = document.getElementsByClassName(changeID);
    const instHolderElements = document.getElementsByClassName(holderID);

    if (instAskPriceElements.length > 0) {
      Array.from(instAskPriceElements).forEach(element => {
        element.textContent = item?.last_quote?.ask;
      });
    }

    if (instChangePriceElements.length > 0) {
      Array.from(instChangePriceElements).forEach(element => {
        element.classList.remove('instGreen', 'instRed');
        const todayChange = item?.today_change.toFixed(4) + '%';
        if (isPositiveFloat(item?.today_change)) {
          element.classList.add('instGreen');
        } else if (item?.today_change < 0) {
          element.classList.add('instRed');
        }
        element.textContent = todayChange;
      });
    }

    if (instHolderElements.length > 0) {
      Array.from(instHolderElements).forEach(element => {
        element.classList.remove('instGreen', 'instRed');
        if (isPositiveFloat(item?.today_change)) {
          element.classList.add('instGreen');
        } else if (item?.today_change < 0) {
          element.classList.add('instRed');
        }
      });
    }
  });
}

function filterTableInstruments(data, filter) {
  const filterItems = filter.map(item => normalize(item))
  const filteredData = data.filter(instrument => {
    const instrumentName = normalize(instrument.instrument_name)
    return filterItems.indexOf(instrumentName) >= 0
  })

  return filteredData
}

function createSwiperElement(data, cls) {
  const container = document.querySelector('.'+cls+'_h');
  if (!container) {
    console.error("Container element not found for class '."+ cls + "_h'.");
    return;
  }

  let initInstSlider = new Swiper('.'+cls+'_h', {
    navigation: {
      nextEl: '.'+cls+'-swiper-nav .'+cls+'-next',
      prevEl: '.'+cls+'-swiper-nav .'+cls+'-prev',
    },
    breakpoints: {
      0: {
        slidesPerView: 2.7,
        spaceBetween: 12,
      },
      390: {
        slidesPerView: 3,
        spaceBetween: 12,
      },
      412: {
        slidesPerView: 3.1,
        spaceBetween: 12,
      },
      430: {
        slidesPerView: 3.3,
        spaceBetween: 12,
      },
      768: {
        slidesPerView: 6.2,
        spaceBetween: 12,
      },
      980: {
        slidesPerView: 6.2,
        spaceBetween: 12,
      },
      1200: {
        slidesPerView: 7,
        spaceBetween: 24,
      }
    },
    loop: false,
    loopFillGroupWithBlank: false,
    loopedSlides: 1,  
    grabCursor: true,
    observer: true,
    observeParents: true,
  });

  data.forEach(item => {
    let inst_ico = '';

    if (item?.icon_url) {
      const imgUrl = 'https://' + asset_data.platform_url + '/images/instrument/icons/' + item?.icon_url?.slice(9);
      inst_ico = '<img src="' + imgUrl + '" alt="' + item.instrument_name + '" title="' + item.instrument_name + '" width="56" height="56" />';
    } else {
      inst_ico = '<img src="../wp-content/themes/klips/styles/images/default-icon.svg" alt="' + item.instrument_name + '" title="' + item.instrument_name + '" class="icoDefault" width="56" height="56" />';
    }

    let instClasse = '';
    let instChage = '';
    let instLastPrice = '';

    if (item?.instrument_status !== 'SUS') {
      if (item?.today_change) {
        if (isPositiveFloat(item?.today_change)) {
          instClasse = 'instGreen';
          instChage = item?.today_change.toFixed(4) + '%';
        } else if (item?.today_change === 0) {
          instClasse = '';
          instChage = item?.today_change + '%';          
        } else {
          instClasse = 'instRed';
          instChage = item?.today_change.toFixed(4) + '%';          
        }
      }
      if (item?.last_quote) {
        instLastPrice = item?.last_quote?.ask;
      }
    } else {
      instLastPrice = '-';
      instChage = '-';
    }

    initInstSlider.addSlide(1, '<div class="swiper-slide ' + instClasse + ' instH'+item?.instrument_id+'"><a href="single-instrument/?instrument=' + item.instrument_name + '"><span class="imgHolder">' + inst_ico + '</span><h3>' + item.instrument_name + '</h3><span class="lastPrice  instLP'+item?.instrument_id+'">' + instLastPrice + '</span><span class="todayChange ' + instClasse + ' instCH'+item?.instrument_id+'">' + instChage + '</span></a></div>');
  });
}

function initLearnSection() {
  new Swiper('.learn-section .blog-list', {
    pagination: {
      el: '.learn-section .blog-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.learn-section .trade-blog-next',
      prevEl: '.learn-section .trade-blog-prev',
    },
    breakpoints: {
      0: {
        slidesPerView: 1.2,
      },
      768: {
        slidesPerView: 2,
      },
      1200: {
        slidesPerView: 3,
      }
    },
    loop: true,
    loopFillGroupWithBlank: true,
    slidesPerView: 'auto',
    loopedSlides: 3,
    spaceBetween: 20,
    grabCursor: true,
  });
}

function initWhySection() {
  const emptyMeta = { el: null, start: null, end: null };

  const container = document.querySelector('.why-list');
  const containerHeight = container.clientHeight;
  const containerTopOffset = container.offsetTop;

  const textList = document.querySelectorAll('.why-text');

  let metaList = [];
  for (let idx = 0; idx < textList.length; idx++) {
    const el = textList.item(idx);
    const prevMeta = metaList[idx - 1];

    const start = idx === 0 ? containerTopOffset : prevMeta.end;
    const end =
      textList.length - 1 === idx
        ? containerTopOffset + containerHeight
        : start + el.clientHeight;

    metaList.push({ el, start, end });
  }  

  window.addEventListener('scroll', function (e) {
    const scroll = window.pageYOffset;

    for (let idx = 0; idx < metaList.length; idx++) {
      const isFirstElement = idx === 0;
      const isLastElement = idx === metaList.length - 1;
      const { el, start, end } = metaList[idx];

      const { el: prevEl } = metaList[idx - 1] || emptyMeta;

      const halfViewportHeight = window.innerHeight / 2;
      const beforeIn = start - halfViewportHeight;
      const beforeOut = end - halfViewportHeight;

      if (isFirstElement) {
        if (scroll < start) {
          el.style.opacity = 1;
          el.style.top = 0;
          el.classList.remove('sticky');
          continue;
        }
        if (scroll > beforeOut) {
          el.style.opacity = 0;
          // el.style.top = `${scroll - start}px`;
          el.classList.remove('sticky');
          continue;
        }
      } else if (isLastElement) {
        if (scroll < beforeIn) {
          el.style.opacity = 0;
          // el.style.top = 0;
          el.classList.remove('sticky');
          continue;
        }
        if (scroll >= start) {
          el.style.opacity = 1;
          // el.style.top = `${scroll - start}px`;
          el.classList.remove('sticky');
          continue;
        }
      } else {
        if (scroll < beforeIn) {
          // el.style.top = 0;
          el.style.opacity = 0;
          el.classList.remove('sticky');
          continue;
        }
        if (scroll > beforeOut) {
          // el.style.top = `${scroll - start}px`;
          el.style.opacity = 0;
          el.classList.remove('sticky');
          continue;
        }
      }

      // The viewport goes into the element
      if (scroll >= beforeIn) {
        el.style.opacity = 1;
        el.classList.add('sticky');
      }
    }
  });
}

function initMobileAnimations() {
  new Swiper('.animationsSwiper', {
    pagination: {
      el: '.animationsSwiper .anime-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.animationsSwiper .anime-next',
      prevEl: '.animationsSwiper .anime-prev',
    },
    loop: true,
    loopFillGroupWithBlank: false,
    slidesPerView: 'auto',
    loopedSlides: null,
    spaceBetween: 20,
    grabCursor: true,
  });
}

window.addEventListener('DOMContentLoaded', () => {
  // if (!isMobile()) initWhySection();

  initLearnSection();
  initMobileAnimations();

  const checkForInstrumentUpdate = setInterval(() => {
    if (JSON.stringify(latestInstrumentData) != JSON.stringify(updatedInst)) {
  
      latestInstrumentData = deepClone(updatedInst);
  
      updateInstrumentsBoxes(latestInstrumentData);      
    }
  }, 1000);

  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const clearSearchButton = document.getElementById('clearSearch');

  searchInput.addEventListener('input', function (event) {
    const searchTerm = event.target.value.toLowerCase();

    searchResults.innerHTML = '';

    const filteredResults = allInstruments.filter(function (item) {
      return item.instrument_name.toLowerCase().includes(searchTerm);
    });

    filteredResults.forEach(function (item) {
      let inst_ico = '';
      if (item?.icon_url) {        
        const imgUrl = 'https://' + asset_data.platform_url + '/images/instrument/icons/' + item?.icon_url?.slice(9);
        inst_ico = '<img src="' + imgUrl + '" alt="' + item.instrument_name + '" title="' + item.instrument_name + '"  width="40" height="40" />';
      } else {
        inst_ico = '<img src="../wp-content/themes/klips/styles/images/default-icon.svg" alt="' + item.instrument_name + '" title="' + item.instrument_name + '" class="icoDefault" width="40" height="40" />';
      }
      const link = document.createElement('a');
      link.href = '/single-instrument/?instrument=' + item.instrument_name;
      link.innerHTML = inst_ico+''+item?.instrument_name+'<span>'+item?.unit_name+'</span>';
      searchResults.appendChild(link);
    });

    searchResults.style.display = filteredResults.length > 0 ? 'flex' : 'none';
    clearSearchButton.style.display = searchTerm.length > 0 ? 'block' : 'none';

    clearSearchButton.addEventListener('click', function () {
      searchInput.value = '';
      searchResults.innerHTML = '';
      searchResults.style.display = 'none';
      clearSearchButton.style.display = 'none';
    });
  });
});