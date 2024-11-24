// denggao
function setEqualHigh(className) {
    jQuery(className).height('auto')
    className.startsWith('.') ? '' : (className = '.' + className);
    let heightList = []
    jQuery(className).each(function () {
        heightList.push(jQuery(this).height())
    })
    let maxNum = Math.max.apply(null, heightList);
    let minNum = Math.min(...heightList);
    if (maxNum > minNum) {
        jQuery(className).each(function () {
            jQuery(this).height(maxNum);
        })
    }
}

function Data()
{
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var newRandom = "";
	for(var i=0;i<5;i++)
	{
		newRandom += Math.floor(Math.random()*9 + 1).toString();
	}
	var currentdate =  year + month + strDate + newRandom;
	return currentdate;
}

// tab Move
function tabsNavMouseMoveFun(nodeClass,nodeChildren,nodeListClass) {
    let node = document.querySelector(nodeClass);
    let nodeList;
    if(nodeListClass){
        nodeList = document.querySelectorAll(nodeListClass);
    }
     
    let isMouseDown = false;
    let scrollLeftValue = 0;
    let startValue = 0;
    let endValue=0;
    let isClick = false;
    node.addEventListener('mousedown',e=>{
        isMouseDown = true;
        isClick = true;
        startValue = e.clientX;
        scrollLeftValue = node.scrollLeft;

    },{passive: true});

    node.addEventListener('mousemove',e=>{
        if(isMouseDown){
            endValue = e.clientX;
            let scrollValue = startValue - endValue
            node.scrollLeft = scrollLeftValue + scrollValue;
            // isClick = false;
        }
    },{passive: true});

    node.addEventListener('mouseleave', () => {
        isMouseDown = false;
    },{passive: true});

    
    node.addEventListener('mouseup', e => {
        isMouseDown = false;
        if(isClick){
            var e = e || window.event;
            var target = e.target || e.srcElement;
            let targetAll = target.parentNode.querySelectorAll(nodeChildren)

            for(let i=0;i<targetAll.length;i++){
                targetAll[i].classList.remove('active');
            }
            target.classList.add('active');
            let nodeArr = [];
            for(let i=0;i<targetAll.length;i++){
                nodeArr.push(targetAll[i].getAttribute('class'))
                
            }
            let moveLeft = 0;
            for(let i=0;i<nodeArr.length;i++){
                // 获取点击元素
                if(nodeArr[i].indexOf('active') !== -1) {
                    node.lastElementChild.style.transform = 'translateX(0)';
                    moveLeft = targetAll[i].offsetLeft
                    node.lastElementChild.style.width = targetAll[i].clientWidth + 'px';
                    node.lastElementChild.style.left = moveLeft + 'px';


                    // navBar 自动滑动
                    // let tagWidth = Number(window.getComputedStyle(targetAll[i]).width.split('px')[0]);
                    // let nodeScrollLeft = moveLeft + tagWidth;
                    // let navBarWidth = Number(window.getComputedStyle(node).width.split('px')[0]);
                    // if(nodeScrollLeft > navBarWidth){
                    //     node.scrollTo({
                    //         left:nodeScrollLeft - navBarWidth + tagWidth,
                    //         behavior:'smooth'
                    //     })
                    // }else{
                    //     node.scrollTo({
                    //         left: 0,
                    //         behavior:'smooth'
                    //     })
                    // }

                    if(nodeList){
                        // 联动下方模块显示或者隐藏
                        nodeList.forEach(item=>{
                            item.classList.remove('active');
                            if(targetAll[i].getAttribute('data-type') == item.getAttribute('data-type')){
                                item.classList.add('active')
                            }
                        })
                    }
                    

                    
                    

                }
                
                
            }


        }
    },{passive: true});

    
}

// animation loading
let boxElement;
window.addEventListener("load",(event) => {
    boxElement = document.querySelectorAll(".animat");
    createObserver();
}, false, );

function createObserver() {
    let observer;
    let options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.2,
};
observer = new IntersectionObserver(handleIntersect, options);

boxElement.forEach(element => {
    observer.observe(element);
});
}
function handleIntersect(entries, observer) {
    entries.forEach((entry) => {
        if(entry.isIntersecting != false){
            entry.target.classList.add("start")
        }
    });
}


// Disable page scrolling
function stopScroll(){
    document.documentElement.style.overflow='hidden';
    document.body.style.overflow='hidden';
}
// Enable page scrolling
function startScroll(){
    document.documentElement.style.overflow='';
    document.body.style.overflow='';
}

var loadAllState = true;
jQuery(document).ready(function ($) {
    if(loadAllState){
        stopScroll();
    }
    $('.moneta-loading-imgBox .load-icon img').css({'transform': 'scale(1.15)'});
})



addEventListener("load",function(){
    window.gtmDefer = true;
    jQuery('.moneta-loading-imgBox .load-icon img').css({'transform': 'scale(1)'});
    setTimeout(() => {
        jQuery('.moneta-loading-imgBox .load-icon').css({'animation': 'none'});
        startScroll();
        loadAllState = false;

        jQuery('.moneta-loading-wrapper').addClass('noBg');
        var topDistance = '';
        var leftDistance = '';
        var imgWidth = '';
        var imgHeight = '';
        var pageScroll = jQuery(window).scrollTop();
        if(jQuery('.header-mobile-content').css('display') == 'block'){
            topDistance = jQuery('.header-mobile-content .header-logo img').offset().top;
            leftDistance = jQuery('.header-mobile-content .header-logo img').offset().left;
            imgWidth = jQuery('.header-mobile-content .header-logo img').width();
            imgHeight = jQuery('.header-mobile-content .header-logo img').height();
        }else{
            topDistance = jQuery('.header-pc-content .header-logo img').offset().top;
            leftDistance = jQuery('.header-pc-content .header-logo').offset().left;
            imgWidth = jQuery('.header-pc-content .header-logo img').width();
            imgHeight = jQuery('.header-pc-content .header-logo img').height();
        }
        jQuery('.moneta-loading-imgBox').animate({height:imgHeight,width:imgWidth,top:(topDistance - pageScroll),left:leftDistance},500);
        jQuery('.moneta-loading-wrapper.noBg .moneta-loading-imgBox .load-icon img').animate({'width': imgHeight,'height': imgHeight},500);
        setTimeout(() => {
            jQuery('.moneta-loading-wrapper.noBg').hide()
            jQuery('.header-logo').css({'opacity': 1})
        }, 1000);
    }, 500);
})


// Encapsulation of Base64 encryption and decryption algorithm:
function Base64() {
    // private property 
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="; 
    // public method for encoding 
    this.encode = function (input) { 
        var output = ""; 
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4; 
        var i = 0; 
        input = _utf8_encode(input); 
        while (i < input.length) { 
        chr1 = input.charCodeAt(i++); 
        chr2 = input.charCodeAt(i++); 
        chr3 = input.charCodeAt(i++); 
        enc1 = chr1 >> 2; 
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4); 
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6); 
        enc4 = chr3 & 63; 
        if (isNaN(chr2)) { 
            enc3 = enc4 = 64; 
        } else if (isNaN(chr3)) { 
            enc4 = 64; 
        } 
        output = output + 
        _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + 
        _keyStr.charAt(enc3) + _keyStr.charAt(enc4); 
        } 
        return output; 
    } 
	// public method for decoding 
	this.decode = function (input) { 
		var output = ""; 
		var chr1, chr2, chr3; 
		var enc1, enc2, enc3, enc4; 
		var i = 0; 
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, ""); 
		while (i < input.length) { 
		enc1 = _keyStr.indexOf(input.charAt(i++)); 
		enc2 = _keyStr.indexOf(input.charAt(i++)); 
		enc3 = _keyStr.indexOf(input.charAt(i++)); 
		enc4 = _keyStr.indexOf(input.charAt(i++)); 
		chr1 = (enc1 << 2) | (enc2 >> 4); 
		chr2 = ((enc2 & 15) << 4) | (enc3 >> 2); 
		chr3 = ((enc3 & 3) << 6) | enc4; 
		output = output + String.fromCharCode(chr1); 
		if (enc3 != 64) { 
			output = output + String.fromCharCode(chr2); 
		} 
		if (enc4 != 64) { 
			output = output + String.fromCharCode(chr3); 
		} 
		} 
		output = _utf8_decode(output); 
		return output; 
	} 
    // private method for UTF-8 encoding 
    _utf8_encode = function (string) { 
        string = string.replace(/\r\n/g,"\n"); 
        var utftext = ""; 
        for (var n = 0; n < string.length; n++) { 
        var c = string.charCodeAt(n); 
        if (c < 128) { 
            utftext += String.fromCharCode(c); 
        } else if((c > 127) && (c < 2048)) { 
            utftext += String.fromCharCode((c >> 6) | 192); 
            utftext += String.fromCharCode((c & 63) | 128); 
        } else { 
            utftext += String.fromCharCode((c >> 12) | 224); 
            utftext += String.fromCharCode(((c >> 6) & 63) | 128); 
            utftext += String.fromCharCode((c & 63) | 128); 
        } 
        } 
        return utftext; 
    } 
	// private method for UTF-8 decoding 
  	_utf8_decode = function (utftext) { 
    var string = ""; 
    var i = 0; 
    var c = c1 = c2 = 0; 
    while ( i < utftext.length ) { 
      c = utftext.charCodeAt(i); 
      if (c < 128) { 
        string += String.fromCharCode(c); 
        i++; 
      } else if((c > 191) && (c < 224)) { 
        c2 = utftext.charCodeAt(i+1); 
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63)); 
        i += 2; 
      } else { 
        c2 = utftext.charCodeAt(i+1); 
        c3 = utftext.charCodeAt(i+2); 
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)); 
        i += 3; 
      } 
    } 
    return string; 
  } 
}
