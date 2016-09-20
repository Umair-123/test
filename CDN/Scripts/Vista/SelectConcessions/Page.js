/// <reference path="../Vista.js" />
/// <reference path="../ModalError.js" />
/// <reference path="../Countdown/Countdown.js" />
/// <reference path="../Cart/CartItem.js" />
/// <reference path="../Cart/CartView.js" />
/// <reference path="../Cart/Cart.js" />
/// <reference path="../PlusMinusNumeric/PlusMinusNumeric.js" />
/// <reference path="Concession.js" />
/// <reference path="../Models/Promotion.js" />
/// <reference path="../CategoryTabs.js" />
/// <reference path="../ButtonWatch.js" />

// TODO: cleanup
Vista.SelectConcessions.Page = (function () {
    'use strict';

    var cart,
        pending = 0; // track number of queued up concession removals

    var promotionInput = $('#txtPromotionCode'),
        promotionButton = $('.promotion-header button'),
        isAdding = promotionButton.val() === 'add',
        promotionErrorContainer = $('.promotion-header .promotion-error'),
        promotionErrorText = promotionErrorContainer.find('p');

    var methods = {
        init: function () {
            cart = new Vista.Cart.Cart(new Vista.Cart.View($('#cart')));
            cart.onConcessionRemoving(onConcessionRemoving, onConcessionRemovingComplete);
            cart.onConcessionRemove(onConcessionRemove);
            $('.countdown').countdown();
            $('#breadcrumb').breadcrumb();

            var categoryTabsContainer = $('.category-tabs');

            categoryTabsContainer.categorytabs();
            categoryTabsContainer.on('click', '.clear', onClearButtonClick);
            categoryTabsContainer.find('.plus-minus-numeric').plusminusnumeric(onValueChange);

            categoryTabsContainer.find('.description-toggle').on('click', onMoreInfoClick);

            promotionInput.keydown(function (e) {
                if (e.which === 13) { // enter
                    $(this).blur();
                    promotionButton.click();
                    return false;
                }
            });

            promotionButton.click(onPromotionButtonClick);

        }
    };

    /// <summary>Switch between add and remove </summary>
    function togglePromotionButton() {
        if (isAdding) {
            promotionButton.find('span')
                                .toggleClass('icon-add')
                                .toggleClass('icon-remove')
                                .text(Vista.Lang.Concessions.RemovePromotion);
            promotionButton.val('remove');
        }
        else {
            promotionButton.find('span')
                                .toggleClass('icon-add')
                                .toggleClass('icon-remove')
                                .text(Vista.Lang.Concessions.AddPromotion);
            promotionButton.val('add');
        }

        isAdding = !isAdding;
    }

    // TODO: error when add fails
    function addPromotions(promotions) {
        if (!promotions.length) {
            // no matching promotions
            promotionInput.removeAttr('disabled');
            displayPromotionError(Vista.Lang.Concessions.PromotionNotFound);
            return;
        }

        for (var i = 0; i < promotions.length; i++) {
            var itemElement = $('#item-' + promotions[i].ItemId);
            // Promotion may include an item not on the page, in which case stop
            if (!itemElement.length) continue; // TODO: is this necessarily the best fix?

            var item = new Vista.SelectConcessions.Concession(itemElement.closest('.item'));
            var promotion = new Vista.Models.Promotion(promotions[i]);

            var applyPromotionResult = promotion.apply(item.getOriginalPrice());

            item.setDiscount(applyPromotionResult);

            cart.updateConcession(item.getConcessionItem());
        }

        cart.addPromotion(promotionInput.val());

        togglePromotionButton();
    }

    function removePromotions() {
        $('.discount').each(function () {
            var concession = new Vista.SelectConcessions.Concession($(this).closest('.item'));
            if (concession.hasPromotionCodeApplied()) {
                concession.resetPrice();
                cart.updateConcession(concession.getConcessionItem());
            }
        });

        promotionInput.val('').removeAttr('disabled');
        cart.removePromotion();
        togglePromotionButton();
    }

    function displayPromotionError(error) {
        promotionErrorContainer.show();
        promotionErrorText.text(error);
    }

    function onPromotionButtonClick() {
        promotionErrorContainer.hide();
        if (promotionInput.val() === '') return;

        promotionInput.attr('disabled', true);
        Vista.ButtonWatch.disableAll();

        var promotionCode = isAdding ? promotionInput.val() : '';

        $.ajax({
            type: 'POST',
            url: Vista.Urls.Concession.AddPromotionCode,
            data: JSON.stringify({ promotionCode: promotionCode }),
            contentType: 'application/json; charset=UTF-8',
            traditional: true,
            complete: function () { promotionButton.removeAttr('disabled'); Vista.ButtonWatch.enableAll(); },
            success: onPromotionUpdate
        });
    }

    function onPromotionUpdate(response) {
        // TODO: error?
        if (!response.d) { // server side error/unsuccessful
            if (isAdding) {
                promotionInput.removeAttr('disabled');
            }
            return;
        }

        var data = response.d;
        var lastUpdated = data.lastUpdated;
        var promotions = data.promotions;

        if (lastUpdated !== '') {
            $('#txtDateOrderChanged').val(lastUpdated);
        }

        if (isAdding)
            addPromotions(promotions);
        else
            removePromotions(promotions);
    }

    function onValueChange(element, newValue) {

        var item = new Vista.SelectConcessions.Concession($(element).closest('.item'));

        if (item.isUnavailable() && newValue > 0) {
            Vista.ModalError.show(Vista.Lang.Concessions.ErrorMemberOnly);
            item.setQuantity(0);
            return;
        }

        item.repaint();
        cart.updateConcession(item.getConcessionItem());
    }

    function onClearButtonClick() {
        var item = new Vista.SelectConcessions.Concession($(this).closest('.item'));
        cart.removeConcession(item.getConcessionItem());
    }

    function onConcessionRemoving(concession) {
        var item;
        if (concession.loyaltyRecognitionId != null) {
            item = new Vista.SelectConcessions.Concession($('#recognition-' + concession.itemCode + '-' + concession.loyaltyRecognitionId).closest('.item'));
        } else {
            item = new Vista.SelectConcessions.Concession($('#item-' + concession.itemCode).closest('.item'));
        }
        
        item.disable();
        pending++;
    }

    function onConcessionRemovingComplete(concession) {
        var item;
        if (concession.loyaltyRecognitionId != null) {
            item = new Vista.SelectConcessions.Concession($('#recognition-' + concession.itemCode + '-' + concession.loyaltyRecognitionId).closest('.item'));
        } else {
            item = new Vista.SelectConcessions.Concession($('#item-' + concession.itemCode).closest('.item'));
        }
        
        item.enable();
        if (--pending === 0) Vista.ButtonWatch.enableAll();
    }

    function onConcessionRemove(concession) {
        var item;
        if (concession.loyaltyRecognitionId != null) {
            item = new Vista.SelectConcessions.Concession($('#recognition-' + concession.itemCode + '-' + concession.loyaltyRecognitionId).closest('.item'));
        } else {
            item = new Vista.SelectConcessions.Concession($('#item-' + concession.itemCode).closest('.item'));
        }
        
        item.setQuantity(0);
    }

    function onMoreInfoClick(event) {
        var linkToggle = $(event.target);
        var itemContainer = $(linkToggle).closest('li[class^="item"]');;
        $(itemContainer).toggleClass('flipped');
        event.preventDefault();
    }

    return methods;
})();

$(Vista.SelectConcessions.Page.init);

