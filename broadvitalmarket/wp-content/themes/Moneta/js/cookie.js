function setCookie(name,value,days) {
	if (days) {
	var date = new Date();
	date.setTime(date.getTime()+(days*24*60*60*1000));
	var expires = "; expires="+date.toGMTString();
	}
	else expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
	var c = ca[i];
	while (c.charAt(0)==' ') c = c.substring(1,c.length);
	if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return "";
}

function getPar(par) {
	var local_url = document.location.href;
	var get = local_url.indexOf(par + "=");
	if (get == -1) {
		return false;
	}
	var get_par = local_url.slice(par.length + get + 1);
	var nextPar = get_par.indexOf("&");
	if (nextPar != -1) {
		get_par = get_par.slice(0, nextPar);
	}
	return get_par;
}

function GetUrl(sProp)
{
	var re = new RegExp("[&,?]"+sProp + "=([^\\&]*)", "i");
	var a = re.exec(document.location.search);
	if (a == null)
	return "";
	return a[1];
}

function getUrl(sProp)
{
	var re = new RegExp("[&,?]"+sProp + "=([^\\&]*)", "i");
	var a = re.exec(document.location.search);
	if (a == null)
	return "";
	return a[1];
}



var g_c="";
if(GetUrl("c")!="")
{
	setCookie("c",GetUrl("c"),15);
	g_c=GetUrl("c");
}

if(getCookie("c")!="")
{
	g_c=getCookie("c");
}
var c="";

var g_utm_source,g_utm_medium,g_utm_campaign,g_utm_content,g_utm_term,retailleadsource,ls,g_lsm,currentDate,currentLsm;
function utmParam(){
	g_utm_source = GetUrl("utm_source") || 'NA';
	g_utm_medium = GetUrl("utm_medium") || 'NA';
	g_utm_campaign = GetUrl("utm_campaign") || 'NA';
	g_utm_content = GetUrl("utm_content") || 'NA';
	g_utm_term = GetUrl("utm_term") || 'NA';
	retailleadsource = GetUrl("retailleadsource") || 'NA';
	ls = GetUrl("ls") || 'NA';
	currentLsm= `${g_utm_source}|${g_utm_medium}|${g_utm_campaign}|${g_utm_content}|${g_utm_term}|retailleadsource=${retailleadsource}|ls=${ls}`;
	
	currentDate = Date.now();

	if(getCookie("lsm")){
		saveLsm = JSON.parse(getCookie("lsm")) ;
        // 看之前是否存过
        const haveRecord = saveLsm.some(item => item.ls == currentLsm);
        // 如果该条链接之前存在过，刷新下对应的时间戳
        if(haveRecord){
            saveLsm.forEach(item => {
                if(item.ls === currentLsm){
                    item.date = currentDate;
                    return;
                }
            });
            // 重新排下序，让最新的保持在最下面
            saveLsm.sort((a, b) => a.date - b.date);
            // 刷新下存的值
            setCookie("lsm",JSON.stringify(saveLsm),90);
        }else{
            // 之前没存过，存到数组中
            saveLsm.push({
                ls: currentLsm,
                date: currentDate
            });
            setCookie("lsm",JSON.stringify(saveLsm),90);
        }
	}else{
		 // 没存过lsm
         if (getCookie("ls")) {
            if (getCookie("ls") == ls) {
                saveLsm = [
                    {
                        ls: currentLsm,
                        date: currentDate
                    }
                ];
            }else {
                if(!GetUrl("utm_source")&&!GetUrl("utm_medium")&&!GetUrl("utm_campaign")&&!GetUrl("utm_content")&&!GetUrl("utm_term")&&!GetUrl("retailleadsource")&&!GetUrl("ls")){
                    saveLsm = [
                        {
                            ls: `NA|NA|NA|NA|NA|retailleadsource=NA|ls=${getCookie('ls')}`,
                            date: currentDate - 1
                        }
                    ];
                }else{
                    saveLsm = [
                        {
                            ls: `NA|NA|NA|NA|NA|retailleadsource=NA|ls=${getCookie('ls')}`,
                            date: currentDate - 1
                        },{
                            ls: currentLsm,
                            date: currentDate
                        }
                    ];
                }
            }
        } else {
            saveLsm = [
                {
                    ls: currentLsm,
                    date: currentDate
                }
            ];
        }
		setCookie("lsm",JSON.stringify(saveLsm),90);
		
		
	}
console.log("lsmmmmm:" + getCookie("lsm"));

	g_lsm = getCookie("lsm");
	g_ls = GetUrl("ls");

}

jQuery(document).ready(function ($) {
	var g_affid="",g_cpaid="",g_ls="",g_cxd="",g_cid="",g_wid="Moneta";
	var g_language="en_US";

	if(window.location.pathname.indexOf('/ar') == 0){
		g_language = "ar"
	}
	if(window.location.pathname.indexOf('/ae') == 0){
		g_language = "ar"
	}
	if(window.location.pathname.indexOf('/cn') == 0){
		g_language = "zh_CN"
	}
	if(window.location.pathname.indexOf('/de') == 0){
		g_language = "de"
	}
	if(window.location.pathname.indexOf('/es') == 0){
		g_language = "es"
	}
	if(window.location.pathname.indexOf('/fr') == 0){
		g_language = "fr_FR"
	}
	if(window.location.pathname.indexOf('/id') == 0){
		g_language = "id"
	}
	if(window.location.pathname.indexOf('/kr') == 0){
		g_language = "ko"
	}
	if(window.location.pathname.indexOf('/my') == 0){
		g_language = "my"
	}
	if(window.location.pathname.indexOf('/pt') == 0){
		g_language = "pt"
	}
	if(window.location.pathname.indexOf('/ru') == 0){
		g_language = "ru"
	}
	if(window.location.pathname.indexOf('/th') == 0){
		g_language = "th"
	}
	if(window.location.pathname.indexOf('/vn') == 0){
		g_language = "vi"
	}

	
    if(GetUrl("ls")!="")
	{
		setCookie("ls",GetUrl("ls"),15);
	}

	if(GetUrl("cpaid")!="")
	{
		setCookie("cpaid",GetUrl("cpaid"),15);
	}

	if(GetUrl("affid")!="")
	{
		var myaffid = GetUrl("affid");

		//  myaffid = myaffid.substring(0,myaffid.indexOf("_"));

		setCookie("affid",myaffid,15);
	}

	if(GetUrl("ibplan")!="")
	{
		var ibplan = GetUrl("ibplan");

		//  myaffid = myaffid.substring(0,myaffid.indexOf("_"));

		setCookie("ibplan",ibplan,15);
	}

	if(GetUrl("cid")!="")
	{
		var cid = GetUrl("cid");

		//  myaffid = myaffid.substring(0,myaffid.indexOf("_"));

		setCookie("cid",cid,15);
	}

	if(GetUrl("wid")!="")
	{
		var wid = GetUrl("wid");

		//  myaffid = myaffid.substring(0,myaffid.indexOf("_"));

		setCookie("wid",wid,15);
	}

	




	
	// console.log('cookie: '+getCookie("cid"));

	if(GetUrl("cxd")!="")
	{
		setCookie("cxd",GetUrl("cxd"),15);
		var cpaids = GetUrl("cxd");
		var cpaids1 = cpaids.split("_");
		setCookie("cpaid",cpaids1[0],15)

	//	setCookie("cpaid",GetUrl("cxd").replace(/_/g,''),1);
	}
	// 注册表单参数结束

	if(GetUrl("referal_id")!="")
	{
		setCookie("cxd",GetUrl("referal_id"),15);
		var cpaids = GetUrl("referal_id");
		var cpaids1 = cpaids.split("_");
		setCookie("cpaid",cpaids1[0],15)

	//	setCookie("cpaid",GetUrl("cxd").replace(/_/g,''),1);
	}

	if(GetUrl("affiliate_ids")!=""){
		var g_cpaid=GetUrl("affiliate_ids");
	}

	if(getCookie("cpaid")&&getCookie("cpaid")!=""&&getCookie("cpaid")!=null&&getCookie("cpaid")!="null")
    {
		var g_cpaid=getCookie("cpaid");
	}
	if(GetUrl("cpaid")!="")
	{
		var g_cpaid=GetUrl("cpaid");
	}


	if(getCookie("affid")&&getCookie("affid")!=""&&getCookie("affid")!=null&&getCookie("affid")!="null")
	{
		var g_affid=getCookie("affid");
	}
	if(GetUrl("affid")!="")
	{
		var g_affid=GetUrl("affid");
	}


	if(getCookie("cxd")&&getCookie("cxd")!=""&&getCookie("cxd")!=null&&getCookie("cxd")!="null")
    {
		var g_cxd=getCookie("cxd");
	}
	if(GetUrl("cxd")!="")
	{
		var g_cxd=GetUrl("cxd");
	}


	if(getCookie("ls")&&getCookie("ls")!=""&&getCookie("ls")!=null&&getCookie("ls")!="null")
	{
		var g_ls=getCookie("ls");
	}
	if(GetUrl("ls")!="")
	{
		var g_ls=GetUrl("ls");
	}

	if(getCookie("cid")&&getCookie("cid")!=""&&getCookie("cid")!=null&&getCookie("cid")!="null")
	{
		var g_cid=getCookie("cid");
	}
	if(GetUrl("cid")!="")
	{
		var g_cid=GetUrl("cid");
	}

	if(getCookie("wid")&&getCookie("wid")!=""&&getCookie("wid")!=null&&getCookie("wid")!="null")
	{
		var g_wid=getCookie("wid");
	}
	if(GetUrl("wid")!="")
	{
		var g_wid=GetUrl("wid");
	}



var partner_id,referal_id,affiliate_id,atag,invite_id;
if(getCookie("partner_id")!="")
{
    partner_id=getCookie("partner_id");
}
if(getCookie("referal_id")!="")
{
    referal_id=getCookie("referal_id");
}
if(getCookie("affiliate_id")!="")
{
    affiliate_id=getCookie("affiliate_id");
}
if(getCookie("atag")!="")
{
    atag=getCookie("atag");
}
if(getCookie("invite_id")!="")
{
    invite_id=getCookie("invite_id");
}

if(GetUrl("partner_id")!="")
{
	partner_id=GetUrl("partner_id");
    setCookie("partner_id",GetUrl("partner_id"),15);
}

if(GetUrl("referal_id")!="")
{
	referal_id=GetUrl("referal_id");
    setCookie("referal_id",GetUrl("referal_id"),15);
}

if(GetUrl("affiliate_id")!="")
{
	affiliate_id=GetUrl("affiliate_id");
    setCookie("affiliate_id",GetUrl("affiliate_id"),15);
}

if(GetUrl("atag")!="")
{
	atag=GetUrl("atag");
    setCookie("atag",GetUrl("atag"),15);
}

if(GetUrl("invite_id")!="")
{
    invite_id=GetUrl("invite_id");
    setCookie("invite_id",GetUrl("invite_id"),15);
}

var forexAffiliate="partner_id%3D"+partner_id+"%7Creferal_id%3D"+referal_id+"%7Caffiliate_id%3D"+affiliate_id+"%7Catag%3D"+atag+"%7Cinvite_id%3D"+invite_id;

    setCookie("forexAffiliate",forexAffiliate,15);

		// 先看当前链接是否有相关参数，有则更新，无则跳过
		if(GetUrl("utm_source")!=""||GetUrl("utm_medium")!=""||GetUrl("utm_campaign")!=""||GetUrl("utm_content")!=""||GetUrl("utm_term")!=""||GetUrl("retailleadsource")!=""||GetUrl("ls")!=""){
			utmParam();
		}else if(getCookie("lsm")){//当前链接没有相关参数，看一下之前有没有存过对应cookie
			// 之前存在过，刷新当前存储的cookie周期
			g_lsm = getCookie("lsm");
			setCookie("ls",getCookie("ls"),90);
			setCookie("lsm",getCookie("lsm"),90);
		}else if (getCookie("ls") && !(getCookie("lsm"))) {
			utmParam();
		}else{//之前没有打开过对应链接
			g_lsm = "";
		}
		//end ls save

	// console.log(g_cid);
	$(".ls input").val(g_ls);
	$(".lsm input").val(g_lsm)
	$(".cpaid input").val(g_cpaid);
    $(".affid input").val(g_affid);
    $(".cxd input").val(g_cxd);
	$(".cid input").val(g_cid);
	$(".wid input").val(g_wid);
	$(".language input").val(g_language);

	$("input.ls ").val(g_ls);
	$("input.lsm ").val(g_lsm);
	$("input.cpaid").val(g_cpaid);
    $("input.affid").val(g_affid);
    $("input.cxd").val(g_cxd);
	$("input.cid").val(g_cid);
	$("input.wid").val(g_wid);
	$("input.language").val(g_language);

	// console.log($(".cid input").val());


})



