/// <reference path="../../jquery-1.8.1.min.js" />
/// <reference path="../Vista.js"/>
/// <reference path="~/Scripts/Vista/Adapters.js" />
/// <reference path="../Cart/CartItem.js"/>
/// <reference path="../Cart/CartView.js"/>
/// <reference path="../Cart/Cart.js"/>
/// <reference path="../Countdown/Countdown.js"/>
/// <reference path="../PlusMinusNumeric/PlusMinusNumeric.js" />
/// <reference path="../CategoryTabs.js" />
/// <reference path="../Breadcrumb/Control.js" />
/// <reference path="../ButtonWatch.js" />
/// <reference path="../ModalError.js" />
/// <reference path="CardHashDialog.js" />
/// <reference path="TicketList.js" />
/// <reference path="TicketVouchers.js" />
/// <reference path="ThirdPartyMemberTickets.js" />
/// <reference path="../SelectGrid/SelectGridControl.js" />

Vista.SelectTickets.Page = (function () {
    'use strict';

    var cart,
        ticketList,
        ticketVouchers,
        thirdPartyMemberTickets,
        ticketGrid,
        breadcrumb,
        isSeatFirst;

    return {
        init: function () {

            cart = new Vista.Cart.Cart(new Vista.Cart.View($('#cart')));
            $('.countdown').countdown();

            ticketVouchers = new Vista.SelectTickets.TicketVouchers($('.voucher-control')[0], onVoucherAddedToOrder, onVoucherRemovedFromOrder);
            
            thirdPartyMemberTickets = new Vista.SelectTickets.ThirdPartyMemberTickets($('.third-party-ticket-control')[0], onVerifyMemberTicketRedemption, onAddMemberTicketToOrder, onRemoveMemberTicketFromOrder);

            var grid = $('.select-grid');
            if (isSeatFirst = grid.length) { // TODO: pass down a boolean instead
                // TODO: integrate as part of control if possible?
                var max = grid.data('max');

                ticketGrid = new Vista.SelectGrid.SelectGridControl(new Vista.SelectGrid.SelectGridView(grid), max, onTicketGridChange, function () {
                    return ticketVouchers.getSeatCount();
                });
            }
            else {
                $('#select-tickets-list-wrapper').categorytabs();
                $('.session-selector').categorytabs();

                var $ticketList = $('.ticket-list #standard, .ticket-list #loyalty');

                // set ticket list height to match the height of the session selector
                var $sessionSelector = $('.session-selector');
                if ($sessionSelector.length) {

                    var $ticketListCategoryHeader = $('#select-tickets-list-wrapper .categories');
                    var adjustedTicketListHeight = $sessionSelector.height() + 1 - $ticketListCategoryHeader.height(); // + 1 for random extra pixel (maybe a border, or margin somewhere??)

                    $ticketList.css('min-height', adjustedTicketListHeight);

                    var $ticketListTabs = $ticketList.find('.tab');
                    var ticketListTabBorderHeight = parseInt($ticketListTabs.css('border-top-width'), 10) + parseInt($ticketListTabs.css('border-bottom-width'), 10);
                    var ticketListTabMarginHeight = parseInt($ticketListTabs.css('margin-top'), 10) + parseInt($ticketListTabs.css('margin-bottom'), 10);
                    var ticketListTabsHeightAdjustment = adjustedTicketListHeight - ticketListTabBorderHeight - ticketListTabMarginHeight - 2; // -2 for unaccounted for pixels...

                    // set ticket list tabs height to match the height of the ticket list
                    $ticketListTabs.css('min-height', ticketListTabsHeightAdjustment);
                }

                ticketList = new Vista.SelectTickets.TicketsList($ticketList, onTicketSelectionChange);
            }

            breadcrumb = new Vista.Breadcrumb.Control($('#breadcrumb'));
            setNextButtonVisibility(); 

           // similar sessions tabs
            $('.session-selector .session-list-item-link').click(onSimilarSessionListItemClick);
        }
    };

    function onTicketGridChange(updatedTicket) {
        cart.updateTicket(updatedTicket);
        setNextButtonVisibility();
    }

    function onTicketSelectionChange(updatedTicket) {
        cart.updateTicket(updatedTicket);
        setNextButtonVisibility();
    }

    function onVoucherAddedToOrder(voucherTicket) {
        cart.updateTicket(voucherTicket);
        setNextButtonVisibility();
        if (ticketGrid) ticketGrid.refresh();
    }

    function onVoucherRemovedFromOrder(voucherTicket) {
        cart.updateTicket(voucherTicket);
        setNextButtonVisibility();
        if (ticketGrid) ticketGrid.refresh();
    }

    function onVerifyMemberTicketRedemption(memberTicketToVerify) {
        
        var ajaxPost = {
            cinemaId: Vista.Data.SelectTickets.cinemaId,
            sessionId: Vista.Data.SelectTickets.sessionId,
            ticketTypeCode: memberTicketToVerify.ticketTypeCode,
            memberCardNumber: memberTicketToVerify.memberCardNumber,
            quantity: memberTicketToVerify.requestedQuantity
        };

       var getMemberTicketApprovalCallPromise = $.ajax({
            type: 'POST',
            url: Vista.Urls.Order.GetMemberTicketApproval,
            data: JSON.stringify(ajaxPost),
            contentType: 'application/json; charset=UTF-8',
            traditional: true
       });

        getMemberTicketApprovalCallPromise.done(function(response) {
            var verificationResponse = {
                approved: response.IsApproved,
                partialApproval: response.IsPartialApproval,
                memberProviderMessage: response.MemberProviderMessage
            };
            if (!verificationResponse.approved) {
                thirdPartyMemberTickets.approvalFailedForMemberTicket(memberTicketToVerify);
                Vista.ModalError.show(verificationResponse.memberProviderMessage || Vista.Lang.SelectTickets.CantAddTicketsDefaultMessage, Vista.Lang.SelectTickets.CantAddTicketsHeader);
                return;
            }
            // price only return if successful
            verificationResponse.approvedSubtotalPriceInCents = response.MemberTicketApprovals[0].ApprovedPriceInCents;
            verificationResponse.approvedQuantity = response.MemberTicketApprovals[0].ApprovedQty;
            thirdPartyMemberTickets.setPriceApprovalForMemberTicket(memberTicketToVerify, verificationResponse.approvedSubtotalPriceInCents, verificationResponse.approvedQuantity);

            if (verificationResponse.partialApproval) {
                Vista.ModalError.show(verificationResponse.memberProviderMessage || Vista.Lang.SelectTickets.TicketsPartiallyApprovedDefaultMessage, Vista.Lang.SelectTickets.TicketsPartiallyApprovedHeader);
            }

        });

        getMemberTicketApprovalCallPromise.fail(function() {
            Vista.ModalError.show(Vista.Lang.SelectTickets.CantAddTicketsDefaultMessage, Vista.Lang.SelectTickets.CantAddTicketsHeader);
            thirdPartyMemberTickets.approvalFailedForMemberTicket(memberTicketToVerify);
        });

        return getMemberTicketApprovalCallPromise;
    }
    
    function onAddMemberTicketToOrder(memberTicketToAddToOrder) {
                
        var ajaxPost = {
            cinemaId: Vista.Data.SelectTickets.cinemaId,
            sessionId: Vista.Data.SelectTickets.sessionId,
            ticketTypeCode: memberTicketToAddToOrder.ticketTypeCode,
            memberCardNumber: memberTicketToAddToOrder.memberCardNumber,
            quantity: memberTicketToAddToOrder.requestedQuantity
        };

        Vista.Utilities.orderUpdateAjax(
            Vista.Urls.Order.AddMemberTicket,
            ajaxPost,
            (function (response) {
                    
                var verificationResponse = {
                    approved: response.IsApproved
                };

                if (!verificationResponse.approved) {
                    Vista.ModalError.show(verificationResponse.memberProviderMessage || Vista.Lang.SelectTickets.CantAddTicketsDefaultMessage, Vista.Lang.SelectTickets.CantAddTicketsHeader);
                    return;
                }

                // price only return if successful
                verificationResponse.approvedSubtotalPriceInCents = response.MemberTicketApprovals[0].ApprovedPriceInCents;
                        
                thirdPartyMemberTickets.addOrderedMemberTicket(memberTicketToAddToOrder, verificationResponse.approvedSubtotalPriceInCents);

                var updatedTicket = $.extend(new Vista.Models.Ticket(), {
                    ticketTypeCode: memberTicketToAddToOrder.ticketTypeCode,
                    description: memberTicketToAddToOrder.description,
                    priceEachInCents: verificationResponse.approvedSubtotalPriceInCents,
                    quantity: memberTicketToAddToOrder.requestedQuantity,
                    thirdPartyMemberCardNumber: memberTicketToAddToOrder.memberCardNumber,
                    isCardPaymentPromotion: memberTicketToAddToOrder.isCardPaymentPromotion,                    
                    includedFeeForDisplay: response.TotalTicketFeesPerTicketInCentsForDisplay,
                    ticketFeeEachInCents: response.TotalTicketFeesPerTicketInCents
                });

                cart.updateTicket(updatedTicket);
                setNextButtonVisibility();
            }),
            /* error */
            (function() {
                Vista.ModalError.show(Vista.Lang.SelectTickets.CantAddTicketsDefaultMessage, Vista.Lang.SelectTickets.CantAddTicketsHeader);
            }),
            /* complete */ $.noop
        );
    }
    
    function onRemoveMemberTicketFromOrder(memberTicketToRemoveFromOrder) {

        var ajaxPost = {
            cinemaId: Vista.Data.SelectTickets.cinemaId,
            sessionId: Vista.Data.SelectTickets.sessionId,
            ticketTypeCode: memberTicketToRemoveFromOrder.ticketTypeCode,
            memberCardNumber: memberTicketToRemoveFromOrder.memberCardNumber
        };
        
        Vista.Utilities.orderUpdateAjax(
            Vista.Urls.Order.RemoveMemberTicket,
            ajaxPost,
            (function () {

                var updatedTicket = $.extend(new Vista.Models.Ticket(), {
                    ticketTypeCode: memberTicketToRemoveFromOrder.ticketTypeCode,
                    thirdPartyMemberCardNumber: memberTicketToRemoveFromOrder.memberCardNumber,
                    isCardPaymentPromotion: memberTicketToRemoveFromOrder.isCardPaymentPromotion,
                    quantity: 0
                });

                cart.updateTicket(updatedTicket);

                thirdPartyMemberTickets.removeOrderedMemberTicket(memberTicketToRemoveFromOrder);
                setNextButtonVisibility();
            }),
            /* on error */
            (function () {
                Vista.ModalError.show(Vista.Lang.SelectTickets.CantRemoveTicketsMessageText, Vista.Lang.SelectTickets.CantRemoveTicketsHeader);
                return;
            }),
            /* complete */ $.noop
        );
    }

    function setNextButtonVisibility() {
        if (isSeatFirst) { 
            if (ticketGrid.maxSelected()) {
                showNextButton();
                breadcrumb.enableForwardNavigation();
                return;
            }
        }
        else if (ticketList.hasSelectedTickets() || ticketVouchers.hasAddedVouchers() || thirdPartyMemberTickets.hasAddedThirdPartyMemberTickets()) {
            showNextButton();
            breadcrumb.enableForwardNavigation(ticketList.hasAllocated() || ticketVouchers.hasAllocated() || thirdPartyMemberTickets.hasAllocated());
            return;
        }

        hideNextButton();
        breadcrumb.disableForwardNavigation();
    }

    function showNextButton() {
        $('#divOrderTickets').removeClass('not-applicable');
    }

    function hideNextButton() {
        $('#divOrderTickets').addClass('not-applicable');
    }
    
    function onSimilarSessionListItemClick(el) {
        var tabUrl = $(el.currentTarget).data('url');
        window.location.href = tabUrl;
    }
})();

$(Vista.SelectTickets.Page.init);
