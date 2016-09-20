Vista.Images = (function () {
    return {
        ImageGalleryFromFolder: function(container, galleryName, clickToPopout, width, height) {
            var id = container.data('id');
            var url = Vista.Utilities.format(Vista.Urls.CDN.GetImageData, galleryName, id, width, height);
            var urlFormat = Vista.Urls.CDN.GalleryImage;

            var imageUrl = function (imageData) {
                return {
                    ImagePath: Vista.Utilities.format(urlFormat, galleryName, id, imageData.ImagePath, width, height)
                };
            };

            var promise = displayImages(container, url, imageUrl, clickToPopout);
        },
        
        AdvertImages: function (container, pageName, sectionName) {
            var url = Vista.Utilities.format(Vista.Urls.Ads.GetAdData, pageName, sectionName);
            var imageDataUrl = function(imageData) { return { ImagePath: imageData.ImagePath, Link: imageData.Link }; };
            displayImages(container, url, imageDataUrl);
        }
    };
    
    function displayImages(container, url, imageUrl, clickToPopout) {
        container.append('<div class="images" />');
        var subContainer = container.find('.images');

        var request = $.get(url);
        $.when(request).done(loadImages);

        function loadImages(imageData) {
            var images = [];
            for (var i = 0; i < imageData.length; i++) {
                images.push(imageUrl(imageData[i]));
            }

            var imagesDoneTask = Vista.GetImagesAsync(images, subContainer);

            return $.when(imagesDoneTask).done(function () {
                container.removeClass('loading');
                var imageGallery = new Vista.ImageGallery(container);
                if (clickToPopout) {
                    var popout = new Vista.ImagePopout(container);
                }
            });
        };
    }
})();