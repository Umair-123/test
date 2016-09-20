/// <reference path="Breadcrumb/Control.js"/>
/// <reference path="Cart/Cart.js"/>
/// <reference path="Cart/View.js"/>
/// <reference path="Countdown/Countdown.js"/>
/// <reference path="PlusMinusNumeric/PlusMinusNumeric.js"/>
/// <reference path="CategoryTabs.js"/>

(function ($) {
    'use strict';

    // vanity functions

    $.fn.breadcrumb = function () {
        var b = new Vista.Breadcrumb.Control(this);
        return this;
    };

    $.fn.cart = function () {
        var c = new Vista.Cart.Cart(new Vista.Cart.View(this));
        return this;
    };

    $.fn.countdown = function (action) {
        var c,
            key = 'countdown';
        if (action === 'stop') {
            c = this.data(key);
            c.stop();
        } else {
            c = new Vista.Countdown(this);
            this.data(key, c);
        }
        return this;
    };

    $.fn.categorytabs = function (categoryTabSettings) {
        var t = new Vista.CategoryTabs(this[0], categoryTabSettings);
        return this;
    };

    $.fn.plusminusnumeric = function (callback) {
        var p;

        this.each(function () {
            p = new Vista.PlusMinusNumeric(this, callback);
        });

        return this;
    };

})(jQuery);