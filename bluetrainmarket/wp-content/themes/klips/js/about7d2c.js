function isMobile() {
  const screenWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  return screenWidth < 768;
}

function initMediaLoader() {}

function initOfficeAccordion() {
  const cardHeaderList = document.querySelectorAll(
    ".office-card .office-title"
  );
  const cardDetailList = document.querySelectorAll(
    ".office-card .office-detail"
  );

  for (const cardHeader of cardHeaderList) {
    cardHeader.addEventListener("click", (e) => {
      const card = e.currentTarget.parentElement;

      if (card.classList.contains("active")) return;

      document
        .querySelectorAll(".office-card.active")
        .forEach((card) => card.classList.remove("active"));

      card.classList.add("active");
    });
  }

  cardDetailList.forEach((detail) =>
    detail.style.setProperty(
      "--office-detail-height",
      `${
        detail.scrollHeight + 10 // padding-bottom: 1rem
      }px`
    )
  );
}

function initVisionLicense() {
  new Swiper(".licences-list", {
    navigation: {
      nextEl: ".licences-next",
      prevEl: ".licences-prev",
    },
    loop: true,
    loopFillGroupWithBlank: true,
    slidesPerView: "auto",
    loopedSlides: isMobile() ? 3 : 6,
    spaceBetween: isMobile() ? 29 : 60,
    grabCursor: true,
  });
}

function initMilestones() {
  if (isMobile()) {
    return;
  }

  const milestonesDate = new Swiper(".milestones-dates", {
    on: {
      activeIndexChange: (swiper) => {
        if (swiper.activeIndex === 0) {
          document.querySelector(".milestones-dates").classList.add("at-begin");
        } else {
          document
            .querySelector(".milestones-dates")
            .classList.remove("at-begin");
        }

        const dates = document.querySelectorAll(
          ".milestones-dates .swiper-slide"
        );
        dates.forEach((date) => {
          if (date.classList.contains("highlight"))
            date.classList.remove("highlight");
        });
        dates.item(swiper.activeIndex).classList.add("highlight");

        const cards = document.querySelectorAll(
          ".milestones-contents .milestones-card"
        );
        cards.forEach((card) => {
          if (card.classList.contains("highlight"))
            card.classList.remove("highlight");
        });
        cards.item(swiper.activeIndex).classList.add("highlight");
      },
    },
    slidesPerView: 3,
    // centeredSlides: true,
    watchSlidesProgress: true,
    slideToClickedSlide: true,
    // direction: isMobile() ? "vertical" : "horizontal",
  });

  const milestonesContents = new Swiper(".milestones-contents", {
    pagination: {
      el: ".milestones-contents > .milestones-pagination",
      clickable: true,
    },
    slidesPerView: 3,
    // centeredSlides: true,
    spaceBetween: 53,
    watchSlidesProgress: true,
    slideToClickedSlide: true,
    grabCursor: true,
    autoHeight: true,
    // direction: isMobile() ? "vertical" : "horizontal",
  });

  milestonesContents.controller.control = milestonesDate;
  milestonesDate.controller.control = milestonesContents;
}

function initCareerListSection() {
  new Swiper('.careers-image-slideshow', {
    loop: true,
    slidesPerView: 4,
    spaceBetween: 0,
    autoplay: {
      disableOnInteraction: true
    },
    centeredSlides: false,
    grabCursor: true, 
    observer: true,
    observeParents: true,
    breakpoints: {
      0: {
        slidesPerView: 'auto',
        autoplay: {
          disableOnInteraction: false
        }
      },
      620: {
        slidesPerView: 2
      },
      920: {
        slidesPerView: 3
      },
      1440: {
        slidesPerView: 4
      }
    }
  });

  const mySwiper = document.querySelector('.careers-image-slideshow').swiper;
  const mySwiperH = document.querySelector('.swiper-wrapper');

  mySwiperH.addEventListener("mouseenter", () => {
    mySwiper.autoplay.stop();
  });
  mySwiperH.addEventListener("mouseleave", () => {
    mySwiper.autoplay.start();
  });
      
  if (mobile.matches || tablet.matches) {
    mySwiper.on('slideChange', function () {
      mySwiper.autoplay.start();
    });     
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const milestonesCount = document.querySelectorAll(
    ".milestones-dates .swiper-slide"
  ).length;
  if (milestonesCount > 3) {
    initMilestones();
  }

  window.addEventListener("resize", (e) => {
    if (milestonesCount <= 3) return;
    initMilestones();
  });

  // initVisionLicense();
  const classSliderSection = document.getElementsByClassName('about-careers').length > 0;

  if (classSliderSection) {
    initCareerListSection();
  }
  
  // Disable for the launch
  // initOfficeAccordion();
});
