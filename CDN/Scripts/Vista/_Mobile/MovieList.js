/// <reference path="../../jquery-1.8.1.min.js" />


$(function () {

    addEllipsisToFilmSypnosis();

    function addEllipsisToFilmSypnosis() {
        var paragraphs = $('.blurb');

        $.each(paragraphs, function (index) {
            $clamp(paragraphs[index], { clamp: '4' });
        });
    }
});

