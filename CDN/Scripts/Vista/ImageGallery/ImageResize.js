Vista.ImageResize = {};

Vista.ImageResize.BoundHorizontally = function (container, image) {
    ///<summary>Bounds an image horizontally within a container. If the image is wider than the container, the image resizes and keeps aspect ratio.</summary>
    ///<param name="container">The element within which to bound the image.</param>
    ///<param name="image">The image to resize. Will become position relative and vertically centered.</param>

    var maxWidth = container.width();
    var maxHeight = container.height();
    
    // setTimeout is used here because chrome and firefox don't have a correct width set on the DOM until slightly afterwards
    window.setTimeout(function () {
        var imageHeight = image.height() !== 0 ? image.height() : maxHeight;
        var imageWidth = image.width() !== 0 ? image.width() : maxWidth;

        var idealHeight = maxHeight;
        if (imageHeight < maxHeight) {
            imageHeight = maxHeight;
            imageWidth = maxWidth;
        }

        var resizedWidth = ((idealHeight / imageHeight) * imageWidth);
        image.height(idealHeight);
        image.width(resizedWidth);
        imageHeight = image.height();
        imageWidth = image.width();
        
        //Vertical letterboxing (Pillarboxing)
        if (imageWidth > maxWidth) {
            var newWidth = maxWidth;
            var newHeight = maxWidth / imageWidth * imageHeight;
            image.width(newWidth);
            image.height(newHeight);                       
            image.addClass('horizontal-bound');
        }

        //Horizontal letterboxing
        if (maxHeight > imageHeight) {
            var remainingSpacePx = (maxHeight - imageHeight);
            var imageTop = Math.ceil(remainingSpacePx / 2);
            image.css('top', imageTop);
            image.addClass('horizontal-bound');
        }
    }, 50);
}