
Vista.Cart.SelectSeatsDialog = function() {
    'use strict';

    var dialog;

    (function() {
        initDialog();
    })();

    function initDialog() {
        dialog = $('<div id="change-seats-dialog"><iframe id="change-seats-iframe"></iframe></div>');
        var iframe = dialog.find('iframe');

        dialog.dialog({
            autoOpen: false,
            modal: true,
            height: 600,
            closeOnEscape: false,
            width: 1120,
            open: function(ev, ui) {
            },
            close: function(ev, ui) {
                iframe.attr('src', '');
                if ($('#CartUpdatePanel').length) {
                    __doPostBack('CartUpdatePanel', '');
                } else {
                    window.location.reload(true);
                }
            }
        });

        $(window.document).on('click', '.change-seats-link', function() {
            var sessionListItem = $(this).closest('li');
            var sessionId = sessionListItem.data('id');
            iframe.attr('src', 'SelectSeatsDialog.aspx?txtSessionId=' + sessionId);
            dialog.dialog('open');
            $('.countdown').countdown('stop').hide();
        });
    }

    Vista.Cart.SelectSeatsDialog.close = function() {
        return dialog.dialog('close');
    }
};

$(Vista.Cart.SelectSeatsDialog);