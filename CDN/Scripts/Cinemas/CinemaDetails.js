$(function () {
    Vista.ShowHideSessions();
    var container = $(".media-info .generic-image-carousel");
    var height = 300;
    var width = 400;
    Vista.Images.ImageGalleryFromFolder(container, 'CinemaGallery', true, width, height);
});