Vista.GetImagesAsync = function (images, container) {
    var height = container.height() || 300;
    var anyImagesDone = $.Deferred();
    var promises = [];
    // foreach image, create an img tag, and a jquery promise to set the src
    images.filter(function (imageMetadata, i) {
        var img = new Image();
        promises.push(getImage(imageMetadata.ImagePath, img));
        // get the jQuery object
        img = $(img);
        
        //We are removing heights/widths - assuming ImageResize.js will take care of this before showing
        img.removeAttr("height");
        img.removeAttr("width");
        if (imageMetadata.Link) {
            var link = $('<a target="_blank" />');
            link.attr('href', imageMetadata.Link);
            img.appendTo(link);
            container.append(link);
        }
        else {
            container.append(img);
        }
    });
    
    // as the images arrive, append them to the container
    // todo: preserve ordering?
    $.each(promises, function () {
        this.done(function(image) {
            var img = $(image);
            Vista.ImageResize.BoundHorizontally(container, img);
            anyImagesDone.resolve();
        });
    });

    function getImage(src, img) {
        return $.Deferred(function (task) {
            img.onload = function () { task.resolve(img); };
            // IE will error on all images here, not 100% sure why. The if statement will check if the image exists.
            img.onerror = function () { task.reject(); if (!img.fileSize || img.fileSize < 0) image.remove(); };
            img.src = src;
            // the ImageGallery code will automatically set the first one to visible
            var image = $(img);
            image.addClass('gallery-image other-image');
        }).promise();
    };

    return anyImagesDone.promise();
};