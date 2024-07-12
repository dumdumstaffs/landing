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
window['tracked_win_loose'] = [];
window['tracked_forex'] = [];

window.addEventListener('DOMContentLoaded', () => {
  if (Array.isArray(window['hotlist_data']?.instruments) && window['hotlist_data']?.instruments.length > 0) {
    // window['hotlist_names'] = window['hotlist_data'].instruments.filter(item => item.hot_list_country.includes(window['country'][0])).map(item => item.instrument);
    const countryInstruments = window['hotlist_data'].instruments.filter(item => item.hot_list_country.includes(window['country'][0]));
    window['hotlist_names'] = countryInstruments.length > 0 ? countryInstruments : window['hotlist_data'].instruments.filter(item => item.hot_list_country.includes('Default'));
    window['hotlist_names'] = window['hotlist_names'].map(item => item.instrument);
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
  if (Array.isArray(window['win_loose_data']?.instruments) && window['win_loose_data']?.instruments.length > 0) {
    document.getElementById("lock-modal2").style.display = "block";
    document.getElementById("loading-circle2").style.display = "block";
    cryptoInstruments();
  }
  if (Array.isArray(window['forex_data']?.instruments) && window['forex_data']?.instruments.length > 0) {  
    // window['forex_names'] = window['forex_data'].instruments.filter(item => item.forex_country.includes(window['country'][0])).map(item => item.forex_instrument);
    const countryInstruments2 = window['forex_data'].instruments.filter(item => item.forex_country.includes(window['country'][0]));
    window['forex_names'] = countryInstruments2.length > 0 ? countryInstruments2 : window['forex_data'].instruments.filter(item => item.forex_country.includes('Default'));
    window['forex_names'] = window['forex_names'].map(item => item.forex_instrument);
    document.getElementById("lock-modal3").style.display = "block";
    document.getElementById("loading-circle3").style.display = "block";

    const waitForData = setInterval(() => {
      if (allInstruments?.length > 0) {
        window['tracked_forex'] = filterTableInstruments(allInstruments, window['forex_names']);
        createSwiperElement(window['tracked_forex'], 'forex');
        document.getElementById("lock-modal3").style.display = "none";
        document.getElementById("loading-circle3").style.display = "none";
        clearInterval(waitForData);
      }
    }, 100);
  }
});

function cryptoInstruments() {

  fetch(includePath.url2, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'type=initial'
  })
  .then(response => {
    return response.json().then(data => {
      if (!response.ok) {
        throw data;
      }
      return data;
    });
  })
  .then(data => {
    if (data.error) {
      switch (data.error) {
        case 'TYPE_MISSING':
          console.log("Type not specified");
          break;
        case 'TYPE_WRONG':
          console.log("Invalid type specified");
          break;
        case 'NOT_FOUND':
          console.log("Not found");
          break;
        case 'BAD_REQUEST':
          console.log("Bad request");
          break;  
        case 'SERVER_ERROR':
          console.log("Server error");
          break;  
          
        default:
          console.log("An unknown error occurred: " + data.error);
          break;
      }
    } else {

      if (Array.isArray(window['win_loose_data']?.instruments) && window['win_loose_data']?.instruments.length > 0) {

        const countryInstruments = window['win_loose_data'].instruments.filter(item => item.w_l_country.includes(window['country'][0]));
        window['win_loose_names'] = countryInstruments.length > 0 ? countryInstruments : window['win_loose_data'].instruments.filter(item => item.w_l_country.includes('Default'));
        window['win_loose_names'] = window['win_loose_names'].map(item => item.w_l_instrument);

        const waitForData = setInterval(() => {

          if (Array.isArray(window['win_loose_names']) && window['win_loose_names'].length > 0) {
            window['tracked_win_loose'] = filterCryptoInstruments(data, window['win_loose_names']);
          }
          createSwiperCryptoElement(window['tracked_win_loose'], 'win_loose');
          document.getElementById("lock-modal2").style.display = "none";
          document.getElementById("loading-circle2").style.display = "none";
          clearInterval(waitForData);
        }, 100);

      }

      if (window['win_loose_data']?.instruments.length > 0) {
        fetchLiveData(0, 100);
      }
    }
  })
  .catch((error) => {
    if (error && error.message) {
      console.error("Error fetching API':", error.message);
    } else {
      console.error("Error fetching API':", error);
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
function filterCryptoInstruments(data, filter) {
  if (!data || !data.data || !Array.isArray(filter)) {
    return [];
  }
  const filterItems = filter.map(item => normalize(item))
  const filteredData = data.data.filter(instrument => {
    const instrumentName = normalize(instrument.shortName)
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
      428: {
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
      const imgUrl = 'https://' + instruments_data.platform_url + '/images/instrument/icons/' + item?.icon_url?.slice(9);
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

const currencySymbols = {
  'USD': '$',
  'EUR': '€',
  'ZAR': 'R',
  'PLN': 'Zl',
  'CZK': 'Kč'
};

function createSwiperCryptoElement(data, cls) {
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
      428: {
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

    if (item?.shortName) {
      const imgUrl = '../wp-content/themes/klips/styles/icons/crypto/' + item?.shortName?.toLowerCase() +'.svg';
      inst_ico = '<img src="' + imgUrl + '" alt="' + item?.fullName + '" title="' + item?.fullName + '" width="56" height="56" />';
    } else {
      inst_ico = '<img src="../wp-content/themes/klips/styles/images/default-icon.svg" alt="' + item?.fullName + '" title="' + item?.fullName + '" class="icoDefault" width="56" height="56" />';
    }

    let instClasse = '';
    let instChage = '';
    let instLastPrice = '';
    let graphColor = '';

    let symbol = currencySymbols[includePath.currency];
    
    if (item?.priceChangePercentage24h) {
      if (isPositiveFloat(item?.priceChangePercentage24h)) {
        instClasse = 'instGreen';
        instChage = item?.priceChangePercentage24h.toFixed(4) + '%';
        instLastPrice = symbol + item?.price;
        graphColor = 'green';
      } else if (item?.priceChangePercentage24h === 0) {
        instClasse = '';
        instChage = item?.priceChangePercentage24h + '%';
        instLastPrice = symbol + item?.price;
        graphColor = 'grey';
      } else {
        instClasse = 'instRed';
        instChage = item?.priceChangePercentage24h.toFixed(4) + '%';
        instLastPrice = symbol + item?.price;
        graphColor = 'red';
      }
    }

    initInstSlider.addSlide(1, '<div class="swiper-slide ' + instClasse + ' instH'+item?.shortName+'"><a href="crypto-instrument/?instrument='+item?.shortName+'"><span class="imgHolder">' + inst_ico + '</span><h3>' + item?.fullName+ '</h3><span class="lastPrice  instLP'+item?.shortName+'">' + instLastPrice + '</span><span class="todayChange ' + instClasse + ' instCH'+item?.shortName+'">' + instChage + '</span></a></div>');
  });
}

function fetchLiveData(counter, maxIntervals) {
  if (counter >= maxIntervals) return;

  fetch(includePath.url2, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'type=live'
  })
  .then(response => {
    return response.json().then(data => {
      if (!response.ok) {
        throw data;
      }
      return data;
    });
  })
  .then(liveData => {
    if (liveData.error) {
      switch (liveData.error) {
        case 'TYPE_MISSING':
          console.log("Type not specified");
          break;
        case 'TYPE_WRONG':
          console.log("Invalid type specified");
          break;
        case 'NOT_FOUND':
          console.log("Not found");
          break;
        case 'BAD_REQUEST':
          console.log("Bad request");
          break;  
        case 'SERVER_ERROR':
          console.log("Server error");
          break;  
          
        default:
          console.log("An unknown error occurred: " + data.error);
          break;
      }
    } else {
      if (liveData.success && liveData.data && Array.isArray(liveData.data)) {
        const rates = liveData.data;
        let symbol = currencySymbols[includePath.currency];

        if (Array.isArray(window['tracked_win_loose']) && window['tracked_win_loose'].length > 0) {
          window['tracked_win_loose'].forEach(instrument => {
            const rateObj = rates.find(rate => rate.shortName === instrument.shortName);
            
            if (rateObj) {
              const elementsLPToUpdate = document.querySelectorAll(`.instLP${instrument.shortName}`);
              
              elementsLPToUpdate.forEach(element => {
                element.textContent = symbol + rateObj?.price;
              });

              const elementsCHToUpdate = document.querySelectorAll(`.instCH${instrument.shortName}`);
              
              elementsCHToUpdate.forEach(element => {
                element.textContent = rateObj?.priceChangePercentage24h.toFixed(4) + '%';
              });
            }
          });
        }
      }
    }

    counter++;
    setTimeout(fetchLiveData, 60000);
  })
  .catch(error => {
    if (error && error.message) {
      console.error("Error fetching live data:", error.message);
    } else {
      console.error("Error fetching live data:", error);
    }
    counter++;
    if (counter >= maxIntervals) return;
    setTimeout(fetchLiveData(counter, 10), 1000);
  });
}

let initLearnSection = new Swiper('.learn-section .blog-list', {
  pagination: {
    el: '.learn-section .blog-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.cards-blog-next',
    prevEl: '.cards-blog-prev',
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
  loop: false,
  loopFillGroupWithBlank: false,
  slidesPerView: 'auto',
  loopedSlides: 3,
  spaceBetween: 20,
  grabCursor: true,
  observer: true,
  observeParents: true
});

function initTabsSection() {
  new Swiper('.switchCategoriesMobile', {
    slidesPerView: 'auto',
    spaceBetween: 20,
  });
}

let initMobileAnimations = new Swiper('.animationsSwiper', {
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
  observer: true,
  observeParents: true,
});

if (mobile.matches) {
  let initWhySlider = new Swiper('.why-list', {
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 5,
      },
      390: {
        slidesPerView: 1,
        spaceBetween: 5,
      },
      412: {
        slidesPerView: 1,
        spaceBetween: 5,
      },
      428: {
        slidesPerView: 1,
        spaceBetween: 5,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 30,        
      },
      1200: {
        slidesPerView: 3,
        spaceBetween: 37,
      }
    },
    autoplay: {
      delay: 4000,
    },
    loop: true,
    loopFillGroupWithBlank: false,
    loopedSlides: 1,  
    grabCursor: true,
    observer: true,
    observeParents: true,
  });
} else {
  let initWhySlider = new Swiper('.why-list', {
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 5,
      },
      390: {
        slidesPerView: 1,
        spaceBetween: 5,
      },
      412: {
        slidesPerView: 1,
        spaceBetween: 5,
      },
      428: {
        slidesPerView: 1,
        spaceBetween: 5,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
      1200: {
        slidesPerView: 3,
        spaceBetween: 37,        
      }
    },
    loop: false,
    loopFillGroupWithBlank: false,
    loopedSlides: 1,  
    grabCursor: true,
    observer: true,
    observeParents: true,
  });
}

const playerContainers = document.querySelectorAll(".animation_h");
playerContainers.forEach(container => {
  container.addEventListener("mouseover", () => {
    const player = container.querySelector("lottie-player");
    player.setDirection(1);
    player.play();
  });

  container.addEventListener("mouseleave", () => {
    const player = container.querySelector("lottie-player");
    player.setDirection(-1);
    player.play();
  });
});

function clearBtnFunc() {
  const clearBtn = document.getElementById("clearSearchBtn");
  const searchInput = document.getElementById("searchTopics");
  let cat_slug = document.querySelector('.cat-list_item.active').dataset.slug;
  clearBtn.addEventListener("click", () => {
    jQuery.ajax({
      type: "POST",
      url: "/wp-admin/admin-ajax.php",
      dataType: "json",
      data: { 
        action: "filter_search_learn_posts", 
        search: '',
        category: cat_slug,
        page: 'home',
      },
      success: function (res) {
        clearBtn.style.display = 'none';
        searchInput.value = '';
        initLearnSection.removeAllSlides();
        jQuery('.blog-list .swiper-wrapper').html(res.html2); 
        initLearnSection;
        initLearnSection.update();    
      },
      error: function () {
        clearBtn.style.display = 'none';
      }
    });
  });
}

if (!window['learnSection']?.active) {
jQuery(function() {
  jQuery('body').on('click', '.cat-list_item', function(e) {
    e.preventDefault();
    jQuery('.cat-list_item').removeClass('active');
    jQuery(this).addClass('active');
    let cat_slug = document.querySelector('.cat-list_item.active').dataset.slug;

    jQuery.ajax({
      type: 'POST',
      url: '/wp-admin/admin-ajax.php',
      dataType: 'json',
      data: {
        action: 'filter_learn_posts',
        category: cat_slug,
        page: 'home',
      },
      success: function(res) {
        initLearnSection.removeAllSlides();
        jQuery('.blog-list .swiper-wrapper').html(res.html2);
        initLearnSection.slideTo(1, 1, false)
        initLearnSection.slidePrev(1, false)
        initLearnSection.init();        
      }
    });
  });

  jQuery('#searchTopics').on("keyup", 
    debounce(function () {
      let searchInput = jQuery(this).val();
      let cat_slug = '';
      const clearBtn = document.getElementById("clearSearchBtn");
      jQuery("a.cat-list_item").each(function() {
        if (jQuery(this).hasClass('active')) {
          cat_slug = jQuery(this).data('slug')
        } else {
          cat_slug = 'learn';
        }
      });

      jQuery.ajax({
        type: "POST",
        url: "/wp-admin/admin-ajax.php",
        dataType: "json",
        data: { 
          action: "filter_search_learn_posts", 
          search: searchInput,
          category: cat_slug,
          page: 'home',
        },
        success: function (res) {
          if (searchInput == '') {
            clearBtn.style.display = 'none';
            initLearnSection.removeAllSlides();
            jQuery('.blog-list .swiper-wrapper').html(res.html2); 
            initLearnSection;
            initLearnSection.update();
          } else {            
            clearBtn.style.display = 'block';
            initLearnSection.removeAllSlides();
            jQuery('.blog-list .swiper-wrapper').html(res.html2); 
            initLearnSection;
            initLearnSection.update();
            clearBtnFunc();
          }  
        },
        error: function (response) {
          clearBtn.style.display = 'block';
          clearBtnFunc();
        }
      });
    }, 500)
  );
});
}

function processUpdateHomeData(data) {
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
  if (window['tracked_forex']?.length > 0) {    
    window['tracked_forex'].forEach(inst => {
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

//Simple start section
const tabs = document.querySelectorAll('.etab');
const displayedImages = document.querySelectorAll('.events-left img');
const imageContainer = document.querySelector('.image-container');
const imageWidth = displayedImages[0].offsetWidth;
let currentIndex = 0;
let rotationInterval;

function showImage(index) {
  const containerWidth = document.querySelector('.events-left').offsetWidth;
  const translateX = -index * containerWidth;
  imageContainer.style.transform = `translateX(${translateX}px)`;

  displayedImages.forEach((image, i) => {
    if (i === index) {
      image.style.opacity = '1';
      image.style.visibility = 'visible';
    } else {
      image.style.opacity = '0';
      image.style.visibility = 'hidden';
    }
  });

  tabs.forEach((tab, i) => {
    if (i === index) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
}

function rotateTabs() {
  currentIndex = (currentIndex + 1) % tabs.length;
  showImage(currentIndex);
}

function startRotation() {
  rotationInterval = setInterval(rotateTabs, 3000);
}

function stopRotation() {
  clearInterval(rotationInterval);
}

const initializeTabs = () => {

  showImage(currentIndex);

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      currentIndex = index;
      showImage(currentIndex);
      stopRotation();
      startRotation();
    });
  });

  startRotation();
}

let initSimpleSlider = new Swiper('.mobile-events-list', {
  navigation: {
    nextEl: '.events-swiper-nav .events-next',
    prevEl: '.events-swiper-nav .events-prev',
  },
  autoplay: false,
  slidesPerView: 1,
  spaceBetween: 0,
  loop: true,
  loopFillGroupWithBlank: false,
  loopedSlides: 1,  
  grabCursor: true,
  observer: true,
  observeParents: true,
});

window.onload = function() {
  document.cookie = `authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${includePath.platform.slice(-9)}; secure; samesite=strict; path=/;`;
}

window.addEventListener('DOMContentLoaded', () => {
  
  if (mobile.matches) {    
    new IntersectionObserver((entries, observer) => {
      if (entries[0].isIntersecting) {
        observer.disconnect();
        initSimpleSlider.autoplay.start(); 
      }
    }).observe(document.querySelector('.mobile-events-list'));
  } else {
    new IntersectionObserver((entries, observer) => {
      if (entries[0].isIntersecting) {
        observer.disconnect();
        // swiper.autoplay.start();
        initializeTabs(); 
      }
    }).observe(document.querySelector('.events-section')); 
  }

  if (!window['learnSection']?.active) {
    initLearnSection;  

    if (mobile.matches) {
      initTabsSection();
    }
    
    document.getElementById('searchTopics').addEventListener('input', (e) => {
      if (!e.currentTarget.value.length) {
        initLearnSection;
      }
    });
  }
  if (!window['enjoySection']?.active) {
    if (mobile.matches) {
      initMobileAnimations;
    }
  }

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
        const imgUrl = 'https://' + instruments_data.platform_url + '/images/instrument/icons/' + item?.icon_url?.slice(9);
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
  });

  clearSearchButton.addEventListener('click', function () {
    searchInput.value = '';
    searchResults.innerHTML = '';
    searchResults.style.display = 'none';
    clearSearchButton.style.display = 'none';
  });

  const classRegSection = document.getElementsByClassName('userRegistration-section').length > 0;

  if (classRegSection) {
  
    let device = 'web-';
    if (mobile.matches || tablet.matches) {
      device = device+'mob-';
    } else {
      device = device+'desk-';
    }
    document.getElementById('userReg_fingerprint').value = device;

    const form = document.getElementById('userRegistrationHome');
    document.getElementById('userReg_nonce').value = window['my_form_data']?.nonce;

    const emailInput = document.getElementById('userReg_email');
    const emailErrorSpan = document.getElementById('emailError');
    const passInput = document.getElementById('userReg_pass');
    const passErrorSpan = document.getElementById('passwordError');
    const chkInput = document.getElementById('userReg_chk');
    const chkErrorSpan = document.getElementById('checkboxError');
    const submitButton = document.getElementById('userReg_submit');
    const chkFname = document.getElementById('userReg_fname').value;
    const chkLname = document.getElementById('userReg_lname').value;
    const generalErrorSpan = document.getElementById('generalError');
    
    const isValidEmail = (email) => {
      const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return re.test(String(email).toLowerCase());
    };

    emailInput.addEventListener('input', function() {
      if (!isValidEmail(this.value)) {
        emailErrorSpan.innerText = 'Invalid email format.';
        emailErrorSpan.classList.add("hasError");
        this.classList.add("hasError");
        submitButton.disabled = true;
      } else {
        emailErrorSpan.innerText = '';
        emailErrorSpan.classList.remove("hasError");
        this.classList.remove("hasError");
        submitButton.disabled = false;
      }
    });

    passInput.addEventListener('input', function() {
      let chkPass = checkPasswordValidation(this.value);
      if (chkPass == null) {
        passErrorSpan.innerText = '';
        passErrorSpan.classList.remove("hasError");
        this.classList.remove("hasError");
        submitButton.disabled = false;        
      } else {
        passErrorSpan.innerText = chkPass;
        passErrorSpan.classList.add("hasError");
        this.classList.add("hasError");
        submitButton.disabled = true;
      }
    });

    chkInput.addEventListener("change", function() {
      if (chkInput.checked) {
        chkErrorSpan.innerText = '';
        chkErrorSpan.classList.remove("hasError");      
        submitButton.disabled = false;
      } else {
        chkErrorSpan.innerText = 'You have to agree with our Privacy Policy.';
        chkErrorSpan.classList.add("hasError");        
        submitButton.disabled = true;
      }
    })

    form.addEventListener('submit', function(event) {
      event.preventDefault();

      if (chkFname || chkLname) {
        generalErrorSpan.innerText = 'Form submission detected as spam.';
        generalErrorSpan.classList.add("hasError");
        submitButton.disabled = true;
        return;
      } else {
        generalErrorSpan.innerText = '';
        generalErrorSpan.classList.remove("hasError");
        submitButton.disabled = false;
      }

      if (!chkInput.checked) {
        chkErrorSpan.innerText = 'You have to agree with our Privacy Policy.';
        submitButton.disabled = true;
        return;
      } 

      const formData = new FormData(form);
      
      fetch(includePath.url, {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          switch (data.error) {
            case 'UNKNOW_ERROR':
              document.getElementById('generalError').innerText = "Registration is currently unavailable, please try again later or contact support.";
              document.getElementById('generalError').classList.add("hasError"); 
              break;
            case 'VALID_EMAIL':
              document.getElementById('generalError').innerText = "Please provide a valid email.";
              document.getElementById('generalError').classList.add("hasError"); 
              break;  
            case 'cURL_Error':
              document.getElementById('generalError').innerText = "Connection problem.";
              document.getElementById('generalError').classList.add("hasError"); 
              break;
            case 'ACF_MUST_BE_SET':
              document.getElementById('generalError').innerText = "Configuration problem.";
              document.getElementById('generalError').classList.add("hasError"); 
              break;
            case 'MISSING_ACF_DATA':
              document.getElementById('generalError').innerText = "Configuration problem.";
              document.getElementById('generalError').classList.add("hasError"); 
              break;              
            case 'EMAIL_REQUIRED':
              document.getElementById('emailError').innerText = "Email is required.";
              document.getElementById('emailError').classList.add("hasError"); 
              break;
            case 'PASSWORD_REQUIRED':
              document.getElementById('passwordError').innerText = "Password is required.";
              document.getElementById('passwordError').classList.add("hasError"); 
              break;  
            case 'INVALID_EMAIL':
              document.getElementById('emailError').innerText = "Please enter a valid email.";
              document.getElementById('emailError').classList.add("hasError"); 
              break;
            case 'USER_EXISTS':
              document.getElementById('emailError').innerText = "Email already exists.";
              document.getElementById('emailError').classList.add("hasError"); 
              break;
            case 'FORM_SPAM':
              document.getElementById('generalError').innerText = "Form submission detected as spam.";
              document.getElementById('generalError').classList.add("hasError"); 
              break;  
            default:
              console.log("An unknown error occurred: " + data.error);
              document.getElementById('generalError').innerText = "Registration is currently unavailable, please try again later or contact support.";
              document.getElementById('generalError').classList.add("hasError"); 
          }
        } else {
          let utmSourceGTM = '';
          let utmCampaignGTM = '';
          let utmMediumGTM = '';
          let utmAdsetIdGTM = '';
          let utmAdIdGTM = '';
          let utmTermGTM = '';
          let utmFullPath = '';

          // localStorage.setItem('TPW.USER', JSON.stringify(data.full_trader_data));
          // localStorage.setItem('TPW.AUTH', data.token);
          // localStorage.setItem('socketCluster.CRM', data.token);
          // localStorage.setItem('socketCluster.CORE', data.token);
          document.cookie = `authToken=${data.token}; domain=${includePath.platform.slice(-9)}; secure; samesite=strict; path=/;`;
          // if (localStorage.getItem('TPW.USER') && localStorage.getItem('TPW.AUTH')) {

            if (sessionStorage.getItem('utm_source') !== 'undefined' && sessionStorage.getItem('utm_source') !== null) {
              utmSourceGTM = sessionStorage.getItem('utm_source');
              utmFullPath += 'utm_source='+utmSourceGTM+'&';
            }
            if (sessionStorage.getItem('utm_medium') !== 'undefined' && sessionStorage.getItem('utm_medium') !== null) {
              utmMediumGTM = sessionStorage.getItem('utm_medium');
              utmFullPath += 'utm_medium='+utmMediumGTM+'&';
            }
            if (sessionStorage.getItem('utm_campaign') !== 'undefined' && sessionStorage.getItem('utm_campaign') !== null) {
              utmCampaignGTM = sessionStorage.getItem('utm_campaign');
              utmFullPath += 'utm_campaign='+utmCampaignGTM+'&';
            }
            if (sessionStorage.getItem('utm_ad_id') !== 'undefined' && sessionStorage.getItem('utm_ad_id') !== null) {
              utmAdIdGTM = sessionStorage.getItem('utm_ad_id');
              utmFullPath += 'utm_ad_id='+utmAdIdGTM+'&';
            }
            if (sessionStorage.getItem('utm_adset_id') !== 'undefined' && sessionStorage.getItem('utm_adset_id') !== null) {
              utmAdsetIdGTM = sessionStorage.getItem('utm_adset_id');
              utmFullPath += 'utm_adset_id='+utmAdsetIdGTM+'&';
            }
            if (sessionStorage.getItem('utm_term') !== 'undefined' && sessionStorage.getItem('utm_term') !== null) {
              utmTermGTM = sessionStorage.getItem('utm_term');
              utmFullPath += 'utm_term='+utmTermGTM+'&';
            }

            window.dataLayer = window.dataLayer || [];

            window.dataLayer.push({
              "event": "Registration_Success",
              "user_state": "REGISTERED",
              "user_id": data.full_trader_data.id,
              "active_demo": false,
              "account_type": "CFD_Real",
              "onboarding_step": "REGISTERED",
              "equity": null,
              "balance": null,
              "currency": null,
              "open_positions_count": 0,
              "pnl": null,
              "in_margin_call": false,
              "event_origin": "MARKETING_WEBSITE",
              "screen_class": "",
              "screen_id": "REGISTRATION_FORM",
              "is_test": null,
              "regulation_name": null,
              "context": "CFD",
              "screen": "REGISTRATION"
            });

            window.location.href = 'https://'+instruments_data.platform_url+'?'+utmFullPath;
          // }
        }
      })
      .catch((error) => {
        document.getElementById('generalError').innerText = "Registration is currently unavailable, please try again later or contact support.";
        document.getElementById('generalError').classList.add("hasError"); 
        console.error('Error: API');
      });
    });
  }
});