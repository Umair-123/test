/*
    Modifies a Loyalty Login control to make it use ajax.
*/
(function ($) {

    $.fn.ajaxifyLoyaltySignup = function(successCallback) {
        var element = this;

        var loginForm = element.find('.loyalty-login'),
            loginError;


        function displayLoginError(errors) {

            if (!loginError) {
                loginError = loginForm.find('ul.signin-errors');
                //$.modal.impl.d.container.css('height', 'auto');
                //$.modal.setPosition();
            }

            loginForm.find('.error').removeClass('error');
            loginError.empty();
            $.each(errors, function(i, error) {
                loginError.append('<li>' + error.Message + '</li>');
                loginForm.find('#' + error.Field).addClass('error');
            });
        }

        function removeLoginError() {
            if (loginError) {
                loginError.html('');
                loginError = undefined;
            }
        }

        var disableInputs = function(container) {
            container.find('button, input').attr('disabled', 'disabled').addClass('disabled');
        }

        var enableInputs = function(container) {
            container.find('button, input').removeAttr('disabled').removeClass('disabled');
        }

        function onLoginSubmit(e) {
            e.preventDefault();

            if (!loginForm.valid()) return;

            var formValues = loginForm.serialize(); // before disable
            disableInputs(loginForm);
            removeLoginError();
            
            $.modal.impl.unbindEvents(); // prevent close 

            $.ajax({
                url: loginForm.attr('action'),
                type: 'POST',
                data: formValues,
                success: function(response) {
                    $.modal.impl.bindEvents();
                    if (!response.Errors) {
                        if (successCallback) {
                            successCallback(response);
                        }
                    } else {
                        displayLoginError(response.Errors);// || [Vista.Lang.SignIn.LoyaltyGeneralSignInError]);
                        enableInputs(loginForm);
                    }
                },
                error: function() {
                    displayLoginError(Vista.Lang.SignIn.LoyaltyGeneralSignInError);
                    enableInputs(loginForm);
                    $.modal.impl.bindEvents();
                }
            });

            return false;
        }

        loginForm.on('submit', onLoginSubmit);

        $.extend(element, {
            popup: function () {
                loginForm.find('ul input').val('');

                removeLoginError();

                return element.modal({
                    overlayClose: true,
                    containerId: 'loyalty-signin-container',
                    modal: true,
                    persist: true, /* this is required, or event handlers break */
                    onShow: function() {
                        // Must be called after dialog is visible
                        // By default jquery.validate ignores :hidden elements for resetForm
                        Vista.Validation.resetForm(loginForm);
                    }
                });
            }
        });

        return element;
    }

})(jQuery);