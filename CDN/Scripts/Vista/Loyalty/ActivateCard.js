Vista.Loyalty.ActivateCard = (function () {
    'use strict';

    var username = $('#Username'),
        usernameDisplay = $("#UsernameDisplay"),
        email = $('#EmailAddress'),
        syncTimer;

    function syncInput() {
        username.val(email.val());
        usernameDisplay.val(email.val());
    }

    return {
        init: function () {
            //If we have a usernameDisplay it means we are in SignInAsEmail mode
            //As such we want to sync the email into the username box automatically
            if (usernameDisplay.length > 0) {
                syncInput();
                email.on('focusin', function () {
                    clearInterval(syncTimer);
                    syncTimer = setInterval(syncInput, 100);
                });

                email.on('focusout', function () {
                    clearInterval(syncTimer);
                    syncInput();
                });
            }
        }
    };
})();

$(Vista.Loyalty.ActivateCard.init);