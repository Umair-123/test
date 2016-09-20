/// <reference path="Vista.js" />
/// <reference path="Utilities/Utilities.js" />
/// <reference path="ModalDialog.js" />

Vista.MessageDialog = function () {
    'use strict';

    var largeHeaderTemplate = '<h2 class="message-dialog-header large-message-dialog-header">{0}<em>{1}</em></h2>',
        normalHeaderTemplate = '<h3 class="message-dialog-header">{0}</h3>',
        bodyTemplate = '<p class="message-dialog-message-text">{0}</p>',
        footerTemplate = '<div class="button-list button-list-single">' +
                                '<button type="button" class="page-action message-dialog-action-button"><span>{0}</span></button>' +
                         '</div>';

    var instance = this,
        modalDialog,
        messageDialogClass = 'message-dialog';

    (function () {
        modalDialog = new Vista.ModalDialog();
    })();

    this.setup = {
        dialogClass: '',
        useLargeHeader: false,
        normalHeaderText: '',
        largeHeaderText1: '',
        largeHeaderText2: '',
        messageText: '',
        includeActionButton: true,
        actionButtonText: '',
        actionButtonCallback: null
    };

    this.show = function (dialogSetup) {

        instance.setup = $.extend({}, instance.setup, dialogSetup);

        modalDialog.show({
            headerHtml: formatHeaderTemplate(),
            bodyHtml: formatBodyTemplate(),
            footerHtml: formatFooterTemplate(),
            modalId: instance.setup.dialogId,
            modalClass: instance.setup.dialogClass + ' ' + messageDialogClass,
            onShow: onModalShow,
            onClose: onModalClose
        });
    };

    this.close = function() {
        modalDialog.close();
    };
    
    function formatHeaderTemplate() {
        
        if (instance.setup.useLargeHeader)
            return Vista.Utilities.format(largeHeaderTemplate, instance.setup.largeHeaderText1, instance.setup.largeHeaderText2);
        
        return Vista.Utilities.format(normalHeaderTemplate, instance.setup.normalHeaderText);
    }

    function formatBodyTemplate() {
        return Vista.Utilities.format(bodyTemplate, instance.setup.messageText);
    }

    function formatFooterTemplate() {

        if (!instance.setup.includeActionButton)
            return '';
        
        return Vista.Utilities.format(footerTemplate, instance.setup.actionButtonText);
    }

    function onModalShow() {

        if (!instance.setup.actionButtonCallback)
            return;
        
        $('body').on('click', getActionButtonSelector(), actionButtonCallbackWrapper);
    }
    
    function onModalClose() {

        if (instance.setup.actionButtonCallback)
            $('body').off('click', getActionButtonSelector(), actionButtonCallbackWrapper);
        
        modalDialog.close();
    }
    
    function getActionButtonSelector() {
        return '.' + messageDialogClass + ' .message-dialog-action-button';
    }
    
    function actionButtonCallbackWrapper() {

        var eventArgs = {
            preventDialogClose: false
        };

        instance.setup.actionButtonCallback(eventArgs);

        if (eventArgs.preventDialogClose)
            return;

        modalDialog.close();
    }
};
