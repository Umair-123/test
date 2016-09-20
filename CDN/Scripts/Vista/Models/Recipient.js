Vista.Models.Recipient = function () {
    'use strict';

    this.id = ''; // delivery id 
    this.name = '';
    this.email = '';
    this.senderName = '';
    this.message = '';
};

Vista.Models.Recipient.prototype.copyFrom = function (otherRecipient) {
    this.name = otherRecipient.name;
    this.email = otherRecipient.email;
    this.senderName = otherRecipient.senderName;
    this.message = otherRecipient.message;
};