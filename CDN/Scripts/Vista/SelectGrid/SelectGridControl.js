/// <reference path="../../jquery-1.8.1.min.js" />
/// <reference path="../Vista.js"/>
/// <reference path="../Models/Ticket.js"/>
/// <reference path="SelectGridView.js"/>
/// <reference path="SelectGridItem.js"/>

Vista.SelectGrid.SelectGridControl = function (view, maxValue, valueChangeHandler, getExternalCountFunc) {
    /// <param name="view" type="Vista.SelectGrid.SelectGridView" />
    /// <param name="maxValue" type="Number" />
    /// <param name="valueChangeHandler" type="Function" />
    /// <param name="getExternalCountFunc" type="Function">Function which returns count from external sources</param>
    'use strict';

    (function () {
        maxValue = +maxValue || 10;

        view.onValueChange(onValueChange);
        view.setMax(maxValue);
        updateCounter();
    })();

    this.maxSelected = function () {
        /// <returns type="Boolean" />
        return getTotal() === maxValue;
    };

    this.refresh = function () {
        updateCounter();
    };

    function onValueChange(item) {
        /// <param name="item" type="Vista.SelectGrid.SelectGridItem.js" />
        updateCounter();

        var updatedTicket = $.extend(new Vista.Models.Ticket(), {
            ticketTypeCode: item.getCode(),
            description: item.getDescription(),
            priceEachInCents: item.getValue(),
            loyaltyPointsCost: item.getData().loyaltyPointsCost,
            loyaltyRecognitionId: item.getData().loyaltyRecognitionId,
            quantity: item.getCount(),
            includedFeeForDisplay: item.getData().ticketFeeForDisplay,
            ticketFeeEachInCents: item.getData().ticketFeeInCents
        });

        item.setTotal(updatedTicket.totalPriceInCents());

        if (typeof valueChangeHandler === 'function') {
            valueChangeHandler(updatedTicket);
        }
    }

    function getTotal() {
        var total = view.getTotal();

        if (typeof getExternalCountFunc === 'function') {
            total += +getExternalCountFunc() || 0;
        }

        return total;
    }

    function updateCounter() {
        var total = getTotal();
        view.setCount(total);
        view.setRemaining(Math.max(maxValue - total, 0));
    }
};