$(function() {
    var mainAd = $('.main-ad');
    var lowerAd = $('.lower-ad');
    Vista.Images.AdvertImages(mainAd, 'Compare', 'Main');
    Vista.Images.AdvertImages(lowerAd, 'Compare', 'Lower');

    $('.play').trailerLauncher('#trailer-player-template');
});
