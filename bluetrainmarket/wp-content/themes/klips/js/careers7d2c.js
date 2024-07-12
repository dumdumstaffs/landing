function initTabsSection() {
  if (mobile.matches) {
    new Swiper('.switchCategories', {
      slidesPerView: 'auto',
      spaceBetween: 20
    });
  } else {
    new Swiper('.switchCategories', {
      slidesPerView: 'auto',
      spaceBetween: 60
    });
  }
}

function initDepartmentSection() {
  new Swiper('.switchDepartments', {
    slidesPerView: 'auto',
    spaceBetween: 20,
  });
}

window.addEventListener('DOMContentLoaded', () => {
  initTabsSection();
  initDepartmentSection();
});

var currentPage = 1;
var offset = 9;
var posts_per_row = 3;
function loadMore(paged) {
  let cat_slug = document.getElementById("load-more").dataset.slug;

  jQuery.ajax({
    type: 'POST',
    url: '/wp-admin/admin-ajax.php',
    dataType: 'json',
    data: {
      action: 'career_load_more',
      category: cat_slug,
      paged: paged,
      offset: offset,
      posts_per_row: posts_per_row
    },
    success: function (res) {
      if (!res.more_posts) {
        jQuery('#load-more').hide();
      }
      jQuery('#positionsPostsHolder').append(res.html);
      offset += posts_per_row;
    }
  });  
}

jQuery(function() {

  jQuery('body').on('click', '.cat-list_item', function(e) {
    e.preventDefault();
    jQuery('.cat-list_item').removeClass('active');
    jQuery(this).addClass('active');
    jQuery('.level-list_item').removeClass('active');
    jQuery('.level-list_item:first').addClass('active');
    let cat_slug = jQuery(this).data('slug');
    
    jQuery.ajax({
      type: 'POST',
      url: '/wp-admin/admin-ajax.php',
      dataType: 'json',
      data: {
        action: 'filter_career_posts',
        category: cat_slug,
        paged: 1,
        page: 'career'
      },
      success: function(res) { 
        if (res.html) {      
          jQuery('#positionsPostsHolder').html(res.html);
        } else {
          jQuery('#positionsPostsHolder').html('');
        }
        currentPage = 1;
        jQuery('#load-more').show();
        jQuery('#load-more').attr('data-slug',cat_slug);
        if (res.max <= 9) {
          jQuery('#load-more').hide();
        }
      }
    });
  });

  jQuery('body').on('click', '.level-list_item', function(e) {
    e.preventDefault();
    jQuery('.level-list_item').removeClass('active');
    jQuery(this).addClass('active');
    jQuery('.cat-list_item').removeClass('active');
    jQuery('.cat-list_item:first').addClass('active');
    jQuery('#load-more').attr('data-slug','articles');
    let level_slug = jQuery(this).data('slug');
    
    jQuery.ajax({
      type: 'POST',
      url: '/wp-admin/admin-ajax.php',
      dataType: 'json',
      data: {
        action: 'level_filter_career_posts',
        level: level_slug,
        paged: 1,
        page: 'career',
        offset: offset,
        posts_per_row: posts_per_row
      },
      success: function(res) {
        if (res.html) {     
          jQuery('#positionsPostsHolder').html(res.html);
        } else {
          jQuery('#positionsPostsHolder').html('<span>No positions found in this category.</span>');
        }
        currentPage = 1;
        jQuery('#load-more').show();
        if (res.max <= 9) {
          jQuery('#load-more').hide();
        }
      }
    });
  });

  jQuery('body').on('click', '#load-more', function(e) {
    e.preventDefault();
    currentPage++;
    loadMore(currentPage);
  });
});