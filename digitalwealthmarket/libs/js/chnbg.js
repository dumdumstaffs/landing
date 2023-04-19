var images = new Array(
    'libs/img/multi_asset.jpg',
    'libs/img/banner.jpg',
    'libs/img/bannr1.jpeg',
    'libs/img/bn22.jpg',
    'libs/img/clients_header.webp',
    'libs/img/multi_asset.jpg',
    'libs/img/bn23.jpg'
  //   'https://dummyimage.com/1000x400/ff0000/ffffff',
  );
  
  var slider = setInterval(function() {
    document.getElementsByClassName('banner')[0].setAttribute('style', 'background-image: linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.7)),url("'+images[0]+'")');
    images.splice(images.length, 0, images[0]);
    images.splice(0, 1);
  }, 10000);