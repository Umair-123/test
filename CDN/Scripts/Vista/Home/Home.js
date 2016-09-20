/// <reference path="../../Culture/globalize.js"/>
/// <reference path="../Vista.js"/>
/// <reference path="../Utilities/Utilities.js"/>

Vista.Home = (function () {
    var nowShowingTemplate = '<a href="' + Vista.Urls.Home.MovieDetails + '{0}" class="movie">' +
                             '<img class="movie-poster" src="' + Vista.Urls.Home.MovieImage + '&height=500" alt="{2}" />' +
                             '<span class="name"><img src="' + Vista.Urls.Home.RatingImage + '" alt="{3}" />{2}</span>' +
                             '<span>' + Vista.Lang.Home.BuyTickets + '</span>' +
                             '</a>';

    var comingSoonTemplate = '<a href="' + Vista.Urls.Home.MovieDetails + '{0}" class="movie">' +
                             '<img class="movie-poster" src="' + Vista.Urls.Home.MovieImage + '&height=500" alt="{2}" />' +
                             '<span class="name"><img src="' + Vista.Urls.Home.RatingImage + '" alt="{3}" />{2}</span>' +
                             '<span>{4} | ' + Vista.Lang.Home.MoreInfo + '</span>' +
                             '</a>';

    return {
        init: function () {
            $('.home-movies').scrollbox();

            var centerAds = $('#home-center-ad');
            var sidebarAds = $('#home-sidebar-ad');

            Vista.Images.AdvertImages(centerAds, 'Home', 'CenterBanner');
            Vista.Images.AdvertImages(sidebarAds, 'Home', 'Gallery');

            loadMovies();
        }
    };

    function loadMovies() {
        $.ajax({
            url: Vista.Urls.Home.NowShowing,
            type: 'POST',
            success: function (data) {
                populateMovies($('#home-now-showing'), data, nowShowingTemplate);
            }
        });

        $.ajax({
            url: Vista.Urls.Home.ComingSoon,
            type: 'POST',
            success: function (data) {
                if (data.length) {
                    populateMovies($('#home-coming-soon'), data, comingSoonTemplate);
                }
                else {
                    $('#home-coming-soon').hide().prev('h2').hide();
                }
            }
        });
    }

    function populateMovies(container, data, template) {
        var view = container.find('.scrollbox-view');

        view.empty();
        container.removeClass('container-loading');

        for (var i = 0; i < data.length; i++) {
            Vista.Utilities.fixDotNetJsonDateString(data[i]);
            view.append(Vista.Utilities.format(template, data[i].Id,
                                                         data[i].PosterImageUrl,
                                                         data[i].Title,
                                                         data[i].Rating,
                                                         Globalize.format(data[i].ReleaseDate, 'd')));
        }

        container.scrollbox('refresh');
    }

})();

$(Vista.Home.init);
