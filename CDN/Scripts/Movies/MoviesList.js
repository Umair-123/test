$(function () {

    $('.play').trailerLauncher('#trailer-player-template');

    var container = $('.main-ad');
    Vista.Images.AdvertImages(container, 'MovieList', 'Main');
    var lowerAd = $('.lower-ad');
    Vista.Images.AdvertImages(lowerAd, 'MovieList', 'Lower');

    $(".item-details-inner").dotdotdot({});

    var getRatings = function(elements) {
        elements = $(elements);
        var getUrl = elements.data('get-url');
        var ids = [];

        for (var i = 0; i < elements.length; i++) {
            var id = $(elements[i]).data('movie-id');
            ids.push(id);
        }

        $.ajax({
            type: "POST",
            data: JSON.stringify(ids),
            url: getUrl,
            contentType: "application/json",
            success: getRatingSuccess
        });
    }

    $(document).on('loyalty::trailerRatingUpdated', function(e, rating) {
        if (rating.Liked) {
            $('.trailer-rating[data-movie-id="' + rating.MovieId + '"]').removeClass('hidden');
        } else {
            $('.trailer-rating[data-movie-id="' + rating.MovieId + '"]').addClass('hidden');
        }
    });

    var getRatingSuccess = function (data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].FilmRatings && moviesRating.length != 0) {
                //var comment = data.FilmRatings[0].Comment;
                var score = data[i].FilmRatings[0].Score;
                if (score > 0) {
                    var elMovie = $(moviesRating).filter(function (index, element) {
                        return $(element).data('movie-id') === data[i].FilmRatings[0].MovieId;
                    });

                    elMovie.find('.user-rating .your-score').text(score.toString());
                    $(elMovie).removeClass('hidden');
                }

                continue; //continue loop if user Rating already has been shown
            }

            if (data[i].FilmTrailerRatings && trailerRating.length != 0) {
                if (data[i].FilmTrailerRatings[0].Liked) {
                    var elTrailer = $(trailerRating).filter(function (index, element) {
                        return $(element).data('movie-id') === data[i].FilmTrailerRatings[0].MovieId;
                    });
                    $(elTrailer).removeClass('hidden');
                }
            }
        }
    }

    var moviesRating = $('.film-rating');
    var trailerRating = $('.trailer-rating');

    if (moviesRating.length != 0) {
        getRatings(moviesRating);
    }
    else if (trailerRating.length != 0) {
        getRatings(trailerRating);
    }
});