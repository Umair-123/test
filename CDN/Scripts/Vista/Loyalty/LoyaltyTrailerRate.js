(function ($) {
    'use strict';

    $.fn.loyaltyTrailerRate = function (movieId) {
        var container = this;
        if (movieId) {
            container.data('movie-id', movieId);
        }

        var rateElement = container.find('.rate');
        var textElement = container.find('.rate-text');
        var rating = { MovieId: container.data('movie-id') };

        var template = $('#trailer-rating-template');

        if (template.length) {
            if (!rateElement.length.length) {

                container.append(template.html());

                rateElement = container.find('.rate');
                textElement = container.find('.rate-text');
                var loginWrapper = container.find('.login-wrapper');

                loginWrapper.ajaxifyLoyaltySignup(function() {
                    submitRating(hideLogin);
                    container.on('modalClose', function() { location.reload(); });
                });

                rateElement.find('span').on('click', function() {
                    var element = $(this);
                    rating.Liked = element.hasClass('thumbs-up');

                    submitRating();
                });
            }
        } else {
            container.hide();
        }

        var submitRating = function(callback) {
            $.post(Vista.Urls.Loyalty.SubmitFilmTrailerRating, rating)
                .done(function () {
                    container.setValue(rating.Liked);
                    $(document).trigger('loyalty::trailerRatingUpdated', rating);
                    container.trigger('loyalty::trailerRatingUpdated', rating);

                    if (callback) {
                        callback();
                    }
                })
                .fail(function (result) {
                    if (result.status == 403) {
                        showLogin();
                    }
                });
        }

        var showLogin = function() {
            rateElement.hide();
            textElement.hide();
            loginWrapper.show();
        }

        var hideLogin = function () {
            rateElement.show();
            textElement.show();
            loginWrapper.hide();
        }

        var updateLiked = function () {
            var liked = container.getValue();

            if (liked === true) {
                rateElement.find('.thumbs-up').addClass('selected');
                rateElement.find('.thumbs-down').removeClass('selected');
                textElement.text(Vista.Localisation.YouLikedTheTrailer);
            } else if(liked === false) {
                rateElement.find('.thumbs-up').removeClass('selected');
                rateElement.find('.thumbs-down').addClass('selected');
                textElement.text(Vista.Localisation.YouDislikedTheTrailer);
            }
        }

        $.extend(container, {
            setValue: function(value) {
                container.data('liked', value);
                updateLiked();
                return this;
            },

            getValue: function () {
                return container.data('liked');
            }
        });

        return container;
    }
})(jQuery);