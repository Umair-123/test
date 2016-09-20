/// <reference path="../Vista.js" />
/// <reference path="../Utilities/Utilities.js" />

Vista.Models.Ticket = function () {
    ///<summary>A Ticket that has been added to the order.</summary>
    ///<remarks>This actually maps back to the Vista.Connect.GroupedTicket class on the server.</remarks>

    'use strict';

    this.ticketTypeCode = '';
    this.description = '';
    this.quantity = 0;
    this.priceEachInCents = 0;
    this.discountQuantity = 0;
    this.discountEachInCents = 0;
    this.loyaltyPointsCost = 0;
    this.loyaltyRecognitionId = null;
    this.voucherBarcode = '';
    this.thirdPartyMemberCardNumber = '';
    this.isCardPaymentPromotion = false;
    this.includedFeeForDisplay = '';
    this.ticketFeeEachInCents = 0;
};

Vista.Models.Ticket.prototype.totalPriceInCents = function () {
    'use strict';
    
    return (this.quantity || 0) * (this.priceEachInCents || 0);
};

Vista.Models.Ticket.prototype.totalDiscountInCents = function () {
    'use strict';

    return (this.discountQuantity || 0) * (this.discountEachInCents || 0);
}

Vista.Models.Ticket.prototype.totalLoyaltyPointsCost = function () {
    'use strict';

    return (this.quantity || 0) * (this.loyaltyPointsCost || 0);
};

Vista.Models.Ticket.prototype.totalLoyaltyPointsCost = function () {
    'use strict';

    return (this.quantity || 0) * (this.loyaltyPointsCost || 0);
};

Vista.Models.Ticket.prototype.totalTicketFeeInCents = function () {
    'use strict';

    return (this.quantity || 0) * (this.ticketFeeEachInCents || 0);
};

Vista.Models.Ticket.prototype.getUniqueId = function () {
    ///<summary>
    /// Returns a unique identifier for this particular ticket
    ///</summary>

    'use strict';
    var ticketTypeCodeString = this.ticketTypeCode.toString();
    if (this.isVoucher())
        if (ticketTypeCodeString.indexOf('v-') === 0)
            return ticketTypeCodeString;
        else
            return 'v-' + ticketTypeCodeString + '-' + this.voucherBarcode;
    else if (this.isLoyaltyRecognition())
        if (ticketTypeCodeString.indexOf('l-') === 0)
            return ticketTypeCodeString;
        else
            return 'l-' + ticketTypeCodeString + '-' + this.loyaltyRecognitionId;
    else if (this.isThirdPartyMemberTicket() || this.isCardPaymentPromotion)
        if (ticketTypeCodeString.indexOf('tpmt-') === 0)
            return ticketTypeCodeString;
        else
            return 'tpmt-' + ticketTypeCodeString + '-' + this.thirdPartyMemberCardNumber;

    return ticketTypeCodeString;
};

Vista.Models.Ticket.prototype.isLoyaltyRecognition = function () {
    'use strict';

    return this.loyaltyRecognitionId !== null && this.loyaltyRecognitionId !== '';
};

Vista.Models.Ticket.prototype.isVoucher = function () {
    'use strict';

    return this.voucherBarcode !== null && this.voucherBarcode !== '';
};

Vista.Models.Ticket.prototype.isThirdPartyMemberTicket = function () {
    'use strict';

    return this.thirdPartyMemberCardNumber !== null && this.thirdPartyMemberCardNumber !== '';
};

Vista.Models.Ticket.prototype.getDisplayText = function () {
    ///<summary>
    /// Returns a string to display the ticket.
    /// If the ticket is a voucher or a third party member ticket
    /// then the barcode or member card number is appended to the
    /// description.
    ///</summary>

    'use strict';

    if (this.isVoucher()) {
        return Vista.Utilities.format('{0} ({1})', this.description, this.voucherBarcode);
    }
    
    if (this.isThirdPartyMemberTicket() && !this.isCardPaymentPromotion) {
        return Vista.Utilities.format('{0} ({1})', this.description, this.thirdPartyMemberCardNumber);
    }

    return this.description;
};