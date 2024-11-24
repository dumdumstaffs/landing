jQuery(document).ready(function ($) {
    // function fixedH() {
    //   if ($(document).header-fixed() >= 105) {
    //     $(".header").addClass('header-fixed')
    //   } else {
    //     $(".header").removeClass('header-fixed')
    //   }
    // }
    // function showSc() {
    //   if ($(window).scrollTop() >= 105 && $('.header-mobile-conten').length != 0) {
    //     $(".header").addClass('header-fixed')
    //   } else if ($(window).scrollTop() < 105 || $('.header-pc-content').length != 0) {
    //     $(".header").removeClass('header-fixed')
    //   }
    // }
    // $(window).on('load', function () {
    //   fixedH();
    //   showSc();
    // });
  
    // $(window).resize(function () {
    //   showSc();
    // });
  
    // $(window).scroll(function () {
    //   fixedH();
    //   showSc();
    // });
  
    $(".mobile-menu-hamburger").on("click", function () {
      $(".mobile-menu").slideToggle("fast");
      return false;
    });
    $(".mobile-menu-colse img").on("click", function () {
      $(".mobile-menu").slideToggle("fast");
      return false;
    });
  
    $(".header-menu li.menu-item-has-children").each(function () {
      $(this).find('a').eq(0).append("<span class='accordsuffix'></span>");
    });
  
    $(".header-menu li.menu-item-has-children > a").click(function () {
      if (!$(this).hasClass("active")) {
        $(this).parent().parent().find("ul").slideUp("normal");
        $(this).parent().parent().find("a").removeClass("active");
        $(this).parent().parent().find("li").removeClass("selected-li");
  
        $(this).parent().find("ul").eq(0).slideDown("normal");
        $(this).addClass("active");
        $(this).parent().addClass("selected-li");
  
      } else {
        $(this).parent().find("ul").eq(0).slideUp("normal");
        $(this).removeClass("active");
        $(this).parent().removeClass("selected-li");
      }
      return false;
    });
  
    $(".header-language-nav").click(function (e) {
      $(".header-language-inner").fadeToggle("fast");
      e.stopPropagation();
      return false;
    });
  
  
    $(".header-language-inner").click(function (e) {
      e.stopPropagation();
    });
    $(document.body).click(function () {
      $(".header-language-inner").fadeOut();
    });
  
    $(".header-phone-nav").click(function () {
      window.location.href = "/about-us/markets/contact-us/";
    })
  
  
    if (window.innerWidth > 768) {
      $(".header-menu-wrapper").stop().animate({ width: "1160px" }, 500, function () {
        $(".header-menu-wrapper").stop().animate({ height: "75px" }, 500, function () {
          $(".header-menu-wrapper").css("overflow", "visible");
        });
      });
    }
  
    var flag = true;
  
    $(window).scroll(function () {
      if (window.innerWidth > 768) {
        var s = $(window).scrollTop();
        if (s > 50) {
          if (flag) {
            $(".header-menu-wrapper ul li a,.header-menu-wrapper .header-logo").stop().animate({  }, 100, function () {
              $(".header-menu-wrapper").stop().animate({ width: "100%" }, 500, function () {
                $(".header-menu-wrapper").stop().animate({ height: "75px" }, 500, function () {
                  $(".header-menu-wrapper").css("overflow", "visible");
                });
              });
            })
            $(".header-top-bar").addClass("bg");
            flag = false;
          }
        } else {
          if (!flag) {
  
            $(".header-menu-wrapper ul li a,.header-menu-wrapper .header-logo").stop().animate({ opacity: 0 }, 100, function () {
              $(".header-menu-wrapper").stop().animate({ width: "1160px" }, 500, function () {
                $(".header-menu-wrapper ul li a,.header-menu-wrapper .header-logo").stop().animate({ opacity: 1 }, 100);
              });
  
            });
            $(".header-top-bar").removeClass("bg");
            flag = true;
          }
        }
      }
    })
  
  
  
    setTimeout(function () {
      $(".load7").hide();
      $(".load7 .loader").css({
        "animation": "none",
        "-webkit-animation": "none"
      });
      $(".desktop-reg-link>ul").show();
    }, 3000)
  
    $(window).resize(function () {
      if ($('.header-pc-content').length != 0) {
        $(".header-menu-wrapper").css({ "overflow": "visible" });
      }
      if (window.innerWidth > 1022) {
        $(".header-menu-wrapper").css({ "width": "100%", "height": "auto" });
      }
  
    });
    $('.sf-menu > li').mouseenter(function () {
      $(this).addClass('sfHover')
      $(this).siblings().removeClass('sfHover')
      $(this).parent('.sf-menu').siblings().find('li').removeClass('sfHover')
      if ($('.header-pc-content').length != 0) {
        $(".header-menu-wrapper").css({ "overflow": "visible" });
      }
    })
  
    $('.header-menu-wrapper').mouseleave(function () {
      $(this).find('.sf-menu>li').removeClass('sfHover')
    })
  
  });