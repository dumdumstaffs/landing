let tableDataTicks = 0;
let allInstruments;
let categories;
let updatedInst = [];
let latestInstrumentData = [];
let allIds = [];
const translationsMap = {
  'pl_PL': {
    'Popular': 'Najpopularniejsze',
    'Forex': 'Waluty',
    'Currencies': 'Waluty',
    'Shares': 'Akcje',
    'Stocks': 'Akcje',
    'Commodities': 'Towary',
    'Indices': 'Indeksy',
    'Crypto': 'Krypto',
    'MOST POPULAR': 'NAJPOPULARNIEJSZE',
  },
  'cs_CZ': {
    'Popular': 'Oblíbené',
    'Forex': 'Měny',
    'Currencies': 'Měny',
    'Shares': 'Aukcie',
    'Stocks': 'Aukcie',
    'Commodities': 'Komodity',
    'Indices': 'Indexy',
    'Crypto': 'Kryptoměny',
    'MOST POPULAR': 'NEJPOPULÁRNĚJŠÍ',
  },
  'sk_SK': {
    'Popular': 'Obľúbené',
    'Forex': 'Meny',
    'Currencies': 'Meny',
    'Shares': 'Akcie',
    'Stocks': 'Akcie',
    'Commodities': 'Komodity',
    'Indices': 'Indexy',
    'Crypto': 'Kryptomeny',
    'MOST POPULAR': 'NAJPOPULÁRNEJŠIE',
  }
};
  
function translate(word, lang) {
  const langTranslations = translationsMap[lang];
  if (langTranslations && langTranslations[word]) {
    return langTranslations[word];
  }
  return word;
}

if (sessionStorage.getItem('all_instruments') && sessionStorage.getItem('categories')) {
  allInstruments = JSON.parse(sessionStorage.getItem('all_instruments'));
  categories = JSON.parse(sessionStorage.getItem('categories'));
  allIds = JSON.parse(sessionStorage.getItem('all_ids'));
} else {
  const waitForSocketData = setInterval(() => {
    if (sessionStorage.getItem('all_instruments') && sessionStorage.getItem('categories')) {
      allInstruments = JSON.parse(sessionStorage.getItem('all_instruments'));
      categories = JSON.parse(sessionStorage.getItem('categories'));
      clearInterval(waitForSocketData);
    }
  }, 100);
}

const waitForTableData = setInterval(() => {
  tableDataTicks++;
  document.getElementById("lock-modal2").style.display = "block";
  document.getElementById("loading-circle2").style.display = "block";
  if (allInstruments?.length) {
    if (categories.length) {
      clearInterval(waitForTableData);

      const firstLevelCategories = extractCategories(categories);

      if (firstLevelCategories?.length) {
        
        if (mobile.matches || tablet.matches) {
          let initICatSlider = new Swiper('.catSlider', {
            breakpoints: {
              0: {
                slidesPerView: 'auto',
                spaceBetween: 2,
              },
              390: {
                slidesPerView: 'auto',
                spaceBetween: 10,
              },
              412: {
                slidesPerView: 'auto',
                spaceBetween: 17,
              },
              428: {
                slidesPerView: 'auto',
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 'auto',
                spaceBetween: 32,
              },
              1024: {
                slidesPerView: 'auto',
                spaceBetween: 48,
              }
            },
            loop: false,
            loopFillGroupWithBlank: false,
            loopedSlides: 1,  
            grabCursor: true,
            observer: true,
            observeParents: true
          });

          firstLevelCategories.forEach((item, i) => {
            const iconN = 'ico'+item;

            if (i === 0) {
              initICatSlider.addSlide(1, '<div class="swiper-slide '+iconN +' active" data-category="main'+item+'">'+item+'</div>');
            } else {
              initICatSlider.addSlide(1, '<div class="swiper-slide '+iconN +'" data-category="main'+item+'">'+item+'</div>');
            }
          });
        } else {
          const holder = document.getElementById('instCat');
          const fragment = document.createDocumentFragment();

          firstLevelCategories.forEach((item, i) => {
            const iconN = 'ico'+item;
            const new_el = document.createElement('span');
            new_el.classList.toggle('catButton', true);
            new_el.classList.toggle(iconN, true);
            new_el.classList.toggle('active', i === 0);
            new_el.dataset.category = 'main' + item;
            new_el.innerHTML = translate(item, instruments_data.lang);
            
            fragment.appendChild(new_el);
          });
          
          holder.appendChild(fragment);
        }
      }
      createElementForFirstLevelCategory(categories, 'Popular');
      document.getElementById("lock-modal2").style.display = "none";
      document.getElementById("loading-circle2").style.display = "none";

      loadSecondAndThirdLevelCategories(categories);

    }
  }
  
  if (tableDataTicks === 400) {
    clearInterval(waitForTableData);
    alert('No data available for the moment, try after a few seconds!');
  }
}, 100);

function createElementForFirstLevelCategory(categories, firstLevelCategoryName) {
  const holder = document.getElementById('categoriesHolder');
  if (!holder) {
    console.error("The 'categoriesHolder' element is not found.");
    return;
  }

  const firstLevelCategory = categories.find(category => category.name === firstLevelCategoryName);

  if (firstLevelCategory && Array.isArray(firstLevelCategory.children)) {
    let catHolder = document.createElement("div");
    catHolder.id = 'main' + firstLevelCategory.name + 'Holder';
    catHolder.className = 'allCats active';
    holder.append(catHolder);

    firstLevelCategory.children.forEach(secondLevelCategory => {
      if (secondLevelCategory.asset_ids && Array.isArray(secondLevelCategory.asset_ids)) {
        window['all_inst_popular_sub'] = [];
        let new_div = document.createElement("div");
        new_div.className = 'swiper inst-list-pp' + secondLevelCategory.name;
        new_div.innerHTML = '<div class="headSec"><h4>'+translate('MOST POPULAR', instruments_data.lang)+' <span>' + translate(secondLevelCategory.name, instruments_data.lang) + '<span></h4><div class="pp' + secondLevelCategory.name + '-swiper-nav swnav"><div class="pp' + secondLevelCategory.name + '-prev"><</div><div class="pp' + secondLevelCategory.name + '-next">></div></div></div><div class="swiper-wrapper"></div>';
        catHolder.append(new_div);
        window['all_inst_popular_sub'] = allInstruments.filter(obj => secondLevelCategory.asset_ids.includes(obj.instrument_id));

        createSwiperElement(window['all_inst_popular_sub'], secondLevelCategory.name);
      }
    });
  }
}

function extractCategories(obj) {
  const categories = [];

  obj.forEach(item => {
    if (item.name) {
      categories.push(item.name);
    }
  });

  return categories;
}

function createElementForSecondAndThirdLevelCategory(categories, firstLevelCategoryName) {
  return new Promise((resolve, reject) => {
    const holder = document.getElementById('categoriesHolder');
    const firstLevelCategory = categories.find(category => category.name === firstLevelCategoryName);

    if (!firstLevelCategory || !Array.isArray(firstLevelCategory.children)) {
      reject(new Error(`First level category "${firstLevelCategoryName}" not found or has no children.`));
      return;
    }

    const catHolder = document.createElement("div");
    catHolder.id = 'main' + firstLevelCategory.name + 'Holder';
    catHolder.className = 'allCats';
    holder.append(catHolder);

    for (const secondLevelCategory of firstLevelCategory.children) {
      if (Array.isArray(secondLevelCategory.asset_ids)) {
        window['all_inst_current_cat_sub'] = [];
        const new_div = document.createElement("div");
        const listClassName = firstLevelCategory.name.toLowerCase().slice(0, 2)+secondLevelCategory.name.slice(0, 3);
        new_div.className = 'swiper inst-list-'+listClassName;
        new_div.innerHTML = `<div class="headSec"><h4>${secondLevelCategory.name} <span>${firstLevelCategory.name}<span></h4><div class="${listClassName}-swiper-nav swnav"><div class="${listClassName}-prev"><</div><div class="${listClassName}-next">></div></div></div><div class="swiper-wrapper"></div>`;

        window['all_inst_current_cat_sub'] = allInstruments.filter(obj => secondLevelCategory.asset_ids.includes(obj.instrument_id));
        if (window['all_inst_current_cat_sub'].length) {
          catHolder.append(new_div);
          createSwiperElement(window['all_inst_current_cat_sub'], secondLevelCategory.name.slice(0, 3), firstLevelCategory.name.toLowerCase().slice(0, 2));
        } else {
          new_div.remove();
        }
      }

      if (Array.isArray(secondLevelCategory.children)) {
        const subCatHolder = document.createElement("div");
        subCatHolder.id = 'sub' + secondLevelCategory.name + 'Holder';
        subCatHolder.className = 'allSubCats';        
        catHolder.append(subCatHolder);

        const subTitle = document.createElement("div");
        subTitle.className = 'headSec2';
        subCatHolder.append(subTitle);

        const new_filter = document.createElement("div");
        new_filter.className = 'subFilter';
        subCatHolder.append(new_filter);

        let ii = 0;
        let iii = 0;
        for (const thirdLevelCategory of secondLevelCategory.children) {
          const fortLvlAssetIDs = [];

          if (Array.isArray(thirdLevelCategory.asset_ids)) {
            window['all_inst_current_cat_sub_sub'] = [];
            const new_filter_el = document.createElement("span");
            new_filter_el.className = ii === 0 ? 'subFilterEl subActive' : 'subFilterEl';
            new_filter_el.dataset.filter = 'subf'+secondLevelCategory.name.toLowerCase().slice(0, 2)+thirdLevelCategory.name.slice(0, 3);
            new_filter_el.innerHTML = thirdLevelCategory.name;

            const new_div = document.createElement("div");
            const listClassName = secondLevelCategory.name.toLowerCase().slice(0, 2)+thirdLevelCategory.name.slice(0, 3);
            new_div.className = ii === 0 ? 'swiper subActive inst-list-'+listClassName : 'swiper inst-list-'+listClassName;
            new_div.innerHTML = `<div class="headSec"><div class="${listClassName}-swiper-nav swnav"><div class="${listClassName}-prev"><</div><div class="${listClassName}-next">></div></div></div><div class="swiper-wrapper"></div>`;

            subTitle.innerHTML = `<h4>${secondLevelCategory.name} <span>${firstLevelCategory.name}<span></h4>`;

            window['all_inst_current_cat_sub_sub'] = allInstruments.filter(obj => thirdLevelCategory.asset_ids.includes(obj.instrument_id));
            if (window['all_inst_current_cat_sub_sub'].length) {
              new_filter.append(new_filter_el);
              subCatHolder.append(new_div);
              createSwiperElement(window['all_inst_current_cat_sub_sub'], thirdLevelCategory.name.slice(0, 3), secondLevelCategory.name.toLowerCase().slice(0, 2));
            } else {
              new_filter_el.remove();
              new_div.remove();
            }
          }  
          if (Array.isArray(thirdLevelCategory.children)) {
            
            window['all_inst_current_cat_sub_sub'] = [];
            const new_filter_el = document.createElement("span");
            new_filter_el.className = iii === 0 ? 'subFilterEl subActive' : 'subFilterEl';
            new_filter_el.dataset.filter = 'subf'+secondLevelCategory.name.toLowerCase().slice(0, 2)+thirdLevelCategory.name.slice(0, 3);
            new_filter_el.innerHTML = thirdLevelCategory.name;

            subTitle.innerHTML = `<h4>${secondLevelCategory.name} <span>${firstLevelCategory.name}<span></h4>`;

            const new_div = document.createElement("div");
            const listClassName = secondLevelCategory.name.toLowerCase().slice(0, 2)+thirdLevelCategory.name.slice(0, 3);
            new_div.className = iii === 0 ? 'swiper subActive inst-list-'+listClassName : 'swiper inst-list-'+listClassName;
            new_div.innerHTML = `<div class="headSec"><div class="${listClassName}-swiper-nav swnav"><div class="${listClassName}-prev"><</div><div class="${listClassName}-next">></div></div></div><div class="swiper-wrapper"></div>`;

            for (const fourthLevelCategory of thirdLevelCategory.children) {
              if (Array.isArray(fourthLevelCategory.asset_ids)) {
                fortLvlAssetIDs.push(...fourthLevelCategory.asset_ids);
                
              }
            }

            window['all_inst_current_cat_sub_sub'] = allInstruments.filter(obj => fortLvlAssetIDs.includes(obj.instrument_id));
            if (window['all_inst_current_cat_sub_sub'].length) {
              new_filter.append(new_filter_el);
              subCatHolder.append(new_div);
              createSwiperElement(window['all_inst_current_cat_sub_sub'], thirdLevelCategory.name.slice(0, 3), secondLevelCategory.name.toLowerCase().slice(0, 2));
            } else {
              new_filter_el.remove();
              new_div.remove();
            }
            iii++;
          }
          
          ii++;
          
        }
      }
    }

    resolve(); // Resolve the Promise once all actions are completed
  });
}

function attachEventListenersToSubFilters() {
  const subFilters = document.querySelectorAll('.subFilter');
  subFilters.forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      if (e.target.classList.contains('subFilterEl')) {
        const filButtons = a.querySelectorAll('.subFilterEl');

        filButtons.forEach(b => {
          b.classList.remove('subActive');
        });
        e.target.classList.add("subActive");

        let buttonCategory = e.target.dataset.filter;
        let catHolder = e.target.parentElement.parentElement;

        const catChange = catHolder.querySelectorAll('.swiper');
        catChange.forEach(t => {
          t.classList.remove('subActive');

          if (t.classList.contains('inst-list-'+buttonCategory.slice(4))) {
            t.classList.add('subActive');
          }
        });
      }
    });
  });
}

async function loadSecondAndThirdLevelCategories(categories) {
  const firstLevelCategories = categories.map(category => category.name);

  await Promise.all(firstLevelCategories.map(async (categoryName) => {
    try {
      if (categoryName !== 'Popular') {
        await createElementForSecondAndThirdLevelCategory(categories, categoryName);
      }
    } catch (error) {
      console.error(error);
    }
  }));

  attachEventListenersToSubFilters();
}

function createSwiperElement(data, cls, fstLvl = 'pp') {
  const container = document.querySelector('.inst-list-' + fstLvl + cls);
  if (!container) {
    console.error("Container element not found for class 'inst-list-" + fstLvl + cls + "'.");
    return;
  }

  let initInstSlider = new Swiper('.inst-list-'+fstLvl+cls, {
    navigation: {
      nextEl: '.'+fstLvl+cls+'-swiper-nav .'+fstLvl+cls+'-next',
      prevEl: '.'+fstLvl+cls+'-swiper-nav .'+fstLvl+cls+'-prev',
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
        slidesPerView: 3.2,
        spaceBetween: 12,
      },
      428: {
        slidesPerView: 3.3,
        spaceBetween: 12,
      },
      768: {
        slidesPerView: 6,
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
    let langMark = "";
    if (instruments_data.lang.slice(0,2) !== 'en') { langMark = '/'+instruments_data.lang.slice(0,2); }
    initInstSlider.addSlide(1, '<div class="swiper-slide ' + instClasse + ' instH'+item?.instrument_id+'"><a href="'+langMark+'/single-instrument/?instrument=' + item.instrument_name + '"><span class="imgHolder">' + inst_ico + '</span><h3>' + item.instrument_name + '</h3><span class="lastPrice  instLP'+item?.instrument_id+'">' + instLastPrice + '</span><span class="todayChange ' + instClasse + ' instCH'+item?.instrument_id+'">' + instChage + '</span></a></div>');
  });
}

function processUpdateMarketData(data) {
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

  if (allIds?.length) {    
    allIds.forEach(inst => {
      const data = newData.find(item => item.instrument_id === inst);
      
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

const checkForInstrumentUpdate = setInterval(() => {
  if (JSON.stringify(latestInstrumentData) != JSON.stringify(updatedInst)) {

    latestInstrumentData = deepClone(updatedInst);

    updateInstrumentsBoxes(latestInstrumentData);      
  }
}, 1000);

window.addEventListener('DOMContentLoaded', () => {
  if (mobile.matches || tablet.matches) {
    const bHolder2 = document.getElementsByClassName('swiper-wrapper');
    const catsHolder2 = document.getElementById('categoriesHolder');

    bHolder2[0].addEventListener('click', e => {
      e.preventDefault();
      if (e.target.classList.contains('swiper-slide')) {

        const buttons2 = bHolder2[0].querySelectorAll('.swiper-slide');

        buttons2.forEach(b => {
          b.classList.remove('active');
        });
        e.target.classList.add("active");
        let buttonCategory = e.target.dataset.category;

        const catChange2 = catsHolder2.querySelectorAll('.allCats');
        catChange2.forEach(t => {
          t.classList.remove('active');

          if (t.id == buttonCategory+'Holder') {
            t.classList.add('active');
          }
        });
      }
    });
  } else {
    const bHolder = document.getElementById('instCat');
    const catsHolder = document.getElementById('categoriesHolder');

    bHolder.addEventListener('click', e => {
      e.preventDefault();
      if (e.target.classList.contains('catButton')) {

        const buttons = bHolder.querySelectorAll('.catButton');

        buttons.forEach(b => {
          b.classList.remove('active');
        });
        e.target.classList.add("active");
        let buttonCategory = e.target.dataset.category;

        const catChange = catsHolder.querySelectorAll('.allCats');
        catChange.forEach(t => {
          t.classList.remove('active');

          if (t.id == buttonCategory+'Holder') {
            t.classList.add('active');
          }
        });
      }
    });
  }

  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const clearSearchButton = document.getElementById('clearSearch');

  searchInput.addEventListener('input', function (event) {
    const searchTerm = event.target.value.toLowerCase();

    // Clear previous results
    searchResults.innerHTML = '';

    // Filter the array based on the search term
    const filteredResults = allInstruments.filter(function (item) {
      return item.instrument_name.toLowerCase().includes(searchTerm);
    });

    // Create and append result links to the dropdown
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

    // Show or hide the dropdown based on the number of results
    searchResults.style.display = filteredResults.length > 0 ? 'flex' : 'none';
    clearSearchButton.style.display = searchTerm.length > 0 ? 'block' : 'none';
  });

  clearSearchButton.addEventListener('click', function () {
    searchInput.value = '';
    searchResults.innerHTML = '';
    searchResults.style.display = 'none';
    clearSearchButton.style.display = 'none';
  });
});