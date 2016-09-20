/// <reference path="../Vista.js"/>
/// <reference path="../Utilities/Utilities.js" />
/// <reference path="../MessageDialog.js" />

Vista.CardWallet.DeleteCardFromWalletDialog = function () {
    'use strict';

    var messageDialog;

    (function() {
        messageDialog = new Vista.MessageDialog();
        messageDialog.setup.dialogClass = 'card-wallet-delete-dialog';
        messageDialog.setup.useLargeHeader = true;
        messageDialog.setup.largeHeaderText1 = Vista.Lang.CardWallet.DeleteCardDialogHeaderText1;
        messageDialog.setup.largeHeaderText2 = Vista.Lang.CardWallet.DeleteCardDialogHeaderText2;
        messageDialog.setup.actionButtonText = Vista.Lang.CardWallet.DeleteCardDialogDeleteButton;
    })();

    this.show = function(cardWalletToDelete, deleteCardCallback) {

        messageDialog.setup.messageText = Vista.Utilities.format(Vista.Lang.CardWallet.DeleteCardDialogMessageText, cardWalletToDelete.maskedCardNumber, cardWalletToDelete.cardExpiryDate);
        messageDialog.setup.actionButtonCallback = deleteCardCallback;

        messageDialog.show();
    };
};