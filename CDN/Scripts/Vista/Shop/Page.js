/// <reference path="../Vista.js"/>
/// <reference path="../Utilities/Utilities.js"/>
/// <reference path="../PlusMinusNumeric/PlusMinusNumeric.js"/>
/// <reference path="../Cart/Cart.js"/>
/// <reference path="../Cart/CartView.js"/>
/// <reference path="../SelectConcessions/Concession.js"/>
/// <reference path="../AssignGiftModalDialog.js"/>

Vista.Shop.Page = (function () {
    'use strict';

    var page = $('#visShop'), // assume this is also the form
        cart,
        nextButton = page.find('#btnShopCheckout'),
        nextContainer = nextButton.closest('div'),
        nextOnClick, // web forms handler
        recipientsInput = page.find('input').filter('[name="gift-recipients"]'),
        pending = 0, // track number of pending concession removes
        assignGiftModal = Vista.AssignGiftModalDialog,
        currentItem;

    var methods = {
        init: function () {
            if (!page.length) return;

            cart = new Vista.Cart.Cart(new Vista.Cart.View($('.cart')));
            cart.onConcessionRemoving(onConcessionRemoving, onConcessionRemovingComplete);
            cart.onConcessionRemove(onConcessionRemove);

            page.find('.plus-minus-numeric').plusminusnumeric(onItemValueChange);

            var categoryTabsContainer = page.find('.category-tabs');
            categoryTabsContainer.categorytabs();
            categoryTabsContainer.on('click', '.clear', onClearButtonClick);

            page.on('click', '.item-footer-button button', onGiftButtonClick);

            assignGiftModal.onSave(onAssignGiftSave);

            nextOnClick = nextButton.attr('onclick');
            nextButton.removeAttr('onclick');
            nextButton.click(onNextClick);
            updateNextButton();

        }
    };

    function onNextClick() {
        serializeForPost();
        Vista.ButtonWatch.disableAll();
        eval(nextOnClick);
    }

    function onGiftButtonClick() {
        var item = new Vista.SelectConcessions.Concession($(this).closest('.item'));
        currentItem = item;
        assignGiftModal.show(cart.getRecipients(), [item.getConcessionItem()]);
    }

    function onItemValueChange(container) {
        var item = new Vista.SelectConcessions.Concession($(container).closest('.item'));
        item.repaint();
        cart.updateConcession(item.getConcessionItem());

        updateNextButton();
    }

    function onConcessionRemoving(concession) {
        if (concession.isGift) return;
        var item = new Vista.SelectConcessions.Concession($('#item-' + concession.itemCode).closest('.item'));
        item.disable();
        pending++;
    }

    function onConcessionRemovingComplete(concession) {
        if (concession.isGift) {
            updateNextButton();
            return;
        }
        var item = new Vista.SelectConcessions.Concession($('#item-' + concession.itemCode).closest('.item'));
        item.enable();
        if (--pending === 0) Vista.ButtonWatch.enableAll();
        updateNextButton();
    }

    function onConcessionRemove(concession) {
        if (concession.isGift) {
            updateNextButton();
            return;
        }
        var item = new Vista.SelectConcessions.Concession($('#item-' + concession.itemCode).closest('.item'));
        item.setQuantity(0);
        updateNextButton();
    }

    function onClearButtonClick() {
        var item = new Vista.SelectConcessions.Concession($(this).closest('.item'));

        item.disable();
        pending++;
        cart.removeConcession(item.getConcessionItem());
        updateNextButton();
    }

    function onAssignGiftSave(recipient, quantity) {
        var concession = currentItem.getConcessionItem();
        concession.quantity = quantity;
        concession.isGift = true;

        cart.addGift(concession, recipient);
        updateNextButton();
    }

    function getGifts() {
        var recipientGifts = {};

        var gifts = cart.getGifts();
        for (var i = 0; i < gifts.length; i++) {
            var gift = gifts[i];
            if (!recipientGifts.hasOwnProperty(gift.deliveryId))
                recipientGifts[gift.deliveryId] = {};

            recipientGifts[gift.deliveryId][gift.itemCode] = gift.quantity;
        }

        return recipientGifts;
    }

    function serializeForPost() {
        // combine into a single object to post to server
        var recipients = cart.getRecipients();

        var recipientGifts = getGifts();

        for (var i = 0; i < recipients.length; i++) {
            recipients[i].gifts = Vista.Utilities.toDataContractDictionary(recipientGifts[recipients[i].id]);
        }

        recipientsInput.val(JSON.stringify(recipients));
    };

    function updateNextButton() {
        nextContainer[cart.hasConcessions() ? 'removeClass' : 'addClass']('not-applicable');
    }

    return methods;
})();

$(Vista.Shop.Page.init);
