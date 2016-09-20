/// <reference path="../../jquery-1.8.1.min.js" />
/// <reference path="../../json2.js" />
/// <reference path="../Polyfill.js" />
/// <reference path="../Vista.js" />
/// <reference path="../Models/Ticket.js" />
/// <reference path="../Utilities/Utilities.js" />
/// <reference path="../Utilities/AjaxUtilities.js" />
/// <reference path="../Utilities/FormatUtilities.js" />
/// <reference path="../PlusMinusNumeric/PlusMinusNumeric.js" />
/// <reference path="CardHashDialog.js" />
/// <reference path="../ModalError.js" />

Vista.SelectTickets.ThirdPartyMemberTickets = function (
                                                containerElement,
                                                onVerifyMemberTicketRedemptionCallback,
                                                onAddMemberTicketToOrderCallback,
                                                onRemoveMemberTicketFromOrderCallback) {
    ///<summary>The View portion of the Third Party Member Tickets control.</summary>

    'use strict';


    var $containerElement,
        ticketListUIItems,
        $thirdPartyTicketInOrderContainer,
        $subTotalHeader,
        $plusMinusContainers,
        quantityPlusMinusFields = [],
        self = this;

    (function () {

        $containerElement = $(containerElement);

        loadElementsFromDOM();
        createControls();
        bindDOMEventHandlers();

        lockTicketLinesThatHaveTicketsOrdered();
    })();

    this.setPriceApprovalForMemberTicket = function(memberTicketToVerify, approvedSubtotalPriceInCents, approvedQty) {
        ///<summary>
        ///Responds to an approved member ticket redemption request. Shows the user the price they can
        ///redeem the tickets for.
        ///</summary>

        var ticketListItem = ticketListUIItems[memberTicketToVerify.ticketTypeCode];

        ticketListItem.quantityField.val(approvedQty);
        ticketListItem.subTotalPriceField.text(Vista.FormatUtilities.formatCurrency(approvedSubtotalPriceInCents * approvedQty, false));
        ticketListItem.addToOrderButton.removeClass('not-applicable');
        ticketListItem.clearVerificationButton.removeClass('not-applicable');
        
        $subTotalHeader.removeClass('not-applicable');
    };

    this.approvalFailedForMemberTicket = function(memberTicket) {
        ///<summary>
        ///Responds to a failed member ticket redemption request. Unlocks the ticket fields to allow the 
        ///user to try again.
        ///</summary>
        
        var ticketListUIItem = ticketListUIItems[memberTicket.ticketTypeCode];

        unlockVerifyProcessInputFields(ticketListUIItem);
    };
    
    this.addOrderedMemberTicket = function (orderedMemberTicket, approvedSubtotalPriceInCents) {
        ///<summary>
        ///Responds to a member ticket successfully being added to the order. Adds the ordered ticket
        ///line to the list item and locks the fields to prevent any further attemps to add this ticket
        ///type to the order.
        ///</summary>

        var ticketListUIItem = ticketListUIItems[orderedMemberTicket.ticketTypeCode];

        var $listItemContainer = ticketListUIItem.listItemContainer;

        var ticketLineHtmlTemplate = '<div class="third-party-member-ticket-line">{0}{1}{2}</div>';

        var memberTicketDetailsHtmlTemplate = '<span class="third-party-member-ticket"><span class="quantity">{0}x</span><span class="desc">{1}</span>';
        if (!ticketListUIItem.isCardPaymentPromotion) {
            memberTicketDetailsHtmlTemplate += '<span class="member-card-number">({2})</span>';   
        }
        memberTicketDetailsHtmlTemplate += '</span>';

        var priceHtmlTemplate = '<span class="price">{0}</span>';

        var removeButtonHtml = '<button type="button" class="icon-button-clear remove-third-party-member-ticket"></button>';
        var memberTicketDetailsHtml = Vista.Utilities.format(memberTicketDetailsHtmlTemplate, orderedMemberTicket.requestedQuantity, orderedMemberTicket.description, orderedMemberTicket.memberCardNumber);
        var priceHtml = Vista.Utilities.format(priceHtmlTemplate, Vista.FormatUtilities.formatCurrency(approvedSubtotalPriceInCents * orderedMemberTicket.requestedQuantity, true));

        var ticketLineHtml = Vista.Utilities.format(ticketLineHtmlTemplate, removeButtonHtml, memberTicketDetailsHtml, priceHtml);


        var $ticketLine = $(ticketLineHtml);

        $ticketLine.attr('data-allocated', orderedMemberTicket.isAllocated);

        $listItemContainer.append($ticketLine);

        // clear related ticket line fields
        lockTicketLines(ticketListUIItems[orderedMemberTicket.ticketTypeCode]);

        hideSubTotalColumnHeaderIfNoPendingApprovals();
    };
    
    this.removeOrderedMemberTicket = function (memberTicketToRemove) {
        ///<summary>
        ///Responds to an ordered member ticket being removed to the order. Removes the ordered ticket
        ///line from the list item and unlocks the fields to allow the ticket type be added again.
        ///</summary>
        
        var ticketListUIItem = ticketListUIItems[memberTicketToRemove.ticketTypeCode];

        unlockTicketLines(ticketListUIItem);

        // remove line
        ticketListUIItem.listItemContainer.find('.third-party-member-ticket-line').remove();
    };

    this.hasAddedThirdPartyMemberTickets = function () {
        return $containerElement.find('.third-party-member-ticket-line').length > 0;
    };

    this.hasAllocated = function () {
        ///<summary>Returns true if any ordered third party member tickets allow seat allocation.</summary>
        return $containerElement.find('.third-party-member-ticket-line[data-allocated=true]').length > 0;
    };

    function loadElementsFromDOM() {
        
        buildTicketListUIItems();

        $thirdPartyTicketInOrderContainer = $containerElement.find('.third-party-member-tickets-in-order');
        $subTotalHeader = $containerElement.find('.sub-total-header');
        
        $plusMinusContainers = $containerElement.find('.plus-minus-numeric');
    }

    function createControls() {

        $.each($plusMinusContainers, function (i, element) {
            quantityPlusMinusFields.push(new Vista.PlusMinusNumeric(element, onQuantityChange));
        });
    }

    function bindDOMEventHandlers() {

        $containerElement.on('click', '.verify-third-party-member-ticket-button', onVerifyMemberTicketRedemptionButtonClick);
        $containerElement.on('click', '.verify-third-party-card-promotion-button', onVerifyMemberCardPromotionRedemptionButtonClick);
        $containerElement.on('click', '.add-third-party-member-ticket-to-order-button', onAddMemberTicketToOrderButtonClick);
        $containerElement.on('click', '.clear-third-party-member-ticket-verification-button', onClearMemberTicketVerificationButtonClick);
        $containerElement.on('click', '.remove-third-party-member-ticket', onRemoveMemberTicketFromOrderButtonClick);
    }

    function buildTicketListUIItems() {

        // hashmap of jquery elements that comprise each ticket type list item
        ticketListUIItems = {};


        var ticketListItems = $containerElement.find('.item');

        $.each(ticketListItems, function (i, listItem) {

            var $listItem = $(listItem);

            var uiFields = {
                listItemContainer: $listItem,
                descriptionLabel: $listItem.find('>.desc'),
                quantityField: $listItem.find('.ticket-quantity .quantity'),
                memberCardNumberField: $listItem.find('.third-party-member-ticket-card-number'),
                verifyButton: $listItem.find('.verify-third-party-member-ticket-button,.verify-third-party-card-promotion-button'),
                subTotalPriceField: $listItem.find('.sub-total'),
                addToOrderButton: $listItem.find('.add-third-party-member-ticket-to-order-button'),
                clearVerificationButton: $listItem.find('.clear-third-party-member-ticket-verification-button'),
                isCardPaymentPromotion: $listItem.find('.verify-third-party-card-promotion-button').length > 0
            };

            var ticketTypeCode = uiFields.quantityField.attr('id');

            uiFields.ticketTypeCode = ticketTypeCode;

            ticketListUIItems[ticketTypeCode] = uiFields;
        });
    }
    
    function lockTicketLinesThatHaveTicketsOrdered() {
        
        for (var ticketTypeCode in ticketListUIItems) {
            if (!ticketListUIItems.hasOwnProperty(ticketTypeCode))
                continue;

            var ticketListUIItem = ticketListUIItems[ticketTypeCode];

            if (ticketListUIItem.listItemContainer.find('.third-party-member-ticket-line').length > 0) {
                lockTicketLines(ticketListUIItem);
            }
        } 
    }
    
    function onVerifyMemberTicketRedemptionButtonClick(e) {
        
        var ticketListUIItem = getTicketListUIItemFromListItemChild(e.currentTarget);        
        var memberTicketToVerify = getMemberTicketDetailFromUIItem(ticketListUIItem);

        // simple validation of fields
        if (memberTicketToVerify.requestedQuantity <= 0) {
            ticketListUIItem.quantityField.focus();
            return;
        }
        if (memberTicketToVerify.memberCardNumber.trim().length === 0) {
            ticketListUIItem.memberCardNumberField.focus();
            return;
        }

        resetAddToOrderStepFields(ticketListUIItem);

        lockVerifyProcessInputFields(ticketListUIItem);

        onVerifyMemberTicketRedemptionCallback(memberTicketToVerify);
    }

    function onVerifyMemberCardPromotionRedemptionButtonClick(e) {
        var ticketListUIItem = getTicketListUIItemFromListItemChild(e.currentTarget);
        
        var memberTicketToVerify = getMemberTicketDetailFromUIItem(ticketListUIItem);
        // simple validation of fields
        if (memberTicketToVerify.requestedQuantity <= 0) {
            ticketListUIItem.quantityField.focus();
            return;
        }
        var userSessionId = $('#VistaUserSessionId').val(),
            cardCoBrand = memberTicketToVerify.cardCoBrand,
            cardBrand = memberTicketToVerify.cardBrand,
            cardhashProviderUrl = memberTicketToVerify.cardVerifierUrl,
            cardhashProviderWidth = memberTicketToVerify.cardVerifierWidth,
            cardhashProviderHeight = memberTicketToVerify.cardVerifierHeight;

        if (cardBrand == null || cardBrand == '' || cardhashProviderUrl == null || cardhashProviderUrl == '') {
            Vista.ModalError.show(Vista.Lang.SelectTickets.CantAddTicketsDefaultMessage, Vista.Lang.SelectTickets.CantAddTicketsHeader);
            return;
        }

        resetAddToOrderStepFields(ticketListUIItem);
        lockVerifyProcessInputFields(ticketListUIItem);
        Vista.SelectTickets.CardHashDialog.open(cardBrand, cardCoBrand, cardhashProviderUrl, userSessionId, cardhashProviderWidth, cardhashProviderHeight, function(cardHasDetailsDto) {
            if (cardHasDetailsDto && cardHasDetailsDto.ValidationResult && cardHasDetailsDto.ValidationResult.IsValid) {
                //if valid call validatemember ticket
                memberTicketToVerify.memberCardNumber = cardHasDetailsDto.CardHashDetail.CardHash;
                setCardHash(memberTicketToVerify, cardHasDetailsDto.CardHashDetail.CardHash);
                //this callback will return a promise that can then be passed to the modal dialogs.
                return onVerifyMemberTicketRedemptionCallback(memberTicketToVerify);
            }
            self.approvalFailedForMemberTicket(memberTicketToVerify);
            return $.Deferred().reject();
        });
    }

    function setCardHash(memberTicketToVerify, cardHash) {
        var ticketListItem = ticketListUIItems[memberTicketToVerify.ticketTypeCode];
        ticketListItem.memberCardNumberField.val(cardHash);
    }
    
    function onAddMemberTicketToOrderButtonClick(e) {

        var ticketListUIItem = getTicketListUIItemFromListItemChild(e.currentTarget);
        var memberTicketToAddToOrder = getMemberTicketDetailFromUIItem(ticketListUIItem);

        onAddMemberTicketToOrderCallback(memberTicketToAddToOrder);
    }
    
    function onClearMemberTicketVerificationButtonClick(e) {

        var ticketListUIItem = getTicketListUIItemFromListItemChild(e.currentTarget);

        unlockVerifyProcessInputFields(ticketListUIItem);

        resetAddToOrderStepFields(ticketListUIItem);
        resetVerifyInputFields(ticketListUIItem);

        hideSubTotalColumnHeaderIfNoPendingApprovals();
    }
    
    function onRemoveMemberTicketFromOrderButtonClick(e) {

        var ticketListUIItem = getTicketListUIItemFromListItemChild(e.currentTarget);
        var memberTicketToRemoveFromOrder = getMemberTicketDetailFromUIItem(ticketListUIItem);

        onRemoveMemberTicketFromOrderCallback(memberTicketToRemoveFromOrder);
    }
    
    function onQuantityChange(numericFieldContainerElement, newQuantity) {

        var ticketListUIItem = getTicketListUIItemFromListItemChild(numericFieldContainerElement);
        
        ticketListUIItem.quantityField.val(newQuantity);
    }
    
    function getTicketListUIItemFromListItemChild(listItemChildElement) {
        
        var listItemForMemberTicket = $(listItemChildElement).parents('.item');
        var ticketTypeCodeForListItem = listItemForMemberTicket.find('.quantity').attr('id');

        return ticketListUIItems[ticketTypeCodeForListItem];
    }
    
    function getMemberTicketDetailFromUIItem(ticketListUIItem) {
        //console.log(ticketListUIItem);
        return {
            ticketTypeCode: ticketListUIItem.ticketTypeCode,
            requestedQuantity: parseInt(ticketListUIItem.quantityField.val(), 10),
            memberCardNumber: ticketListUIItem.memberCardNumberField.val(),
            description: ticketListUIItem.descriptionLabel.text(),
            isAllocated: ticketListUIItem.quantityField.data('allocated'),
            cardCoBrand: ticketListUIItem.verifyButton.data('card-cobrand'),
            cardBrand: ticketListUIItem.verifyButton.data('card-brand'),
            cardVerifierUrl: ticketListUIItem.verifyButton.data('card-verifier-url'),
            cardVerifierWidth: ticketListUIItem.verifyButton.data('card-verifier-width'),
            cardVerifierHeight: ticketListUIItem.verifyButton.data('card-verifier-height'),
            isCardPaymentPromotion: ticketListUIItem.isCardPaymentPromotion
        };
    }
    function lockTicketLines(ticketListUIItem) {
        if (ticketListUIItem.isCardPaymentPromotion) {
            lockCardPromotionFields();
        } else {
            lockTicketLineFields(ticketListUIItem);
        }
    }

    function lockCardPromotionFields() {
        var cardPromotionListItems = $('.verify-third-party-card-promotion-button');
        for (var i = 0; i < cardPromotionListItems.length; i++) {
            var listItemUI = getTicketListUIItemFromListItemChild(cardPromotionListItems[i]);
            lockTicketLineFields(listItemUI);
        }
    }

    function lockTicketLineFields(ticketListUIItem) {

        lockVerifyProcessInputFields(ticketListUIItem);
        
        ticketListUIItem.descriptionLabel.addClass('disabled');
        ticketListUIItem.subTotalPriceField.text('');
        ticketListUIItem.addToOrderButton.addClass('not-applicable');
        ticketListUIItem.clearVerificationButton.addClass('not-applicable');
    }

    function unlockTicketLines(ticketListUIItem) {
        if (ticketListUIItem.isCardPaymentPromotion) {
            unlockCardPromotionFields();
        } else {
            unlockTicketLineFields(ticketListUIItem);
        }
    }

    function unlockCardPromotionFields() {
        var cardPromotionListItems = $('.verify-third-party-card-promotion-button');
        for (var i = 0; i < cardPromotionListItems.length; i++) {
            var listItemUI = getTicketListUIItemFromListItemChild(cardPromotionListItems[i]);
            unlockTicketLineFields(listItemUI);
        }
    }

    function unlockTicketLineFields(ticketListUIItem) {

        unlockVerifyProcessInputFields(ticketListUIItem);
        
        ticketListUIItem.descriptionLabel.removeClass('disabled');
    }
    
    function lockVerifyProcessInputFields(ticketListUIItem) {
        ticketListUIItem.quantityField.attr('disabled', 'disabled');
        ticketListUIItem.memberCardNumberField.attr('disabled', 'disabled');
        ticketListUIItem.verifyButton.attr('disabled', 'disabled');
        ticketListUIItem.listItemContainer.find('.icon-plus').attr('disabled', 'disabled');
        ticketListUIItem.listItemContainer.find('.icon-minus').attr('disabled', 'disabled');
    }

    function resetVerifyInputFields(ticketListUIItem) {
        ticketListUIItem.quantityField.val('0');
        var defaultCardNumberValue = ticketListUIItem.memberCardNumberField.attr('data-default-value');
        ticketListUIItem.memberCardNumberField.val(defaultCardNumberValue);
    }
    
    function unlockVerifyProcessInputFields(ticketListUIItem) {
        ticketListUIItem.quantityField.removeAttr('disabled', 'disabled');
        ticketListUIItem.memberCardNumberField.removeAttr('disabled', 'disabled');
        ticketListUIItem.verifyButton.removeAttr('disabled');
        ticketListUIItem.listItemContainer.find('.icon-plus').removeAttr('disabled', 'disabled');
        ticketListUIItem.listItemContainer.find('.icon-minus').removeAttr('disabled', 'disabled');
    }
    
    function resetAddToOrderStepFields(ticketListUIItem) {
        ticketListUIItem.subTotalPriceField.text('');
        ticketListUIItem.addToOrderButton.addClass('not-applicable');
        ticketListUIItem.clearVerificationButton.addClass('not-applicable');
    }
    
    function hideSubTotalColumnHeaderIfNoPendingApprovals() {

        // if there aren't any "pending" approvals, then hide the subtotal header
        if (!$containerElement.find('.sub-total').text())
            $subTotalHeader.addClass('not-applicable');
    }
};
