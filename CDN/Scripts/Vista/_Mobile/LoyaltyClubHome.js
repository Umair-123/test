/// <reference path="../../jquery-1.8.1.min.js" />

$(function () {

    bindUpcomingTabsOnClick();
    bindRewardsTabOnClick();
    getBookingCount();

    function bindUpcomingTabsOnClick() {
        $('.upcoming-bookings-title').on('click', function (event) {
            var tab = $(event.target);
            $(tab).parent().toggleClass('collapsed');
            $('.booking-count').toggle();
        });
    }

    function bindRewardsTabOnClick()
    {
        $('.rewards > h3').on('click', function (event) {
            var tab = $(event.target);
            $(tab).parent().toggleClass('collapsed');
        });

    }

    function getBookingCount() {
        var count = $('.booking-detail-wrapper').length;
        count = ' (' + count + ')';
        $('.booking-count').text(count);
    }
});
