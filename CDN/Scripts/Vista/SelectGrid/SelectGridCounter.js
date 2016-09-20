/// <reference path="../../jquery-1.8.1.min.js" />
/// <reference path="../Vista.js"/>

Vista.SelectGrid.SelectGridCounter = function () {
    /// <param name="maxValue" type="Number" />
    'use strict';

    var container,
        value,
        max;

    (function () {
        container = $(".select-grid-counter");

        (value = $('<span></span>').text(0)).insertBefore(container.find("p"));
        ($('<span></span>').text('/')).insertBefore(container.find("p"));
        (max = $('<span></span>').text(0)).insertBefore(container.find("p"));
    })();

    $.extend(this, container);

    this.setValue = function (val) {
        /// <param name="val" type="Number" />
        value.text(val);
    };

    this.setMax = function (maxValue) {
        /// <param name="maxVal" type="Number" />
        max.text(maxValue);
    };

};
