/// <reference path="../Vista.js" />
/// <reference path="../Models/Ticket.js" />
/// <reference path="../Models/Concession.js" />

Vista.Cart.Item = function () {
    ///<summary>Item displayed in the cart.</summary>
    'use strict';

    this.id = '';
    this.name = '';
    this.totalPriceInCents = 0;
    this.quantity = 0;
    this.totalDiscountInCents = 0;
    this.discountQuantity = 0;
    this.pointsCost = 0;
    this.isGift = false;
    this.recipient = '';
};

Vista.Cart.Item.prototype.fromTicket = function (ticket) {
    /// <param name="ticket" type="Vista.Models.Ticket"></param>

    this.id = ticket.getUniqueId();
    this.name = ticket.getDisplayText();
    this.quantity = ticket.quantity;
    this.totalPriceInCents = ticket.totalPriceInCents();
    this.discountQuantity = ticket.discountQuantity;
    this.totalDiscountInCents = ticket.totalDiscountInCents();
    this.pointsCost = ticket.totalLoyaltyPointsCost();
    this.includedFeeForDisplay = ticket.includedFeeForDisplay;
    this.ticketFeeEachInCents = ticket.ticketFeeEachInCents;
    return this;
};

Vista.Cart.Item.prototype.fromConcession = function (concession) {
    /// <param name="ticket" type="Vista.Models.Concession"></param>
    var id;

    if (concession.isGift) {
        id = 'd-' + concession.deliveryId + concession.itemCode;
        this.isGift = true;
    }
    else if (concession.loyaltyRecognitionId !== null && concession.loyaltyRecognitionId !== '')
        id = 'l-' + concession.itemCode + '-' + concession.loyaltyRecognitionId;
    else {
        id = concession.itemCode;
        this.isGift = false;
    }

    this.id = id;
    this.name = concession.description;
    this.quantity = concession.quantity;
    this.totalPriceInCents = concession.totalPriceInCents();
    this.discountQuantity = concession.discountQuantity;
    this.totalDiscountInCents = concession.totalDiscountInCents();
    this.pointsCost = concession.totalLoyaltyPointsCost();
    this.recipient = concession.recipient;

    return this;
};
