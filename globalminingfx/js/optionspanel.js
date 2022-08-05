jQuery(document).ready(function($) {
	
	$('.options_toggle').bind('click', function() {
		if($('#t_options').css('left') == '0px'){
			$('#t_options').stop(false, true).animate({left:'-230px'}, 400, 'easeOutExpo');
		}else {
			$('#t_options').stop(false, true).animate({left:'0px'}, 400, 'easeOutExpo');
		}	
	});

	$(".wideboxed a.wrapboxed").click(function() { 
		$.cookie($('#wrapper').addClass("boxed"));
		return false;
	});
	$(".wideboxed a.wrapwide").click(function() { 
		$.cookie($('#wrapper').removeClass("boxed"));
		return false;
	});
	
	
	$("#stylechanger .color a").click(function() { 
		$("#t-colors").attr("href",'color/'+$(this).attr('data-rel'));
		$.cookie("css",'color/'+$(this).attr('data-rel'), {expires: 365, path: '/'});
		return false;
	});
	
	$(".bgr .color a").click(function() { 
		$("#bodybg").attr("href",'bodybg/'+$(this).attr('data-rel'));
		$.cookie("css",'bodybg/'+$(this).attr('data-rel'), {expires: 365, path: '/'});
		return false;
	});
	
	$('#accent_color').ColorPicker({
		onSubmit: function(hsb, hex, rgb, el) {
			$(el).val(hex);
			$(el).ColorPickerHide();
		},
		onBeforeShow: function () {
			$(this).ColorPickerSetColor(this.value);
		},
		onChange: function (hsb, hex, rgb) {
			$('#accent_color').val(hex);
			$('#accent_color').css('backgroundColor', '#' + hex);
			accentColorUpdate(hex);
		}
	})
	.bind('keyup', function(){
		$(this).ColorPickerSetColor(this.value);
	});
	
	$('#bodybg_color').ColorPicker({
		onSubmit: function(hsb, hex, rgb, el) {
			$(el).val(hex);
			$(el).ColorPickerHide();
		},
		onBeforeShow: function () {
			$(this).ColorPickerSetColor(this.value);
		},
		onChange: function (hsb, hex, rgb) {
			$('#bodybg_color').val(hex);
			$('#bodybg_color').css('backgroundColor', '#' + hex);
			bodybgColorUpdate(hex);
		}
	})
	.bind('keyup', function(){
		$(this).ColorPickerSetColor(this.value);
	});
	
function accentColorUpdate(hex){

	hex = '#'+hex;

	$('#custom_styles').html('<style>'+
		'	a, a:hover, footer a.text-link:hover, strike, footer ul.link-list li a:hover, .post-meta span a:hover, footer 	a.text-link,ul.meta-post li a:hover, ul.cat li a:hover, ul.recent li h6 a:hover,ul.portfolio-categ li.active a, ul.portfolio-categ li.active a:hover,ul.portfolio-categ li a:hover,ul.related-post li h4 a:hover, span.highlight,article .post-heading h3 a:hover { color:'+ hex +'; }' +
		'	form#contactform1 .validation,#sendmessage,.post-meta .comments a:hover ,.recent-post .text h5 a:hover,.product-info h4 a:hover ,#content .product-single .product-desc h3 a:hover,.widget ul.recent-products li h6 a:hover { color:'+ hex +';}'+
		'	.navbar .nav > .active > a,.navbar .nav > .active > a:hover,.navbar .nav > .active > a:focus,.navbar .nav > .active.dropdown > a.dropdown-toggle,.navbar .nav > .active.dropdown > a.dropdown-toggle:hover,.navbar .nav > .active.dropdown > a.dropdown-toggle:focus,.custom-carousel-nav.right:hover, .custom-carousel-nav.left:hover,.dropdown-menu li > a:hover,.dropdown-menu li > a:focus,.dropdown-submenu:hover > a,.dropdown-menu .active > a,.dropdown-menu .active > a:hover,.pagination ul > .active > a:hover,.pagination ul > .active > a,.pagination ul > .active > span,.flex-control-nav li a:hover,.flex-control-nav li a.active,.icon-square:hover,.icon-rounded:hover,.icon-circled:hover,[class^="icon-"].active,[class*=" icon-"].active,.nivo-directionNav a:hover  { background-color:'+ hex +';}'+

		'	.pagination ul > li.active > a,.pagination ul > li.active > span,a.thumbnail:hover,input[type="text"].search-form:focus { border: 1px solid '+ hex +';}'+
		
	    '   header { border-top: 5px solid '+ hex +';}'+
		'   #sub-footer { border-bottom: 5px solid '+ hex +';}'+
	    '   header.alt2 .contact_info p,header.alt3 .contact_info p,.ls-highlighted-h.color { background: '+ hex +';}'+
	    '   .btn-dark:hover,.btn-dark:focus,.btn-dark:active,.btn-theme  { border: 1px solid '+ hex +'; background: '+ hex +';}'+
	    '   .post-meta { border-top: 4px solid '+ hex +';}'+
	    '   .widget ul.tags li a:hover { background: '+ hex +';}'+
	   
	    '   .pricing-box-alt.special .icon .price-circled { background: '+ hex +';}'+
	    '   .pricing-box-alt  .pricing-action { border-top: 4px solid '+ hex +';}'+
	    '   .pricing-box-alt .pricing-terms { border-top: 4px solid '+ hex +';}'+
	   
	    '   .pullquote-left { border-left: 5px solid '+ hex +';}'+
	    '   .pullquote-right { border-right: 5px solid '+ hex +';}'+
	    '   ul.clients li:hover { border: 4px solid '+ hex +';}'+
	    '   .heading span,.widgetheading span { background: '+ hex +';}'+

		'	.jcarousel-skin-tango .jcarousel-prev-horizontal:hover,.jcarousel-skin-tango .jcarousel-prev-horizontal:focus,.jcarousel-skin-tango .jcarousel-next-horizontal:hover,.jcarousel-skin-tango .jcarousel-next-horizontal:focus { background:'+ hex +';}'+
		
		'</style>');
}

function bodybgColorUpdate(hex){
	$('body').css('background', '#'+hex);
}
	
});