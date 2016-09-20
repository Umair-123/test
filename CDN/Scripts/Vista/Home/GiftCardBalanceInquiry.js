/// <reference path="../../jquery-1.8.1.min.js" />
/// <reference path="../../jquery.validate.js" />
/// <reference path="../Vista.js"/>
/// <reference path="../Utilities/FormatUtilities.js" />

Vista.Home.GiftCardBalanceInquiry = (function () {
    'use strict';

    var states = {
        presentational: 0,
        inquiryForm: 1,
        results: 2,
        loading: 3
    };

    var presentationalStateContainer,
        inquiryFormStateContainer,
        resultsStateContainer,
        loadingStateContainer,
        giftCardBalanceForm,
        giftCardNumberInput,
        checkAnotherCardButton,
        errorMessageContainer;


    return {
        init: function () {
            loadElementsFromDom();
            setupFormValidation();
            setupEventHandlers();
        }
    };
        
    function loadElementsFromDom() {
        
        // state containers
        presentationalStateContainer = $('.gift-card-balance-inquiry-presentational-state');
        inquiryFormStateContainer = $('.gift-card-balance-inquiry-inquiry-state');
        resultsStateContainer = $('.gift-card-balance-inquiry-result-state');
        loadingStateContainer = $('.gift-card-balance-inquiry-loading-state');

        giftCardBalanceForm = $('.gift-card-balance-inquiry-form');
        giftCardNumberInput = giftCardBalanceForm.find('#CardNumber');

        checkAnotherCardButton = $('.check-another-card-button');

        errorMessageContainer = $('.error-container');
    }
    
    function setupEventHandlers() {

        $('.gift-card-balance-inquiry-presentational-state').click(function () {
            setState(states.inquiryForm);
        });
        
        checkAnotherCardButton.click(function () {

            resetInquiryForm();

            setState(states.inquiryForm);

            resetInquiryResults();
        });
        
        
        giftCardBalanceForm.submit(function () {

            setState(states.loading);

            $.ajax({
                type: 'GET', // need to change to post to prevent caching?? maybe server side no-cache header is enough
                url: giftCardBalanceForm.attr('action'),
                data: { giftCardNumber: giftCardNumberInput.val() }
            }).done(function (result) {

                if (result.succeeded) {
                    setErrorMessage(Vista.Lang.GiftCardBalanceInquiry.GeneralError);
                    setState(states.inquiryForm);
                    return;
                }

                resultsStateContainer.find('.gift-card-number').text(giftCardNumberInput.val());
                resultsStateContainer.find('.gift-card-balance').text( Vista.FormatUtilities.formatCurrency(result.balanceInCents, true) );

                if (result.cardExpiryDate !== null) {
                    resultsStateContainer.find('.gift-card-expiry').text(result.cardExpiryDate);
                    resultsStateContainer.find('.gift-card-expiry-result-line').removeClass('not-applicable');
                } else {
                    resultsStateContainer.find('.gift-card-expiry-result-line').addClass('not-applicable');
                }


                setState(states.results);

            }).fail(function () {
                
                setErrorMessage(Vista.Lang.GiftCardBalanceInquiry.GeneralError);
                setState(states.inquiryForm);
            });


            // prevent native form submission
            return false;
        });


        giftCardNumberInput.focusin(function() {
            clearErrorMessage();
        });
    }
    
    function setupFormValidation() {
        //giftCardBalanceForm.validate();
    }
    
    function setState(state) {
        
        switch (state) {
            case states.presentational:
                presentationalStateContainer.removeClass('not-applicable');
                inquiryFormStateContainer.addClass('not-applicable');
                resultsStateContainer.addClass('not-applicable');
                loadingStateContainer.addClass('not-applicable');
                break;
            case states.inquiryForm:
                presentationalStateContainer.addClass('not-applicable');
                inquiryFormStateContainer.removeClass('not-applicable');
                resultsStateContainer.addClass('not-applicable');
                loadingStateContainer.addClass('not-applicable');
                break;
            case states.results:
                presentationalStateContainer.addClass('not-applicable');
                inquiryFormStateContainer.addClass('not-applicable');
                resultsStateContainer.removeClass('not-applicable');
                loadingStateContainer.addClass('not-applicable');
                break;
            case states.loading:
                presentationalStateContainer.addClass('not-applicable');
                inquiryFormStateContainer.addClass('not-applicable');
                resultsStateContainer.addClass('not-applicable');
                loadingStateContainer.removeClass('not-applicable');
                break;
            default:
                throw Error('Unknown state: ' + state + ' for gift card inquiry control.');
        }
    }
    
    function resetInquiryForm() {
        giftCardNumberInput.val(null);
    }
    
    function resetInquiryResults() {
        // reset fields
        resultsStateContainer.find('.gift-card-number').clear();
        resultsStateContainer.find('.gift-card-balance').clear();
        resultsStateContainer.find('.gift-card-expiry').clear();
    };

    function setErrorMessage(message) {
        errorMessageContainer.find('.error-text').text(message);
        errorMessageContainer.removeClass('not-applicable');
    }

    function clearErrorMessage() {
        errorMessageContainer.find('.error-text').text('');
        errorMessageContainer.addClass('not-applicable');
    }

})();

$(Vista.Home.GiftCardBalanceInquiry.init);