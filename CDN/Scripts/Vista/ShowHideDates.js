Vista.ShowHideSessions = function (toggleDateLinkSelector) {
    
    toggleDateLinkSelector = toggleDateLinkSelector || '.toggle-future-dates';

    (function () {
        $(toggleDateLinkSelector).bind('click', function () {
            var link = $(this);
            
            // load future sessions
            var movieParent = link.parents('.film-item');
            var showtimeList = movieParent.find('.film-showtimes');

            var futureSessions = showtimeList.find('.session.future');

            if (!futureSessions.length) {
                var cinemaId = movieParent.attr('data-cinema-id');
                var movieId = movieParent.attr('data-movie-id');
                var attributeShortName = movieParent.attr('data-attribute-short-name');

                var url = Vista.Urls.Movies.GetMovieFutureSessions;
                url = url + '?cinemaId=' + cinemaId;
                url = url + '&movieId=' + movieId;
                if (attributeShortName !== null && attributeShortName !== '')
                    url = url + '&attributeShortName=' + attributeShortName;


                $.post(url, function(futureSessionsHtml) {

                    var futureSessions = $(futureSessionsHtml);
                    futureSessions.hide();
                    
                    showtimeList.append(futureSessions);

                    toggleFutureDates(link);
                    addDiscountTicketsToKeyLegend();
                });
            } else {
                toggleFutureDates(link);
            }
            
            return true;
        });


        $(toggleDateLinkSelector).filter(':visible').each(function () {
            var link = $(this);
            toggleFutureDates(link);
        });
    })();

    function toggleFutureDates(link) {
        var parent = link.parents('.film-showtimes').first();
        $(parent).find('.future').toggle('fast');
        link.hide();
        parent.find(toggleDateLinkSelector).not(link).show();
    }
    
    function addDiscountTicketsToKeyLegend() {
        var sessionsWithDiscountedTickets = $(".session-time-with-dynamic-pricing");
        
        if (sessionsWithDiscountedTickets.length > 0) {
            var keyLegend = $(".attributes-key");
            var discountTicketsKey = keyLegend.find("div.dynamically-priced-ticket-key");

            if (keyLegend.length > 0 && discountTicketsKey.length === 0) {
                var discountTicketsText = Vista.Lang.DiscountTickets;
                var discountTicketsKeyHtml = '<div class="dynamically-priced-ticket-key"><span class="dynamically-priced-ticket-key-icon"></span><span> ' + discountTicketsText + '</span></div>';
                keyLegend.find("div.attributes-list").append(discountTicketsKeyHtml);
            }
        }

    }
}