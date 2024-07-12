function hasElementClass(element, className) {
  return element.classList
    ? element.classList.contains(className)
    : new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
}
function addElementClass(element, className) {
  element.classList
    ? element.classList.add(className)
    : (element.className += ' ' + className);
}
function removeElementClass(element, className) {
  element.classList
    ? element.classList.remove(className)
    : (element.className = element.className.replace(
        new RegExp(
          '(^|\\b)' + className.split(' ').join('|') + '(\\b|$)',
          'gi'
        ),
        ' '
      ));
}

let videosSwiper = Swiper;
let initFAQVideosSection = new Swiper('.section-videos-container-inner', {
  pagination: {
    el: '.section-videos-container-inner .swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.video-slider-button-next',
    prevEl: '.video-slider-button-prev',
  },
  loop: false,
  slidesPerView: 4.5,
  spaceBetween: 20,
  grabCursor: true,
  breakpoints: {
    0: {
      slidesPerView: 1.1
    },
    768: {
      slidesPerView: 2.5
    },
    1200: {
      slidesPerView: 4.5
    }
  }
});

const fireIntercom = () => {
  const url = new URL(window.location);

  document.querySelectorAll('.popup-chat-trigger').forEach(x => {
    x.addEventListener('click', (e) => {
      e.preventDefault();
      Intercom('show');
      url.searchParams.set('intercom', 'true');
      window.history.pushState(null, '', url.toString());
    });
  });
}

const fireYoutubeVideoModal = () => {
  document.querySelectorAll('.youtube-videos-section .youtube-video .youtube-video-placeholder').forEach(occurence => {
    occurence.addEventListener('click', (e) => {
      e.preventDefault();
      let modalId = occurence.getAttribute('data-id');
      let modalSrc = occurence.getAttribute('data-src');
      let targetModal = document.getElementById(modalId.substring(1));
      targetModal.style.display = "block";
      targetModal.querySelector('iframe').setAttribute('src', modalSrc);
      
      targetModal.querySelector('.modalClose').onclick = function () {
        targetModal.style.display = "none";
        targetModal.querySelector('iframe').removeAttribute('src');
      }

      targetModal.addEventListener('click', (e) => {
        const modalClose2 = e.target.closest(".modalClose");
        if (modalClose2 && e.currentTarget.contains(modalClose2)) {
          targetModal.style.display = "none";
        }
      });
    });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('resize', (e) => {});

  initFAQVideosSection;
  fireIntercom();

  const ALL_TOPICS_ID = 'faq-group-all-topics';

  // search & highlight
  const container = document.querySelector('.faq-content');
  if (!container) return true;

  const input = document.querySelector('.faq-search input');
  const notfound = document.querySelector('.faq-search .faq-notfound');
  const items = document.querySelectorAll('.faq-content > ul > li > ul > li');
  let item = {};
  let itemsIndexed = [];

  [].forEach.call(items, function (entry) {
    itemsIndexed.push(entry.textContent.replace(/\s{2,}/g, ' ').toLowerCase());
  });

  input.addEventListener('keyup', function (e) {
    if (e.code == 13) {
      // enter
      input.blur();
      return true;
    }

    [].forEach.call(items, function (entry) {
      entry.innerHTML = entry.innerHTML.replace(
        /<span class="highlight">([^<]+)<\/span>/gi,
        '$1'
      );
    });

    var searchVal = input.value.trim().toLowerCase();
    if (searchVal.length) {
      itemsIndexed.forEach(function (entry, i) {
        if (itemsIndexed[i].indexOf(searchVal) != -1) {
          removeElementClass(items[i], 'is-hidden');
          items[i].innerHTML = items[i].innerHTML.replace(
            new RegExp(searchVal + '(?!([^<]+)?>)', 'gi'),
            '<span class="highlight">$&</span>'
          );
        } else addElementClass(items[i], 'is-hidden');
      });
    } else
      [].forEach.call(items, function (entry) {
        removeElementClass(entry, 'is-hidden');
      });

    if (
      items.length ==
      [].filter.call(items, function (entry) {
        return hasElementClass(entry, 'is-hidden');
      }).length
    )
      addElementClass(notfound, 'is-visible');
    else removeElementClass(notfound, 'is-visible');
  });

  // toggling items on title press
  [].forEach.call(
    document.querySelectorAll('.faq-content .faq-item > h4 a'),
    function (entry) {
      addElementClass(entry, 'js--is-toggleable-item');
    }
  );

  document.addEventListener('click', function (e) {
    if (hasElementClass(e.target, 'js--is-toggleable-item')) {
      e.preventDefault();
      
      var current = e.target;
      while (current.parentNode) {
        current = current.parentNode;
        if (current.tagName.toLowerCase() == 'li') {
          hasElementClass(current, 'is-active')
            ? removeElementClass(current, 'is-active')
            : addElementClass(current, 'is-active');
          break;
        }
      }
    }
  });

  // auto-show item content when show results reduces to single
  let item_to_show = {};

  input.addEventListener('keyup', function (e) {
    resetAsideActive();
    setAsideItemActive(ALL_TOPICS_ID);

    resetGroupActive();
    setGroupItemActive(ALL_TOPICS_ID);

    item_to_show = [].filter.call(items, function (entry) {
      return !hasElementClass(entry, 'is-hidden');
    });

    if (item_to_show.length == 1) {
      addElementClass(item_to_show[0], 'js--autoshown');
      addElementClass(item_to_show[0], 'is-active');
    } else {
      [].forEach.call(items, function (entry) {
        if (hasElementClass(entry, 'js--autoshown')) {
          removeElementClass(entry, 'js--autoshown');
          removeElementClass(entry, 'is-active');
        }
      });
    }

    // debaunce the search
    clearTimeout(window.search_timeout);
    window.search_timeout = setTimeout(function () {
      if (item_to_show.length > 0) {
        window.scrollTo(0, item_to_show[0].getBoundingClientRect().top - 200);
      }
    }, 1400);
  });

  // reset search resoults on click search clear button
  //   input.addEventListener('input', function (e) {
  //     if (input.value.length == 0) {
  //       resetAsideActive();
  //       setAsideItemActive(ALL_TOPICS_ID);

  //       resetGroupActive();
  //       setGroupItemActive(ALL_TOPICS_ID);
  //     }
  //   });

  // when user click on a link in the faq-aside, scroll to the corresponding item
  const aside = document.querySelector('.faq-aside');
  if (!aside) return true;

  const aside_links = document.querySelectorAll('.faq-aside .faq-aside-item');
  [].forEach.call(aside_links, function (entry) {
    entry.addEventListener('click', function (e) {
      e.preventDefault();

      const id = entry.querySelector('a').getAttribute('href').replace('#', '');
      const item = document.querySelector('#' + id);

      if (item) {
        resetAsideActive();
        setAsideItemActive(id);

        resetGroupActive();
        setGroupItemActive(id, item);
      }
    });
  });

  function resetAsideActive() {
    // loop through all aside items and remove the active class
    const aside_list = document.querySelectorAll(
      '.faq-aside .faq-aside-list .faq-aside-item'
    );
    [].forEach.call(aside_list, function (entry) {
      removeElementClass(entry, 'active');
    });
  }
  function resetGroupActive() {
    // loop through all groups and remove the active class
    const groups_list = document.querySelectorAll(
      '.faq-content .faq-groups-list .faq-group'
    );
    [].forEach.call(groups_list, function (entry) {
      removeElementClass(entry, 'active');
    });
  }

  function setAsideItemActive(id) {
    // add the active class to the corresponding item
    const aside_item = document.querySelector(
      '.faq-aside .faq-aside-list .faq-aside-item a[href="#' + id + '"]'
    );
    if (aside_item) {
      const parent = aside_item.parentNode.parentNode;
      if (parent.tagName.toLowerCase() === 'li') {
        parent.classList.add('active');
      }
    }
  }
  function setGroupItemActive(id, item) {
    // if user click to view all groups
    const groups_container = document.querySelector(
      '.faq-content .faq-groups-list'
    );
    if (id == ALL_TOPICS_ID) {
      // remove show single topic class
      removeElementClass(groups_container, 'show-single-topic');
    } else {
      addElementClass(groups_container, 'show-single-topic');
      // add active class to the item parent
      const parent = item.parentNode;
      if (parent.tagName.toLowerCase() === 'li') {
        parent.classList.add('active');
      }
    }
  }

  // show only the first 3 items in .faq-group-content and add a show and hide, show more/less button
  const groups_content = document.querySelectorAll(
    '.faq-content .faq-groups-list .faq-group-content'
  );
  [].forEach.call(groups_content, function (entry) {
    if (entry.children.length > 3) {
      const show_more = entry.parentNode.querySelector('.faq-show-more-btn');
      show_more.addEventListener('click', function (e) {
        e.preventDefault();
        entry.classList.remove('hide-first-3');
        show_more.classList.remove('active');
        show_less.classList.add('active');
      });

      const show_less = entry.parentNode.querySelector('.faq-show-less-btn');
      show_less.addEventListener('click', function (e) {
        e.preventDefault();
        entry.classList.add('hide-first-3');
        show_less.classList.remove('active');
        show_more.classList.add('active');
      });
    }
  });

  const faqAllTopicsTitle = document.querySelector(".page-template-faq .faq-section .faq-content-title");
  const faqListContainer = document.querySelector(".page-template-faq .faq-aside .faq-aside-list");
  const faqListLi = document.querySelectorAll(".page-template-faq .faq-aside .faq-aside-list li");
  const faqListFirstChild = document.querySelector(".page-template-faq .faq-aside .faq-aside-list li:first-child");

  if ( faqListContainer !== null  || faqListLi.length != 0 ) {
      faqListLi.forEach((item, index) => {
          item.addEventListener('click', (event) => {
              if (item !== faqListFirstChild) {
                  faqAllTopicsTitle.classList.add('hide-all-topics-title');
              } else {
                  faqAllTopicsTitle.classList.remove('hide-all-topics-title');
              }
          });
      });
  }

  fireYoutubeVideoModal();
  
  document.querySelectorAll('div').forEach(btn => {
    btn.addEventListener('click', (e) => {
      let btnDataType = btn.getAttribute('data-type');
      if (btn.classList.contains('youtube-video-placeholder')) {
        window.dataLayer.push({
          'type': btnDataType,
        });
      }
    });
  });
  
});
