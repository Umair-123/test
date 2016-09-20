/// <reference path="../Vista.js"/>
/// <reference path="../Validation/Validation.js"/>
Vista.Loyalty.ResetPassword = (function() {
    'use strict';

    var sendEmailForm = $(".reset-password-form");
    var sendButton = sendEmailForm.find("button");
    
    var methods = {
        init: function () {
            sendEmailForm.on("submit", function () {
                if (sendEmailForm.valid()) {
                    sendButton.addClass("page-action-disabled");
                }                
            });
        }
    };
    
    return methods;
}());
$(Vista.Loyalty.ResetPassword.init);
