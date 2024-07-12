const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
const mobile = window.matchMedia('(min-width: 0px) and (max-width: 768px)');
const tablet = window.matchMedia('(min-width: 769px) and (max-width: 1024px)');
const desktop = window.matchMedia('(min-width: 1025px)');
const tablet2 = window.matchMedia('(min-width: 769px) and (max-width: 1200px)');
const desktop2 = window.matchMedia('(min-width: 1201px)');

function displayDefaults(localResults, remoteResults) {
  localResults.innerHTML = '';
  remoteResults.innerHTML = '';

  const filteredInstruments = default_search.instruments.map(inst => {
    return allInstruments.find(item => item.instrument_name.toLowerCase() === inst.name.toLowerCase());
  }).filter(item => item);

  if (filteredInstruments.length > 0) {
    updateInstrumentsResults(filteredInstruments, localResults);
  }

  const articlesFragment = document.createDocumentFragment();
  default_search.articles.forEach(article => {
    const a = document.createElement('a');
    a.href = article.link;
    a.textContent = article.title;
    articlesFragment.appendChild(a);
  });
  remoteResults.appendChild(articlesFragment);
}

function updateInstrumentsResults(results, container) {
  const fragment = document.createDocumentFragment();
  results.forEach(item => {
    renderInstrumentsResult(item, fragment);
  });
  container.innerHTML = '';
  container.appendChild(fragment);
}

function renderInstrumentsResult(item, fragment) {
  const link = document.createElement('a');
  let inst_ico = '';
  if (item.icon_url) {
    const imgUrl = 'https://' + instruments_data.platform_url + '/images/instrument/icons/' + item.icon_url.slice(9);
    inst_ico = `<img src="${imgUrl}" alt="${item.instrument_name}" title="${item.instrument_name}" width="32" height="32" />`;
  } else {
    inst_ico = `<img src="../wp-content/themes/klips/styles/images/default-icon.svg" alt="${item.instrument_name}" title="${item.instrument_name}" class="icoDefault" width="32" height="32" />`;
  }

  link.href = '/single-instrument/?instrument=' + item.instrument_name;
  link.innerHTML = `<span class="instHolder">${inst_ico}<span class="instName">${item.instrument_name}</span><span class="instUnit">${item.unit_name}</span></span><span class="instPrice">${item.last_quote?.ask}</span>`;
  fragment.appendChild(link);
}

function renderResult(item, container) {
  const link = document.createElement('a');
  link.href = item.link;
  link.innerHTML = `${item.name}`;
  container.appendChild(link);
}

const handleHeaderSearch = () => {
  const searchButton = document.getElementById('headerSearch');

  if (searchButton) {
    const searchIcons = [...searchButton.querySelectorAll('img')];
    const searchInputBox = document.querySelector('.header-actions-search-form-input');
    const headerSearchInput = document.getElementById('headerSearchInput');
    const localResults = document.getElementById('localResults');
    const remoteResults = document.getElementById('remoteResults');
    const headerClearSearchButton = document.getElementById('headerClearSearch');
    let open = false;
    let timeoutId = null;
    const debounceDelay = 300;

    const inputEventHandler = (searchTerm) => {
      localResults.innerHTML = '';
      remoteResults.innerHTML = '';
      if (searchTerm.length) {
        const filteredResults = allInstruments.filter(item => item.instrument_name.toLowerCase().includes(searchTerm) || item.unit_name.toLowerCase().includes(searchTerm));
        if (filteredResults.length) {
          updateInstrumentsResults(filteredResults, localResults);
        } else {
          localResults.textContent = 'No results';
        }

        fetch(`${includePath2.academy_url}/wp-json/custom/search?s=${encodeURIComponent(searchTerm)}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            if (data.length) {
              const fragment = document.createDocumentFragment();
              data.forEach(item => renderResult(item, fragment));
              remoteResults.appendChild(fragment);
            } else {
              remoteResults.textContent = 'No results';
            }
          })
          .catch(error => {
            console.error('Error fetching remote articles:', error);
            remoteResults.textContent = 'Failed to load results';
          });

        headerClearSearchButton.style.display = 'block';
      } else {
        headerClearSearchButton.style.display = 'none';
        displayDefaults(localResults, remoteResults);
      }
    };

    const clearEventHandler = () => {
      headerSearchInput.value = '';
      displayDefaults(localResults, remoteResults);
      headerClearSearchButton.style.display = 'none';
    };

    searchButton.addEventListener('click', (e) => {
      e.preventDefault();
      searchIcons.forEach((item) => {
        item.classList.toggle('hidden');
      });
      searchInputBox.classList.toggle('shown');
      open = !open;
      if (open) {
        searchInputBox.focus();
        headerSearchInput.addEventListener('input', () => {
          clearTimeout(timeoutId);
          const searchTerm = headerSearchInput.value.trim().toLowerCase();
          timeoutId = setTimeout(() => inputEventHandler(searchTerm), debounceDelay);
        });
        headerClearSearchButton.addEventListener('click', clearEventHandler);
        displayDefaults(localResults, remoteResults);
      } else {
        headerSearchInput.removeEventListener('input', inputEventHandler);
        headerClearSearchButton.removeEventListener('click', clearEventHandler);
      }
    });
  }
};

const handleMobileHeaderSearch = () => {
  const searchMobileButton = document.getElementById('headerMobileSearch');

  if (searchMobileButton) {
    const searchIcons = [...searchMobileButton.querySelectorAll('img')];
    const searchInputBox = document.querySelector('.mobile-header-actions-search-form-input');
    const headerSearchInput = document.getElementById('headerMobileSearchInput');
    const localResults = document.getElementById('localMobileResults');
    const remoteResults = document.getElementById('remoteMobileResults');
    const headerClearSearchButton = document.getElementById('headerMobileClearSearch');
    let open = false;
    let timeoutId = null;
    const debounceDelay = 300;

    const inputEventHandler = (searchTerm) => {
      localResults.innerHTML = '';
      remoteResults.innerHTML = '';
      if (searchTerm.length) {
        const filteredResults = allInstruments.filter(item => item.instrument_name.toLowerCase().includes(searchTerm) || item.unit_name.toLowerCase().includes(searchTerm));
        if (filteredResults.length) {
          updateInstrumentsResults(filteredResults, localResults);
        } else {
          localResults.textContent = 'No results';
        }

        fetch(`${includePath2.academy_url}/wp-json/custom/search?s=${encodeURIComponent(searchTerm)}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            if (data.length) {
              const fragment = document.createDocumentFragment();
              data.forEach(item => renderResult(item, fragment));
              remoteResults.appendChild(fragment);
            } else {
              remoteResults.textContent = 'No results';
            }
          })
          .catch(error => {
            console.error('Error fetching remote articles:', error);
            remoteResults.textContent = 'Failed to load results';
          });

        headerClearSearchButton.style.display = 'block';
      } else {
        headerClearSearchButton.style.display = 'none';
        displayDefaults(localResults, remoteResults);
      }
    };

    const clearEventHandler = () => {
      headerSearchInput.value = '';
      displayDefaults(localResults, remoteResults);
      headerClearSearchButton.style.display = 'none';
    };

    searchMobileButton.addEventListener('click', (e) => {
      e.preventDefault();
      searchIcons.forEach((item) => {
        item.classList.toggle('hidden');
      });
      searchInputBox.classList.toggle('shown');
      open = !open;
      if (open) {
        searchInputBox.focus();
        headerSearchInput.addEventListener('input', () => {
          clearTimeout(timeoutId);
          const searchTerm = headerSearchInput.value.trim().toLowerCase();
          timeoutId = setTimeout(() => inputEventHandler(searchTerm), debounceDelay);
        });
        headerClearSearchButton.addEventListener('click', clearEventHandler);
        displayDefaults(localResults, remoteResults);
      } else {
        headerSearchInput.removeEventListener('input', inputEventHandler);
        headerClearSearchButton.removeEventListener('click', clearEventHandler);
      }
    });
  }
}

const openNavInMobileHeader = () => {
  const headerList = [
    ...document.querySelectorAll(
      '.mobile-header-wrapper-tools-navigation-list-item'
    ),
  ];
  headerList.forEach((item) => {
    const link = item.querySelector(
      '.mobile-header-wrapper-tools-navigation-list-item .link-wrapper img.arrow'
    );
    const content = item.querySelector(
      '.mobile-header-wrapper-tools-navigation-list-item-content'
    );

    if (content) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        if (content.classList.contains('shown')) {
          content.classList.remove('shown');
          link.style.transform = 'rotate(0deg)';
        } else {
          content.classList.add('shown');
          link.style.transform = 'rotate(180deg)';
        }
      });

      const secondLvlList = [...content.querySelectorAll('.sub-link-wrapper')];
      secondLvlList.forEach((item) => {
        const content2 = item.querySelector('.mobile-header-wrapper-tools-navigation-list-item-content-sub');

        if (content2) {
          const link2 = item.querySelector('img');
          const subContent2 = item.querySelector('.mobile-header-wrapper-tools-navigation-list-item-content-sub ul');

          link2.addEventListener('click', (e) => {
            e.preventDefault();
            if (content2.classList.contains('shown')) {
              content2.classList.remove('shown');
              subContent2.classList.remove('shown');
              link2.style.transform = 'rotate(0deg)';
            } else {
              subContent2.classList.add('shown');
              content2.classList.add('shown');
              link2.style.transform = 'rotate(180deg)';
            }
          });
        }
      });
    }
  });
}

const headerShadow = () => {
    const header = document.querySelector('.header');
    if (header) {
        let scroll = window.scrollY;
        if (scroll > 0) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    }
};

const handleLanguageSwitcher = () => {
    const languageSwitchers = document.querySelectorAll('.language-switcher');

    if (languageSwitchers) {
        languageSwitchers.forEach((switcher) => {
            const languageSelected = switcher.querySelector('.language-selected');

            // when clicking on the slected field show list
            languageSelected.addEventListener('click', (e) => {
                e.preventDefault();
                switcher.classList.toggle('active');
            });

            // when clicking on item, hide list and place the selected text
            const languageItem = switcher.querySelector('.language-item');
            languageItem.addEventListener('click', (e) => {
                switcher.classList.toggle('active');

                // make element text as selected text
                const selectedText = languageItem.innerText;
                languageSelected.innerText = selectedText;
            });

            // close dropdown when click outside
            document.addEventListener('click', (e) => {
                if (!switcher.contains(e.target)) {
                    switcher.classList.remove('active');
                }
            });
        });
    }
};

const fireAppModal = () => {
  const url = new URL(window.location);
  const modalWindow = document.getElementById("modalApp");
  const modalClose = modalWindow.querySelector(".modalClose");

  document.querySelectorAll('.openModalApp').forEach(occurence => {
    occurence.addEventListener('click', (e) => {
      e.preventDefault();

      modalWindow.style.display = "block";
      url.searchParams.set('modalApp', 'true');
      window.history.pushState(null, '', url.toString());

      const input2 = document.getElementById("smsPopUp_phone");
      const iti2 = window.intlTelInput(input2, {
        autoInsertDialCode: true,
        excludeCountries: ['af', 'dz', 'ao', 'br', 'cf', 'cd', 'ci', 'eg', 'er', 'gh', 'gn', 'gw', 'ht', 'ir', 'iq', 'kp', 'xk', 'lb', 'lr', 'ly', 'ml', 'mm', 'ni', 'ne', 'pk', 'ru', 'rw', 'sn', 'sl', 'so', 'sd', 'sy', 'tz', 'tg', 'tn', 'ug', 'ua', 'us', 'ye', 'zw'],
        hiddenInput: () => "phone_full",
        initialCountry: window['real_country'][0].toLowerCase(),
        nationalMode: true,
        placeholderNumberType: "MOBILE",
        // preferredCountries: ['cn', 'jp'],
        showSelectedDialCode: true,
        utilsScript: "../vendor/utils.js"
      });

      const form = document.getElementById('smsPopUp');
      document.getElementById('smsPopUp_nonce').value = window['my_popup_form_data']?.nonce3;

      let phoneInput = document.getElementById('smsPopUp_phone');
      const phoneErrorSpan = document.getElementById('smsPopUpPhoneError');
      const chkFname = document.getElementById('smsPopUp_fname').value;
      const generalErrorSpan = document.getElementById('smsPopUpGeneralError');
      const submitButton = document.getElementById('smsPopUp_submit');
      const submitSuccess2 = document.getElementById('submitSuccess2');
      const modalAppTitle = document.querySelector('.modalAppTitle');
      const modalAppSubtitle = document.querySelector('.modalAppSubtitle');
      const smsFormContainer = document.querySelector('.sms-form-container');

      const errorMap = ["Invalid number", "Invalid country code", "Too short", "Too long", "Invalid number"];
      phoneInput.addEventListener('input', function() {
        let chkData = this.value;
        if (!chkData.trim()) {
          phoneErrorSpan.innerText = 'Phone number is required.';
          phoneErrorSpan.classList.add("hasError");
          this.classList.add("hasError");
          submitButton.disabled = true;
        } else if (iti2.isValidNumber()) {
          phoneErrorSpan.innerText = '';
          phoneErrorSpan.classList.remove("hasError");
          this.classList.remove("hasError");
          submitButton.disabled = false;
        } else {
          const errorCode = iti2.getValidationError();
          const msg = errorMap[errorCode] || "Invalid number";
          phoneErrorSpan.innerText = msg;
          phoneErrorSpan.classList.add("hasError");
          this.classList.add("hasError");
          submitButton.disabled = true;
        }
      });

      form.addEventListener('submit', function(event) {
        event.preventDefault();

        if (chkFname) {
          generalErrorSpan.innerText = 'Form submission detected as spam.';
          generalErrorSpan.classList.add("hasError");
          submitButton.disabled = true;
          return;
        } else {
          generalErrorSpan.innerText = '';
          generalErrorSpan.classList.remove("hasError");
          submitButton.disabled = false;
        }

        document.getElementById("lock-modal4").style.display = "block";
        document.getElementById("loading-circle4").style.display = "block";

        const formData = new FormData(form);

        fetch(includePath2.twilio, {
          method: 'POST',
          body: formData
        })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            switch (data.error) {
              case 'UNKNOW_ERROR':
                document.getElementById("lock-modal4").style.display = "none";
                document.getElementById("loading-circle4").style.display = "none";
                generalErrorSpan.innerText = "Error during the registration.";
                generalErrorSpan.classList.add("hasError");
                break;
              case 'VALID_EMAIL':
                document.getElementById("lock-modal4").style.display = "none";
                document.getElementById("loading-circle4").style.display = "none";
                generalErrorSpan.innerText = "Please provide a valid email.";
                generalErrorSpan.classList.add("hasError");
                break;
              case 'cURL_Error':
                document.getElementById("lock-modal4").style.display = "none";
                document.getElementById("loading-circle4").style.display = "none";
                generalErrorSpan.innerText = "Connection problem.";
                generalErrorSpan.classList.add("hasError");
                break;
              case 'TWILIO_API_ERROR':
                document.getElementById("lock-modal4").style.display = "none";
                document.getElementById("loading-circle4").style.display = "none";
                generalErrorSpan.innerText = "Twilio API error.";
                generalErrorSpan.classList.add("hasError");
                break;
              case 'PHONE_REQUIRED':
                document.getElementById("lock-modal4").style.display = "none";
                document.getElementById("loading-circle4").style.display = "none";
                leadPopPhoneError.innerText = "Phone is required.";
                leadPopPhoneError.classList.add("hasError");
                break;
              case 'FORM_SPAM':
                document.getElementById("lock-modal4").style.display = "none";
                document.getElementById("loading-circle4").style.display = "none";
                generalErrorSpan.innerText = "Form submission detected as spam.";
                generalErrorSpan.classList.add("hasError");
                break;
              default:
                document.getElementById("lock-modal4").style.display = "none";
                document.getElementById("loading-circle4").style.display = "none";
                console.log("An unknown error occurred: " + data.error);
                break;
            }
          } else {

            document.getElementById("lock-modal4").style.display = "none";
            document.getElementById("loading-circle4").style.display = "none";

            form.style.display = "none";
            modalAppTitle.style.display = "none";
            modalAppSubtitle.style.display = "none";
            smsFormContainer.style.display = "none";
            submitSuccess2.style.display = "flex";
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          document.getElementById("lock-modal4").style.display = "none";
          document.getElementById("loading-circle4").style.display = "none";
        });
      });

      modalClose.onclick = function () {
        modalWindow.style.display = "none";
        url.searchParams.delete('modalApp');
        window.history.pushState(null, '', url.toString());
      }

      modalWindow.addEventListener('click', (e) => {
        const modalClose2 = e.target.closest(".modalClose2");
        if (modalClose2 && e.currentTarget.contains(modalClose2)) {
          modalWindow.style.display = "none";
        }
      });
    });
  });
}

const fireUsrRegModal = () => {
  const url = new URL(window.location);
  const modalWindow = document.getElementById("modalUsrReg");
  const modalClose = modalWindow.querySelector(".modalClose");

  document.querySelectorAll('.openModalUsrReg').forEach(occurence => {
    occurence.addEventListener('click', (e) => {
      e.preventDefault();

      let device = 'web-';
      if (mobile.matches || tablet.matches) {
        device = device+'mob-';
      } else {
        device = device+'desk-';
      }
      document.getElementById('popUserReg_fingerprint').value = device;

      const btnRegRedirect = occurence.getAttribute('data-redirect');

      const form = document.getElementById('userRegistrationPopUp');
      document.getElementById('popUserReg_nonce').value = window['my_popup_form_data']?.nonce;

      const emailInput = document.getElementById('popUserReg_email');
      const emailErrorSpan = document.getElementById('popEmailError');
      const passInput = document.getElementById('popUserReg_pass');
      const passErrorSpan = document.getElementById('popPasswordError');
      const chkInput = document.getElementById('popUserReg_chk');
      const chkErrorSpan = document.getElementById('popCheckboxError');
      const submitButton = document.getElementById('popUserReg_submit');
      const chkFname = document.getElementById('popUserReg_fname').value;
      const chkLname = document.getElementById('popUserReg_lname').value;
      const generalErrorSpan = document.getElementById('popGeneralError');

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

        fetch(includePath2.url, {
          method: 'POST',
          body: formData
        })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            switch (data.error) {
              case 'UNKNOW_ERROR':
                generalErrorSpan.innerText = "Error during the registration.";
                generalErrorSpan.classList.add("hasError");
                break;
              case 'VALID_EMAIL':
                generalErrorSpan.innerText = "Please provide a valid email.";
                generalErrorSpan.classList.add("hasError");
                break;
              case 'cURL_Error':
                generalErrorSpan.innerText = "Connection problem.";
                generalErrorSpan.classList.add("hasError");
                break;
              case 'ACF_MUST_BE_SET':
                generalErrorSpan.innerText = "Configuration problem.";
                generalErrorSpan.classList.add("hasError");
                break;
              case 'MISSING_ACF_DATA':
                generalErrorSpan.innerText = "Configuration problem.";
                generalErrorSpan.classList.add("hasError");
                break;
              case 'EMAIL_REQUIRED':
                emailErrorSpan.innerText = "Email is required.";
                emailErrorSpan.classList.add("hasError");
                break;
              case 'PASSWORD_REQUIRED':
                passErrorSpan.innerText = "Password is required.";
                passErrorSpan.classList.add("hasError");
                break;
              case 'INVALID_EMAIL':
                emailErrorSpan.innerText = "Please enter a valid email.";
                emailErrorSpan.classList.add("hasError");
                break;
              case 'USER_EXISTS':
                emailErrorSpan.innerText = "Email already exists.";
                emailErrorSpan.classList.add("hasError");
                break;
              case 'FORM_SPAM':
                generalErrorSpan.innerText = "Form submission detected as spam.";
                generalErrorSpan.classList.add("hasError");
                break;
              default:
                console.log("An unknown error occurred: " + data.error);
                break;
            }
          } else {
            let utmSourceGTM = '';
            let utmCampaignGTM = '';
            let utmMediumGTM = '';
            let utmAdsetIdGTM = '';
            let utmAdIdGTM = '';
            let utmTermGTM = '';
            let utmFullPath = '';

            document.cookie = `authToken=${data.token}; domain=${includePath2.platform.slice(-9)}; secure; samesite=strict; path=/;`;

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

            if (btnRegRedirect) {
              window.location.href = 'https://'+includePath2.platform_url+'?'+btnRegRedirect+'&'+utmFullPath;
            } else {
              window.location.href = 'https://'+includePath2.platform_url+'?'+utmFullPath;
            }

          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      });

      modalWindow.style.display = "block";
      url.searchParams.set('modalUsrReg', 'true');
      window.history.pushState(null, '', url.toString());

      modalClose.onclick = function () {
        modalWindow.style.display = "none";
        url.searchParams.delete('modalUsrReg');
        window.history.pushState(null, '', url.toString());
      }
    });
  });
}

const fireLeadRegModal = () => {
  const url = new URL(window.location);
  const modalWindow = document.getElementById("modalLeadReg");
  const modalClose = modalWindow.querySelector(".modalClose");

  document.querySelectorAll('.openModal').forEach(occurence => {
    occurence.addEventListener('click', (e) => {
      e.preventDefault();
      let input = document.querySelector("#popLeadReg_phone");
      const iti = window.intlTelInput(input, {
        autoInsertDialCode: true,
        excludeCountries: ['af', 'dz', 'ao', 'br', 'cf', 'cd', 'ci', 'eg', 'er', 'gh', 'gn', 'gw', 'ht', 'ir', 'iq', 'kp', 'xk', 'lb', 'lr', 'ly', 'ml', 'mm', 'ni', 'ne', 'pk', 'ru', 'rw', 'sn', 'sl', 'so', 'sd', 'sy', 'tz', 'tg', 'tn', 'ug', 'ua', 'us', 'ye', 'zw'],
        hiddenInput: () => "phone_full",
        initialCountry: window['real_country'][0].toLowerCase(),
        nationalMode: true,
        placeholderNumberType: "MOBILE",
        // preferredCountries: ['cn', 'jp'],
        showSelectedDialCode: true,
        utilsScript: "../vendor/utils.js"
      });

      const form = document.getElementById('leadRegistrationPopUp');
      document.getElementById('popLeadReg_nonce').value = window['my_popup_form_data']?.nonce2;

      const emailInput = document.getElementById('popLeadReg_email');
      const emailErrorSpan = document.getElementById('leadPopEmailError');
      const fnameInput = document.getElementById('popLeadReg_fn');
      const fnameErrorSpan = document.getElementById('leadPopFNameError');
      const lnameInput = document.getElementById('popLeadReg_ln');
      const lnameErrorSpan = document.getElementById('leadPopLNameError');
      const phoneInput = document.getElementById('popLeadReg_phone');
      const phoneErrorSpan = document.getElementById('leadPopPhoneError');
      const chkInput = document.getElementById('popleadReg_chk');
      const chkErrorSpan = document.getElementById('leadPopChckError');
      const submitButton = document.getElementById('popLeadReg_submit');
      const chkFname = document.getElementById('popLeadReg_fname').value;
      const chkLname = document.getElementById('popLeadReg_lname').value;
      const generalErrorSpan = document.getElementById('leadPopGeneralError');
      const submitSuccess = document.getElementById('submitSuccess');

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

      fnameInput.addEventListener('input', function() {
        let chkData = this.value;
        if (chkData.length > 2) {
          fnameErrorSpan.innerText = '';
          fnameErrorSpan.classList.remove("hasError");
          this.classList.remove("hasError");
          submitButton.disabled = false;
        } else {
          fnameErrorSpan.innerText = 'First name is required.';
          fnameErrorSpan.classList.add("hasError");
          this.classList.add("hasError");
          submitButton.disabled = true;
        }
      });

      lnameInput.addEventListener('input', function() {
        let chkData = this.value;
        if (chkData.length > 2) {
          lnameErrorSpan.innerText = '';
          lnameErrorSpan.classList.remove("hasError");
          this.classList.remove("hasError");
          submitButton.disabled = false;
        } else {
          lnameErrorSpan.innerText = 'Last name is required.';
          lnameErrorSpan.classList.add("hasError");
          this.classList.add("hasError");
          submitButton.disabled = true;
        }
      });

      const errorMap = ["Invalid number", "Invalid country code", "Too short", "Too long", "Invalid number"];
      phoneInput.addEventListener('input', function() {
        let chkData = this.value;
        if (!chkData.trim()) {
          phoneErrorSpan.innerText = 'Phone number is required.';
          phoneErrorSpan.classList.add("hasError");
          this.classList.add("hasError");
          submitButton.disabled = true;
        } else if (iti.isValidNumber()) {
          phoneErrorSpan.innerText = '';
          phoneErrorSpan.classList.remove("hasError");
          this.classList.remove("hasError");
          submitButton.disabled = false;
        } else {
          const errorCode = iti.getValidationError();
          const msg = errorMap[errorCode] || "Invalid number";
          phoneErrorSpan.innerText = msg;
          phoneErrorSpan.classList.add("hasError");
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

        document.getElementById("lock-modal").style.display = "block";
        document.getElementById("loading-circle").style.display = "block";

        const formData = new FormData(form);

        fetch(includePath2.lead_reg, {
          method: 'POST',
          body: formData
        })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            switch (data.error) {

              case 'UNKNOW_ERROR':
                document.getElementById("lock-modal").style.display = "none";
                document.getElementById("loading-circle").style.display = "none";
                generalErrorSpan.innerText = "Error during the registration.";
                generalErrorSpan.classList.add("hasError");
                break;
              case 'VALID_EMAIL':
                document.getElementById("lock-modal").style.display = "none";
                document.getElementById("loading-circle").style.display = "none";
                generalErrorSpan.innerText = "Please provide a valid email.";
                generalErrorSpan.classList.add("hasError");
                break;
              case 'cURL_Error':
                document.getElementById("lock-modal").style.display = "none";
                document.getElementById("loading-circle").style.display = "none";
                generalErrorSpan.innerText = "Connection problem.";
                generalErrorSpan.classList.add("hasError");
                break;
              case 'ACF_MUST_BE_SET':
                document.getElementById("lock-modal").style.display = "none";
                document.getElementById("loading-circle").style.display = "none";
                generalErrorSpan.innerText = "Configuration problem.";
                generalErrorSpan.classList.add("hasError");
                break;
              case 'MISSING_ACF_DATA':
                document.getElementById("lock-modal").style.display = "none";
                document.getElementById("loading-circle").style.display = "none";
                generalErrorSpan.innerText = "Configuration problem.";
                generalErrorSpan.classList.add("hasError");
                break;
              case 'EMAIL_REQUIRED':
                document.getElementById("lock-modal").style.display = "none";
                document.getElementById("loading-circle").style.display = "none";
                emailErrorSpan.innerText = "Email is required.";
                emailErrorSpan.classList.add("hasError");
                break;
              case 'FN_REQUIRED':
                document.getElementById("lock-modal").style.display = "none";
                document.getElementById("loading-circle").style.display = "none";
                fnameErrorSpan.innerText = "First name is required.";
                fnameErrorSpan.classList.add("hasError");
                break;
              case 'LN_REQUIRED':
                document.getElementById("lock-modal").style.display = "none";
                document.getElementById("loading-circle").style.display = "none";
                lnameErrorSpan.innerText = "Last name is required.";
                lnameErrorSpan.classList.add("hasError");
                break;
              case 'PHONE_REQUIRED':
                document.getElementById("lock-modal").style.display = "none";
                document.getElementById("loading-circle").style.display = "none";
                leadPopPhoneError.innerText = "Phone is required.";
                leadPopPhoneError.classList.add("hasError");
                break;
              case 'INVALID_EMAIL':
                emailErrorSpan.innerText = "Please enter a valid email.";
                emailErrorSpan.classList.add("hasError");
                break;
              case 'USER_EXISTS':
                document.getElementById("lock-modal").style.display = "none";
                document.getElementById("loading-circle").style.display = "none";
                emailErrorSpan.innerText = "Email or phone already exists.";
                emailErrorSpan.classList.add("hasError");
                break;
              case 'FORM_SPAM':
                document.getElementById("lock-modal").style.display = "none";
                document.getElementById("loading-circle").style.display = "none";
                generalErrorSpan.innerText = "Form submission detected as spam.";
                generalErrorSpan.classList.add("hasError");
                break;
              default:
                document.getElementById("lock-modal").style.display = "none";
                document.getElementById("loading-circle").style.display = "none";
                console.log("An unknown error occurred: " + data.error);
                break;
            }
          } else {

            document.getElementById("lock-modal").style.display = "none";
            document.getElementById("loading-circle").style.display = "none";

            form.style.display = "none";
            submitSuccess.style.display = "flex";
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          document.getElementById("lock-modal2").style.display = "none";
          document.getElementById("loading-circle2").style.display = "none";
        });
      });

      modalWindow.style.display = "block";
      url.searchParams.set('modalLeadReg', 'true');
      window.history.pushState(null, '', url.toString());

      modalClose.onclick = function () {
        modalWindow.style.display = "none";
        url.searchParams.delete('modalLeadReg');
        window.history.pushState(null, '', url.toString());
      }
    });
  });
}

const intercomLoader = function(){
(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/fv1f29nd';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s, x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
  window.Intercom('boot', {
    app_id: "fv1f29nd",
  });

  window.removeEventListener('scroll', intercomLoader);
}

document.addEventListener('scroll', () => {
  headerShadow();
});

document.addEventListener('DOMContentLoaded', () => {
  if (desktop2.matches) {
    handleHeaderSearch();
  }
  if (mobile.matches || tablet2.matches) {
    handleMobileHeaderSearch();
  }
  openNavInMobileHeader();
  handleLanguageSwitcher();

  const classExistsLP1 = document.getElementsByClassName('page-id-8173').length > 0;
  const classExistsLP2 = document.getElementsByClassName('page-id-8143').length > 0;
  const classExistsLP3 = document.getElementsByClassName('page-id-8089').length > 0;
  const classExistsLP4 = document.getElementsByClassName('page-id-8164').length > 0;

  if (classExistsLP1 || classExistsLP2 || classExistsLP3 || classExistsLP4) {
    const classExistsModalLP = document.getElementsByClassName('openModalUsrReg').length > 0;
    if (classExistsModalLP) {
      document.querySelectorAll('.openModalUsrReg').forEach(occurence => {
        occurence.classList.remove('openModalUsrReg');
      });
    }
  }

  const classExistsModal = document.getElementsByClassName('openModal').length > 0;
  const classExistsModalApp = document.getElementsByClassName('openModalApp').length > 0;
  const classExistsModalUsrReg = document.getElementsByClassName('openModalUsrReg').length > 0;

  if (mobile.matches || tablet.matches) {
    const classExistsModalL = document.getElementsByClassName('openModal').length > 0;
    if (classExistsModalL) {
      document.querySelectorAll('.openModal').forEach(occurence => {
        occurence.classList.add('app-download-link');
        occurence.classList.remove('openModal');
      });
    }

    const classExistsModalLTP = document.getElementsByClassName('openModalUsrReg').length > 0;
    if (classExistsModalLTP) {
      document.querySelectorAll('.openModalUsrReg').forEach(occurence => {
        occurence.classList.add('app-download-link');
        occurence.classList.remove('openModalUsrReg');
      });
    }
  } else {
    if (window['real_country'][0] === 'PL' || window['real_country'][0] === 'CZ' || window['real_country'][0] === 'SK') {
      document.querySelectorAll('.openModal').forEach(occurence => {
        occurence.classList.add('openModalUsrReg');
        occurence.classList.remove('openModal');
      });
    }
  }

  if (classExistsModal) {
    document.querySelectorAll('.openModal').forEach(occurence => {
      occurence.setAttribute('href', '?modal=true');
    });
    // fireModal();
    fireLeadRegModal();
  }
  if (classExistsModalApp) {
    fireAppModal();
  }
  if (classExistsModalUsrReg) {
    document.querySelectorAll('.openModalUsrReg').forEach(occurence => {
      occurence.setAttribute('href', '?modalUsrReg=true');
    });
    fireUsrRegModal();
  }

  const classExistsPayment = document.getElementsByClassName('payment-providers').length > 0;

  if (classExistsPayment) {
    if (mobile.matches) {
      const initPaymentSliderMob = new Swiper('.payment-logos-h', {
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        loop: true,
        loopFillGroupWithBlank: false,
        loopedSlides: 3,
        initialSlide: 0,
        loopedSlidesLimit: false,
        grabCursor: true,
        observer: true,
        observeParents: true,
        breakpoints: {
          0: {
            slidesPerView: 3,
            spaceBetween: 5,
          },
          390: {
            slidesPerView: 3,
            spaceBetween: 5,
          },
          412: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          440: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          768: {
            slidesPerView: 7,
            spaceBetween: 30,
          },
          1200: {
            slidesPerView: 8,
            spaceBetween: 32,
          }
        }
      });

    } else {
      const initPaymentSlider = new Swiper('.payment-logos-h', {
        breakpoints: {
          0: {
            slidesPerView: 3,
            spaceBetween: 5,
          },
          390: {
            slidesPerView: 3,
            spaceBetween: 5,
          },
          412: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          440: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          768: {
            slidesPerView: 7,
            spaceBetween: 30,
          },
          1200: {
            slidesPerView: 8,
            spaceBetween: 32,
          }
        },
        loop: false,
        loopFillGroupWithBlank: false,
        loopedSlides: 1,
        grabCursor: true,
        observer: true,
        observeParents: true
      });
    }
  }

  const classHomeFAQ = document.getElementsByClassName('hFAQ_h').length > 0;
  if (classHomeFAQ) {
    const openClose = document.querySelectorAll(".hFAQel");
    openClose.forEach(row => {
      row.addEventListener('click', (e) => {
        row.classList.toggle("showIt");

        if (row.classList.contains("showIt")) {
          row.querySelector('.showFAQ').innerHTML = '-';
        } else {
          row.querySelector('.showFAQ').innerHTML = '+';;
        }
      });
    });
  }

  window.addEventListener("load", () => {
    window.addEventListener('scroll', intercomLoader);
  });
});

function setParentHeight() {
  const parent = document.querySelector('.header-nav-list-item-content');
  const uls = document.querySelectorAll('.header-nav-list-item-content-sub_content ul');
  let parentHeight = 0;

  uls.forEach(function(ul) {
    const ulHeight = ul.offsetHeight;
    if (ulHeight > parentHeight) {
      parentHeight = ulHeight;
    }
  });

  parent.style.height = parentHeight + 'px';
}

document.addEventListener('DOMContentLoaded', () => {
  const elem = document.querySelector(".float-risk-disclaimer");
  const cookie = document.getElementById("cookie-law-info-bar");

  setTimeout(function () {
    if (elem && cookie) {
      const rect = elem.getBoundingClientRect();
      cookie.style.bottom = rect.height + 'px';
    }
  }, 2);

  const classKIDDocs = document.getElementsByClassName('documents-list-kid').length > 0;
  if (classKIDDocs) {
    const holder = document.querySelector(".documents-list-kid");
    const openClose = document.querySelector(".showKID");
    openClose.addEventListener('click', (e) => {
      holder.classList.toggle("showIt");

      if (holder.classList.contains("showIt")) {
        openClose.querySelector('.showKIDarrow').style.transform = 'rotate(90deg)';
      } else {
        openClose.querySelector('.showKIDarrow').style.transform = 'rotate(0deg)';
      }
    });
  }

  if (desktop.matches) {
    // document.querySelector('.header-nav-list-item').addEventListener('mouseover', setParentHeight);

    // var observer = new MutationObserver(function(mutations) {
    //   mutations.forEach(function(mutation) {
    //     if (mutation.attributeName === "style") {
    //       var displayStyle = window.getComputedStyle(mutation.target).display;
    //       if (displayStyle !== "none") {
    //         setParentHeight();
    //       }
    //     }
    //   });
    // });

    // var target = document.querySelector('.header-nav-list-item-content');
    // observer.observe(target, { attributes: true });

    // document.querySelector('.header-nav-list-item').addEventListener('mouseover', function() {
    //   setTimeout(setParentHeight(), 500); // Adjust delay as needed
    // });
  }

});

function waitForElement() {
  if (window.hasOwnProperty('AF_SMART_SCRIPT_RESULT')) {
    var result_url = "https://klips.com";
    if (window.hasOwnProperty('AF_SMART_SCRIPT_RESULT')) {
      result_url = AF_SMART_SCRIPT_RESULT.clickURL;
      // Add Appsflyer Smart Script link on footer, LP buttons (mobile only) and Home Apps section icons
      if ( document.querySelector('.app-download-link') ) {
        const appIcons = document.querySelectorAll('.app-download-link');
        appIcons.forEach((appIcon, index) => {
          appIcon.setAttribute('href', result_url);
        });
      }
      // Add Appsflyer Smart Script link on mobile devices header 'Get the app' button
      if ( document.querySelector('.mobile-header-wrapper-getApp .mobile-app-download-link') ) {
        const mobileAppIcons = document.querySelectorAll('.mobile-app-download-link');
        mobileAppIcons.forEach((mobileAppIcon, index) => {
          mobileAppIcon.setAttribute('href', result_url);
        });
      }
      // Add QR code in 'Get the App' popup
      if ( document.getElementById('app-modal-qr-code') ) {
        window.AF_SMART_SCRIPT.displayQrCode("app-modal-qr-code");
      }
      if ( document.getElementById('trade-app-download-qr') ) {
        window.AF_SMART_SCRIPT.displayQrCode("trade-app-download-qr");
      }
    }
  }
  else{
    setTimeout(waitForElement, 250);
  }
}

function returnDeviceTypeClass() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if (/android/i.test(userAgent)) {
    return '.type-android-device';
  }
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return '.type-ios-device';
  }
}

document.addEventListener('DOMContentLoaded', () => {

  // waitForElement();

  //Initializing Smart Script arguments
  var oneLinkURL = "https://klips.onelink.me/kRzQ/wepfy1ch";
  var mediaSource = {keys:["utm_source"],defaultValue:"my_default_source"};
  var campaign = {keys:["utm_campaign"],defaultValue:"my_default_camaping2"};
  var channel = {keys:["utm_channel"],defaultValue:"my_default_channel2"};
  var ad = {keys:["utm_ad"]};
  var adSet = {keys:["utm_adset"]};
  var googleClickIdKey = "af_sub1";
  var afSub2 = {keys:["fbclid"]};
  var utm_medium = {paramKey:"utm_medium",keys:["utm_medium"]};
  var af_keywords = {paramKey:"af_keywords",keys:["utm_term"]};
  var utm_geo = {paramKey:"utm_geo",keys:["utm_geo"]};
  var af_model = {paramKey:"af_model",keys:["utm_device"]};
  var af_ad_type = {paramKey:"af_ad_type",keys:["utm_matchtype"]};
  var af_c_id = {paramKey:"af_c_id",keys:["utm_campaign_id"]};
  var af_ad_id = {paramKey:"af_ad_id",keys:["utm_ad_id"]};
  var afSub3 = {keys:["utm_affiliate"]};
  var afSub4 = {keys:["utm_lp"]};
  var afSub5 = {keys:["utm_subid"]};
  var af_ip = {paramKey:"af_ip",keys:["utm_ip"]};
  var af_sub_siteid = {paramKey:"af_sub_siteid",keys:["utm_sub_site_id"]};
  var af_ref = {paramKey:"af_ref",keys:["utm_network"]};
  var af_os_version = {paramKey:"af_os_version",keys:["utm_browser"]};
  var af_siteid = {paramKey:"af_siteid",keys:["utm_site_id"]};
  var clickid = {paramKey:"clickid",keys:["clickid"]};
  var custom_ss_ui = {paramKey:"af_ss_ui",defaultValue:"true"};

  //Detect UTM Parameters in url
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.has('utm_source') || urlParams.has('utm_medium') || urlParams.has('utm_campaign') || urlParams.has('utm_campaign_id')
    || urlParams.has('utm_term') || urlParams.has('utm_device') || urlParams.has('utm_channel') || urlParams.has('utm_ad_id') || urlParams.has('clickid')
    || urlParams.has('utm_matchtype') || urlParams.has('utm_geo') || urlParams.has('utm_adset') || urlParams.has('utm_ad') || urlParams.has('utm_site_id')
    || urlParams.has('fbclid') || urlParams.has('af_sub1') || urlParams.has('af_adset_id') || urlParams.has('utm_affiliate') || urlParams.has('utm_lp')
    || urlParams.has('utm_subid') || urlParams.has('utm_ip') || urlParams.has('utm_sub_site_id') || urlParams.has('utm_network') || urlParams.has('utm_browser')) {

    // If there are, store them in Session Storage
    sessionStorage.setItem('utm_source', urlParams.get('utm_source') || '');
    sessionStorage.setItem('utm_medium', urlParams.get('utm_medium') || '');
    sessionStorage.setItem('utm_campaign', urlParams.get('utm_campaign') || '');
    sessionStorage.setItem('utm_campaign_id', urlParams.get('utm_campaign_id') || '');
    sessionStorage.setItem('utm_ad_id', urlParams.get('utm_ad_id') || '');
    sessionStorage.setItem('utm_ad', urlParams.get('utm_ad') || '');
    sessionStorage.setItem('utm_channel', urlParams.get('utm_channel') || '');
    sessionStorage.setItem('utm_adset', urlParams.get('utm_adset') || '');
    sessionStorage.setItem('utm_term', urlParams.get('utm_term') || '');
    sessionStorage.setItem('utm_device', urlParams.get('utm_device') || '');
    sessionStorage.setItem('utm_matchtype', urlParams.get('utm_matchtype') || '');
    sessionStorage.setItem('utm_geo', urlParams.get('utm_geo') || '');
    sessionStorage.setItem('fbclid', urlParams.get('fbclid') || '');
    sessionStorage.setItem('af_sub1', urlParams.get('af_sub1') || '');
    sessionStorage.setItem('utm_adset_id', urlParams.get('af_adset_id') || '');
    sessionStorage.setItem('utm_affiliate', urlParams.get('utm_affiliate') || '');
    sessionStorage.setItem('utm_lp', urlParams.get('utm_lp') || '');
    sessionStorage.setItem('utm_subid', urlParams.get('utm_subid') || '');
    sessionStorage.setItem('utm_ip', urlParams.get('utm_ip') || '');
    sessionStorage.setItem('utm_sub_site_id', urlParams.get('utm_sub_site_id') || '');
    sessionStorage.setItem('utm_network', urlParams.get('utm_network') || '');
    sessionStorage.setItem('utm_browser', urlParams.get('utm_browser') || '');
    sessionStorage.setItem('utm_site_id', urlParams.get('utm_site_id') || '');
    sessionStorage.setItem('clickid', urlParams.get('clickid') || '');
  }

  //Cheking Session Storage for UTM
  if (sessionStorage.getItem('utm_source') !== 'undefined' && sessionStorage.getItem('utm_source') !== null) {
    const utmSource = sessionStorage.getItem('utm_source');
    if (utmSource) {
      mediaSource.defaultValue = utmSource;
    }
  }
  if (sessionStorage.getItem('utm_medium') !== 'undefined' && sessionStorage.getItem('utm_medium') !== null) {
    const utmMedium = sessionStorage.getItem('utm_medium');
    utm_medium.defaultValue = utmMedium;
  }
  if (sessionStorage.getItem('utm_campaign') !== 'undefined' && sessionStorage.getItem('utm_campaign') !== null) {
    const utmCampaign = sessionStorage.getItem('utm_campaign');
    if (utmCampaign) {
      campaign.defaultValue = utmCampaign;
    }
  }
  if (sessionStorage.getItem('af_sub1') !== 'undefined' && sessionStorage.getItem('af_sub1') !== null) {
    const utmAfsub1 = sessionStorage.getItem('af_sub1');
    googleClickIdKey.defaultValue = utmAfsub1;
  }
  if (sessionStorage.getItem('utm_campaign_id') !== 'undefined' && sessionStorage.getItem('utm_campaign_id') !== null) {
    const utmCampaignID = sessionStorage.getItem('utm_campaign_id');
    af_c_id.defaultValue = utmCampaignID;
  }
  if (sessionStorage.getItem('utm_ad') !== 'undefined' && sessionStorage.getItem('utm_ad') !== null) {
    const utmAd = sessionStorage.getItem('utm_ad');
    ad.defaultValue = utmAd;
  }
  if (sessionStorage.getItem('utm_ad_id') !== 'undefined' && sessionStorage.getItem('utm_ad_id') !== null) {
    const utmAdId = sessionStorage.getItem('utm_ad_id');
    af_ad_id.defaultValue = utmAdId;
  }
  if (sessionStorage.getItem('utm_adset') !== 'undefined' && sessionStorage.getItem('utm_adset') !== null) {
    const utmAdset = sessionStorage.getItem('utm_adset');
    adSet.defaultValue = utmAdset;
  }
  if (sessionStorage.getItem('utm_term') !== 'undefined' && sessionStorage.getItem('utm_term') !== null) {
    const utmTerm = sessionStorage.getItem('utm_term');
    af_keywords.defaultValue = utmTerm;
  }
  if (sessionStorage.getItem('utm_device') !== 'undefined' && sessionStorage.getItem('utm_device') !== null) {
    const utmDevice = sessionStorage.getItem('utm_device');
    af_model.defaultValue = utmDevice;
  }
  if (sessionStorage.getItem('utm_matchtype') !== 'undefined' && sessionStorage.getItem('utm_matchtype') !== null) {
    const utmMatchtype = sessionStorage.getItem('utm_matchtype');
    af_ad_type.defaultValue = utmMatchtype;
  }
  if (sessionStorage.getItem('utm_geo') !== 'undefined' && sessionStorage.getItem('utm_geo') !== null) {
    const utmGeo = sessionStorage.getItem('utm_geo');
    utm_geo.defaultValue = utmGeo;
  }
  if (sessionStorage.getItem('af_ss_ui') !== 'undefined' && sessionStorage.getItem('af_ss_ui') !== null) {
    const utmAfSS = sessionStorage.getItem('af_ss_ui');
    custom_ss_ui.defaultValue = utmAfSS;
  }
  if (sessionStorage.getItem('fbclid') !== 'undefined' && sessionStorage.getItem('fbclid') !== null) {
    const utmfbc = sessionStorage.getItem('fbclid');
    afSub2.defaultValue = utmfbc;
  }
  if (sessionStorage.getItem('utm_channel') !== 'undefined' && sessionStorage.getItem('utm_channel') !== null) {
    const utmChannel = sessionStorage.getItem('utm_channel');
    channel.defaultValue = utmChannel;
  }
  if (sessionStorage.getItem('utm_affiliate') !== 'undefined' && sessionStorage.getItem('utm_affiliate') !== null) {
    const utmAffiliate = sessionStorage.getItem('utm_affiliate');
    afSub3.defaultValue = utmAffiliate;
  }
  if (sessionStorage.getItem('utm_lp') !== 'undefined' && sessionStorage.getItem('utm_lp') !== null) {
    const utmLp = sessionStorage.getItem('utm_lp');
    afSub4.defaultValue = utmLp;
  }
  if (sessionStorage.getItem('utm_subid') !== 'undefined' && sessionStorage.getItem('utm_subid') !== null) {
    const utmSubid = sessionStorage.getItem('utm_subid');
    afSub5.defaultValue = utmSubid;
  }
  if (sessionStorage.getItem('utm_ip') !== 'undefined' && sessionStorage.getItem('utm_ip') !== null) {
    const utmIp = sessionStorage.getItem('utm_ip');
    af_ip.defaultValue = utmIp;
  }
  if (sessionStorage.getItem('utm_sub_site_id') !== 'undefined' && sessionStorage.getItem('utm_sub_site_id') !== null) {
    const utmSubSiteID = sessionStorage.getItem('utm_sub_site_id');
    af_sub_siteid.defaultValue = utmSubSiteID;
  }
  if (sessionStorage.getItem('utm_network') !== 'undefined' && sessionStorage.getItem('utm_network') !== null) {
    const utmNetwork = sessionStorage.getItem('utm_network');
    af_ref.defaultValue = utmNetwork;
  }
  if (sessionStorage.getItem('utm_browser') !== 'undefined' && sessionStorage.getItem('utm_browser') !== null) {
    const utmBrowser = sessionStorage.getItem('utm_browser');
    af_os_version.defaultValue = utmBrowser;
  }
  if (sessionStorage.getItem('utm_site_id') !== 'undefined' && sessionStorage.getItem('utm_site_id') !== null) {
    const utmSiteId = sessionStorage.getItem('utm_site_id');
    af_siteid.defaultValue = utmSiteId;
  }
  if (sessionStorage.getItem('clickid') !== 'undefined' && sessionStorage.getItem('clickid') !== null) {
    const utmClickId = sessionStorage.getItem('clickid');
    clickid.defaultValue = utmClickId;
  }

  //Generate Link
  var result = window.AF_SMART_SCRIPT.generateOneLinkURL({
    oneLinkURL: oneLinkURL,
    afParameters: {
        mediaSource: mediaSource,
        campaign: campaign,
        channel: channel,
        ad: ad,
        adSet: adSet,
        googleClickIdKey: googleClickIdKey,
        afSub2: afSub2,
        afCustom: [
            utm_medium,
            af_keywords,
            utm_geo,
            af_model,
            af_ad_type,
            af_c_id,
            af_ad_id,
            af_ip,
            af_sub_siteid,
            af_ref,
            af_os_version,
            af_siteid,
            clickid,
            custom_ss_ui
        ],
        afSub3: afSub3,
        afSub4: afSub4,
        afSub5: afSub5
    }
  });

  if (result) {
    result_url = result.clickURL;

    if ( document.querySelector('.app-download-link') ) {
      const appIcons = document.querySelectorAll('.app-download-link');
      appIcons.forEach((appIcon, index) => {
        appIcon.setAttribute('href', result_url);
      });
    }
    // Add Appsflyer Smart Script link on mobile devices header 'Get the app' button
    if ( document.querySelector('.mobile-header-wrapper-getApp .mobile-app-download-link') ) {
      const mobileAppIcons = document.querySelectorAll('.mobile-app-download-link');
      mobileAppIcons.forEach((mobileAppIcon, index) => {
        mobileAppIcon.setAttribute('href', result_url);
      });
    }
    // Add QR code in 'Get the App' popup
    if ( document.getElementById('app-modal-qr-code') ) {
      window.AF_SMART_SCRIPT.displayQrCode("app-modal-qr-code");
    }
    if ( document.getElementById('trade-app-download-qr') ) {
      window.AF_SMART_SCRIPT.displayQrCode("trade-app-download-qr");
    }
  }

  // Device type checks for Android/iOS/Huawei app store icons
  const getDeviceTypeClass = returnDeviceTypeClass();

  document.querySelectorAll('.type-android-device, .type-ios-device, .type-huawei-device').forEach((allDevices, index) => {
    allDevices.style.display = 'none';
  });

  document.querySelectorAll(getDeviceTypeClass).forEach((currentDevice, index) => {
    currentDevice.style.display = 'block';
    currentDevice.style.opacity = '1';
  });

  let params = (new URL(document.location)).searchParams;
  const url2 = new URL(window.location);

  if(params.get('modal')){
    const modalWindow = document.getElementById("modal");
    const modalClose = modalWindow.querySelector(".modalClose");
    const chkBoxLabels = modalWindow.querySelectorAll('.forminator-checkbox');

    params.get('modal') ? document.getElementById("modal").style.display = "block" : null;

    chkBoxLabels.forEach(b => {
      b.removeAttribute('title');
    });

    modalClose.onclick = function () {
      modalWindow.style.display = "none";
      url2.searchParams.delete('modal');
      window.history.pushState(null, '', url2.toString());
    }
  } else if (params.get('modalApp')) {
    const modalWindow2 = document.getElementById("modalApp");
    const modalClose2 = modalWindow2.querySelector(".modalClose");

    params.get('modalApp') ? document.getElementById("modalApp").style.display = "block" : null;
    modalClose2.onclick = function () {
      modalWindow2.style.display = "none";
      url2.searchParams.delete('modalApp');
      window.history.pushState(null, '', url2.toString());
    }
  } else if (params.get('modalUsrReg')) {
    fireUsrRegModal();
  } else if (params.get('intercom')) {
    params.get('intercom') ? Intercom('show') : null;
  } else if (params.get('hide_header_footer')) {
    document.querySelectorAll('.mobile-header-wrapper-getApp').forEach((mobDevice) => {
      mobDevice.style.display = 'none';
    });
  }

  // dataLayer related code for GTM
  let pageTitleName = document.querySelector('.page-title-container').innerText;
  let pageEventOrigin = document.querySelector('.page-title-container').getAttribute('data-event-origin');
  let utmSourceGTM = '';
  let utmCampaignGTM = '';
  let utmMediumGTM = '';
  let utmAdsetIdGTM = '';
  let utmAdIdGTM = '';
  let utmTermGTM = '';
  let utmCampaignidGTM = '';
  let utmDeviceGTM = '';
  let utmChannelGTM = '';
  let utmMatchtypeGTM = '';
  let utmGeoGTM = '';
  let utmAdsetGTM = '';
  let fbclidGTM = '';
  let utmAdGTM = '';
  let afSub3GTM = '';
  let afSub4GTM = '';
  let afSub5GTM = '';
  let afIpGTM = '';
  let afSubSiteidGTM = '';
  let afRefGTM = '';
  let afOsVersionGTM = '';

  if (sessionStorage.getItem('utm_source') !== 'undefined' && sessionStorage.getItem('utm_source') !== null) {
    utmSourceGTM = sessionStorage.getItem('utm_source');
  }
  if (sessionStorage.getItem('utm_medium') !== 'undefined' && sessionStorage.getItem('utm_medium') !== null) {
    utmMediumGTM = sessionStorage.getItem('utm_medium');
  }
  if (sessionStorage.getItem('utm_campaign') !== 'undefined' && sessionStorage.getItem('utm_campaign') !== null) {
    utmCampaignGTM = sessionStorage.getItem('utm_campaign');
  }
  if (sessionStorage.getItem('utm_ad_id') !== 'undefined' && sessionStorage.getItem('utm_ad_id') !== null) {
    utmAdIdGTM = sessionStorage.getItem('utm_ad_id');
  }
  if (sessionStorage.getItem('utm_ad') !== 'undefined' && sessionStorage.getItem('utm_ad') !== null) {
    utmAdGTM = sessionStorage.getItem('utm_ad');
  }
  if (sessionStorage.getItem('utm_adset_id') !== 'undefined' && sessionStorage.getItem('utm_adset_id') !== null) {
    utmAdsetIdGTM = sessionStorage.getItem('utm_adset_id');
  }
  if (sessionStorage.getItem('utm_term') !== 'undefined' && sessionStorage.getItem('utm_term') !== null) {
    utmTermGTM = sessionStorage.getItem('utm_term');
  }
  if (sessionStorage.getItem('utm_campaign_id') !== 'undefined' && sessionStorage.getItem('utm_campaign_id') !== null) {
    utmCampaignidGTM = sessionStorage.getItem('utm_campaign_id');
  }
  if (sessionStorage.getItem('utm_device') !== 'undefined' && sessionStorage.getItem('utm_device') !== null) {
    utmDeviceGTM = sessionStorage.getItem('utm_device');
  }
  if (sessionStorage.getItem('utm_channel') !== 'undefined' && sessionStorage.getItem('utm_channel') !== null) {
    utmChannelGTM = sessionStorage.getItem('utm_channel');
  }
  if (sessionStorage.getItem('utm_matchtype') !== 'undefined' && sessionStorage.getItem('utm_matchtype') !== null) {
    utmMatchtypeGTM = sessionStorage.getItem('utm_matchtype');
  }
  if (sessionStorage.getItem('utm_geo') !== 'undefined' && sessionStorage.getItem('utm_geo') !== null) {
    utmGeoGTM = sessionStorage.getItem('utm_geo');
  }
  if (sessionStorage.getItem('utm_adset') !== 'undefined' && sessionStorage.getItem('utm_adset') !== null) {
    utmAdsetGTM = sessionStorage.getItem('utm_adset');
  }
  if (sessionStorage.getItem('fbclid') !== 'undefined' && sessionStorage.getItem('fbclid') !== null) {
    fbclidGTM = sessionStorage.getItem('fbclid');
  }
  if (sessionStorage.getItem('utm_affiliate') !== 'undefined' && sessionStorage.getItem('utm_affiliate') !== null) {
    afSub3GTM = sessionStorage.getItem('utm_affiliate');
  }
  if (sessionStorage.getItem('utm_lp') !== 'undefined' && sessionStorage.getItem('utm_lp') !== null) {
    afSub4GTM = sessionStorage.getItem('utm_lp');
  }
  if (sessionStorage.getItem('utm_subid') !== 'undefined' && sessionStorage.getItem('utm_subid') !== null) {
    afSub5GTM = sessionStorage.getItem('utm_subid');
  }
  if (sessionStorage.getItem('utm_ip') !== 'undefined' && sessionStorage.getItem('utm_ip') !== null) {
    afIpGTM = sessionStorage.getItem('utm_ip');
  }
  if (sessionStorage.getItem('utm_sub_site_id') !== 'undefined' && sessionStorage.getItem('utm_sub_site_id') !== null) {
    afSubSiteidGTM = sessionStorage.getItem('utm_sub_site_id');
  }
  if (sessionStorage.getItem('utm_network') !== 'undefined' && sessionStorage.getItem('utm_network') !== null) {
    afRefGTM = sessionStorage.getItem('utm_network');
  }
  if (sessionStorage.getItem('utm_browser') !== 'undefined' && sessionStorage.getItem('utm_browser') !== null) {
    afOsVersionGTM = sessionStorage.getItem('utm_browser');
  }

  window.dataLayer = window.dataLayer || [];

  if ( document.body.classList.contains('page-template-landing-pages') ) {
    window.dataLayer.push({
      'screen': 'LANDING_PAGE',
      'ScreenType': 'LANDING_PAGE',
      'pageTitle': pageTitleName,
      'utm_source': utmSourceGTM,
      'utm_campaign': utmCampaignGTM,
      'utm_medium': utmMediumGTM,
      'utm_adset_id': utmAdsetIdGTM,
      'utm_ad': utmAdGTM,
      'utm_ad_id': utmAdIdGTM,
      'utm_term': utmTermGTM,
      'event_origin': pageEventOrigin,
      'type': window.location.href,
      'utm_campaign_id': utmCampaignidGTM,
      'utm_device': utmDeviceGTM,
      'utm_channel': utmChannelGTM,
      'utm_matchtype': utmMatchtypeGTM,
      'utm_geo': utmGeoGTM,
      'utm_adset': utmAdsetGTM,
      'utm_affiliate': afSub3GTM,
      'utm_lp': afSub4GTM,
      'utm_subid': afSub5GTM,
      'utm_ip': afIpGTM,
      'utm_sub_site_id': afSubSiteidGTM,
      'utm_network': afRefGTM,
      'utm_browser': afOsVersionGTM,
      'fbclid': fbclidGTM
    });
  } else if ( document.body.classList.contains('single') ) {
    window.dataLayer.push({
      'screen': pageTitleName,
      'ScreenType': 'WEBSITE',
      'pageTitle': pageTitleName,
      'utm_source': utmSourceGTM,
      'utm_campaign': utmCampaignGTM,
      'utm_medium': utmMediumGTM,
      'utm_adset_id': utmAdsetIdGTM,
      'utm_ad': utmAdGTM,
      'utm_ad_id': utmAdIdGTM,
      'utm_term': utmTermGTM,
      'event_origin': pageEventOrigin,
      'type': window.location.href,
      'utm_campaign_id': utmCampaignidGTM,
      'utm_device': utmDeviceGTM,
      'utm_channel': utmChannelGTM,
      'utm_matchtype': utmMatchtypeGTM,
      'utm_geo': utmGeoGTM,
      'utm_adset': utmAdsetGTM,
      'utm_affiliate': afSub3GTM,
      'utm_lp': afSub4GTM,
      'utm_subid': afSub5GTM,
      'utm_ip': afIpGTM,
      'utm_sub_site_id': afSubSiteidGTM,
      'utm_network': afRefGTM,
      'utm_browser': afOsVersionGTM,
      'fbclid': fbclidGTM
    });
  } else if ( document.body.classList.contains('category-learn') ) {
    window.dataLayer.push({
      'screen': 'LEARN',
      'ScreenType': 'WEBSITE',
      'pageTitle': 'LEARN',
      'utm_source': utmSourceGTM,
      'utm_campaign': utmCampaignGTM,
      'utm_medium': utmMediumGTM,
      'utm_adset_id': utmAdsetIdGTM,
      'utm_ad': utmAdGTM,
      'utm_ad_id': utmAdIdGTM,
      'utm_term': utmTermGTM,
      'event_origin': pageEventOrigin,
      'utm_campaign_id': utmCampaignidGTM,
      'utm_device': utmDeviceGTM,
      'utm_channel': utmChannelGTM,
      'utm_matchtype': utmMatchtypeGTM,
      'utm_geo': utmGeoGTM,
      'utm_adset': utmAdsetGTM,
      'utm_affiliate': afSub3GTM,
      'utm_lp': afSub4GTM,
      'utm_subid': afSub5GTM,
      'utm_ip': afIpGTM,
      'utm_sub_site_id': afSubSiteidGTM,
      'utm_network': afRefGTM,
      'utm_browser': afOsVersionGTM,
      'fbclid': fbclidGTM
    });
  } else if ( document.body.classList.contains('tag') ) {
    let tagName = document.querySelector('body.tag .tags-results-container .top-results-info .tag-name').innerText;
    window.dataLayer.push({
      'screen': pageTitleName,
      'ScreenType': 'WEBSITE',
      'pageTitle': pageTitleName,
      'utm_source': utmSourceGTM,
      'utm_campaign': utmCampaignGTM,
      'utm_medium': utmMediumGTM,
      'utm_adset_id': utmAdsetIdGTM,
      'utm_ad': utmAdGTM,
      'utm_ad_id': utmAdIdGTM,
      'utm_term': utmTermGTM,
      'event_origin': pageEventOrigin,
      'tag': tagName,
      'utm_campaign_id': utmCampaignidGTM,
      'utm_device': utmDeviceGTM,
      'utm_channel': utmChannelGTM,
      'utm_matchtype': utmMatchtypeGTM,
      'utm_geo': utmGeoGTM,
      'utm_adset': utmAdsetGTM,
      'utm_affiliate': afSub3GTM,
      'utm_lp': afSub4GTM,
      'utm_subid': afSub5GTM,
      'utm_ip': afIpGTM,
      'utm_sub_site_id': afSubSiteidGTM,
      'utm_network': afRefGTM,
      'utm_browser': afOsVersionGTM,
      'fbclid': fbclidGTM
    });
  } else if ( document.body.classList.contains('page-template-asset') ) {
    const urlParams2 = new URLSearchParams(window.location.search);
    let instName = urlParams2.get('instrument');
    window.dataLayer.push({
      'screen': pageTitleName,
      'ScreenType': 'WEBSITE',
      'pageTitle': pageTitleName,
      'utm_source': utmSourceGTM,
      'utm_campaign': utmCampaignGTM,
      'utm_medium': utmMediumGTM,
      'utm_adset_id': utmAdsetIdGTM,
      'utm_ad': utmAdGTM,
      'utm_ad_id': utmAdIdGTM,
      'utm_term': utmTermGTM,
      'event_origin': pageEventOrigin,
      'instrument_name': instName,
      'utm_campaign_id': utmCampaignidGTM,
      'utm_device': utmDeviceGTM,
      'utm_channel': utmChannelGTM,
      'utm_matchtype': utmMatchtypeGTM,
      'utm_geo': utmGeoGTM,
      'utm_adset': utmAdsetGTM,
      'utm_affiliate': afSub3GTM,
      'utm_lp': afSub4GTM,
      'utm_subid': afSub5GTM,
      'utm_ip': afIpGTM,
      'utm_sub_site_id': afSubSiteidGTM,
      'utm_network': afRefGTM,
      'utm_browser': afOsVersionGTM,
      'fbclid': fbclidGTM
    });
  } else {
    window.dataLayer.push({
      'screen': pageTitleName,
      'ScreenType': 'WEBSITE',
      'pageTitle': pageTitleName,
      'utm_source': utmSourceGTM,
      'utm_campaign': utmCampaignGTM,
      'utm_medium': utmMediumGTM,
      'utm_adset_id': utmAdsetIdGTM,
      'utm_ad': utmAdGTM,
      'utm_ad_id': utmAdIdGTM,
      'utm_term': utmTermGTM,
      'event_origin': pageEventOrigin,
      'utm_campaign_id': utmCampaignidGTM,
      'utm_device': utmDeviceGTM,
      'utm_channel': utmChannelGTM,
      'utm_matchtype': utmMatchtypeGTM,
      'utm_geo': utmGeoGTM,
      'utm_adset': utmAdsetGTM,
      'utm_affiliate': afSub3GTM,
      'utm_lp': afSub4GTM,
      'utm_subid': afSub5GTM,
      'utm_ip': afIpGTM,
      'utm_sub_site_id': afSubSiteidGTM,
      'utm_network': afRefGTM,
      'utm_browser': afOsVersionGTM,
      'fbclid': fbclidGTM
    });
  }

  document.querySelectorAll('a').forEach(btn => {
    btn.addEventListener('click', (e) => {
      let btnDataType = btn.getAttribute('data-type');
      let btnDataPosition = btn.getAttribute('data-position');
      if (btn.classList.contains('btn')) {
        window.dataLayer.push({
          'type': btnDataType,
          'position': btnDataPosition,
        });
      }
      if (btn.classList.contains('openModal') || btn.classList.contains('openModalUsrReg')) {
        window.dataLayer.push({
          'modal_name': 'SIGN_UP_FORM',
        });
      }
      if (btn.classList.contains('openModalApp')) {
        window.dataLayer.push({
          'modal_name': 'GET_LINK',
        });
      }
      if (btn.classList.contains('app-download-link')) {
        window.dataLayer.push({
          'type': btnDataType,
          'position': btnDataPosition,
        });
      }
      if (btn.classList.contains('footer-social-icon')) {
        window.dataLayer.push({
          'type': btnDataType,
        });
      }
    });
  });

});