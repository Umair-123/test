Vista.ImageGallery = function (container, imageGalleryTimeout) {
    imageGalleryTimeout = imageGalleryTimeout || 7000;

    var images = [];
    var currentImageIndex = 0;
    var currentImageClass = 'current-image';
    var otherImageClass = 'other-image';
    var selectedClass = 'selected';
    var imageSelects = [];
    var descriptionContainer;
    var imageDescriptions = [];

    (function () {
        images = container.find('img.gallery-image');

        if (images.length == 0)
            return;
        if (images.length === 1) {
            moveToImage(0);
            return;
        }

        container.append('<div class="image-select-container"></div>');
        var imageSelectContainerBase = container.find(".image-select-container");

        imageSelectContainerBase.append('<div class="image-select-inner"></div>');
        var imageSelectContainer = imageSelectContainerBase.find(".image-select-inner");

        container.append('<div class="image-descriptions"></div>');
        descriptionContainer = container.find(".image-descriptions");

        images.each(function (index, image) {
            imageSelectContainer.append('<span class="image-select">&nbsp;</span>');
            var description = $(this).data("description");
            if (description)
                descriptionContainer.append('<span class=image-description>' + description + '</span>');

            if (Vista.ImageResize)
                Vista.ImageResize.BoundHorizontally(container.find('.images'), $(image));
        });
        imageSelects = container.find(".image-select");
        imageSelects.bind('click', imageSelectClick);
        imageDescriptions = descriptionContainer.find(".image-description");
        moveToImage(0);
        startTimer();
        
    })();

    function moveToImage(index) {
        index = index % images.length;

        var oldSelectedImage = $(images[currentImageIndex]);
        oldSelectedImage.removeClass(currentImageClass);
        oldSelectedImage.addClass(otherImageClass);

        var newSelectedImage = $(images[index]);
        newSelectedImage.addClass(currentImageClass);
        newSelectedImage.removeClass(otherImageClass);

        $(imageSelects[currentImageIndex]).removeClass(selectedClass);
        $(imageSelects[index]).addClass(selectedClass);
        $(imageDescriptions[currentImageIndex]).removeClass(selectedClass);
        $(imageDescriptions[index]).addClass(selectedClass);

        currentImageIndex = index;
        return true;
    };

    var imageGalleryTimer;
    function startTimer() {
        imageGalleryTimer = setTimeout(function () {
            moveToNextImage();
            startTimer();
        }, imageGalleryTimeout);
    }

    function moveToNextImage() {
        moveToImage(currentImageIndex + 1);
    }

    function imageSelectClick() {
        clearTimeout(imageGalleryTimer);
        var source = $(this);
        var index = imageSelects.index(source);
        moveToImage(index);
        startTimer();
    }
};