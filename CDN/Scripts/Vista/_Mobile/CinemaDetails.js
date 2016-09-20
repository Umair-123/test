/// <reference path="../../jquery-1.8.1.min.js" />


$(function () {

    bindSessionDayClickEvent();
    bindFilmTitleClickEvent();
    bindTooltipToClickEvent();

    goToNextDay();
    goToPreviousDay();


    // TODO: use hammer and bind to tap events?

    function bindSessionDayClickEvent() {
        $('.session-day').click(function (event) {

            // reset current
            $('.films-for-day').removeClass('selected');
            $('.session-day.selected').removeClass('selected');

            // set new
            var sessionDayElement = $(event.currentTarget);
            var clickedSessionDayIdentifier = sessionDayElement.data('day');
            $('.films-for-day[data-day=' + clickedSessionDayIdentifier + ']').addClass('selected');
            sessionDayElement.addClass('selected');


            event.stopPropagation();
            event.preventDefault();
            return false;
        });
    }

    function bindFilmTitleClickEvent() {
        $('.film-for-day').click(function (event) {
            var filmForDayElement = $(event.currentTarget);

            var eventTarget = $(event.target);

            if (eventTarget.is('.session-attributes') || eventTarget.is('.attribute-image')) {
                return false;
            }

            if (filmForDayElement.hasClass('expanded') && (eventTarget.is('.showtime-link') || eventTarget.parents('.showtime-link').length > 0)) {
                // allow click event to propogate and redirect to next page
                return true;
            }

            $('html, body').animate({
                scrollTop: $(filmForDayElement).offset().top
            }, 500);
            
            filmForDayElement.toggleClass('collapsed').toggleClass('expanded');
            event.stopPropagation();
            event.preventDefault();
            return false;
        });
    }

    function bindTooltipToClickEvent() {
        var tabs = $('.session-attributes.has-attributes');

        $(tabs).on('click', function () {
            if ($(this).find('.tooltip').hasClass('visible')) {
                $(this).find('.tooltip').toggleClass('visible');
                return;
            }

            $.each(tabs, function (index, tab) {
                var tooltip = $(tab).find('.tooltip');
                if (tooltip.hasClass('visible')) {
                    $(tooltip).removeClass('visible');
                }
            });
            $(this).find('.tooltip').toggleClass('visible');
        });
    };

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

    if (Vista.Singletons.MobilePageSpinner) {
        $('.showtime-link').on('click', (function () {
            Vista.Singletons.MobilePageSpinner.show();
        }));
    }
});
