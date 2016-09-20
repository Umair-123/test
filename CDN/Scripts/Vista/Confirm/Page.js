/// <reference path="../../jquery-1.8.1.min.js" />
/// <reference path="../Vista.js"/>
/// <reference path="../Cart/Cart.js"/>
/// <reference path="../CardWallet/CardWalletList.js" />

Vista.Confirm.Page = (function () {
    'use strict';

    var confirmForm,
        nextButton,
        cancelButton,
        continueShoppingButton,
        signInButton,
        paymentMethodRadioButtonGroup,
        giftCardPaymentMethods,
        cardWalletContainer,
        giftCardNumberContainer,
        giftCardPaymentContainer,
        storedValueNumberContainer,
        storedValuePaymentContainer,
        sameAsDeliveryCheckbox,
        deliveryContainer,
        billingContainer,
        postDetailsContainer,
        inputSync,
        cart,
        hasLoyaltyMembershipCheckbox,
        loyaltyCardNumberContainer;

    return {
        init: function () {

            scrollToPaymentMethodsIfPaymentError();

            loadElementsFromDom();
            
            setupControls();
            setupPaymentMethodRadioButtonClickHandlers();
            setupCopyHandler();
            setupButtonsForFormSubmit();
            setupFormForValidation();
            setupCartHandler();
            setupHasLoyaltyMembershipClickHandler();
        }
    };
    
    function loadElementsFromDom() {
        confirmForm = $('#confirmForm');
        nextButton = $('#next');
        cancelButton = $('#cancelOrder');
        continueShoppingButton = $('#continueShopping');
        signInButton = $('#signInButton');

        paymentMethodRadioButtonGroup = $('.payment-method .radio-button-group.main-group');
        giftCardPaymentMethods = $('.payment-method .radio-button-group.gift-card-group');
        cardWalletContainer = $('.card-wallet');
        giftCardPaymentContainer = $('.gift-card-payment');
        giftCardNumberContainer = $('.gift-card-payment-data');
        storedValuePaymentContainer = $('.stored-value-payment');
        storedValueNumberContainer = $('.stored-value-payment-data');

        sameAsDeliveryCheckbox = $('#billing-same-as-delivery');
        postDetailsContainer = $('.postage-details');
        deliveryContainer = $('.delivery-details');
        billingContainer = $('.billing-details');

        hasLoyaltyMembershipCheckbox = $('#is-loyalty-member');
        loyaltyCardNumberContainer = $('.loyalty-card-number-container');
    }

    function setupControls() {
        cart = new Vista.Cart.Cart(new Vista.Cart.View($('.cart')));
        $('.countdown').countdown();
        $('#breadcrumb').breadcrumb();

        var cardWallet = new Vista.CardWallet.CardWalletList($('.card-wallet')[0]);

        if (hasLoyaltyMembershipCheckbox.is(":checked")) {
            loyaltyCardNumberContainer.show();
        } else {
            loyaltyCardNumberContainer.hide();
        }
        
        if (cart.isPickupDeliveryMethodSelected()) {
            postDetailsContainer.hide();
        }
    }

    function scrollToPaymentMethodsIfPaymentError() {

        // scroll to the payment methods when a payment error has occured (this is where the error message displays)
        if (Vista.Data.ConfirmPage.hasPaymentError === true)
            location.hash = '#' + 'payment-methods';
    }

    function setupPaymentMethodRadioButtonClickHandlers() {
        
        paymentMethodRadioButtonGroup.find('.payment-type').on('click', function () {

            var clickedLabel = $(this).find('label');

            setupClickEventForPaymentTypes(clickedLabel);
        });

        paymentMethodRadioButtonGroup.find('label').on('click', function () {

            var clickedLabel = $(this);

            setupClickEventForPaymentTypes(clickedLabel);
        });

        giftCardPaymentMethods.find('label').on('click', function () {
            var clickedLabel = $(this);
            if (clickedLabel.attr('for') === 'gift-card-other')
                giftCardNumberContainer.removeClass('not-applicable');
            else
                giftCardNumberContainer.addClass('not-applicable');
        });

    }

    function setupClickEventForPaymentTypes(clickedLabel) {
        if (clickedLabel.attr('for') === 'card-wallet')
            cardWalletContainer.removeClass('not-applicable');
        else
            cardWalletContainer.addClass('not-applicable');

        setupCardClickHandler(clickedLabel, 'gift-card', giftCardPaymentContainer, giftCardNumberContainer);
        setupCardClickHandler(clickedLabel, 'loyalty-points-payment', storedValuePaymentContainer, storedValueNumberContainer);
    }

    function setupCardClickHandler(clickedLabel, labelFor, paymentContainer, numberContainer) {
        if (clickedLabel.attr('for') === labelFor) {
            paymentContainer.removeClass('not-applicable');
            if (!giftCardPaymentContainer.find('input').length) {
                numberContainer.removeClass('not-applicable');
            }
        } else {
            paymentContainer.addClass('not-applicable');
            if (!paymentContainer.find('input').length) {
                numberContainer.addClass('not-applicable');
            }
        }
    }


    function setupCopyHandler() {
        var settings = {
            //Sync from this div
            targetContainer: deliveryContainer,
            //Do this div
            parentContainer: billingContainer,
            //Only sync elements with this JQuery filter
            inputFilter: ".js-syncable",
            disableElements: billingContainer.find('.js-syncable').closest('.form-line'),
            selectorFunc: function (elementId) {
                return $('#billing' + elementId.substring(elementId.indexOf('-')));
            },
            disableValidation: false // TODO: do we want to disable validation when syncing?
        };

        inputSync = new Vista.Confirm.InputSync(settings);

        sameAsDeliveryCheckbox.click(function () {
            if ($(this).is(':checked')) {
                inputSync.start();
            }
            else {
                inputSync.stop();
            }
        });
    }


    function setupButtonsForFormSubmit() {
        
        // workaround for web forms hijacking the form submit button to do post backs
        var webFormsPostbackClickHandlerText = nextButton.attr('onclick');
        nextButton.removeAttr('onclick');
        nextButton.click(function () {
            confirmForm.validate();
            if (confirmForm.valid()) {
                Vista.ButtonWatch.disableAll();
                eval(webFormsPostbackClickHandlerText);
                return false;
            }
        });


    }
    
    function setupFormForValidation() {

        var formValidation = confirmForm.validate();

        cancelButton.click(function () {
            formValidation.cancelSubmit = true;
        });

        continueShoppingButton.click(function () {
            formValidation.cancelSubmit = true;
        });

        signInButton.click(function () {
            formValidation.cancelSubmit = true;
        });
    }

    function setupCartHandler() {

        cart.onConcessionRemove(function () {
            if (!cart.getConcessions().length) {
                postDetailsContainer.hide();
            }
        });

        cart.onDeliveryMethodChange(function(newDeliveryMethod) {
            if (newDeliveryMethod.isPickup) {
                postDetailsContainer.hide();
            } else {
                postDetailsContainer.show();
            }
        });
    }
    
    function setupHasLoyaltyMembershipClickHandler() {

        hasLoyaltyMembershipCheckbox.on('click', function () {
            var isChecked = this.checked;
            loyaltyCardNumberContainer.toggle(isChecked);
        });
    }

})();

$(Vista.Confirm.Page.init);