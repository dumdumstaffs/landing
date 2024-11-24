let paseUrl = window.location.href;
let paseName = window.location.pathname;
if(siteLanguage != 'en'){
	paseName = paseName.split(siteUrl)[1];
}





// geoip2
if(getCookie('ip_code') == '' || getCookie('ip_aging') == '' || getCookie('ip_continent_code') == ''){
	var dxt_geo = {
		onSuccess : function(geoipResponse) {
			var dxt_this = this;
			if(geoipResponse.country.iso_code) {
				var ip_code = geoipResponse.country.iso_code.toLowerCase();
				var ip_continent_code = geoipResponse.continent.code.toLowerCase();
				var ip_address= geoipResponse.traits.ip_address;
				setCookie('ip_code',ip_code);
				setCookie('ip_continent_code',ip_continent_code);
				setCookie('ip_aging',true,1);

				if(paseUrl.indexOf(idDomain) != -1){
				}else if(paseUrl.indexOf(vnDomain) != -1){
				}else{
					forcedJump(ip_code);
					firstJump(ip_code)
				}
					
				
				
			}
			
		},
		onError: function (error) {
			console.log('err')
			var dxt_this = this;
		},
		init: function () {
			var dxt_this = this;
			if (typeof (geoip2) != "undefined") {
				geoip2.country(dxt_this.onSuccess, dxt_this.onError);
			}
		},
	}
	dxt_geo.init();
}else{
	var code = getCookie('ip_code');
	var ip_address = getCookie('real_ip');

	if(paseUrl.indexOf(idDomain) != -1){
	}else if(paseUrl.indexOf(vnDomain) != -1){
	}else{
		forcedJump(code);
		firstJump(code)
	}

	
}


function forcedJump(code){
	if(code == 'it'){
		window.location.href = 'https://www.broadvitalmarketit.com' + paseName;
	}
	
	if(code == 'sc'){
		window.location.href = 'https://www.broadvitalmarket.sc'
	}
	
	if(code == 'vn'){
		window.location.href = 'https://www.broadvitalmarketvn.com/vn' + paseName;
	}
}

function firstJump(code){
	let arArr = ['dz','bh','eg','ir','iq',' il','jo','kw','lb','ly','ma','om','qa','sa','ps','sy','tn','ye'];
	if(!getCookie('isgetGeoip')){
		if(code == 'ae') {
			setCookie('isgetGeoip',true)
			window.location.href = '/ae'+ paseName;
		}
		if(arArr.indexOf(code) !== -1){
			setCookie('isgetGeoip',true)
			window.location.href = '/ar'+ paseName;
		}
	}
}