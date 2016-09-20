/// <reference path="../../json2.js" />
/// <reference path="../Polyfill.js" />
/// <reference path="../Vista.js" />
/// <reference path="../Models/Ticket.js" />
/// <reference path="../Utilities/Utilities.js" />
/// <reference path="../Utilities/AjaxUtilities.js" />
/// <reference path="../PlusMinusNumeric/PlusMinusNumeric.js" />
/// <reference path="../ButtonWatch.js" />

Vista.SelectTickets.TicketVouchers = function (containerElement, onVoucherAddedCallback, onVoucherRemovedCallback) {
    ///<summary>
    /// Widget for adding ticket vouchers to the order.
    ///</summary>
    ///<param name="containerElement">
    /// DOMElement wrapper for the ticket voucher widget.
    ///</param>
    ///<param name="onVoucherAddedCallback">
    /// Callback function for when a voucher is added to the order. Will be passed 1 parameter;
    /// function (addedTicket) { }
    /// addedTicket = { id: '', name: '', priceInCents: 0, quantity: 0, barcode: '' }.
    ///</param>
    ///<param name="onVoucherRemovedCallback">
    /// Callback function for when a voucher is removed to the order. Will be passed 1 parameter;
    /// function (removedTicket) { }
    /// removedTicket = { id: '', quantity: 0, barcode: '' }.
    ///</param>

    'use strict';


    var $containerElement,
        $voucherHeader,
        $ticketVoucherField,
        $addButton,
        $voucherPinFormLine,
        $ticketVoucherPINField,
        $voucherErrorMessage;

    (function () {

        $containerElement = $(containerElement);

        loadElementsFromDOM();
        bindDOMEventHandlers();

    })();

    this.hasAddedVouchers = function () {
        return $containerElement.find('.voucher-ticket').length > 0;
    };

    this.hasAllocated = function () {
        return Array.prototype.some.call($containerElement.find('.voucher-line'), function (element) {
            return $(element).data('allocated');
        });
    };

    this.getSeatCount = function () {
        /// <summary>Return the number of seats required for the vouchers in the order.</summary>
        /// <returns type="Number" />
        return Array.prototype.reduce.call($containerElement.find('.voucher-line'), function (prev, element) {
            return prev + +($(element).data('seat-count') || 0);
        }, 0);
    };

    function loadElementsFromDOM() {
        $voucherHeader = $containerElement.find('.voucher-header');
        $ticketVoucherField = $containerElement.find('#ticket-voucher');
        $addButton = $containerElement.find('#add-voucher');
        $voucherPinFormLine = $containerElement.find('#voucher-pin-form-line');
        $ticketVoucherPINField = $containerElement.find('#ticket-voucher-pin');
        $voucherErrorMessage = buildErrorMessageField();
    }

    function bindDOMEventHandlers() {
        $addButton.on('click', onAddVoucherClick);
        addEnterKeyPressedHandler($ticketVoucherField, onAddVoucherClick);
        addEnterKeyPressedHandler($ticketVoucherPINField, onAddVoucherClick);

        $containerElement.on('click', '.remove-voucher-ticket', onRemoveVoucherClick);
    }

    function addEnterKeyPressedHandler($inputField, enterKeyHandler) {
        var enterKeyCode = 13;

        $inputField.keydown(function (e) {
            if (e.keyCode === enterKeyCode) {
                enterKeyHandler();
                return false;
            }

            return true;
        });
    }

    function onAddVoucherClick() {

        var voucherBarcode = $ticketVoucherField.val();

        // display message instead? should be consistent with promotions
        if (voucherBarcode === '')
            return;


        var voucherPIN = $ticketVoucherPINField.val();


        //        $ticketVoucherField.attr('disabled', true);
        Vista.ButtonWatch.disableAll();

        Vista.Utilities.orderUpdateAjax(
            Vista.Urls.Ticket.AddVoucherTicket,
            { voucherBarcode: voucherBarcode, voucherPIN: voucherPIN },
            onAddVoucherTicket,
            onAddVoucherTicketError
        );
    }

    function onRemoveVoucherClick(e) {
        /// <param name="e" type="jQuery.Event" />
        e.stopPropagation();

        // get associated voucher barcode from button click
        var $voucherButton = $(this);
        var $voucherLine = $voucherButton.parent('.voucher-line');

        var voucherTicketRemoved = $.extend(new Vista.Models.Ticket(), {
            ticketTypeCode: $voucherLine.attr('data-ticket-code'),
            voucherBarcode: $voucherLine.attr('data-voucher-barcode'),
            quantity: 0
        });


        if (voucherTicketRemoved.barcode === '')
            throw Error('Voucher barcode missing. Cannot remove voucher.');

        // TODO: disable remove voucher button

        Vista.Utilities.orderUpdateAjax(
            Vista.Urls.Ticket.RemoveVoucherTicket,
            { voucherBarcode: voucherTicketRemoved.voucherBarcode },
            (function () { onRemoveVoucherTicket(voucherTicketRemoved); }),
            onRemoveVoucherTicketError
        );
    }

    function onAddVoucherTicketError() {
        enableAddToOrderButton();
    }

    function onAddVoucherTicket(addVoucherResponse) {

        enableAddToOrderButton();

        if (addVoucherResponse.voucherRequiresPIN) {
            hideErrorMessage();
            displayVoucherPinPrompt();
            return;
        }

        if (!addVoucherResponse.isValid) {
            displayErrorMessage(addVoucherResponse.errorMessage);
            return;
        }

        var voucherCode = $ticketVoucherField.val();

        // clear fields
        $ticketVoucherField.val('');
        $ticketVoucherPINField.val('');


        hideErrorMessage();
        hideVoucherPinPrompt();


        // notify listener
        // TODO: should be the responsiblity of the cart to display voucher codes
        var voucherTicketAdded = $.extend(new Vista.Models.Ticket(), {
            ticketTypeCode: addVoucherResponse.ticketTypeCode,
            description: addVoucherResponse.description,
            priceEachInCents: addVoucherResponse.priceEachInCents,
            voucherBarcode: voucherCode,
            quantity: 1,
            includedFeeForDisplay: addVoucherResponse.TotalTicketFeesPerTicketInCentsForDisplay,
            ticketFeeEachInCents: addVoucherResponse.TotalTicketFeesPerTicketInCents            
        });

        // TODO: do we want these as properties on the ticket, even though they're only used on the page?
        var isAllocated = addVoucherResponse.isAllocated;
        var seatCount = addVoucherResponse.seatCount;

        addVoucherLine(voucherTicketAdded, isAllocated, seatCount);

        onVoucherAddedCallback(voucherTicketAdded);
    }

    function onRemoveVoucherTicketError() {

    }

    function onRemoveVoucherTicket(voucherTicketRemoved) {

        removeVoucherLine(voucherTicketRemoved);

        // notify listener
        onVoucherRemovedCallback(voucherTicketRemoved);
    }

    function displayVoucherPinPrompt() {
        $voucherPinFormLine.removeClass('not-applicable');
        $ticketVoucherPINField.focus();
    }

    function hideVoucherPinPrompt() {
        $voucherPinFormLine.addClass('not-applicable');
    }

    function enableAddToOrderButton() {
        Vista.ButtonWatch.enableAll();
    }

    function addVoucherLine(voucherTicket, isAllocated, seatCount) {

        var voucherLineTemplate = '<div class="voucher-line" data-ticket-code="{0}" data-voucher-barcode="{1}" data-allocated="{2}" data-seat-count="{3}"><span class="voucher-ticket">{4}</span><button type="button" class="icon icon-small icon-delete remove-voucher-ticket"></button></div>';
        var voucherLineHtml = Vista.Utilities.format(voucherLineTemplate, voucherTicket.ticketTypeCode, voucherTicket.voucherBarcode, isAllocated, seatCount, voucherTicket.getDisplayText());

        var $vouchersInOrderContainer = $containerElement.find('.vouchers-in-order');
        if ($vouchersInOrderContainer.length === 0) {
            $vouchersInOrderContainer = $('<div class="vouchers-in-order"></div>');
            $containerElement.append($vouchersInOrderContainer);
        }

        $vouchersInOrderContainer.append(voucherLineHtml);
    }

    function removeVoucherLine(voucherTicket) {

        var ticketLineSelector = Vista.Utilities.format('.voucher-line[data-ticket-code={0}][data-voucher-barcode={1}]', voucherTicket.ticketTypeCode, voucherTicket.voucherBarcode);
        $containerElement.find(ticketLineSelector).remove();
    }

    function buildErrorMessageField() {
        return $('<div class="voucher-error"><span class="notification"></span><p class="field-validation-error error-text"></p></div>');
    }

    function displayErrorMessage(message) {

        $voucherErrorMessage.find('.error-text').html(message);

        if ($.contains($voucherHeader[0], $voucherErrorMessage[0]))
            return;

        $voucherHeader.prepend($voucherErrorMessage);
        $ticketVoucherField.addClass('input-validation-error');
    }

    function hideErrorMessage() {
        $voucherErrorMessage.find('.error-text').html('');
        $voucherErrorMessage.remove();
        $ticketVoucherField.removeClass('input-validation-error');
    }
};
