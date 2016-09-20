/// <reference path="../Vista.js"/>
/// <reference path="../Validation/Validation.js"/>

Vista.Loyalty.Clubs = (function () {
    'use strict';

    var container = $('.main-ad');
    Vista.Images.AdvertImages(container, 'LoyaltyClubs', 'Main');

    var deleteForm = $('#loyalty-delete-membership'), // form
        loginForm = $('.loyalty-login'), // form
        deleteAction,
        loginAction,
        loginError;

    var methods = {
        init: function () {
            var endsWithSlash = /\/$/;

            deleteAction = deleteForm.attr('action');
            if (!endsWithSlash.test(deleteAction))
                deleteAction = deleteAction + '/';

            loginAction = loginForm.attr('action');
            if (!endsWithSlash.test(loginAction))
                loginAction = loginAction + '/';

            $('#loyalty-clubs').on('click', '.loyalty-unsubscribe', onUnsubscribeClick)
                               .on('click', '.loyalty-signin', onSignInClick);

            deleteForm.on('click', '.cancel', onModalCancelClick)
                      .on('submit', onSubmitClick);

            loginForm.on('submit', onLoginSubmit);
        }
    };

    function disableInputs(container) {
        container.find('button, input').attr('disabled', 'disabled').addClass('disabled');
    }

    function enableInputs(container) {
        container.find('button, input').removeAttr('disabled').removeClass('disabled');
    }

    function displayLoginError(text) {
        if (!loginError) {
            loginError = $('ul.signin-errors');
            $.modal.impl.d.container.css('height', 'auto');
            $.modal.setPosition();
        }

        loginError.html('<li>' + text.join('</li><li>') + '</li>');
    }

    function removeLoginError() {
        if (loginError) {
            loginError.html('');
            loginError = undefined;
        }
    }

    function onUnsubscribeClick() {
        deleteForm.attr('action', deleteAction + $(this).val());

        deleteForm.modal({
            overlayClose: true,
            containerId: 'loyalty-delete-container',
            modal: true,
            persist: true /* this is required, or event handlers break */
        });
    }

    // TODO: async login script may need to be be moved out
    function onSignInClick(e) {
        e.preventDefault();

        var target = $(this);
        var clubName = target.closest('.list-item').find('.item-title').text();
        var clubSignUp = target.closest('.list-item').find('.loyalty-register');
        loginForm.find('h3 em').text(clubName);
        loginForm.attr('action', loginAction + target.data('id'));

        // make the sign up link the same as the one on the page
        var formSignUp = loginForm.find('.loyalty-register');
        formSignUp.attr('href', clubSignUp.attr('href')).removeClass('disabled');

        loginForm.find('ul input').val('');
        removeLoginError();

        loginForm.modal({
            overlayClose: true,
            containerId: 'loyalty-signin-container',
            modal: true,
            persist: true, /* this is required, or event handlers break */
            onShow: function () {
                // Must be called after dialog is visible
                // By default jquery.validate ignores :hidden elements for resetForm
                Vista.Validation.resetForm(loginForm);
            }
        });

    }

    function onModalCancelClick() {
        $.modal.close();
    }

    function onSubmitClick() {
        disableInputs($(this).closest('form'));
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
            success: function (response) {
                if (response.Redirect) {
                    window.location.href = response.Redirect;
                }
                else {
                    displayLoginError(response.Errors || Vista.Lang.SignIn.LoyaltyGeneralSignInError);
                    enableInputs(loginForm);
                    $.modal.impl.bindEvents();
                }
            },
            error: function () {
                displayLoginError(Vista.Lang.SignIn.LoyaltyGeneralSignInError);
                enableInputs(loginForm);
                $.modal.impl.bindEvents();
            }
        });
    }

    return methods;

})();

$(Vista.Loyalty.Clubs.init);