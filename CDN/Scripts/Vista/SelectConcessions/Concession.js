(function () {
    'use strict';

    Vista.SelectConcessions.Concession = function (container) {
        this.container = container;
        this.originalPriceElement = container.find('.price.original');
        this.discountPriceElement = container.find('.price.discount');

        var originalPrice = this.originalPriceElement.data('value');
        this.originalPrice = typeof originalPrice === 'undefined' ? this.getPrice() : originalPrice;

    };

    Vista.SelectConcessions.Concession.prototype.repaint = function () {
        if (this.container.find('.quantity').val() > 0) {
            this.container.addClass('active');
        }
        else {
            this.container.removeClass('active');
        }
    };

    Vista.SelectConcessions.Concession.prototype.getPrice = function () {
        return this.container.find('.price').data('value');
    };

    Vista.SelectConcessions.Concession.prototype.getOriginalPrice = function () {
        return this.originalPrice;
    };

    Vista.SelectConcessions.Concession.prototype.setDiscount = function (applyPromotionResult) {
        this.originalPriceElement.text(applyPromotionResult.oldPriceTextPrefix + " " + Vista.FormatUtilities.formatCurrency(applyPromotionResult.oldPrice, false));
        this.discountPriceElement.data('value', applyPromotionResult.newPrice);
        this.discountPriceElement.data('hasPromotionCode', 'true');
        this.discountPriceElement.text(applyPromotionResult.newPriceTextPrefix + " " + Vista.FormatUtilities.formatCurrency(applyPromotionResult.newPrice, false));
    };

    Vista.SelectConcessions.Concession.prototype.resetPrice = function () {
        this.originalPriceElement.text(Vista.FormatUtilities.formatCurrency(this.originalPrice, false));
        this.discountPriceElement.text('');
        this.discountPriceElement.data('hasPromotionCode', 'false');
        this.discountPriceElement.data('value', '');
    };

    Vista.SelectConcessions.Concession.prototype.setQuantity = function (value) {
        this.container.find('.quantity').val(value).change();
    };

    Vista.SelectConcessions.Concession.prototype.getId = function () {
        return this.container.find('.quantity').attr('id').substr(5);
    };

    Vista.SelectConcessions.Concession.prototype.disable = function () {
        this.container.addClass('disabled');
        this.container.find('.item-footer-quantity button').attr('disabled', true).addClass('disabled');
        this.container.find('.item-footer-quantity input').attr('disabled', true).addClass('disabled');
    };

    Vista.SelectConcessions.Concession.prototype.enable = function () {
        this.container.removeClass('disabled');
        this.container.find('.item-footer-quantity button').removeAttr('disabled').removeClass('disabled');
        this.container.find('.item-footer-quantity input').removeAttr('disabled').removeClass('disabled');
    };

    Vista.SelectConcessions.Concession.prototype.isUnavailable = function () {
        return this.container.find('input').data('unavailable');
    };

    // TODO: serialize this down directly
    Vista.SelectConcessions.Concession.prototype.getConcessionItem = function () {
        var quantity = this.container.find('.quantity');
        var concession = new Vista.Models.Concession();

        if (quantity.attr('id').substring(0, 12) === "recognition-") {
            var combinationId = quantity.attr('id').substring(12).split('-');
            concession.itemCode = combinationId[0];
            concession.loyaltyRecognitionId = combinationId[1];
        } else {
            concession.itemCode = quantity.attr('id').substring(5);
        }

        concession.description = this.container.find('label').text();

        concession.priceEachInCents = +this.container.find('.price.original').data('value');
        concession.quantity = +quantity.val();

        var discountedPrice = this.container.find('.price.discount').data('value');
        if (discountedPrice !== "") {
            concession.discountEachInCents = concession.priceEachInCents - discountedPrice;
            concession.discountQuantity = concession.quantity;
        }
        
        return concession;
    };

    Vista.SelectConcessions.Concession.prototype.hasPromotionCodeApplied = function () {
        var hasPromotionCode = this.discountPriceElement.data('hasPromotionCode');
        if (hasPromotionCode === null || hasPromotionCode === undefined)
            return false;

        return hasPromotionCode.toString().toLowerCase() === 'true';
    };

   

})();
