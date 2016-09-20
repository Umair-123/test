(function() {
    'use strict';

    $(document).ready(function() {

        $('.rating .rating-wrapper').starRating();

    });

    $('#experience form').on('submit', function(e) {

        e.preventDefault();

        var form = $(e.currentTarget);

        var ratings = {
            FilmRatings: [],
            ExperienceRatings: []
        }

        form.find('.rating.film').each(function (i, el) {
            el = $(el);
            var rating = {
                MovieId: el.data('movie-id'),
                Score: el.find('.rating-wrapper').data('rating-value'),
                Comment: el.find('textarea').val()
            }
            if (rating.Score || rating.Comment) {
                ratings.FilmRatings.push(rating);
            }
        });

        form.find('.rating.experience').each(function (i, el) {
            el = $(el);
            var rating = {
                RatingType: el.data('rating-type'),
                Score: el.find('.rating-wrapper').data('rating-value'),
                Comment: el.find('textarea').val()
            };
            if(rating.Score || rating.Comment) {
                ratings.ExperienceRatings.push(rating);
            }
        });
        

        $.modal('<div class="loading"></div>',{
            overlayClose: false,
            opacity: 50,
            modal: true,
            minHeight: 200,
            minWidth: 200,
            containerCss: {
                backgroundColor: 'transparent',
                height: 70,
                width: 70
            },
            overlayCss: {
                backgroundColor: '#000'
            },
        });

        var canClose = false,
            open = true;

        var close = function() {
            if (canClose) {
                $.modal.close();
            }
            canClose = true;
        }

        setTimeout(close, 1000);

        $.ajax({
            url: this.action,
            data: JSON.stringify(ratings),
            type: 'POST',
            contentType: "application/json;",
            success: function () { close(); },
            error: function () { location.replace(Vista.Urls.General.Error); }
        });
    });

})(jQuery);