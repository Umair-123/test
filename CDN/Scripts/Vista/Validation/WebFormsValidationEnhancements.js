/// <reference path="../Vista.js"/>
/// <reference path="../Vista.Validation.js"/>
Vista.Validation.WebFormsEnhancements = (function () {
    'use strict';

    return {
        injectValidationOnButtonClick: function (button, form) {
            injectValidationOnButtonClick(button, form);
        }

    };

    //This function basically intercepts the click event for the button and validates the form before firing its default behaviuor
    //We do this as ASP.NET WebForm's __doPostBack method (used to postback button clicks etc.) omits this step.
    function injectValidationOnButtonClick(button, aspNetForm) {
        if (aspNetForm.validate) {
            aspNetForm.validate();
        }
        var webFormsPostbackClickHandlerText = button.attr('onclick');
        button.removeAttr('onclick');
        $(button).click(function () {
            aspNetForm.validate();
            if (aspNetForm.valid()) {
                eval(webFormsPostbackClickHandlerText);
                return false;
            }
        });
    }
})();

$(function () {
    $('.webform-validate-button').each(function (index, value) {
        var button = $(value);
        var form = button.closest("form");
        Vista.Validation.WebFormsEnhancements.injectValidationOnButtonClick(button, form);
    });
});

