Vista.MobilePageSpinner = function() {

    this.show = function() {
        var $overlay = $('#page-spinner-overlay');
        $overlay.removeClass('hidden');
    };

    this.initialise = function () {
        var _this = this;
        if (typeof window.theForm !== 'undefined') {
            window.theForm.onsubmit = function() {
                _this.show();
            };
        }
    };
};
$(function () {
    Vista.Singletons.MobilePageSpinner = new Vista.MobilePageSpinner();
    Vista.Singletons.MobilePageSpinner.initialise();
});