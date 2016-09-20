/// <reference path="../Vista.js"/>

Vista.Models.Session = function () {
    this.id = null;
    this.description = null;
    this.totalPriceInCents = 0; // TODO: should this be calculated from tickets/concessions instead?
    this.totalDiscountInCents = 0;
    this.totalLoyaltyPointsCost = 0; 
    this.isCurrent = false;
    this.totalTicketFeeInCents = 0;
};