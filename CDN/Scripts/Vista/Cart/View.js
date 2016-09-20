/// <reference path="../Vista.js" />
/// <reference path="../Utilities/Utilities.js" />
/// <reference path="../Utilities/FormatUtilities.js" />
/// <reference path="../ButtonWatch.js" />
/// <reference path="CartItem.js" />
/// <reference path="CartTemplate.js" />

Vista.Cart.View = function (container) {
    'use strict';

    var events = {
        removeSession: 'cartremovesession',
        removeConcession: 'cartremoveconcession',
        deliveryMethodChange: 'cartdeliverymethodchange',
        editRecipient: 'carteditrecipient'
    };

    var ticketTemplate = new Vista.Cart.Template('cart-ticket');
    var concessionTemplate = new Vista.Cart.Template('cart-concession');

    var tickets = {},
        concessions = {},
        sessions = {},
        recipients = {}, // DOM elements
        ticketsList = container.find('#cart-tickets'),
        concessionsList = container.find('#cart-concessions'),
        totalText = container.find('.total .price'),
        savingsRow = container.find('.total-savings'),
        savingsText = container.find('.total-savings .savings'),
        bookingFeeText = container.find('.booking-fee .booking-fee-amount'),
        ticketFeeRow = container.find('.total-ticket-fee'),
        ticketFeeText = container.find('.total-ticket-fee .ticket-fee-amount'),
        totalPoints = container.find('.cart-footer .points-cost'),
        promotion = container.find('.promotion'),
        estimate = container.find('.cart-estimate'),
        deliveryTotal = container.find('.cart-delivery-total dd'),
        deliveryFee = container.find('.cart-delivery-fee dd'),
        currentSessionTotal = container.find('.cart-current-session .cart-session-total'),
        section = {
            concessions: container.find('.cart-summary-concessions'),
            gifts: container.find('.cart-summary-gifts'),
            postage: container.find('.cart-summary-postage')
        },
        pendingRemove = 0; // track the number of queued up non-blocking removes so we know when to reenable page buttons

    container.on('click', '.edit-recipient', onEditRecipientClick);
    container.on('click', '.cart-session .clear', onRemoveSessionClick);
    container.on('click', '.cart-concession .clear', onRemoveConcessionClick);
    container.on('change', '.cart-delivery-methods input', onDeliveryMethodChange);

    (function () {
        // Track existing elements so we know when an item needs to be rendered
        container.find('.cart-ticket').each(function () {
            var element = $(this);
            tickets[element.data('id')] = element;
        });

        container.find('.cart-concession').each(function () {
            var element = $(this);
            concessions[element.data('id')] = element;
        });

        container.find('.cart-session').each(function () {
            var element = $(this);
            sessions[element.data('id')] = element;
        });

        container.find('.cart-recipient').each(function () {
            var element = $(this);
            var id = element.data('id');

            if (!recipients.hasOwnProperty(id))
                recipients[id] = $();

            recipients[id] = recipients[id].add(element);
        });

    })();

    this.onRemoveSessionClick = function (handler) {
        container.bind(events.removeSession, handler);
    };

    this.onRemoveConcessionClick = function (handler) {
        container.bind(events.removeConcession, handler);
    };

    this.onDeliveryMethodChange = function (handler) {
        container.bind(events.deliveryMethodChange, handler);
    };

    this.onEditRecipientClick = function (handler) {
        container.bind(events.editRecipient, handler);
    };

    this.updateTicket = function (cartItem) {
        if (!tickets.hasOwnProperty(cartItem.id)) {
            var item = ticketTemplate.render(cartItem);
            ticketsList.append(item);
            tickets[cartItem.id] = item;
            repaint();
        }
        else {
            ticketTemplate.refresh(tickets[cartItem.id], cartItem);
        }
    };

    this.updateConcession = function (cartItem) {
        if (!concessions.hasOwnProperty(cartItem.id)) {
            var item = concessionTemplate.render(cartItem);
            concessionsList.append(item);
            concessions[cartItem.id] = item;    
        }
        else {
            concessionTemplate.refresh(concessions[cartItem.id], cartItem);
        }
        repaint();
    };

    this.updateRecipient = function (id, name) {
        // Currently do not render the recipient client-side, so we can get away with doing this
        // this may have to change
        
        recipients[id].text(name);
    };

    this.removeTicket = function (id) {
        remove(id, tickets);
    };

    this.removeConcession = function (id) {
        if (concessions.hasOwnProperty(id)) {
            var list = concessions[id].find('li').filter(function (i, e) { return $(e).data('id') === id; });
            if (list.length) {
                list.remove();
                delete list[id];
                delete concessions[id];
                repaint();
            } else {
                list = concessions;
                remove(id, list);
            }
        } else {
            repaint();
        }
    };

    this.setEstimate = function (ticketType, quantity, price) {
        if (Vista.Lang.Cart) {
            price = Vista.FormatUtilities.formatCurrency(price, true /* display currency symbol */);
            estimate.show().text(Vista.Utilities.format(Vista.Lang.Cart.estimate, quantity, ticketType, price));
        }
    };

    this.clearEstimate = function () {
        estimate.hide().text('');
    };

    this.hideConcessions = function () {
        section.concessions.hide();
    };

    this.hideGifts = function () {
        section.gifts.hide();
    };

    this.hidePostage = function () {
        section.postage.hide();
    };

    function remove(id, collection) {
        if (collection.hasOwnProperty(id)) {
            collection[id].remove();
            delete collection[id];
        }

        repaint();
    }

    function repaint() {
        // Note: this does not work on the summary page with multiple sessions, but it isn't possible to remove individual rows there
        container.find('.cart-ticket, .cart-concession').removeClass('alt').filter(':odd').addClass('alt');
        var items = container.find('.cart-concession ul');
        // it seems that the :empty selector doesnt work as you would think
        for (var i = 0; i < items.length; i++) {
            var item = $(items[i]);
            if (item.html().trim() === '') {
                item.parent().hide();
            } else {
                item.parent().show();
            }
        }
        
    }

    this.setSessionTotal = function (valueInCents) {
        currentSessionTotal.text(Vista.FormatUtilities.formatCurrency(valueInCents, false));
    };

    this.setBookingFee = function (valueInCents) {
        /// <summary>Set the displayed booking fee.</summary>
        /// <param name="valueInCents" type="Number">Value of the total in cents.</param>
        bookingFeeText.text(Vista.FormatUtilities.formatCurrency(valueInCents));
    };

    this.setTotalTicketFee = function (valueInCents) {
        /// <summary>Set the displayed booking fee.</summary>
        /// <param name="valueInCents" type="Number">Value of the total in cents.</param>
        ticketFeeText.text(Vista.FormatUtilities.formatCurrency(valueInCents));
        if (valueInCents > 0) {
            ticketFeeRow.show();
        } else {
            ticketFeeRow.hide();
        }
    };
    this.setTotal = function (valueInCents) {
        /// <summary>Set the displayed total price.</summary>
        /// <param name="valueInCents" type="Number">Value of the total in cents.</param>
        totalText.text(Vista.FormatUtilities.formatCurrency(valueInCents));
    };

    this.setTotalSavings = function(valueInCents) {
        /// <summary>Set the displayed total savings.</summary>
        /// <param name="valueInCents" type="Number">Value of the savings in cents.</param>
        savingsText.text(Vista.FormatUtilities.formatCurrency(valueInCents));
        if (valueInCents) {
            savingsRow.show();
        } else {
            savingsRow.hide();
        }        
    }

    this.setDeliveryTotal = function (valueInCents, deliveryFeeInCents) {
        /// <summary>Set the displayed total price including postage.</summary>
        /// <param name="valueInCents" type="Number">Value of the total in cents.</param>
        deliveryFee.text(Vista.FormatUtilities.formatCurrency(deliveryFeeInCents || 0));
        deliveryTotal.text(Vista.FormatUtilities.formatCurrency(valueInCents));
        
    };

    this.setPointsCost = function (pointsCost) {
        if (pointsCost > 0) {
            totalPoints.find('.value').text(Vista.Utilities.format(Vista.Lang.Cart.points, pointsCost));
            totalPoints.show();
        }
        else {
            totalPoints.hide();
        }
    };

    this.addPromotion = function (promotionCode) {
        promotion.removeClass('promotion-none').find('.value').text(promotionCode);
    };

    this.removePromotion = function () {
        promotion.addClass('promotion-none').find('.value').text('');
    };

    this.enableConcession = function (concessionId) {
        concessions[concessionId].removeClass('disabled').find('button').removeAttr('disabled');
    };

    this.disableConcession = function (concessionId) {
        // if this is a gifted item, find the correct sub-item
        var concession = concessions[concessionId].find('li').filter(function (i, e) { return $(e).data('id') === concessionId; });
        if (!concession.length)
            concession = concessions[concessionId];

        concession.addClass('disabled').find('button').attr('disabled', true);
    };

    // TODO: this doesn't quite work out, as it will override the global disable
    this.enableSession = function (sessionId) {
        sessions[sessionId].removeClass('disabled').find('button').removeAttr('disabled').removeClass('disabled');

        if (--pendingRemove === 0) Vista.ButtonWatch.enableAll();
    };

    this.disableSession = function (sessionId) {
        sessions[sessionId].addClass('disabled').find('button').attr('disabled', true).addClass('disabled');

        Vista.ButtonWatch.disableAll();
        pendingRemove++;
    };

    this.removeSession = function (sessionId) {
        sessions[sessionId].closest('li').remove();
        delete sessions[sessionId];

        if (--pendingRemove === 0) Vista.ButtonWatch.enableAll();
    };

    this.disable = function () {
        container.find('.disabled').removeClass('disabled'); // prevent opacity stacking
        container.find('button').attr('disabled', true).addClass('disabled');
        container.children('ul').addClass('disabled');

        Vista.ButtonWatch.disableAll();
    };

    this.enable = function () {
        container.find('button').removeAttr('disabled').removeClass('disabled');
        container.children('ul').removeClass('disabled');

        Vista.ButtonWatch.enableAll();
    };

    this.enableAllDeliveryMethods = function () {
        container.find('.radio-button-group').find('input').next('label').addBack().removeClass('disabled').removeAttr('disabled');
        container.find('.cart-delivery-pickup').remove(); // One-way
    };

    this.isPickupDeliveryMethodSelected = function() {
        return container.find('.cart-delivery-methods input[checked]').data('pickup');
    };
    
    function onRemoveSessionClick() {
        var sessionId = '' + $(this).closest('.cart-session').data('id');
        container.trigger(events.removeSession, sessionId);
    }

    function onRemoveConcessionClick() {
        var cartItemId = $(this).closest('.cart-concession').data('id');
        container.trigger(events.removeConcession, cartItemId);
    }

    function onEditRecipientClick() {
        var cartItemId = $(this).closest('.cart-concession').data('id');
        container.trigger(events.editRecipient, cartItemId);
    }

    function onDeliveryMethodChange() {
        // TODO: change tracking?
        var $deliveryMethodRadioButton = $(this);
        var deliveryMethod = {
            id: $deliveryMethodRadioButton.val(),
            isPickup: $deliveryMethodRadioButton.data('pickup')
        };
        
        container.trigger(events.deliveryMethodChange, deliveryMethod);
    }

    Vista.Cart.View.getConcessionsList = function() {
        return concessionsList;
    };
};