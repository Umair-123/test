/// <reference path="../../jquery-1.8.1.min.js" />


$(function () {

    bindSessionDayClickEvent();
    bindCinemaTitleClickEvent();

    goToNextDay();
    goToPreviousDay();

    toggleFilmSynopsis();

    toggleTrailerBox();

    // TODO: use hammer and bind to tap events

    function bindSessionDayClickEvent() {
        $('.session-day').click(function (event) {

            // reset current
            $('.cinemas-for-day').removeClass('selected');
            $('.session-day.selected').removeClass('selected');

            // set new
            var sessionDayElement = $(event.currentTarget);
            var clickedSessionDayIdentifier = sessionDayElement.data('day');
            $('.cinemas-for-day[data-day=' + clickedSessionDayIdentifier + ']').addClass('selected');
            sessionDayElement.addClass('selected');


            event.stopPropagation();
            event.preventDefault();
            return false;
        });
    }

    function bindCinemaTitleClickEvent() {
        $('.cinema-for-day').click(function (event) {
            var cinemaForDayElement = $(event.currentTarget);

            var eventTarget = $(event.target);

            if (eventTarget.is('.session-attributes') || eventTarget.is('.attribute-image')) {
                return false;
            }

            if (cinemaForDayElement.hasClass('expanded') && (eventTarget.is('.showtime-link') || eventTarget.parents('.showtime-link').length > 0)) {
                // allow click event to propogate and redirect to next page
                return true;
            }
            
            cinemaForDayElement.toggleClass('collapsed').toggleClass('expanded');

            $('html, body').animate({
                scrollTop: $(cinemaForDayElement).offset().top
            }, 500);

            event.stopPropagation();
            event.preventDefault();
            return false;
        });
    }

    function goToNextDay() {
        $('.date-selector .next').on('click', function () {
            $('.session-day.selected').next().click();
        });
    }

    function goToPreviousDay() {
        $('.date-selector .prev').on('click', function () {
            $('.session-day.selected').prev().click();
        });
    }

    function toggleFilmSynopsis() {
        $(document).ready(function () {
            toggleExpandHelper();
        });

        $('.film-synopsis').on('click', function() {
            $('.item-details').toggleClass('expanded');
            toggleExpandHelper();
        });

        $('.expand-helper').on('click', function () {
            $('.item-details').toggleClass('expanded');
            toggleExpandHelper();
        });
    }

    function toggleExpandHelper() {
        var itemDetails = $('.item-details')[0];
        if (itemDetails.offsetHeight < itemDetails.scrollHeight) {
            $('.expand-helper').show();
        } else {
            $('.expand-helper').hide();
        }
    }

    function toggleTrailerBox() {
        $('.trailer-icon').on('click', function() {
            $('.trailer-box').slideToggle(150, 'linear');
        });
    }

    if (Vista.Singletons.MobilePageSpinner) {
        $('.showtime-link').on('click', (function () {
            Vista.Singletons.MobilePageSpinner.show();
        }));
    }
});

