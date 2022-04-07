var __export=/******/
function(t){/******/
/******/
// The require function
/******/
function e(r){/******/
/******/
// Check if module is in cache
/******/
if(n[r])/******/
return n[r].exports;/******/
// Create a new module (and put it into the cache)
/******/
var a=n[r]={/******/
i:r,/******/
l:!1,/******/
exports:{}};/******/
/******/
// Return the exports of the module
/******/
/******/
/******/
// Execute the module function
/******/
/******/
/******/
// Flag the module as loaded
/******/
return t[r].call(a.exports,a,a.exports,e),a.l=!0,a.exports}// webpackBootstrap
/******/
// The module cache
/******/
var n={};/******/
/******/
// Load entry module and return exports
/******/
/******/
/******/
/******/
// expose the modules object (__webpack_modules__)
/******/
/******/
/******/
// expose the module cache
/******/
/******/
/******/
// identity function for calling harmony imports with the correct context
/******/
/******/
/******/
// define getter function for harmony exports
/******/
/******/
/******/
// getDefaultExport function for compatibility with non-harmony modules
/******/
/******/
/******/
// Object.prototype.hasOwnProperty.call
/******/
/******/
/******/
// __webpack_public_path__
/******/
return e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,r){/******/
e.o(t,n)||/******/
Object.defineProperty(t,n,{/******/
configurable:!1,/******/
enumerable:!0,/******/
get:r})},e.n=function(t){/******/
var n=t&&t.__esModule?/******/
function(){return t.default}:/******/
function(){return t};/******/
/******/
return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=22)}({/***/
0:/***/
function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var a=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}();Object.defineProperty(e,"__esModule",{value:!0});var i=function(){function t(){r(this,t),this.listeners={}}return a(t,[{key:"addListener",value:function(t,e){this.listeners[t]=this.listeners[t]||[],this.listeners[t].push(e)}},{key:"removeListener",value:function(t,e){if(this.listeners[t]){var n=this.listeners[t].indexOf(e);-1!=n&&this.listeners[t].splice(n,1)}}},{key:"removeListeners",value:function(t){t?delete this.listeners[t]:this.listeners={}}},{key:"trigger",value:function(t,e){var n="*"==t?["*"]:["*",t],r=!0,a=!1,i=void 0;try{for(var s,o=n[Symbol.iterator]();!(r=(s=o.next()).done);r=!0){var u=s.value;if(this.listeners.hasOwnProperty(u)){var c=!0,l=!1,f=void 0;try{for(var v,h=this.listeners[u][Symbol.iterator]();!(c=(v=h.next()).done);c=!0){(0,v.value)(e)}}catch(t){l=!0,f=t}finally{try{!c&&h.return&&h.return()}finally{if(l)throw f}}}}}catch(t){a=!0,i=t}finally{try{!r&&o.return&&o.return()}finally{if(a)throw i}}}}]),t}();e.default=i},/***/
1:/***/
function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var a=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}();Object.defineProperty(e,"__esModule",{value:!0});var i=n(5),s=n(0);e.TabEvent={select:"tab:select"};var o=function(){function t(e,n){var a=this,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"";r(this,t),this.tabs=i(),this.tabsContent=i(),this.eventManager=new s.default,this.activeClass=n,this.tabs=i(e),this.tabsContent=i(o),this.tabs.click(function(t){a.switchTab(i(t.currentTarget))});var u=this.getActiveTab();u.length?this.toggleTabContent(u):this.switchTab(i(this.tabs.get(0)))}return a(t,[{key:"getEventManager",value:function(){return this.eventManager}},{key:"getTabs",value:function(){return this.tabs}},{key:"getActiveTab",value:function(){return this.getTabs().filter("."+this.activeClass)}},{key:"isTabActive",value:function(t){return t.get(0)==this.getActiveTab().get(0)}},{key:"getActiveTabName",value:function(){return this.getActiveTab().data("tab")}},{key:"getTabsContent",value:function(){return this.tabsContent}},{key:"getTabContent",value:function(t){return this.getTabsContent().filter("[data-tab-content="+t+"]")}},{key:"getActiveTabContent",value:function(){return this.getTabsContent().filter("."+this.activeClass)}},{key:"switchTab",value:function(t){this.tabs.is(t)&&!this.getActiveTab().is(t)&&(this.tabs.removeClass(this.activeClass),t.addClass(this.activeClass),this.toggleTabContent(t),this.eventManager.trigger(e.TabEvent.select,t))}},{key:"toggleTabContent",value:function(t){var e=t.data("tab");e&&this.tabsContent.css({display:"none"}).removeClass(this.activeClass).filter("[data-tab-content="+e+"]").addClass(this.activeClass).css({display:""})}},{key:"switchTabByName",value:function(t){this.switchTab(this.tabs.filter("[data-tab="+t+"]"))}}]),t}();e.default=o},/***/
2:/***/
function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var a=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}();Object.defineProperty(e,"__esModule",{value:!0});var i=function(){function t(){r(this,t)}return a(t,[{key:"getSpread",value:function(t,e){return Math.pow(10,e)*(t.ask-t.bid)}}]),t}();e.default=i},/***/
22:/***/
function(t,e,n){"use strict";function r(t){var e=new a.default(".spread-cntrl__item","-selected"),n=null,r=new o.default,u=$(".js-spread-name"),c=$(".js-spread-val");if(t.isTradingActive)try{var l=new i.default(t.wsUrl);n=new s.default(l)}catch(t){}var f=function(){var t=e.getActiveTab(),n=t.attr("data-tab"),r=t.attr("data-spread");u.text(n),c.removeClass("-up -down").addClass("-"+t.attr("data-direction")).text(r)};e.getTabs().each(function(t,e){var a=$(e),i=a.attr("data-tab"),s=+a.attr("data-pip-position");a.click(f),null!=n&&n.addQuoteListener(i,function(t){var e=a.attr("data-spread"),n=r.getSpread(t,s).toFixed(1);n!=e&&a.attr("data-direction",n>e?"up":"down"),a.attr("data-spread",n),a.hasClass("-selected")&&f()})})}Object.defineProperty(e,"__esModule",{value:!0});var a=n(1),i=n(4),s=n(3),o=n(2);e.default=r},/***/
3:/***/
function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var a=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}();Object.defineProperty(e,"__esModule",{value:!0});var i=n(0);e.QuoteEvent={quoteUpdate:"quoteUpdate",quoteHistory:"quoteHistory",requestHistory:"requestQuoteHistory"};var s=function(){function t(n){var a=this,s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:30;r(this,t),this.history={},this.eventManager=new i.default,this.wsClient=n,this.historyLimit=s>0?s:1,n.getEventManager().addListener(e.QuoteEvent.quoteUpdate,function(t){a.pushHistory(t),a.getEventManager().trigger(t.symbolName,t)}),n.getEventManager().addListener(e.QuoteEvent.quoteHistory,function(t){var e=void 0,n=!0,r=!1,i=void 0;try{for(var s,o=t[Symbol.iterator]();!(n=(s=o.next()).done);n=!0)e=s.value,a.pushHistory(e)}catch(t){r=!0,i=t}finally{try{!n&&o.return&&o.return()}finally{if(r)throw i}}e&&a.getEventManager().trigger(e.symbolName,e)})}return a(t,[{key:"getEventManager",value:function(){return this.eventManager}},{key:"prefetchData",value:function(t){this.history=t}},{key:"pushHistory",value:function(t){this.history[t.symbolName]=this.history[t.symbolName]||[],this.history[t.symbolName].push(t);var e=this.history[t.symbolName].length;e>this.historyLimit&&this.history[t.symbolName].splice(0,e-this.historyLimit)}},{key:"getQuote",value:function(t){if(this.history.hasOwnProperty(t))return this.history[t][this.history[t].length-1]}},{key:"getQuoteHistory",value:function(t){return this.history.hasOwnProperty(t)?this.history[t]:[]}},{key:"addQuoteListener",value:function(t,e){this.getEventManager().addListener(t,e)}},{key:"detachQuoteListener",value:function(t,e){this.getEventManager().removeListener(t,e)}},{key:"requestQuoteHistory",value:function(t){this.wsClient.send({type:e.QuoteEvent.requestHistory,symbolName:t,length:this.historyLimit})}}]),t}();e.default=s},/***/
4:/***/
function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var a=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}();Object.defineProperty(e,"__esModule",{value:!0});var i,s=n(0);!function(t){t[t.CLOSED=0]="CLOSED",t[t.PENDING=1]="PENDING",t[t.OPEN=2]="OPEN",t[t.ERROR=3]="ERROR"}(i=e.ConnectionStatus||(e.ConnectionStatus={}));var o=function(){function t(e){var n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];r(this,t),this.listeners={},this.connectStatus=i.CLOSED,this.eventManager=new s.default,this.queue=[],this.url=e,n&&this.connect()}return a(t,[{key:"connect",value:function(t){var e=this;if(t||this.connectStatus==i.CLOSED){var n=new WebSocket(this.url);this.connectStatus=i.PENDING,n.onerror=function(t){throw new Error(t.message)},n.onopen=function(){e.connectStatus=i.OPEN;var t=e.queue.splice(0,e.queue.length),n=!0,r=!1,a=void 0;try{for(var s,o=t[Symbol.iterator]();!(n=(s=o.next()).done);n=!0){var u=s.value;e.send(u)}}catch(t){r=!0,a=t}finally{try{!n&&o.return&&o.return()}finally{if(r)throw a}}},n.onclose=function(t){t.wasClean?e.connectStatus=i.CLOSED:e.connectStatus=i.ERROR},n.onmessage=function(t){var n=e.parseMessage(t);e.eventManager.trigger(n.event,n.payload)},this.ws=n}}},{key:"isConnected",value:function(){return this.connectStatus==i.OPEN}},{key:"send",value:function(t){"string"!=typeof t&&(t=JSON.stringify(t)),this.isConnected()?this.ws.send(t):this.queue.push(t)}},{key:"parseMessage",value:function(t){var e=void 0;try{e=JSON.parse(t.data)}catch(t){}return e}},{key:"getEventManager",value:function(){return this.eventManager}},{key:"close",value:function(){this.ws&&this.ws.close()}}]),t}();e.default=o},/***/
5:/***/
function(t,e){t.exports=jQuery}});