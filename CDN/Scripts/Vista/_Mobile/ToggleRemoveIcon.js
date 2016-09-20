/// <reference path="../../jquery-1.8.1.min.js" />

$(function () {

    hideAllClearIcons();
    bindToggleRemoveIcon();

    function bindToggleRemoveIcon() {
        $('.select-grid-item > select').on('change', function (event) {
            var selectElementValue = $(event.target).val();
            if (selectElementValue > 0) {
                var selectGridFooter = $(event.target).next();
                var clearIcon = $(selectGridFooter).find('.icon-clear');
                $(clearIcon).show();
            }
        });

        $('.select-grid-item .icon-clear').on('click', function(event) {
            var buttonElement = $(event.target);
            $(buttonElement).hide();
        });
    }

    function hideAllClearIcons() {
        var clearIcons = $('.category-tabs .icon-clear');
        clearIcons.hide();
    }
});