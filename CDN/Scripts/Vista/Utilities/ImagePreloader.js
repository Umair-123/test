$(function () {
    'use strict';

    var preloadRequests = [];
    var preloadSources = $('.preload-image');
    $.each(preloadSources, function (index, sourceElement) {
        sourceElement = $(sourceElement);
        var url = sourceElement.attr('data-image-url');
        var target = sourceElement.attr('data-preload-target');
        if (!url) {
            return;
        }
        preloadRequests.push({
            jelement: sourceElement,
            target: target,
            url: url
        });
    });
    $.each(preloadRequests, function (index, preloadRequest) {
        var image = new Image();
        image.onload = function () {
            if (preloadRequest.target === 'background-image') {
                var cssUrl = 'url(' + preloadRequest.url + ')';
                preloadRequest.jelement.css('background-image', cssUrl);
            } else {
                preloadRequest.jelement.attr("src", preloadRequest.url);
                preloadRequest.jelement.show();
            }            
        }
        image.src = preloadRequest.url;
    });
}());
