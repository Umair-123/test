/// <reference path="../../jquery-1.8.1.min.js" />
/// <reference path="../../Culture/globalize.js"/>
/// <reference path="../Vista.js"/>
/// <reference path="../Utilities/Utilities.js"/>
/// <reference path="../Utilities/Language.js" />

Vista.Home = (function () {
    
    var nowShowingTemplate = '<a href="{0}" class="movie">' +
                             '<img class="movie-poster" src="{1}" alt="{2}" width="{3}" height="{4}" />' +
                             '<span class="movie-title">{2}</span>' +
                             '</a>';

    var scrollbox;
    var scrollboxView;
    var widthToHeightRatio = 1.48; // landscape mode for standard A2 poster size
    var movieData;
    
    return {
        init: function () {

            loadScrollboxMovies();

            // fix to make the images resize correctly when the browser window changes dimensions
            // this results in all the movie images being re-downloaded with the new dimensions
            $(window).resize(loadScrollboxMovies);
            
            $('.language-toggle').click(function () {
                Vista.Utilities.Language.toggleLanguage();
            });
        }
    };

    function loadScrollboxMovies() {

        if (scrollbox) {
            // not calling destroy before re-creating scrollbox can increase memory consumption
            $('.home-movies').scrollbox('destroy');
        }
        
        // TODO: have to set includeScrolling to true to enable dragging
        // TODO: rename includeScrolling to renderScrollingControls
        scrollbox = $('.home-movies').scrollbox({ includeScrolling: true, useNativeScrollingForTouchDevices: true });
        scrollboxView = scrollbox.find('.scrollbox-view');

        scrollbox.addClass('container-loading');
        
        if (!movieData) {
            $.ajax({
                url: Vista.Urls.Home.NowShowing,
                type: 'POST',
                success: function(data) {
                    movieData = data;
                    populateMovies(scrollbox, data, nowShowingTemplate);
                }
            });
        }
        else {
            populateMovies(scrollbox, movieData, nowShowingTemplate);
        }
    }

    function populateMovies(container, data, template) {

        scrollboxView.empty();    
        container.removeClass('container-loading');

        var scrollBoxOuterHeight = scrollbox.outerHeight();
        var imageHeight = parseInt(scrollBoxOuterHeight, 10);
        
        for (var i = 0; i < data.length; i++) {
            
            Vista.Utilities.fixDotNetJsonDateString(data[i]);

            // the scrollbox images dimensions are based on the space available in the parent container
            var height = imageHeight;
            var width = (scrollBoxOuterHeight * widthToHeightRatio);
            width = parseInt(width, 10);


            var anchorLink = Vista.Utilities.format(Vista.Urls.Home.MovieDetailsTemplate, data[i].Id);
            var imageUrl = Vista.Utilities.format(data[i].PosterImageUrl + '&width={0}&height={1}', width, height);
            
            scrollboxView.append(Vista.Utilities.format(template, anchorLink, imageUrl, data[i].Title, width, height));
        }

        // have to refresh the scrollbox widget due to the images not having a tangible width until
        // the images are loaded. This causes the scrollbox width calculation for the viewport to be incorrect,
        // hence the 'refresh' method calls after each image comes back
        scrollbox.find('img.movie-poster').bind('load', function () {
            
            // these two lines are workarounds for the images not being scaled to the requested dimensions
            // in the CDN. In non-webkit browsers the image's containing anchor tag will have a width of the
            // image's original size (ignoring the width attribute explicitly set on the image tag).
            // To fix this we have to explicitly set the width of the anchor element as the image is downloaded
            // (i.e. after the image element has a tangible width).
            var $poster = $(this);
            $poster.parent().width($poster.outerWidth());
            
            container.scrollbox('refresh');
        });

        container.scrollbox('refresh');
    }

})();

$(Vista.Home.init);
