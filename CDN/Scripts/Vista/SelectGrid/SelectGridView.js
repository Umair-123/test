/// <reference path="../../jquery-1.8.1.min.js" />
/// <reference path="../Vista.js"/>
/// <reference path="SelectGridItem.js"/>
/// <reference path="SelectGridSelector.js"/>
/// <reference path="SelectGridCounter.js"/>

Vista.SelectGrid.SelectGridView = function (container) {
    /// <param name="container" type="jQuery" />
    'use strict';

    var selector = new Vista.SelectGrid.SelectGridSelector(),
        counter = new Vista.SelectGrid.SelectGridCounter(),
        items = [],
        changeHandler;

    container.on(Vista.SelectGrid.SelectGridItem.Events.change, onValueChange);
    container.find('.select-grid-item').each(function () {
        var element = $(this);

        var item = new Vista.SelectGrid.SelectGridItem(element, selector);
        element.data('selectgriditem', item);
        items.push(item);
    });

    // IE6/7 bugs out when having an absolute-positioned element before a static element
    // putting it after as a workaround
    container.after(counter);

    this.onValueChange= function (handler) {
        /// <param name="handler" type="Function" />
        changeHandler = handler;
    };

    this.setCount = function (count) {
        /// <param name="count" type="Number" />
        counter.setValue(count);
    };

    this.getTotal = function () {
        /// <returns type="Number" />
        return items.reduce(function (prev, current) {
            return prev + current.getCount() * current.getWeigh();
        }, 0);
    };

    this.setMax = function (maxValue) {
        /// <param name="maxValue" type="Number" />
        counter.setMax(maxValue);
    };

    this.setRemaining = function (minValue) {
        /// <param name="totalValue" type="Number" />
        selector.setMax(minValue);
    };

    function onValueChange(e) {
        /// <param name="e" type="jQuery.Event" />
        e.stopPropagation();

        if (typeof changeHandler === 'function') {
            changeHandler($(e.target).data('selectgriditem'));
        }
    }

};