/// <reference path="../Polyfill.js" />
/// <reference path="../Vista.js" />
/// <reference path="../PlusMinusNumeric/PlusMinusNumeric.js" />
/// <reference path="../Models/Ticket.js" />

Vista.SelectTickets.TicketsList = function (containerElement, onTicketSelectionChangeCallback) {
    ///<summary>
    /// Widget for ticket list
    ///</summary>
    ///<param name="containerElement">
    /// DOMElement wrapper for the ticket list widget.
    ///</param>
    ///<param name="onTicketSelectionChangeCallback">
    /// Callback function for changes in the ticket selection. Will be passed 1 parameter;
    /// function (updatedTicket) { }
    /// updatedTicket = { id: '', name: '', priceInCents: 0, quantity: 0 }.
    ///</param>

    'use strict';


    var $containerElement,
        $plusMinusContainers,
        $packageInfoButtons,
        quantityPlusMinusFields = [];

    (function () {

        $containerElement = $(containerElement);

        loadElementsFromDOM();
        bindDOMEventHandlers();
        createControls();
    })();

    ///<summary>Returns true if any tickets in the ticket list have a positive quantity.</summary>
    this.hasSelectedTickets = function () {
        var hasTickets = false;

        quantityPlusMinusFields.forEach(function (quantityField) {
            var quantity = quantityField.getValue();
            if (quantity > 0) {
                hasTickets = true;
                return true; // break loop
            }
        });

        return hasTickets;
    };

    this.hasAllocated = function () {
        return Array.prototype.some.call($plusMinusContainers.find('.quantity'), function (element) {
            var quantity = $(element);
            return quantity.val() > 0 && quantity.data('allocated');
        });
    };

    function loadElementsFromDOM() {
        $plusMinusContainers = $containerElement.find('.plus-minus-numeric');
        $packageInfoButtons = $containerElement.find('.button-package-info');
    }

    function bindDOMEventHandlers() {
        $packageInfoButtons.on('click', openPackageInfoDialog);
    }

    function createControls() {

        $.each($plusMinusContainers, function (i, element) {
            quantityPlusMinusFields.push(new Vista.PlusMinusNumeric(element, onQuantityChange));
        });
    }

    function openPackageInfoDialog(event) {
        var dialog = $(event.target).parent().find('.package-info-dialog');
        dialog.modal({
            overlayClose: true,
            modal: true,
            containerId: 'packageInfoDialog',
            minHeight: 150,
            minWidth: 450,
            close: true,
            closeHTML: '<a>' + Vista.Lang.SelectTickets.ClosePackageInfoDialog + '</a>',
            persist: true
        });
    }

    // INTERNAL IMPLEMENTATION
    function onQuantityChange(numericFieldContainerElement, newQuantity) {

        var $itemContainerElement = $(numericFieldContainerElement).parent('.item');
        var $quantityField = $itemContainerElement.find('.quantity');
        var $ticketDescription = $itemContainerElement.find('label span.ticket-name');
        var $priceField = $itemContainerElement.find('.price');
        var $pointsCost = $itemContainerElement.find('.points-cost');
        var $includedFee = $itemContainerElement.find('.item-fee');

        var updatedTicket = $.extend(new Vista.Models.Ticket(), {
            ticketTypeCode: $quantityField.attr('id'),
            description: $ticketDescription.text(),
            priceEachInCents: +$priceField.data('original'),
            loyaltyPointsCost: +($pointsCost.data('original') || ''),
            loyaltyRecognitionId: $quantityField.attr('data-loyalty-recognition-id'),
            quantity: newQuantity,
            includedFeeForDisplay: $includedFee.text(),
            ticketFeeEachInCents: +$priceField.data('ticketFeeInCents'),
    });


        updateSubtotal($itemContainerElement, updatedTicket);

        onTicketSelectionChangeCallback(updatedTicket);
    }

    function updateSubtotal($itemContainerElement, updatedTicket) {

        var $subtotal = $itemContainerElement.find('.sub-total');

        $subtotal.text(Vista.FormatUtilities.formatCurrency(updatedTicket.quantity * updatedTicket.priceEachInCents, false));
    }

};
