/// <reference path="../Vista.js" />
/// <reference path="../ButtonWatch.js" />
/// <reference path="../../jquery-1.8.1.min.js" />
/// <reference path="../../jquery.validate.js" />

$(function () {

    var paymentForm,
        payButton,
        cancelOrderButton,
        payButtonWebFormsDoPostbackClickHandler,
        cancelOrderButtonWebFormsDoPostbackClickHandler;


    (function ctor() {
        paymentForm = $('#paymentForm');

        // allow validation of hidden inputs
        paymentForm.data('validator').settings.ignore = "";

        paymentForm.validate();

        payButton = $('#pay');
        cancelOrderButton = $('#cancelOrder');

        // in order to disable the buttons and still have the form postback
        // we have to disable the button (and swap it out visually with a clone) and remove the click handler
        // for the clone to just be a visual duplicate
        payButtonWebFormsDoPostbackClickHandler = payButton.attr('onclick');
        payButton.removeAttr('onclick');

        cancelOrderButtonWebFormsDoPostbackClickHandler = cancelOrderButton.attr('onclick');
        cancelOrderButton.removeAttr('onclick');

        // 'secureRedirectInfo' is serialised to the page when we are redirecting to a 3D Secure page - when the page loads normally this will not have a value
        if (secureRedirectInfo == null) {
            $('.countdown').countdown();
        } else {
            prepareFormAndRedirectForPayment();
        }
    })();

    payButton.click(function () {

        Vista.ButtonWatch.disableAll();
        
        paymentForm.validate();
        if (paymentForm.valid()) {
            eval(payButtonWebFormsDoPostbackClickHandler);
        } else {
            Vista.ButtonWatch.enableAll();
        }
        
        return false;
    });

    cancelOrderButton.click(function() {
        Vista.ButtonWatch.disableAll();
        eval(cancelOrderButtonWebFormsDoPostbackClickHandler);
        return false;
    });

    function updateDateFieldValue($container) {
        var year = $('.date-field-year option:selected', $container).val();
        var month = $('.date-field-month option:selected', $container).val();
        if (year != '' && month != '') {
            $('.date-field-value', $container).val((new Date(Date.UTC(year, month - 1))).toISOString());
        } else {
            $('.date-field-value', $container).val('');
        }
    }

    function prepareFormAndRedirectForPayment() {
        Vista.ButtonWatch.disableAll();

        var redirectForm = $('<form></form>', {
            action: secureRedirectInfo.RedirectUrl,
            method: 'POST'
        });

        for (var prop in secureRedirectInfo) {
            if (!secureRedirectInfo.hasOwnProperty(prop)) {
                continue;
            }

            var formElement = $('<input/>', {
                name: prop,
                type: 'hidden',
                value: secureRedirectInfo[prop]
            });

            redirectForm.append(formElement);
        }

        $('body').append(redirectForm);

        redirectForm[0].submit();
    }

    $.each($('div.date-field'), function(index, value) {
        updateDateFieldValue(value);
    });

    $('div.date-field select').change(function () {
        var $parent = $(this).parent();
        updateDateFieldValue($parent);
        paymentForm.validate().element($('.date-field-value', $parent));
    });    
});