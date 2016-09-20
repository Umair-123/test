/// <reference path="Vista.js"/>
/// <reference path="../jquery.simplemodal.1.4.3.min.js"/>

Vista.ModalError = (function () {
    // TODO: lang for default values
    var template = '<div class="modal-error">' +
                       '<h2 class="modal-error-title">' + Vista.Lang.ModalError.Title + '</h2>' +
                       '<p class="modal-error-message"></p>' +
                       '<div class="modal-error-button-container"><button class="page-action"><span>' + Vista.Lang.ModalError.OkButton + '</span></button></div>' +
                   '</div>',
        container,
        titleContainer,
        textContainer,
        defaultTitle;

    var methods = {
        show: function (message, title /* optional */) {
            if (!container)
                createContainer();

            textContainer.text(message);

            setTitle(title);

            container.modal({
                overlayClose: true,
                containerId: 'modal-error-container',
                modal: true,
                persist: true
            });
        }
    };

    function onOkClick() {
        $.modal.close();
        $('.modal-error').hide();
    }

    function createContainer() {
        container = $(template).appendTo('body');

        titleContainer = container.find('.modal-error-title');
        defaultTitle = titleContainer.text();

        textContainer = container.find('.modal-error-message');

        container.find('button').on('click', onOkClick);
    }

    function setTitle(optionalTitle) {
        titleContainer.text(typeof optionalTitle !== 'undefined' ? optionalTitle : defaultTitle);
    }


    return methods;
})();