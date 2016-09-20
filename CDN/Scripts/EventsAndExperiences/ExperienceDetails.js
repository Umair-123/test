$(function() {
    Vista.ShowHideSessions();
    var container = $('.media-info .generic-image-carousel');

    Vista.Images.ImageGalleryFromFolder(container, 'ShowTypeGallery', true, 400, 300);

    $('.play').trailerLauncher('#trailer-player-template');
});

