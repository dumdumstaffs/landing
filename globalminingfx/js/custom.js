/*global jQuery:false */
jQuery(document).ready(function($) {
"use strict";


	(function() {

		var $menu = $('nav'),
			optionsList = '<option value="" selected>Go to..</option>';

		$menu.find('li').each(function() {
			var $this   = $(this),
				$anchor = $this.children('a'),
				depth   = $this.parents('ul').length - 1,
				indent  = '';

			if( depth ) {
				while( depth > 0 ) {
					indent += ' - ';
					depth--;
				}

			}
			$(".nav li").parent().addClass("bold");

			optionsList += '<option value="' + $anchor.attr('href') + '">' + indent + ' ' + $anchor.text() + '</option>';
		}).end()
		.after('<select class="selectmenu">' + optionsList + '</select>');
		
		$('select.selectmenu').on('change', function() {
			window.location = $(this).val();
		});
		
	})();

	
		//add some elements with animate effect
		$('.logo').addClass("animated bounce");
		$(".logo").hover(
			function () {
			$('.logo').addClass("animated bounce");
			},
			function () {
			$('.logo').removeClass("animated bounce");
			}
		);
		$(".big-cta").hover(
			function () {
			$('.cta a').addClass("animated shake");
			},
			function () {
			$('.cta a').removeClass("animated shake");
			}
		);
		$(".box").hover(
			function () {
			$(this).find('.icon').addClass("animated pulse");
			$(this).find('.text').addClass("animated fadeInUp");
			$(this).find('.image').addClass("animated fadeInDown");
			},
			function () {
			$(this).find('.icon').removeClass("animated pulse");
			$(this).find('.text').removeClass("animated fadeInUp");
			$(this).find('.image').removeClass("animated fadeInDown");
			}
		);
		
		
		$('.accordion').on('show', function (e) {
		
			$(e.target).prev('.accordion-heading').find('.accordion-toggle').addClass('active');
			$(e.target).prev('.accordion-heading').find('.accordion-toggle i').removeClass('icon-plus');
			$(e.target).prev('.accordion-heading').find('.accordion-toggle i').addClass('icon-minus');
		});
		
		$('.accordion').on('hide', function (e) {
			$(this).find('.accordion-toggle').not($(e.target)).removeClass('active');
			$(this).find('.accordion-toggle i').not($(e.target)).removeClass('icon-minus');
			$(this).find('.accordion-toggle i').not($(e.target)).addClass('icon-plus');
		});	


		
		//Navi hover
		$('ul.nav li.dropdown').hover(function () {
			$(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn();
		}, function () {
			$(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut();
		});
		
		// tooltip
		$('.social-network li a, .options_box .color a').tooltip();

		//prettyphoto
		$("a[data-pretty^='prettyPhoto']").prettyPhoto();
		
		//scroll to top
		$(window).scroll(function(){
			if ($(this).scrollTop() > 100) {
				$('.scrollup').fadeIn();
				} else {
				$('.scrollup').fadeOut();
			}
		});
		$('.scrollup').click(function(){
			$("html, body").animate({ scrollTop: 0 }, 1000);
				return false;
		});

		$('#mycarousel').jcarousel();
		$('#mycarousel1').jcarousel();
		
		//portfolio hover
		$('ul.da-thumbs > li').hoverdir();
		
		//TWITTER
		$(".twitter").tweet({
			join_text: "auto",
			username: "envato",
			avatar_size: 20,
			count: 2,
			auto_join_text_default: "we said,",
			auto_join_text_ed: "we",
			auto_join_text_ing: "we were",
			auto_join_text_reply: "we replied",
			auto_join_text_url: "we were checking out",
			loading_text: "loading tweets..."
		});
							
		
		//layerslider
		$('#layerslider').layerSlider({
			autoStart : true,
			skinsPath : 'js/layerslider/skins/',
			skin : 'fullwidthdark',
			animateFirstLayer : true,
			thumbnailNavigation : false,
			navButtons	: false,
			navStartStop : false,
			navPrevNext	: true,		
			pauseOnHover : true,
			responsive : true,
			responsiveUnder : 940,
			sublayerContainer : 1110	
		});
	
		//flexslider
		$('.flexslider').flexslider();
	
		//nivo slider
		$('.nivo-slider').nivoSlider({
			effect: 'random', // Specify sets like: 'fold,fade,sliceDown'
			slices: 15, // For slice animations
			boxCols: 8, // For box animations
			boxRows: 4, // For box animations
			animSpeed: 500, // Slide transition speed
			pauseTime: 5000, // How long each slide will show
			startSlide: 0, // Set starting Slide (0 index)
			directionNav: true, // Next & Prev navigation
			controlNav: true, // 1,2,3... navigation
			controlNavThumbs: false, // Use thumbnails for Control Nav
			pauseOnHover: true, // Stop animation while hovering
			manualAdvance: false, // Force manual transitions
			prevText: '', // Prev directionNav text
			nextText: '', // Next directionNav text
			randomStart: false, // Start on a random slide
			beforeChange: function(){}, // Triggers before a slide transition
			afterChange: function(){}, // Triggers after a slide transition
			slideshowEnd: function(){}, // Triggers after all slides have been shown
			lastSlide: function(){}, // Triggers when last slide is shown
			afterLoad: function(){} // Triggers when slider has loaded
		});
				
		//slitslider				
		var Page = (function() {

			var $nav = $( '#nav-dots > span' ),
				slitslider = $( '#slider' ).slitslider( {
				onBeforeChange : function( slide, pos ) {
				$nav.removeClass( 'nav-dot-current' );
				$nav.eq( pos ).addClass( 'nav-dot-current' );
				}
			} ),

			init = function() {
				initEvents();
			},
			initEvents = function() {
				$nav.each( function( i ) {
					$( this ).on( 'click', function() {
					var $dot = $( this );
			
					if( !slitslider.isActive() ) {
						$nav.removeClass( 'nav-dot-current' );
						$dot.addClass( 'nav-dot-current' );
					}
										
					slitslider.jump( i + 1 );
					return false;
									
					} );
									
				} );

			};

			return { init : init };
		})();

		Page.init();
		/*
		var $items  = $('<div class="sl-slide sl-slide-color-2" data-orientation="horizontal" data-slice1-rotation="-5" data-slice2-rotation="10" data-slice1-scale="2" data-slice2-scale="1"><div class="sl-slide-inner bg-1"><div class="sl-deco" data-icon="t"></div><h2>some text</h2><blockquote><p>bla bla</p><cite>Margi Clarke</cite></blockquote></div></div>');
		// call the plugin's add method
		ss.add($items);
		*/


});