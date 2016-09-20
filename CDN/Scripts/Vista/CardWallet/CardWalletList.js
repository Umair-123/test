/// <reference path="../Vista.js"/>
/// <reference path="DeleteCardFromWalletDialog.js" />

Vista.CardWallet.CardWalletList = function (cardWalletContainerElement) {
    'use strict';

    var deleteCardButton,
        deleteCardDialog,
        checkboxList,
        cardWalletInfo,
        noCardsMessage;

    (function () {
        loadElementsFromDom();
        setupEventHandlers();
        setupControls();
    })();

    function loadElementsFromDom() {
        deleteCardButton = $(cardWalletContainerElement).find('.card-wallet-delete-card');
        checkboxList = $(cardWalletContainerElement).find('.checkbox-list');
        cardWalletInfo = $(cardWalletContainerElement).find('.card-wallet-info');
        noCardsMessage = $(cardWalletContainerElement).find('.no-cards-message');
    }
    
    function setupEventHandlers() {
        deleteCardButton.click(onDeleteCardButtonClick);
    }

    function setupControls() {
        deleteCardDialog = new Vista.CardWallet.DeleteCardFromWalletDialog();

        checkboxList.checkboxlist();
    }

    function onDeleteCardButtonClick() {

        var cardIdToDelete = $(this).parent().attr('for');

        var cardWalletToDelete = getCardWalletById(cardIdToDelete);

        deleteCardDialog.show(cardWalletToDelete, function () {
            deleteCardFromWallet(cardWalletToDelete);
        });

        return false;
    }
    
    function getCardWalletById(id) {

        var label = $('label[for=' + id + ']');

        return {
            id: id,
            maskedCardNumber: label.find('.card-wallet-card-number').text(),
            cardExpiryDate: label.find('.card-wallet-card-expiry').text()
        };
    }

    function deleteCardFromWallet(cardWalletToDelete) {
       
        $.ajax({
            type: "POST",
            url: Vista.Urls.CardWallet.DeleteCardFromCardWallet,
            data: JSON.stringify({ cardWalletToken: cardWalletToDelete.id }),
            contentType: 'application/json; charset=UTF-8'
        })
        .done(function () {
            
            // remove deleted card wallet list item
            $('#' + cardWalletToDelete.id).parent().remove();
            
            if (checkboxList.find('li').length > 0) {
                // reapply alt styling to list
                checkboxList.find('li').removeClass('alt');
                checkboxList.find('li:nth-child(2n)').addClass('alt');
            } else {
                // no cards left in wallet; hide list container and display no cards message
                cardWalletInfo.addClass('not-applicable');
                noCardsMessage.removeClass('not-applicable');
            }
        })
        .fail(function() {
            
        });     
    }
};