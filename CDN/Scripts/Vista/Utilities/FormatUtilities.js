/// <reference path="../../jquery-1.8.1.min.js"/>
/// <reference path="../Vista.js"/>
/// <reference path="../../Culture/globalize.js"/>
(function () {
    'use strict';

    Vista.FormatUtilities = {};

    Vista.FormatUtilities.formatCurrency = function (valueInCents, displayCurrencySymbol) {
        /// <summary>Formats a price in cents for display according to culture settings.</summary>
        /// <param name="valueInCents" type="Number"></param>
        /// <param name="displayCurrencySymbol" type="Boolean">Whether to display the currency symbol. Defaults to true.</param>

        var currentCulture = Globalize.culture();

        if (displayCurrencySymbol === false) { // default to true
            currentCulture = $.extend(true, {}, currentCulture); // don't modify global culture
            currentCulture.numberFormat.currency.symbol = '';
        }

        return Globalize.format(valueInCents / 100, 'c', currentCulture);
    };

})();