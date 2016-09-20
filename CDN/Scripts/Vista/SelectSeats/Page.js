/// <reference path="../../jquery-1.8.1.min.js"/>
/// <reference path="../Vista.js"/>
/// <reference path="../Models/Ticket.js"/>
/// <reference path="../Breadcrumb/Control.js"/>
/// <reference path="../Adapters.js"/>
/// <reference path="AreaSelector.js"/>

Vista.SelectSeats.Page = (function () {
    'use strict';

    var SeatingControl = window.SeatingControl; // explicit import suppresses warnings

    var nextButton,
        nextOnClick,
        areaSelector,
        cart,
        breadcrumb,
        singleArea, // true if there is only a single area category
        isSeatFirst,
        currentTicket;

    var methods = {
        init: function () {

            // save user selected seats into a hidden field
            $('#signInButton').click(function () {
                SeatingControl.setSelectedSeatsField(true);
                setSelectedSeats();
            });

            // when page loads, select seats from tempdata if it exists
            $(document).ready(function() {
                var seatData = $('#txtSeatSelectionTemp').val();
                if (seatData.length > 0) {
                    selectTempSeats(seatData);
                }
                $('#txtSeatSelectionTemp').val('');
            });

            nextButton = $('#ibtnNext');
            
            // TODO: possibly better to do this on a global level (i.e. replace __doPostBack)?
            // hijack asp.net generated handler
            nextOnClick = nextButton.attr('onclick');
            nextButton.removeAttr('onclick');
            nextButton.click(onNextClick);

            breadcrumb = new Vista.Breadcrumb.Control($('#breadcrumb'));
            breadcrumb.setPrecondition(trySetSelectedSeats);

            $('.countdown').countdown();
            cart = new Vista.Cart.Cart(new Vista.Cart.View($('#cart')));

            if (SeatingControl) {
                var areaSelectorContainer = $('.seating-area-select');
                areaSelector = new Vista.SelectSeats.AreaSelector(areaSelectorContainer);

                singleArea = !areaSelectorContainer.length;
                isSeatFirst = SeatingControl.isSeatFirst();

                if (isSeatFirst)
                    SeatingControl.setActiveAreaCategory(getActiveAreaCategoryCode());

                syncState();

                // Wire up event handlers last, to prevent repeatedly triggering syncState on initial setup
                SeatingControl.onSelectionChange(onSeatChange);
                SeatingControl.onActiveAreaCategoryChange(onAreaCategoryChange);
                areaSelector.onClick(onAreaCategoryClick);
            }
        }
    };

    // used for re-selecting the temp seats when the user login
    function selectTempSeats(tempSeatData) {
        var seatsArr = [];
        var tempArr = tempSeatData.split('|');
        tempArr.splice(0, 2);
        tempArr.pop();
        var i;
        for (i = 0; i < tempArr.length; i+=4) {
            seatsArr.push({
                area: tempArr[i+1] - 0,
                row: tempArr[i+2] - 1,
                col: tempArr[i+3] - 1
            });
        }

        var areaCode = tempArr[0];

        SeatingControl.deselectAllSeats(areaCode);

        for (var s = 0; s < seatsArr.length; s++) {
            SeatingControl.selectSeat(seatsArr[s].area, seatsArr[s].row, seatsArr[s].col);
        }

        syncState();
    }

    function onSeatChange() {
        syncState();
    }

    function onAreaCategoryChange(areaCategoryCode) {
        areaSelector.setValue(areaCategoryCode);
    }

    function onAreaCategoryClick() {
        SeatingControl.setActiveAreaCategory(areaSelector.getValue());
        syncState();
    }

    function onNextClick() {
        Vista.ButtonWatch.disableAll();
        if (trySetSelectedSeats()) {
            eval(nextOnClick);
            return true;
        }
        else {
            Vista.ButtonWatch.enableAll();
            return false;
        }
    }

    function getActiveAreaCategoryCode() {
        if (singleArea) {
            var areaCategories = SeatingControl.getAreaCategories();

            for (var i = 0; i < areaCategories.length; i++) {
                if (areaCategories[i].SeatsToAllocate > 0)
                    return areaCategories[i].AreaCategoryCode;
            }

            return undefined;
         }
        else {
            return areaSelector.getValue();
        }
    }

    function isUnallocated(areaCategoryCode) {
        return Vista.SelectSeats.Data.unallocatedAreas.hasOwnProperty(areaCategoryCode);
    }

    function syncState() {
        /// <summary>Update the state of the controls on the page according to the number of seats selected.</summary>

        var areaCategoryCode = getActiveAreaCategoryCode(),
            unallocatedSession = isUnallocated(areaCategoryCode),
            seatCount = SeatingControl.getSeatCount(),
            ticketStepRequired = isSeatFirst;
            
        if (isSeatFirst) {
            clearCurrentTicket();
            cart.clearEstimate();

            // Once a seat has been selected, it is no longer valid to change the area category via the selector
            if (seatCount > 0) {
                areaSelector.disableInactive();
            }
            else {
                areaSelector.enableInactive();
            }

            // Unallocated sessions must go to the tickets page to choose the number of tickets
            ticketStepRequired = unallocatedSession;
            if (isSeatFirst && seatCount > 0) {
                var ticket = getTicket(areaCategoryCode, seatCount);

                if (getTicketCount(areaCategoryCode) > 1) {
                    cart.setEstimate(ticket);
                    ticketStepRequired = true;
                }
                else {
                    currentTicket = ticket;
                    cart.updateTicket(ticket);
                }
            }

        }

        if (seatCount === 0 && !unallocatedSession) {
            // not valid to continue 
            Vista.ButtonWatch.disable(nextButton);
            breadcrumb.disableForwardNavigation();
        }
        else {
            Vista.ButtonWatch.enable(nextButton);
            breadcrumb.enableForwardNavigation(ticketStepRequired);
        }
    }

    function clearCurrentTicket() {
        if (currentTicket) {
            currentTicket.quantity = 0;
            cart.updateTicket(currentTicket);
            currentTicket = undefined;
        }
    }

    function trySetSelectedSeats() {
        var success = SeatingControl.validate(); 
        if (success) setSelectedSeats();
        return success;
    }

    function setSelectedSeats() {
        var selectedSeatsHiddenField;
        var strSelectedSeats;
        
        selectedSeatsHiddenField = document.getElementById('SelectedSeatsHiddenField');
        strSelectedSeats = selectedSeatsHiddenField.value;
        strSelectedSeats = strSelectedSeats.substring(0, strSelectedSeats.length-1);
        document.frmSelectSeats.txtSeatInfo.value = strSelectedSeats;
    }

    function getTicketCount(areaCategoryCode) {
        /// <returns type="Number">The number of ticket types in the area category.</returns>
        return +Vista.SelectSeats.Data.ticketCount[areaCategoryCode] || 0;
    }

    function getTicket(areaCategoryCode, seatCount) {
        var ticketData = Vista.SelectSeats.Data.tickets[areaCategoryCode];
        var ticket = new Vista.Models.Ticket();
        ticket.description = ticketData.description;
        ticket.priceEachInCents = ticketData.priceInCents;

        // drop fractions, assume partial selection of sofas will not pass validation
        ticket.quantity = Math.floor(seatCount / ticketData.seatCount);

        return ticket;
    }

    return methods;
})();

$(Vista.SelectSeats.Page.init);