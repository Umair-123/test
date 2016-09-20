/// <reference path="../../jquery-1.8.1.min.js" />


$(function () {

    addEllipsisToCinemaInfo();

    function addEllipsisToCinemaInfo() {
        var paragraphs = $('.item-address');

        $.each(paragraphs, function (index) {
            $clamp(paragraphs[index], { clamp: '4' });
        });
    }
});

