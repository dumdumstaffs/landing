window.log=function(){if(log.history=log.history||[],log.history.push(arguments),this.console){var e,s=arguments;s.callee=s.callee.caller,e=[].slice.call(s),"object"==typeof console.log?log.apply.call(console.log,console,e):console.log.apply(console,e)}},function(e){function s(){}for(var n,o="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(",");n=o.pop();)e[n]=e[n]||s}(function(){try{return console.log(),window.console}catch(e){return window.console={}}}()),$(function(){$(window).on("scroll",function(){$(".js-paralax").each(function(){var e=$(this),s=-$(window).scrollTop()/e.data("speed");e.css("transform","translateY("+s+"px)")})})}),$(function(){var e=$(".js-header");$(".js-header-cntrl"),$(".js-submenu-wrap");function s(){10<$(window).scrollTop()?(e.addClass("-is-scrolled").removeClass("-isn-scrolled"),$("body").removeClass("-lng-visible")):e.removeClass("-is-scrolled").addClass("-isn-scrolled")}s(),$(window).scroll(function(){s()}),$(window).resize(function(){s()})}),$(function(){var e=$(".js-header"),s=$(".js-header-cntrl"),n=$(".js-submenu-m");s.click(function(){$("body").toggleClass("-mobile-menu-open"),n.removeClass("-selected"),e.removeClass("-submenu-open")})}),$(function(){var s=$(".js-lng-cntrl"),n=$(".js-lng-nav"),e=$(".js-lng-close");s.click(function(){return $("body").toggleClass("-lng-visible"),!1}),e.click(function(){$("body").removeClass("-lng-visible")}),$(document).mouseup(function(e){n.is(e.target)||0!==n.has(e.target).length||s.is(e.target)||0!==s.has(e.target).length||$("body").removeClass("-lng-visible")})}),$(function(){var s,n=$(".js-submenu-cntr"),o=$(".js-submenu"),t=$(".js-header"),l=($(".js-subnav-cntrl"),$(".js-submenu-wrap")),e=0,a=0;function c(){l.removeClass("-is-open"),o.removeClass("-selected"),n.removeClass("-selected").removeClass("-disabled")}n.on("mouseenter click",function(){clearTimeout(e),s=$(this).index(),a=setTimeout(function(){var e;e=s,o.removeClass("-selected").eq(e).addClass("-selected"),n.removeClass("-selected").addClass("-disabled").eq(e).addClass("-selected").removeClass("-disabled"),l.addClass("-is-open"),t.addClass("-submenu-open")},200)}),n.on("mouseleave",function(){clearTimeout(a)}),l.hover(function(){clearTimeout(e)}),l.on("mouseleave",function(){e=setTimeout(function(){c()},500)}),$(window).scroll(function(){c()}),$(document).keyup(function(e){27==e.keyCode&&c()})}),$(function(){var s,n=$(".js-header"),o=$(".js-submenu-cntr-m"),t=$(".js-submenu-m"),e=$(".js-subnav-cntrl-m");o.click(function(){var e;return s=$(this).index(),e=s,t.removeClass("-selected").eq(e).addClass("-selected"),o.removeClass("-selected").eq(e).addClass("-selected"),n.addClass("-submenu-open"),!1}),e.click(function(){n.removeClass("-submenu-open"),t.removeClass("-selected")})}),$(function(){var e=$(".js-input");function s(e){e.val()?e.addClass("-with-value"):e.removeClass("-with-value")}e.change(function(){s($(this))});for(var n=0,o=e.length;n<o;n++)s(e.eq(n))}),$(function(){$(".js-table-scroll-wrap").find("table").each(function(){$(this).wrap("<div class='scroll-content-wrap'></div>")})}),$(function(){var n,o;$(".js-tab-cntrl").click(function(){n=$(this).index();var e=(o=$(this).parents(".js-tab-wrap")).find(".js-tab-cntrl"),s=o.find(".js-tab-content");return o.find(".js-cur").text($(this).text()),e.removeClass("-selected").eq(n).addClass("-selected"),s.removeClass("-selected").eq(n).addClass("-selected"),!1})}),$(function(){var n,o;$(".js-tab-item").click(function(){n=$(this).index();var e=(o=$(this).parents(".js-tab-parent")).find(".js-tab-item"),s=o.children(".js-tab-container").children(".js-tab-content-item");return e.removeClass("-selected").eq(n).addClass("-selected"),s.removeClass("-selected").eq(n).addClass("-selected"),!1})}),$(function(){$(".js-hidden-text-cntrl").click(function(){return $(this).parents(".js-hidden-text-wrap").toggleClass("-is-open"),!1})}),$(function(){var n,o,t,l=$(".js-subcontent-cntrl");l.click(function(){(n=$(this)).fadeOut(),t=n.data("subcontent"),o=$("#"+t);for(var e=0,s=l.length;e<s;e++)l.eq(e).data("subcontent")===t&&l.eq(e).hide();return o.addClass("-open"),$("html, body").animate({scrollTop:o.offset().top-100},500),!1})}),$(function(){var e=$(".js-article-area");function s(){450<$(window).scrollTop()?e.addClass("-t02"):e.removeClass("-t02")}s(),$(window).scroll(function(){s()}),$(window).resize(function(){s()})}),$(function(){for(var e=$(".js-submenu"),s=$(".js-submenu-m"),n=0,o=e.length;n<o;n++)s.eq(n).html(e.eq(n).html())}),$(function(){$(".js-back-cntrl").click(function(){window.history.back()})}),$(function(){var e,s=$(".js-scroll-content");function n(){s.each(function(){e=$(this),e.children(".js-scroll-content-inner").width()>e.width()?e.parents(".js-scroll-content-shadow").addClass("-horiz-scrolled-content"):e.parents(".js-scroll-content-shadow").removeClass("-horiz-scrolled-content")})}$(window).on("resize",function(){n()}),n()}),$(function(){var e;$(".js-subcontent-list-cntrl").click(function(){e=$(this),e.parent(".js-subcontent-list-parent").toggleClass("-open")})}),window.onload=function(){var e=sessionStorage.getItem("backToUrl"),s=location.href,n=s.search("signup");s==e&&-1!==n||sessionStorage.removeItem("backToUrl")},$(function(){var e,s,n=$(".js-help-cntrl"),o=$(".js-help-content");n.click(function(){e=$(this),s=e.data("content"),e.hasClass("-open")?(e.removeClass("-open"),$(s).removeClass("-open")):(n.removeClass("-open"),o.removeClass("-open"),e.addClass("-open"),$(s).addClass("-open"))})});