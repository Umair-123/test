// adds .naturalWidth() and .naturalHeight() methods to jQuery
// for retreaving a normalized naturalWidth and naturalHeight.
Vista.ImagePopout = function (container) {
    (function () {
        container.find('img.gallery-image').bind('click', imageClicked);
    })();

    function imageClicked(evt) {
        var image = $(this);
        displayImage(image);
    }

    function displayImage(image) {
        var clone = image.clone();
        
        //Get the actual size of the image
        var calculatedWidth = $(image[0]).naturalWidth();
        var calculatedHeight = $(image[0]).naturalHeight();

        //We don't want to make the popout larger than the screen
        var maxWidth = $(window).width()-150;
        var maxHeight = $(window).height() - 150;
        
        var expandHeight = calculatedHeight;
        var expandWidth = calculatedWidth;
        
        if (calculatedHeight > maxHeight) {
            expandHeight = maxHeight;
            expandWidth = (maxHeight / calculatedHeight) * calculatedWidth;
        }
        else if (calculatedWidth > maxWidth) {
            expandWidth = maxWidth;
            expandHeight = (maxWidth / calculatedWidth) * calculatedHeight;
        }                
        
        clone.attr('width', expandWidth).attr('height', expandHeight).css('position', 'inherit');
        clone.width(expandWidth);
        clone.height(expandHeight);
        $.modal('<div id="frame-hook"></div>', {
            overlayClose: true,
            opacity: 50,
            modal: true,
            containerCss: {
                backgroundColor: '#2B2725',
                width: expandWidth,
                height: expandHeight + 15
            },
            overlayCss: {
                backgroundColor: '#000'
            },
            closeHTML: '<button type="button" id="close-gallery" class="user-action"><span class="icon">' + Vista.Lang.Shared.Close + '</span></button>'
        });
        $('#frame-hook').append(clone);
    }
}