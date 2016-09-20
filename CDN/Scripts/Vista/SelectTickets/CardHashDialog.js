Vista.SelectTickets.CardHashDialog = (function () {
    'use strict';

    var dialog = new Vista.ModalDialog();
    var onDialogCloseCallback = null;
    var result = null;

    return {
        open: open,
        close: close
    }

    function open(cardBrand, cardCoBrand, cardHashProviderUrl, userSessionId, width, height, onCloseCallback) {
        result = null;
        onDialogCloseCallback = onCloseCallback;
        dialog.show({
            bodyHtml: '<iframe name="card-hash-iframe" width="100%" height="100%"></iframe>',
            closeHtml: 'Close',
            minWidth: width,
            minHeight: height,
            onShow: function () {
                var params = {
                    CardBrand: cardBrand,
                    CardCoBrand: cardCoBrand,
                    ReturnURL: window.location.origin + '/Ticketing/CreditCardHash/StoreCardHashDetails',
                    UniqueToken: userSessionId
                };
                post(cardHashProviderUrl, params, 'POST', 'card-hash-iframe');
            },
            onClose: function () {
                dialog.close();
                if (onDialogCloseCallback) {
                    onDialogCloseCallback(result);
                }
            }
        });
    }

    function close(cardHashDetails) {
        result = cardHashDetails;
        dialog.close();
    }

    function post(path, params, method, target) {
        var form = document.createElement('form');
        form.setAttribute('method', method || 'post');
        form.setAttribute('action', path);
        form.setAttribute('target', target);

        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                var hiddenField = document.createElement('input');
                hiddenField.setAttribute('type', 'hidden');
                hiddenField.setAttribute('name', key);
                hiddenField.setAttribute('value', params[key]);

                form.appendChild(hiddenField);
            }
        }
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }
})();

