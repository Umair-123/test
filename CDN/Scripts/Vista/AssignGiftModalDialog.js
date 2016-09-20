/// <reference path="Vista.js"/>
/// <reference path="Validation/Validation.js"/>
/// <reference path="Models/Recipient.js"/>

Vista.AssignGiftModalDialog = (function () {
    'use strict';

        // elements
    var container = $('#assign-gift-modal'),
        heading = container.find('h2'),
        saveButton = container.find('.assign-gift-save'),
        saveButtonText = container.find('.assign-gift-save span'),
        recipientList = container.find('.assign-gift-recipients ul'),
        giftList = container.find('.assign-gift-value'),
        formFields = {
            name: container.find('#assign-gift-name'),
            email: container.find('#assign-gift-email'),
            senderName: container.find('#assign-gift-sender-name'),
            message: container.find('#assign-gift-message'),
            quantity: container.find('[name="quantity"]')
        },
        // state
        isEdit = false,
        // data
        previousSenderName = '',
        currentRecipient = null,
        recipientModels = {}, // map to the model object of the recipient
        recipientListItems = {}, // map to the list item of the recipient
        // callback
        onSaveCallbacks = [],
        onEditSaveCallbacks = [];

    $(function () {
        container.find('.assign-gift-close').click(onCloseClick);
        container.on('change', '.assign-gift-recipients input', onRecipientChange);
        container.on('change', '#assign-gift-name, #assign-gift-email', onRecipientDetailsChange);
        container.submit(onSubmit);

        formFields.quantity.parent().plusminusnumeric(onQuantityChangedCallback);
    });

    var methods = {};

    methods.show = function (recipients, gifts) {
        /// <param name="recipients" type="Vista.Models.Recipient[]"></param>
        /// <param name="gifts" type="Vista.Models.Concession[]"></param>
        container.removeClass('assign-modal-edit');
        isEdit = false;

        buildRecipientList(recipients || []);
        buildGiftList(gifts || []);

        clearRecipient();
        show();
    };

    methods.showEdit = function (recipient, gifts) {
        /// <param name="recipient" type="Vista.Models.Recipient"></param>
        /// <param name="gifts" type="Vista.Models.Concession[]"></param>
        container.addClass('assign-modal-edit');
        isEdit = true;

        buildGiftList(gifts || []);

        displayRecipient(recipient);
        show();
    };

    methods.onSave = function (callback) {
        if (typeof callback === 'function')
            onSaveCallbacks.push(callback);
    };

    methods.onEditSave = function (callback) {
        if (typeof callback === 'function')
            onEditSaveCallbacks.push(callback);
    };

    function onQuantityChangedCallback(control, value, previousValue) {
        if (value < 1) {
            saveButton.attr("disabled", "disabled");
            saveButton.addClass("disabled");
        }
    }

    function show() {
        if (isEdit) {
            heading.text(Vista.Lang.AssignGift.EditHeading1).append($('<em>').text(Vista.Lang.AssignGift.EditHeading2));
            saveButtonText.text(Vista.Lang.AssignGift.ButtonSave);
        }
        else {
            heading.text(Vista.Lang.AssignGift.Heading1).append($('<em>').text(Vista.Lang.AssignGift.Heading2));
            saveButtonText.text(Vista.Lang.AssignGift.ButtonAdd);
        }

        container.modal({
            focus: false,
            overlayClose: true,
            modal: true,
            containerId: 'assign-gift-container',
            persist: true,
            onShow: onFormShow
        });
    }

    function buildRecipientList(recipients) {
        recipientList.empty();
        recipientModels = {};
        recipientListItems = {};

        var elements = $();
        var index = 0;
        recipients.forEach(function (recipient) {
            var input = $('<input type="radio" name="recent-recipient">');
            input.attr({
                'id': 'recent-recipient-' + index++,
                'value': recipient.id
            });

            var label = $('<label>');
            label.attr('for', input.attr('id'));
            label.append($('<span class="recipient-name">'));
            label.append($('<span class="recipient-email">'));

            var element = $('<li>');
            element.append(input);
            element.append(label);
            elements = elements.add(element);

            recipientListItems[recipient.id] = element;
            recipientModels[recipient.id] = recipient;

            refreshRecipient(recipient.id);
        });

        elements.filter(':odd').addClass('alt');
        recipientList.append(elements);
    }

    function refreshRecipient(id) {
        var recipient = recipientModels[id];
        recipientListItems[id].find('.recipient-name').text(recipient.name);
        recipientListItems[id].find('.recipient-email').text(recipient.email);
    }

    function buildGiftList(gifts) {
        giftList.empty();

        var elements = gifts.map(function (concession) {
            var listItem = $('<li>').append($('<span class="gift-name">').text(concession.description));

            if (isEdit)
                listItem.append($('<span>').text('x' + concession.quantity)); // TODO: lang?

            return listItem;
        });

        giftList.append(elements);
    }

    function displayRecipient(recipient) {
        /// <param name="recipients" type="Vista.Models.Recipient"></param>
        // Clear previous recipient when doing multiple recipient dialog
        if (!isEdit && currentRecipient && currentRecipient !== recipient) {
            // Undo changes to the previously active recipient
            refreshRecipient(currentRecipient.id);
        }

        formFields.name.val(recipient.name);
        formFields.email.val(recipient.email);
        formFields.senderName.val(recipient.senderName);
        formFields.message.val(recipient.message);

        container.valid();

        currentRecipient = recipient;
    }

    function clearRecipient() {
        formFields.name.val('');
        formFields.email.val('');
        formFields.senderName.val(previousSenderName);
        formFields.message.val('');
        formFields.quantity.val('1');

        currentRecipient = null;
    }

    function saveRecipient() {
        var recipient = currentRecipient || new Vista.Models.Recipient();

        //Check if we created a new recipient. If so, check if the recipient details match any existing recipients. If yes, use that recipient instead
        if (recipient.id === '' && Object.keys(recipientModels).length > 0) {
            for (var key in recipientModels) {
                if (recipientModels.hasOwnProperty(key)) {
                    //Check if all of the details match, if yes, return the recipient
                    if (formFields.name.val() === recipientModels[key].name
                        && formFields.email.val() === recipientModels[key].email
                        && formFields.senderName.val() === recipientModels[key].senderName
                        && formFields.message.val() == recipientModels[key].message) {
                        return recipientModels[key];
                    }
                }
            }

            //otherwise, continue as normal
        }

        recipient.name = formFields.name.val();
        recipient.email = formFields.email.val();
        recipient.senderName = formFields.senderName.val();
        recipient.message = formFields.message.val();

        return recipient;
    }

    function onRecipientChange() {
        displayRecipient(recipientModels[this.value]);
    }

    function onRecipientDetailsChange() {
        // Note: this isn't committed until save is clicked
        if (currentRecipient && recipientListItems.hasOwnProperty(currentRecipient.id)) {
            recipientListItems[currentRecipient.id].find('.recipient-name').text(formFields.name.val());
            recipientListItems[currentRecipient.id].find('.recipient-email').text(formFields.email.val());
        }
    }

    function onFormShow() {
        // Must be done after form shown, due to :hidden fields being ignored by jquery.validate's default ignore rule
        Vista.Validation.resetForm(container);
    }

    function onCloseClick() {
        $.modal.close();
    }

    function onSubmit(e) {
        e.preventDefault();

        if (container.valid()) {
            $.modal.close();

            var recipient = saveRecipient();
            previousSenderName = recipient.senderName;

            var i;
            if (isEdit) {
                for (i = 0; i < onEditSaveCallbacks.length; i++)
                    onEditSaveCallbacks[i](recipient);
            }
            else {
                var quantity = +formFields.quantity.val();
                for (i = 0; i < onSaveCallbacks.length; i++)
                    onSaveCallbacks[i](recipient, quantity);
            }
        }
    }

    return methods;

})();