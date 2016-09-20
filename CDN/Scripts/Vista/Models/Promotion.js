/// <reference path="../Vista.js"/>

(function () {
    'use strict';

    Vista.Models.Promotion = function (promotion) {
        /// <param name="promotion">Promotion serialized down from server.</param>

        this.price = promotion.Price;
        this.discount = promotion.Discount;
        this.priceOff = promotion.PriceOff;
    };

    Vista.Models.Promotion.prototype.apply = function (priceInCents) {
        var result = {
            oldPrice: priceInCents,
            newPrice: priceInCents,
            oldPriceTextPrefix: Vista.Lang.Concessions.OldPriceTextPrefix,
            newPriceTextPrefix: Vista.Lang.Concessions.NewPriceTextPrefix
        };

        if (this.price > 0) {
            result.newPrice = this.price;
        }
        else if (this.discount > 0 && this.discount < 100) {
            result.newPrice = priceInCents * (100 - this.discount) / 100;
        }
        else if (this.priceOff > 0 && this.priceOff < priceInCents) {
            result.newPrice = priceInCents - this.priceOff;
        }

        return result;
    };
})();
