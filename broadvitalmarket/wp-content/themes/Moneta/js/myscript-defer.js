
window.addEventListener('load',function(){
    function gtmDeferSetTimeout(){
        setTimeout(()=>{
            if(window.gtmDefer){
          console.log('gtmDefer已加载');
          
            (function(a,b,d,h,c,g,e,f){a[c]||(a[c]={},a[c].state={callbackQueue:[]},
            a[c].registerConversion=function(b){a[c].state.callbackQueue.push(b)},
            a[c].registerConversion(function(a){}),e=b.createElement("script"),
            f=b.scripts[0],e.src=g+(-1===g.indexOf("?")?"?":"&")+"oref="+d(b.referrer)+"&ourl="+d(location[h])+"&opt="+d(b.title)+"&t="+(new Date).getTime(),
            f.parentNode.insertBefore(e,f))})(window,document,encodeURIComponent,"href","dtpCallback","https://track.broadvitalmarket.com.x/d/.js");

            //  Start Global site tag (gtag.js) - Google Analytics 
            (function(w, d, s, i) { f = d.getElementsByTagName(s)[0], 
            j = d.createElement(s); j.async = true; j.src = 'https://www.googletagmanager.com/gtag/js?id=' + i; 
            f.parentNode.insertBefore(j, f); })
            (window, document, 'script', 'UA-158684470-1');

            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'UA-158684470-1');
            //  End Global site tag (gtag.js) - Google Analytics 

            //  Google Tag Manager 
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-NSB66K2');
            //  End Google Tag Manager 

            adroll_adv_id = "OSEJXVECA5HPHFAO7SC43M"; adroll_pix_id = "D552AS6LEFFZFNWPQXXJXP"; (function () { var _onload = function(){ if (document.readyState && !/loaded|complete/.test(document.readyState)){setTimeout(_onload, 10);return} if (!window.__adroll_loaded){__adroll_loaded=true;setTimeout(_onload, 50);return} var scr = document.createElement("script"); var host = (("https:" == document.location.protocol) ? "https://s.adroll.com" : "http://a.adroll.com"); scr.setAttribute('async', 'true'); scr.type = "text/javascript"; scr.src = host + "/j/roundtrip.js"; ((document.getElementsByTagName('head') || [null])[0] || document.getElementsByTagName('script')[0].parentNode).appendChild(scr); }; if (window.addEventListener) {window.addEventListener('load', _onload, false);} else {window.attachEvent('onload', _onload)} }());

            (function() {
                var didInit = false;
                function initMunchkin() {
                    if(didInit === false) {
                    didInit = true;
                    Munchkin.init('079-WFQ-812', {"wsInfo":"jFRT"});
                    }
                }
                var s = document.createElement('script');
                s.type = 'text/javascript';
                s.async = true;
                s.src = '//munchkin.marketo.net/munchkin.js';
                s.onreadystatechange = function() {
                    if (this.readyState == 'complete' || this.readyState == 'loaded') {
                    initMunchkin();
                    }
                };
                s.onload = initMunchkin;
                document.getElementsByTagName('head')[0].appendChild(s);
            })();
            }else{
                gtmDeferSetTimeout();
            }

        },2000)
    }
    gtmDeferSetTimeout();
    
},{passive:false});