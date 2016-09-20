//Handles the toggling of the sign in widget help
Vista.Loyalty.SignInWidget = (function () {
    'use strict';

    var signInFormContainer = $(".sign-in-help");    
    var helpTogglers = $(".js-sign-in-help-toggle");
    
    var methods = {
        init: function () {            
            helpTogglers.on("click", function (e) {
                e.preventDefault();
                signInFormContainer.slideToggle(150);                
                return false;
            });
        }
    };
    return methods;
}());
$(Vista.Loyalty.SignInWidget.init);
