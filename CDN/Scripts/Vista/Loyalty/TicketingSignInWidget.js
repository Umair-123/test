//Handles the toggling up and down of the sign in widget
Vista.Loyalty.TicketingSignInWidget = (function () {
    'use strict';

    var signInFormContainer = $(".sign-in-form-container");
    var signInFormError = $(".sign-in-form-container .signin-errors");
    var toggler = $(".sign-in-form-toggler");
    
    var methods = {
        init: function () {
            toggler.on("click", function (e) {
                e.preventDefault();
                signInFormError.hide();
                signInFormContainer.slideToggle(100);
                return false;
            });
        }
    };
    return methods;
}());
$(Vista.Loyalty.TicketingSignInWidget.init);
