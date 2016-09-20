/// <reference path="../Vista.js" />
/// <reference path="../AssignGiftModalDialog.js" />
/// <reference path="../Models/Ticket.js" />
/// <reference path="../Utilities/Utilities.js" />
/// <reference path="View.js" />
/// <reference path="Item.js" />
/// <reference path="RequestQueue.js" />
/// <reference path="CartData.js" />

// TODO: tidy up
// TODO: extract ajax calls
// TODO: events
// TODO: refactor request queue to return deferred objects?
Vista.Cart.Cart = function (view) {
    ///<param name="view" type="Vista.Cart.View" />
    'use strict';

    var tickets = Vista.Cart.Data.tickets,
        concessions = Vista.Cart.Data.concessions,
        existingConcessions = $.extend({}, concessions), // These are concessions that have to be removed server-side
        sessions = Vista.Cart.Data.sessions,
        recipients = Vista.Cart.Data.recipients,
        bookingFeeInCents = Vista.Cart.Data.bookingFeeInCents,
        requestQueue = new Vista.Cart.RequestQueue(),
        removeCallback,
        removingCallback,
        removingCompleteCallback,
        deliveryMethodChangeCallback;
    
    (function () {
        view.onRemoveSessionClick(onRemoveSessionClick);
        view.onRemoveConcessionClick(onRemoveConcessionClick);
        view.onDeliveryMethodChange(onDeliveryMethodChange);
        view.onEditRecipientClick(onEditRecipientClick);
        
        Vista.AssignGiftModalDialog.onEditSave(onRecipientSave);
        updateTotal();
    })();

    this.setEstimate = function (ticket) {
        /// <param name="ticket" type="Vista.Models.Ticket"></param>
        view.setEstimate(ticket.description, ticket.quantity, ticket.totalPriceInCents());
    };

    this.clearEstimate = function () {
        view.clearEstimate();
    };

    this.hasConcessions = function () {
        return !!project(concessions).length;
    };

    this.updateTicket = function (ticket) {
        var cartItem = new Vista.Cart.Item().fromTicket(ticket);

        if (cartItem.quantity === 0) {
            delete tickets[cartItem.id];
            view.removeTicket(cartItem.id);
        }
        else {
            tickets[cartItem.id] = ticket;
            view.updateTicket(cartItem);
        }

        updateTotal();
    };

    this.addGift = function (concession, recipient) {
        saveRecipient(recipient);
        concession.recipient = recipient.name;
        concession.deliveryId = recipient.id;

        //Update concessions in cart to use new recipient name for this recipient ID (if they still have an old name)
        for (var c in concessions) {
            if (concessions.hasOwnProperty(c)) {
                if (concessions[c].deliveryId === recipient.id) {
                    concessions[c].recipient = recipient.name;
                    view.updateConcession(new Vista.Cart.Item().fromConcession(concessions[c]));
                }
            }
        }

        var cartItem = new Vista.Cart.Item().fromConcession(concession);

        if (cartItem.quantity === 0)
            return;

        if (concessions.hasOwnProperty(cartItem.id)) {
            concessions[cartItem.id].quantity += concession.quantity;
            cartItem = new Vista.Cart.Item().fromConcession(concessions[cartItem.id]);
        }
        else {
            concessions[cartItem.id] = concession;
        }
        
        view.updateConcession(cartItem);
        updateTotal();
    };

    this.getConcessions = function () {
        return project(concessions).filter(function (c) { return !c.isGift; });
    };

    this.getGifts = function () {
        return project(concessions).filter(function (c) { return c.isGift; });
    };

    this.getRecipients = function () {
        return project(recipients);
    };

    this.updateConcession = function (concession) {
        var cartItem = new Vista.Cart.Item().fromConcession(concession);

        if (cartItem.quantity === 0) {
            delete concessions[cartItem.id];
            view.removeConcession(cartItem.id);
        }
        else {
            concessions[cartItem.id] = concession;
            view.updateConcession(cartItem);
        }

        updateTotal();
    };

    this.addPromotion = function (promotionCode) {
        view.addPromotion(promotionCode);
    };

    this.removePromotion = function () {
        view.removePromotion();
    };

    this.removeConcession = function (concession) {
        removeConcession(concession);
    };

    this.isPickupDeliveryMethodSelected = function() {
        return view.isPickupDeliveryMethodSelected();
    };

    this.onConcessionRemoving = function (callback, completeCallback) {
        removingCallback = callback;
        removingCompleteCallback = completeCallback;
    };

    this.onConcessionRemove = function (callback) {
        removeCallback = callback;
    };

    this.onDeliveryMethodChange = function(callback) {
        deliveryMethodChangeCallback = callback;
    };

    function onRemoveSessionClick(e, sessionId) {
        removeSession(sessionId);
    }

    function onRemoveConcessionClick(e, cartItemId) {
        var concession = concessions[cartItemId];
        removeConcession(concession);
    }

    function onDeliveryMethodChange(e, deliveryMethod) {
        var deliveryMethodId = deliveryMethod.id;
        requestQueue.enqueue({
            url: Vista.Urls.Order.setDeliveryMethod,
            data: { deliveryMethodCode: deliveryMethodId },
            success: function (response, updatedOrderValues) {
                view.setDeliveryTotal(response, updatedOrderValues.deliveryFeeInCents);
                deliveryMethodChangeCallback(deliveryMethod);
            }
        });
    }

    function onEditRecipientClick(e, cartItemId) {
        var concession = concessions[cartItemId];

        var recipient = recipients[concession.deliveryId];
        var gifts = project(concessions).filter(function (c) {
            return c.deliveryId === concession.deliveryId;
        });

        Vista.AssignGiftModalDialog.showEdit(recipient, gifts);
    }

    function onRecipientSave(recipient) {
        requestQueue.enqueue({
            url: Vista.Urls.Order.updateDeliveryDetails,
            data: { recipient: recipient }
        });

        view.updateRecipient(recipient.id, recipient.name);
    }

    var keyCount = 0;
    function getNextKey() {
        return 'x' + keyCount++;
    }

    function saveRecipient(recipient) {
        if (!recipient.id) {
            recipient.id = getNextKey();
        }

        if (!recipients.hasOwnProperty(recipient.id)) {
            recipients[recipient.id] = recipient;
        }
        else {
            recipients[recipient.id].copyFrom(recipient);
        }
    }

    function isLastSession() {
        return project(sessions).length <= 1;
    }

    function removeSession(sessionId) {
        var isCurrent = sessions[sessionId] && sessions[sessionId].isCurrent;
        requestQueue.enqueue({
            url: Vista.Urls.Order.removeSession,
            data: { orderSessionId: sessionId },
            success: function (response, orderData) {
                if (isCurrent || isLastSession())
                    if (typeof response === 'string') {
                        window.location = response;
                    }
                    else {
                        window.location = Vista.Urls.Shared.Error;
                    }
                else {
                    //No orderData = order has been can canelled - last session was removed
                    if (orderData) {
                        bookingFeeInCents = orderData.bookingFeeInCents;
                    } else {
                        bookingFeeInCents = 0;
                    }
                    view.removeSession(sessionId);
                    delete sessions[sessionId];
                    updateTotal();
                }
            },
            error: function (response) {
                if (isCurrent)
                    window.location = response;
                else
                    view.enableSession(sessionId); // TODO: error messages
            }
        }, true /* session removal should preempt concession removals */);

        if (isCurrent) {
            requestQueue.stop(); // do not process further requests
            view.disable();
        }
        else {
            view.disableSession(sessionId);
        }
    }

    // TODO: properly sort out logic for setting quantity to 0 and explicitly removing the concession
    function removeConcession(concession) {
        if (typeof removingCallback == 'function')
            removingCallback(concession);

        var cartItem = new Vista.Cart.Item().fromConcession(concession);
        view.disableConcession(cartItem.id);

        // TODO: refactor request queue or extract these out of the function
        function onComplete() {
            if (typeof removingCompleteCallback === 'function')
                removingCompleteCallback(concession);
        }

        function onSuccess(response, updatedOrderValues) {
            
            // response and updatedOrderValues will be undefined when removing concessions that haven't been saved
            // on the server yet

            if (Vista.Cart.Data.redirectOnLastItem && project(concessions).length === 1) {
                // Redirect on the last concession
                redirectToUrl(Vista.Urls.Shared.Home);
                return;
            }
            else if (updatedOrderValues && updatedOrderValues.requiresPostage) {
                // remaining item(s) require postage, need to refresh page to offer a revised list of delivery methods
                // use case: two items in cart; one requires shipping, the other pick up only, if pick up only item
                // is removed instead of forcing the delivery method to be pick up - now all delivery methods are
                // available to the user
                redirectToUrl(window.location.href);
                return;
            }

            view.removeConcession(cartItem.id);

            delete existingConcessions[cartItem.id];
            delete concessions[cartItem.id];

            if (typeof removeCallback === 'function')
                removeCallback(concession);

            var allConcessions = project(concessions);
            if (allConcessions.every(function (c) { return !c.isPickup; }))
                view.enableAllDeliveryMethods();

            var totalCount = allConcessions.length;
            var giftCount = allConcessions.reduce(function (prev, c) { return prev + +c.isGift; }, 0);
            var normalCount = totalCount - giftCount;

            if (normalCount === 0) {
                view.hideConcessions();
                view.hidePostage();
            }
            else if (giftCount === 0) {
                view.hideGifts();
            }

            if (response != null) {
                view.setDeliveryTotal(response, updatedOrderValues.deliveryFeeInCents);
                if (!updatedOrderValues.requiresPostage)
                    view.hidePostage();
            }

            updateTotal();
        }

        if (existingConcessions[cartItem.id]) {
            requestQueue.enqueue({
                url: Vista.Urls.Order.removeConcession,
                data: { concessionId: concession.itemCode, deliveryCode: concession.deliveryId, finalise: Vista.Cart.Data.finaliseOnRemove, recognitionId: concession.loyaltyRecognitionId },
                complete: onComplete,
                success: onSuccess,
                error: function () {
                    view.enableConcession(cartItem.id);
                }
            });
        }
        else { // client-side concession
            onSuccess();
            onComplete();
        }
    }
    
    function redirectToUrl(url) {
        Vista.ButtonWatch.disableAll();
        window.location = url;
    }

    function project(object) {
        var properties = [];
        for (var prop in object) {
            if (object.hasOwnProperty(prop))
                properties.push(object[prop]);
        }

        return properties;
    }

    function updateTotal() {
        var id,
            totalInCents = 0,
            totalDiscount = 0,
            totalPoints = 0,
            ticketFeeInCents = 0;

        // TODO: update delivery total 

        for (id in tickets) {
            if (tickets.hasOwnProperty(id)) {
                totalInCents += tickets[id].totalPriceInCents();
                totalInCents += tickets[id].totalDiscountInCents();
                totalPoints += tickets[id].totalLoyaltyPointsCost();

                // Ticket feels will only exist if ticket fees
                // are display separately
                ticketFeeInCents += tickets[id].totalTicketFeeInCents();
            }
        }

        for (id in concessions) {
            if (concessions.hasOwnProperty(id)) {
                totalInCents += concessions[id].totalPriceInCents();
                totalDiscount += concessions[id].totalDiscountInCents();
                totalPoints += concessions[id].totalLoyaltyPointsCost();
            }
        }

        view.setSessionTotal(totalInCents - totalDiscount);

        for (var sessionId in sessions) {
            // value of current session is calculated from tickets/concessions
            if (sessions.hasOwnProperty(sessionId) && !sessions[sessionId].isCurrent) {
                totalInCents += sessions[sessionId].totalPriceInCents;
                totalDiscount += sessions[sessionId].totalDiscountInCents;
                totalPoints += sessions[sessionId].totalLoyaltyPointsCost;
                ticketFeeInCents += sessions[sessionId].totalTicketFeeInCents;
            }
        }


        //Add the booking fee
        if (bookingFeeInCents) {
            totalInCents += bookingFeeInCents;
        }

        if (Vista.Data.Cart.TicketFeeExplicitAtTotalLevel) {
            // Add the ticket fee.
            totalInCents += ticketFeeInCents;

            view.setTotalTicketFee(ticketFeeInCents);
        }

        view.setBookingFee(bookingFeeInCents);
        view.setTotal(totalInCents - totalDiscount);
        view.setTotalSavings(totalDiscount);
        view.setPointsCost(totalPoints);
    }
};
