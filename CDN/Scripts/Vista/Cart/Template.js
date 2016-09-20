/// <reference path="../Vista.js"/>
/// <reference path="../Utilities/FormatUtilities.js"/>
/// <reference path="CartItem.js"/>

(function () {
    'use strict';

    Vista.Cart.Template = function (itemClass) {
        this._itemClass = itemClass;
    };

    Vista.Cart.Template.prototype._template = $('<li></li>')
        .append($('<button class="clear icon icon-clear" data-js-buttonwatch="true" type="button"></button>'))
        .append($('<div class="item-detail">').append('<span class="name"></span>').append('<span class="item-fee"></span>'))
        .append($('<span class="quantity"></span>'))
        .append($('<span class="points-cost"></span>'))
        .append($('<div class="cost">').append('<span class="price"></span>').append('<span class="discount"></span>'));

    Vista.Cart.Template.prototype.refresh = function (template, cartItem) {
        template.find('.name').text(cartItem.name);
        template.find('.item-fee').text(cartItem.includedFeeForDisplay);
        template.find('.price').data('value', cartItem.totalPriceInCents).text(Vista.FormatUtilities.formatCurrency(cartItem.totalPriceInCents, false));
        template.find('.discount').data('value', cartItem.totalDiscountInCents).text(Vista.FormatUtilities.formatCurrency(-cartItem.totalDiscountInCents, false)).toggleClass('none', !cartItem.totalDiscountInCents);
        template.find('.quantity').text(cartItem.quantity);
        template.find('.points-cost').data('value', cartItem.pointsCost);
    };

    Vista.Cart.Template.prototype.render = function (cartItem) {
        var template = this.getTemplate(cartItem).addClass(this._itemClass);
        template.data('id', cartItem.id);
        this.refresh(template, cartItem);

        return template;
    };

    Vista.Cart.Template.prototype.getTemplate = function () {
        return this._template.clone();
    };
})();
