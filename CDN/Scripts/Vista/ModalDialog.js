/// <reference path="../../jquery.simplemodal.1.4.3.min.js" />
/// <reference path="Vista.js" />
/// <reference path="Utilities/Utilities.js" />

Vista.ModalDialog = function () {
    'use strict';

    var modalHtmlTemplate = '<div class="modal-dialog-container {4}">' + //class
                                '{3}' + //close
                                '<div class="modal-dialog-content">' +
                                    '{0}' + //header
                                    '{1}' + //body
                                    '{2}' + //footer
                                '</div>' +
                            '</div>';

    var instance = this,
        formattedModalHtml,
        closeClass = 'modal-dialog-close-button';

    this.setup = {
        modalId: 'modal-dialog',
        modalClass: '',
        includeCloseButton: true,
        closeButtonHtml: '<button class="close-button {1}"><span>{0}</span></button>',
        headerHtml: '',
        bodyHtml: '',
        footerHtml: '',
        onClose: null,
        onShow: null
    };

    this.show = function (dialogSetup) {

        instance.setup = $.extend({}, instance.setup, dialogSetup);
        
        formattedModalHtml = instance.formatTemplate();

        $.modal(
            formattedModalHtml,
            {
                minWidth: instance.setup.minWidth,
                minHeight: instance.setup.minHeight,
                containerId: instance.setup.modalId,
                overlayClose: true,
                focus: false,
                closeClass: closeClass,
                onClose: instance.setup.onClose,
                onShow: instance.setup.onShow,
                closeHtml: '' // inserting a button into the close html breaks the height calculation of the simple modal widget, which is why we implemented our own
            }
        );
    };

    this.close = function() {
        $.modal.close();
    };

    this.formatTemplate = function () {
        return Vista.Utilities.format(
            modalHtmlTemplate,
            instance.setup.headerHtml,
            instance.setup.bodyHtml,
            instance.setup.footerHtml,
            instance.formatCloseTemplate(),
            instance.setup.modalClass
        );
    };

    this.formatCloseTemplate = function() {
        return Vista.Utilities.format(instance.setup.closeButtonHtml, Vista.Lang.Shared.Close, closeClass);
    };
};
