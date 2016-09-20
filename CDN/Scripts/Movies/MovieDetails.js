
$(function () {
    Vista.ShowHideSessions();
    $('a#trailer').trailerLauncher('#trailer-player-template');
    $('button.trailer-button').trailerLauncher('#trailer-player-template');

    Vista.ImageResize.BoundHorizontally($('#trailer'), $('#play-trailer'));

    var createRating = function (element) {

        element = $(element);
        element.hide();
        var movieId = element.data('movie-id'),
            getUrl = element.data('get-url'),
            submitUrl = element.data('submit-rating-url'),
            loginWrapper = element.find('.login-wrapper');

        var commentElement = element.find('.comment');
        var ratingElement = element.find('.rating-stars');
        var likeElement = element.find('.trailer-rating');
        var yourRatingElement = element.find('.your-rating');
        var topLineLeft = element.find('.top-line .left');
        var hasRating = ratingElement.length;
        var hasComment = commentElement.length;
        var hasLike = likeElement.length;
        var data = {};

        loginWrapper.ajaxifyLoyaltySignup(function() { location.reload(); });

        $(document).on('loyalty::trailerRatingUpdated', function (e, rating) {
            if (rating.MovieId === movieId) {
                $.extend(data, { FilmTrailerRatings: [rating] });
                setData(data);
            }
        });

        if (getUrl) {
            $.post(getUrl, null, function (response) {
                data = response;
                setData(data);
                setEvents();
                element.show();
            });
        }

        var setData = function(data) {
            setTrailerRating(data);
            setComment(data);
            setRating(data);

            topLineLeft.show();
            if ((!hasRating || yourRatingElement.css('display') == 'none')
                && (!hasLike || likeElement.css('display') == 'none')) {
                topLineLeft.hide();
            }

            if (commentElement.css('display') == 'none') {
                element.find('.bottom-line').hide();
            }
        };

        var setRating = function (data) {
            if (hasRating) {
                var starElement = ratingElement.find('.rating-wrapper').starRating();
                if (data.FilmRatings && data.FilmRatings.length && data.FilmRatings[0].Score) {
                    starElement.setValue(data.FilmRatings[0].Score);
                    yourRatingElement.show();
                    yourRatingElement.find('.score').text(data.FilmRatings[0].Score);
                    yourRatingElement.find('.rated').show();
                } else {
                    yourRatingElement.hide();
                }
                starElement.trigger('resize');
            } 
        };

        var setEvents = function()
        {
            element.find('.rating-wrapper').bind('rated', function () {
                if (hasComment) {
                    editComment();
                } else {
                    submitRating();
                }
            });

            element.find('.submit-rating').bind('click', submitRating);
            element.find('.edit-comment').bind('click', editComment);
            element.find('textarea').bind('input propertychange', function () {
                element.find('.comment .display').text($(this).val());
            });
        }

        var editComment = function () {
            commentElement.show();
            element.find('.bottom-line').show();
            commentElement.find('.edit').show().find('textarea').val(commentElement.find('.display').text());
            commentElement.find('.submit-rating').show();
            commentElement.find('.display').hide();
            commentElement.find('.edit-comment').hide();
        }

        var setComment = function (data) {
            if (hasComment) {
                if (!hasRating || (hasRating && data.FilmRatings && data.FilmRatings.length)) {
                    commentElement.show();
                    commentElement.find('.edit').hide();
                    commentElement.find('.submit-rating').hide();
                    if (data.FilmRatings && data.FilmRatings.length && data.FilmRatings[0].Comment) {
                        commentElement.find('.display').text(data.FilmRatings[0].Comment).show();
                    }
                    commentElement.find('.edit-comment').show();

                    if (!hasRating && !commentElement.find('.display').text()) {
                        editComment();
                    }
                } else {
                    commentElement.hide();
                }
            }
        };

        var setTrailerLiked = function(liked) {
            if (liked) {
                likeElement.find('.liked').show();
                likeElement.find('.disliked').hide();
            } else {
                likeElement.find('.liked').hide();
                likeElement.find('.disliked').show();
            }
        }

        var setTrailerRating = function (data) {

            if (canShowLike(data)) {
                likeElement.show();
                setTrailerLiked(data.FilmTrailerRatings[0].Liked);
            } else {
                likeElement.hide();
            }
        };

        var canShowLike = function(data) {
            return hasLike // likes available
                && (data.FilmTrailerRatings && data.FilmTrailerRatings.length) // the trailer has been rated
                && (!ratingElement || !(data.FilmRatings && data.FilmRatings.length)); // the film has not been rated
        };

        var submitRating = function() {
            if (submitUrl) {
                var score = null;

                var starRating = element.find('.rating-wrapper').starRating();
                if (starRating && starRating.getValue) {
                    score = starRating.getValue();
                }
                var rating = {
                    MovieId: movieId,
                    Score: score || null,
                    Comment: element.find('.comment .display').text()
                };

                $.post(submitUrl, rating)
                .done(function () {
                    $.extend(data, { FilmRatings: [rating] });
                    setData(data);
                })
                .fail(function (result) {
                    if (result.status == 403) {
                        loginWrapper.popup();
                    }
                });
            }
        };
    }

    createRating('.film-rating');

});
