/// <reference path="../Vista.js"/>

Vista.Models.Concession = function () {
    'use strict';

    this.itemCode = '';
    this.description = '';
    this.quantity = 0;
    this.priceEachInCents = 0;
    this.discountQuantity = 0;
    this.discountEachInCents = 0;
    this.loyaltyPointsCost = 0;
    this.isPickup = false;
    this.isGift = false;
    this.deliveryId = '';
    this.loyaltyRecognitionId = null;
    this.recipient = '';
};

Vista.Models.Concession.prototype.totalPriceInCents = function () {
    'use strict';
    
    return (this.quantity || 0) * (this.priceEachInCents || 0);
};

Vista.Models.Concession.prototype.totalDiscountInCents = function() {
    'use strict';

    return (this.discountQuantity || 0) * (this.discountEachInCents || 0);
}

Vista.Models.Concession.prototype.totalLoyaltyPointsCost = function () {
    'use strict';

    return (this.quantity || 0) * (this.loyaltyPointsCost || 0);
};
