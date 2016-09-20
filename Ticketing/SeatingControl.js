// NB: compatibility with Call Centre & Facebook & Internet Ticketing

////////////////////////////////////////////////////
// GLOBALS
////////////////////////////////////////////////////
var mobilecheck = function () {
    //stolen from http://detectmobilebrowsers.com/mobile
    var check = false;
    (function (a, b) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

var seatingLoaded = false;

////////////////////////////////////////////////////
// CONSTANTS
////////////////////////////////////////////////////

var EMPTY = 0,       // Available
    SOLD = 1,        // Previously sold
    HOUSE = 2,       // House seat (cannot be sold)
    WHEELCHAIR = 3,     // Special / Wheelchair seat
    SELECTED = 4,    // Selected by user (reserved)
    BROKEN = 5,      // Broken seat (cannot be sold)
    PLACEHOLDER = 6, // Used as a placeholder to help with layout (cannot be sold)
    COMPANION = 7;   // Wheelchair companion seat


////////////////////////////////////////////////////
// CUSTOM SEATING POPUP FUNCTIONALITY
////////////////////////////////////////////////////

var popupTimer;

// Hides the validation popup
function hidePopup(suppressAnimation) {
    if (suppressAnimation) {
        $('.Seating-Popup').hide();
    }
    else {
        $('.Seating-Popup').fadeOut(200);
    }
}

// Shows the validation popup with the given message
function showPopup(message) {
    var seatingPopup = $('.Seating-Popup'),
        page = $(document),
        parentPage = $(parent.document),
        yPosition = 0,
        xPosition = 0,
        opacity = 0.95;

    clearTimeout(popupTimer);

    if (parentPage.length === 1) { // In an iframe
        yPosition = $('.Seating-Theatre').height() * (parentPage.scrollTop() / parentPage.height()); // Offset the popup with the scroll position of the page
    }
    else {
        yPosition = $('.Seating-Theatre').height() * (page.scrollTop() / page.height()); // Offset the popup with the scroll position of the page
    }
    xPosition = seatingPopup.parent().scrollLeft();

    seatingPopup.find('.Seating-PopupMessage').text(message); // Set the message text
    seatingPopup.css('filter', 'alpha(opacity=' + opacity * 100 + ')'); // Fixes IE 8 font problem
    seatingPopup.css('opacity', opacity);

    seatingPopup.fadeIn(200, function () {
        if (seatingPopup.length && seatingPopup[0].tagName === 'TABLE') {
            seatingPopup.css('display', 'table');
        }
        popupTimer = setTimeout(function () { hidePopup(); }, 7000);
    });

    seatingPopup.css('top', yPosition);
    seatingPopup.css('left', xPosition);

}

////////////////////////////////////////////////////
// SEAT SELECTION FUNCTINALITY
////////////////////////////////////////////////////

// Gets the html 'img' object on the page for a given position by matching its data tags
function getSeatImage(areaNumber, row, col) {
    return $('.Seating-Area[data-area-number=\'' + areaNumber + '\'] img[data-row=\'' + row + '\'][data-col=\'' + col + '\']');
}

// Get the area from the theatre
function getArea(areaNumber) {
    var i = 0;

    for (i = 0; i < m_theatre.Areas.length; i++) {
        if (m_theatre.Areas[i].AreaNumber === areaNumber) {
            return m_theatre.Areas[i];
        }
    }

    return null;
}

// Get the seat from the theatre
function getSeat(areaNumber, row, column) {
    var area, seat;

    area = getArea(areaNumber);

    if (column >= 0 && column < area.ColumnCount && row >= 0 && row < area.Rows.length) { // Check bounds
        seat = area.Rows[row].Seats[column];
    }

    if (seat) { // Seat was found
        seat.area = area; // Attach a reference to the area to the seat
    }

    return seat;
}

function seatAvailable(seat) {
    if (seat.Status === EMPTY) {
        return true;
    }
    else if (m_validationRules.AllowWheelchairSeatPurchase) {

        if (seat.Status === WHEELCHAIR) {
            return true;
        }

        if (seat.Status === COMPANION) {
            return true;
        }
    }
}

// Add a seat to the selected seat list
// Note: There is a selected seat list per area category. The selected seat list holds a basic representation
// of each seat that is currently selected.
function addSeatToSelectedList(seat) {
    var seatSelectionObject = { "RowIndex": seat.RowIndex, "ColumnIndex": seat.ColumnIndex, "AreaNumber": seat.area.AreaNumber },
        i = 0;

    for (i = 0; i < m_selectedSeats.length; i++) {
        if (m_selectedSeats[i].AreaCategoryCode === seat.area.AreaCategoryCode) {
            m_selectedSeats[i].Seats.unshift(seatSelectionObject); // Push to front
            return;
        }
    }
}

// Gets the list of selected seats for a given area category code
function getSelectedSeatList(areaCategoryCode) {
    var i = 0;

    for (i = 0; i < m_selectedSeats.length; i++) {
        if (m_selectedSeats[i].AreaCategoryCode === areaCategoryCode) {
            return m_selectedSeats[i].Seats;
        }
    }

    return [];
}

function removeSeatFromSelectedList(seat) {
    var selectedSeats = getSelectedSeatList(seat.area.AreaCategoryCode),
        i = 0;

    for (i = 0; i < selectedSeats.length; i++) {
        if (selectedSeats[i].RowIndex === seat.RowIndex && selectedSeats[i].ColumnIndex === seat.ColumnIndex && selectedSeats[i].AreaNumber === seat.area.AreaNumber) {
            selectedSeats.splice(i, 1); // Remove from selected seats array
            return;
        }
    }
}

function selectSeat(areaNumber, row, col) {
    var seat = getSeat(areaNumber, row, col),
        seatImage = getSeatImage(areaNumber, row, col);

    m_theatre.AreaCategories[seat.area.AreaCategoryCode].SeatsNotAllocatedCount -= 1; // Reduce the number of available seats

    seat.Status = SELECTED;

    // Change to the reserved image
    var re = /[a-zA-Z]*_available/i,
        replaceWith = null;

    if (seat.OriginalSeatStatus === EMPTY || seat.OriginalSeatStatus === SELECTED) {
        seatImage.attr('src', seatImage.attr('src').replace('_available', '_selected'));
    }
    else if (seat.OriginalSeatStatus === WHEELCHAIR) {
        replaceWith = 'wheelchair_selected';
        seatImage.attr('src', seatImage.attr('src').replace(re, replaceWith));
    }
    else if (seat.IsCompanion) {
        replaceWith = 'companion_selected';
        seatImage.attr('src', seatImage.attr('src').replace(re, replaceWith));
    }


    addSeatToSelectedList(seat);
}

function isCompanionSeat(seat) {
    if (m_validationRules.CreateLegacyCompanionSeats) {
        return isLegacyCompanionSeat(seat);
    }
    return seat.IsCompanion;
}

function isLegacyCompanionSeat(seat) {
    var seatToLeft = getSeat(seat.area.AreaNumber, seat.RowIndex, seat.ColumnIndex + 1);
    var seatToRight = getSeat(seat.area.AreaNumber, seat.RowIndex, seat.ColumnIndex - 1);

    if (seatToLeft && seatToLeft.OriginalSeatStatus === WHEELCHAIR) {
        return true;
    }
    if (seatToRight && seatToRight.OriginalSeatStatus === WHEELCHAIR) {
        return true;
    }
    return false;
}

// Deselects a specific seat
function deselectSeat(areaNumber, row, col) {
    var seat = getSeat(areaNumber, row, col),
        seatImage = getSeatImage(areaNumber, row, col);

    if (seat.Status !== SELECTED) {
        return;
    }

    m_theatre.AreaCategories[seat.area.AreaCategoryCode].SeatsNotAllocatedCount += 1; // Increase the number of available seats for this area category

    var re = /[a-zA-Z]*_selected/i;
    if (seat.OriginalSeatStatus === EMPTY || seat.OriginalSeatStatus === SELECTED) {
        seatImage.attr('src', seatImage.attr('src').replace('_selected', '_available')); // Change to the empty image TODO: Revisit how changing images works
        seat.Status = EMPTY;
    }
    else if (seat.OriginalSeatStatus === WHEELCHAIR) {
        seatImage.attr('src', seatImage.attr('src').replace(re, 'wheelchair_available'));
        seat.Status = WHEELCHAIR;
    }
    else if (seat.IsCompanion) {
        seatImage.attr('src', seatImage.attr('src').replace(re, 'companion_available'));
        seat.Status = COMPANION;
    }

    removeSeatFromSelectedList(seat);
}


/**
 * Deselects all seats in the group in which seatInGroup is located.
 * @param {} seat 
 */
function deselectGroup(seat) {

    var seatsDeselected = 0, groupSeat, idx;

    if (seat && seat.SeatsInGroup) {

        for (idx = 0; idx < seat.SeatsInGroup.length; idx++) {
            groupSeat = getSeat(seat.area.AreaNumber, seat.SeatsInGroup[idx].RowIndex, seat.SeatsInGroup[idx].ColumnIndex);
            if (groupSeat.Status === SELECTED) {
                deselectSeat(seat.area.AreaNumber, groupSeat.RowIndex, groupSeat.ColumnIndex);
                seatsDeselected++;
            }
        }
    }

    return { deselectedCount: seatsDeselected };
}

function areInSamePosition(seatA, seatB) {
    return seatA && seatB && seatA.RowIndex === seatB.RowIndex && seatA.ColumnIndex === seatB.ColumnIndex;
}

// Deselects the currently selected seat which is furthest from the chosen seat
function deselectFurthestSeat(areaNumber, row, col) {
    var area = getArea(areaNumber),
        selectedSeats = getSelectedSeatList(area.AreaCategoryCode),
        i,
        furthestSeatSoFar;

    for (i = 0; i < selectedSeats.length; i++) {
        if (!furthestSeatSoFar) { // No seat chosen yet
            furthestSeatSoFar = selectedSeats[i];
            continue;
        }

        if (selectedSeats[i].AreaNumber !== areaNumber) { // Area number takes precedence
            furthestSeatSoFar = selectedSeats[i];
            break;
        }
        else if (Math.abs(selectedSeats[i].RowIndex - row) > Math.abs(furthestSeatSoFar.RowIndex - row)) { // Row difference takes precedence over column difference
            furthestSeatSoFar = selectedSeats[i];
        }
        else if (Math.abs(selectedSeats[i].RowIndex - row) === Math.abs(furthestSeatSoFar.RowIndex - row) &&
                 Math.abs(selectedSeats[i].ColumnIndex - col) > Math.abs(furthestSeatSoFar.ColumnIndex - col)) {
            furthestSeatSoFar = selectedSeats[i];
        }
    }

    deselectSeat(furthestSeatSoFar.AreaNumber, furthestSeatSoFar.RowIndex, furthestSeatSoFar.ColumnIndex);
}

// Selects as many seats as available in the sofa that this seat belongs to
function selectSofa(seat, numberToAllocate) {
    var i,
        sofaSeat,
        seatsToLeft = 0,
        seatsToRight = 0,
        soldSeatsToLeft = 0,
        soldSeatsToRight = 0,
        sofaIsEmpty = true,
        allocateFromRight = true;

    // Work out how many seats are to the left and right of the chosen seat on the sofa - assuming IDs are ordered with higher to the right
    for (i = 0; i < seat.SeatsInGroup.length; i++) {
        sofaSeat = getSeat(seat.area.AreaNumber, seat.SeatsInGroup[i].RowIndex, seat.SeatsInGroup[i].ColumnIndex);

        if (!seatAvailable(sofaSeat)) {
            sofaIsEmpty = false;

            if (sofaSeat.ColumnIndex > seat.ColumnIndex) { // Seat indices go from right to left
                soldSeatsToLeft++;
            }
            else if (sofaSeat.ColumnIndex < seat.ColumnIndex) {
                soldSeatsToRight++;
            }
        }

        if (sofaSeat.ColumnIndex > seat.ColumnIndex) {
            seatsToLeft++;
        }
        else if (sofaSeat.ColumnIndex < seat.ColumnIndex) {
            seatsToRight++;
        }
    }

    if (sofaIsEmpty) {
        if (seatsToLeft < seatsToRight) { // Seat is on the left side of the sofa - Allocate from left
            allocateFromRight = false;
        }
    }
    else { // Sofa has other seats allocated
        if (soldSeatsToLeft > soldSeatsToRight) { // There are more sold seats on the left - Allocate from left
            allocateFromRight = false;
        }
    }

    if (allocateFromRight) {
        for (i = 0; i < seat.SeatsInGroup.length && numberToAllocate !== 0; i++) {
            sofaSeat = getSeat(seat.area.AreaNumber, seat.SeatsInGroup[i].RowIndex, seat.SeatsInGroup[i].ColumnIndex);

            if (seatAvailable(sofaSeat)) {
                selectSeat(seat.area.AreaNumber, sofaSeat.RowIndex, sofaSeat.ColumnIndex);
                numberToAllocate--;
            }
        }
    }
    else {
        for (i = seat.SeatsInGroup.length - 1; i >= 0 && numberToAllocate !== 0; i--) {
            sofaSeat = getSeat(seat.area.AreaNumber, seat.SeatsInGroup[i].RowIndex, seat.SeatsInGroup[i].ColumnIndex);

            if (seatAvailable(sofaSeat)) {
                selectSeat(seat.area.AreaNumber, sofaSeat.RowIndex, sofaSeat.ColumnIndex);
                numberToAllocate--;
            }
        }
    }
}


// Gets the number of seats available in the sofa that the seat is part of
function getNumAvailableSeatsInSofa(seat) {
    var i,
        seatsAvailable = 0;

    for (i = 0; i < seat.SeatsInGroup.length; i++) {
        var sofaSeat = getSeat(seat.area.AreaNumber, seat.SeatsInGroup[i].RowIndex, seat.SeatsInGroup[i].ColumnIndex);

        if (seatAvailable(seat)) {
            seatsAvailable++;
        }
    }

    return seatsAvailable;
}

// Deselects all seats in the given area category
function deselectAllSeats(areaCategoryCode) {
    var i,
        selectedSeats = getSelectedSeatList(areaCategoryCode).slice(); // Take a copy of this array as 'deselectSeat' edits this array directly which would break the for loop

    for (i = 0; i < selectedSeats.length; i++) {
        deselectSeat(selectedSeats[i].AreaNumber, selectedSeats[i].RowIndex, selectedSeats[i].ColumnIndex);
    }
}

// Deselects a specific number of seats in an area category
// If the seat passed as a parameter is on a sofa then don't deselect seats on the same sofa
function deselectSeats(seat, seatsToDeselect) {
    var i,
        selectedSeats = getSelectedSeatList(seat.area.AreaCategoryCode).slice(); // Take a copy of this array as 'deselectSeat' edits this array directly which would break the for loop

    if (selectedSeats.length === 0) {
        return;
    }

    if (seatsToDeselect >= selectedSeats.length) {
        deselectAllSeats(seat.area.AreaCategoryCode);
    }
    else {
        for (i = 0; i < seatsToDeselect; i++) {
            deselectFurthestSeat(seat.area.AreaNumber, seat.RowIndex, seat.ColumnIndex);
        }
    }
}

// This function is called by the area clicked event
function seatClicked(seatImage, areaNumber) {
    var seat = getSeat(areaNumber, seatImage.data('row'), seatImage.data('col')),
        message = '';

    if (!seat) { // Place holder seat
        return;
    }

    if (m_theatre.AreaCategories[seat.area.AreaCategoryCode].SeatsToAllocate === 0) { // No seats available in this area category
        return m_validationRules.InvalidAreaSelected;
    }
    else if (seatAvailable(seat)) {
        var seatsRemaining = m_theatre.AreaCategories[seat.area.AreaCategoryCode].SeatsNotAllocatedCount;

        if (seatsRemaining === 0) { // No seats left in this area category
            if (m_selectionMode === 'seatbyseat') {
                return m_validationRules.AllSeatsAllocated;
            }
        }

        if (seat.IsSofaSeat && m_sofaSeatingEnabled) { // Seat is in a sofa

            var seatsAvailable;

            // In seat-first mode with partial selection allowed, sofa seats must be selected one at a time
            // Otherwise there is no easy way for the user to select less than the total number seats in the sofa
            var seatsToSelect;

            if (m_selectionMode === 'seatbyseat') {

                seatsAvailable = m_theatre.AreaCategories[seat.area.AreaCategoryCode].SeatsNotAllocatedCount;

                // Check whether the whole sofa can be selected with the seats available in this area category
                if (seatsAvailable < getNumAvailableSeatsInSofa(seat)) { // Can't select whole sofa
                    if (m_validationRules.MustFillSofa) {
                        message = m_validationRules.MustFillSofa;
                    }
                }

                seatsToSelect = seatsAvailable;
                if (SeatingControl.isSeatFirst() && !m_validationRules.MustFillSofa)
                    seatsToSelect = Math.min(seatsAvailable, 1);

                selectSofa(seat, seatsToSelect);
            }
            else if (m_selectionMode === 'sequential') {
                deselectGroup(seat); // The user may already have selected seats on this sofa

                seatsRemaining = m_theatre.AreaCategories[seat.area.AreaCategoryCode].SeatsNotAllocatedCount;
                seatsAvailable = m_theatre.AreaCategories[seat.area.AreaCategoryCode].SeatsToAllocate;

                var seatsAvailableInSofa = getNumAvailableSeatsInSofa(seat);

                // Check whether the whole sofa can be selected with the seats available in this area category
                if (seatsAvailable < seatsAvailableInSofa) { // Can't select whole sofa
                    if (m_validationRules.MustFillSofa) {
                        return m_validationRules.MustFillSofa;
                    }
                }

                if (seatsAvailableInSofa - seatsRemaining > 0) {
                    deselectSeats(seat, seatsAvailableInSofa - seatsRemaining); // Deselect as many seats as needed to fill the sofa
                }

                selectSofa(seat, Math.min(seatsAvailableInSofa, seatsAvailable));
            }
        }
        else { // Standard seat
            if (m_selectionMode === 'sequential') {

                var selectedSeats = getSelectedSeatList(seat.area.AreaCategoryCode);
                if (selectedSeats.length === m_theatre.AreaCategories[seat.area.AreaCategoryCode].SeatsToAllocate) {

                    // Find oldest picked seat. This will be deselected in favour of the newly-clicked seat
                    var oldestPickedSeat = getSeat(selectedSeats[selectedSeats.length - 1].AreaNumber, selectedSeats[selectedSeats.length - 1].RowIndex, selectedSeats[selectedSeats.length - 1].ColumnIndex);
                    var wheelchairStatus = deselectCompanionSeatsIfRequired(oldestPickedSeat);
                    deselectSeat(oldestPickedSeat.area.AreaNumber, oldestPickedSeat.RowIndex, oldestPickedSeat.ColumnIndex);

                    if (wheelchairStatus.failedCheck) {
                        return wheelchairStatus.message;
                    }
                    message = wheelchairStatus.message;
                }
            }

            if (seat.Status === WHEELCHAIR) {
                message = m_validationRules.WheelChairSelected;
            }
            else if (isCompanionSeat(seat)) {
                var hasAssociatedWheelchair = checkForMatchingWheelchair(seat);
                if (!hasAssociatedWheelchair) {

                    if (m_validationRules.RequireWheelchairToPurchaseCompanionSeat) {
                        return m_validationRules.RequireWheelchairToPurchaseCompanionSeat;
                    }
                    else if (m_validationRules.WarnCompanionSeatWithoutWheelchairSeat) {
                        message = m_validationRules.WarnCompanionSeatWithoutWheelchairSeat;
                    }
                }
            }

            selectSeat(areaNumber, seatImage.data('row'), seatImage.data('col'));
        }
    }
    else if (seat.Status === SELECTED) { // The seat is already selected
        if (m_selectionMode === 'sequential') {
            return; // Deselection isn't available in sequential movement mode
        }

        if (seat.OriginalSeatStatus === WHEELCHAIR) {

            var deselectedWheelchairStatus = deselectCompanionSeatsIfRequired(seat);
            if (deselectedWheelchairStatus.failedCheck) {
                return deselectedWheelchairStatus.message;
            }
            message = deselectedWheelchairStatus.message;
        }
        else if (seat.IsSofaSeat && m_sofaSeatingEnabled) { // Seat is in a sofa
            deselectGroup(seat); // Deselect whole sofa
        }
        else { // Standard seat
            deselectSeat(areaNumber, seatImage.data('row'), seatImage.data('col'));
        }
    }
    else {
        return m_validationRules.InvalidSeatSelected;
    }

    // If the user is selecting a sales server allocated seat then don't show a validation warning
    if (seat.OriginalSeatStatus === SELECTED) {
        message = '';
    }

    return message;
}

function deselectCompanionSeatsIfRequired(seat) {

    var message = '',
        wasWheelchair = seat.OriginalSeatStatus === WHEELCHAIR,
        failedCheck = false;

    if (seat.OriginalSeatStatus === WHEELCHAIR) {
        var companions = selectedCompanionSeats(seat);

        var companionSeatsSelected = companions.length > 0;
        if (m_validationRules.RequireWheelchairToPurchaseCompanionSeat) {
            failedCheck = companionSeatsSelected;
            deselectSeat(seat.area.AreaNumber, seat.RowIndex, seat.ColumnIndex);
            for (var i = 0; i < companions.length; i++) {
                var companionSeat = companions[i];
                deselectSeat(companionSeat.area.AreaNumber, companionSeat.RowIndex, companionSeat.ColumnIndex);
            }
            if (companionSeatsSelected) {
                message = m_validationRules.WarnCompanionSeatsRemovedWithWheelchair;
            }
        }
        else {
            // Deselect wheelchair, but do not deselect matching companion seats.
            deselectSeat(seat.area.AreaNumber, seat.RowIndex, seat.ColumnIndex);
            if (companionSeatsSelected && m_validationRules.WarnCompanionSeatWithoutWheelchairSeat) {
                message = m_validationRules.WarnCompanionSeatWithoutWheelchairSeat;
            }
        }
    }

    return {
        message: message,
        wasWheelChair: wasWheelchair,
        failedCheck: failedCheck
    }
}

////////////////////////////////////////////////////
// VALIDATION FUNCTINALITY
////////////////////////////////////////////////////

// Object to encapsulate a seating rule with a validation method and message to display upon failure
function SeatRule(msg, validationMethod) {
    this.message = msg;
    this.validate = validationMethod;
}

// Indicates which seat is causing the seating error TODO: Enable/disable this based on a setting on the control?
//function flashSeat(seat) {
//    getSeatImage(seat.area.AreaNumber, seat.RowIndex, seat.ColumnIndex).effect('highlight', { color: '#FF0000' }, 1000);
//}

//function flashSofa(seat) {
//    var sofaSeat;

//    for (i = 0; i < seat.SeatsInGroup.length; i++) {
//        sofaSeat = getSeatById(seat.area, seat.RowIndex, seat.SeatsInGroup[i]);

//        flashSeat(sofaSeat);
//    }
//}

// Checks for a gap seat next to a selected seat and then for a selected seat on the other side of the gap
function checkSingleSeatBetweenSeats(seat) {

    // If we are ignoring special seats then we need to 
    // skip validation if the seat in question is special.
    if (m_validationRules.SpecialSeatsIgnoreLogic) {
        if (seat.OriginalSeatStatus === WHEELCHAIR) {
            return true;
        }
    }

    var oneSeatOver, twoSeatsOver;

    // Check to the left
    if (seat.ColumnIndex + 2 < seat.area.ColumnCount) { // Check row bounds
        oneSeatOver = getSeat(seat.area.AreaNumber, seat.RowIndex, seat.ColumnIndex + 1);

        if (oneSeatOver && seatAvailable(oneSeatOver)) {
            twoSeatsOver = getSeat(seat.area.AreaNumber, seat.RowIndex, seat.ColumnIndex + 2);

            if (twoSeatsOver) {
                if (twoSeatsOver.Status === SELECTED) {
                    //flashSeat(oneSeatOver);
                    return false;
                }
            }
        }
    }

    // Check to the right
    if (seat.ColumnIndex - 2 > -1) {
        oneSeatOver = getSeat(seat.area.AreaNumber, seat.RowIndex, seat.ColumnIndex - 1);

        if (oneSeatOver && seatAvailable(oneSeatOver)) {
            twoSeatsOver = getSeat(seat.area.AreaNumber, seat.RowIndex, seat.ColumnIndex - 2);

            if (twoSeatsOver) {
                if (twoSeatsOver.Status === SELECTED) {
                    //flashSeat(oneSeatOver);
                    return false;
                }
            }
        }
    }

    return true;
}

// Ensure that a single seat gap isn't left between selected seats and the aisle
function checkSingleSeatGapFromAisle(seat) {

    // If we are ignoring special seats then we need to 
    // skip validation if the seat in question is special.
    if (m_validationRules.SpecialSeatsIgnoreLogic) {
        if (seat.OriginalSeatStatus === WHEELCHAIR) {
            return true;
        }
    }

    var oneSeatOver, oneSeatOtherWay;

    // Check if aisle to the left
    if (seat.ColumnIndex + 1 < seat.area.ColumnCount) { // Check row bounds
        oneSeatOver = getSeat(seat.area.AreaNumber, seat.RowIndex, seat.ColumnIndex + 1);

        if (oneSeatOver && seatAvailable(oneSeatOver)) {
            if (seat.ColumnIndex + 2 === seat.area.ColumnCount || !getSeat(seat.area.AreaNumber, seat.RowIndex, seat.ColumnIndex + 2)) {
                oneSeatOtherWay = getSeat(seat.area.AreaNumber, seat.RowIndex, seat.ColumnIndex + 1);
                // if the seat to the right is already taken, then it is valid
                if (oneSeatOtherWay && (seatAvailable(oneSeatOtherWay) && oneSeatOtherWay.Status !== SELECTED)) {
                    if (ignoreSeatGapIfNoAdequateSpaceLeftInRow(seat.area.Rows[seat.RowIndex])) {
                        return true;
                    }
                    return false;
                }
            }
        }
    }

    // Check if aisle to the right
    if (seat.ColumnIndex - 1 > -1) { // Check row bounds
        oneSeatOver = getSeat(seat.area.AreaNumber, seat.RowIndex, seat.ColumnIndex - 1);

        if (oneSeatOver && seatAvailable(oneSeatOver)) {
            if (seat.ColumnIndex - 2 === seat.area.ColumnCount || !getSeat(seat.area.AreaNumber, seat.RowIndex, seat.ColumnIndex - 2)) {
                //flashSeat(oneSeatOver);
                oneSeatOtherWay = getSeat(seat.area.AreaNumber, seat.RowIndex, seat.ColumnIndex - 1);
                if (oneSeatOtherWay && (seatAvailable(oneSeatOtherWay) && oneSeatOtherWay.Status !== SELECTED)) {
                    if (ignoreSeatGapIfNoAdequateSpaceLeftInRow(seat.area.Rows[seat.RowIndex])) {
                        return true;
                    }
                    return false;
                }
            }
        }
    }

    return true;
}

// Ensure that a single seat isn't left between selected seats and other sold seats
function checkSingleSeatGapFromSoldSeats(seat) {

    // If we are ignoring special seats then we need to 
    // skip validation if the seat in question is special.
    if (m_validationRules.SpecialSeatsIgnoreLogic) {
        if (seat.OriginalSeatStatus === WHEELCHAIR) {
            return true;
        }
    }

    var oneSeatOver, twoSeatsOver;

    // Check to the left
    if (seat.ColumnIndex + 2 < seat.area.ColumnCount) { // Check row bounds
        oneSeatOver = getSeat(seat.area.AreaNumber, seat.RowIndex, seat.ColumnIndex + 1);

        if (oneSeatOver && seatAvailable(oneSeatOver)) {
            twoSeatsOver = getSeat(seat.area.AreaNumber, seat.RowIndex, seat.ColumnIndex + 2);

            if (twoSeatsOver) {
                if (twoSeatsOver.Status === SOLD) {
                    //flashSeat(oneSeatOver);
                    if (ignoreSeatGapIfNoAdequateSpaceLeftInRow(seat.area.Rows[seat.RowIndex])) {
                        return true;
                    }
                    return false;
                }
            }
        }
    }

    // Check to the right
    if (seat.ColumnIndex - 2 > -1) {
        oneSeatOver = getSeat(seat.area.AreaNumber, seat.RowIndex, seat.ColumnIndex - 1);

        if (oneSeatOver && seatAvailable(oneSeatOver)) { // Gap seat
            twoSeatsOver = getSeat(seat.area.AreaNumber, seat.RowIndex, seat.ColumnIndex - 2);

            if (twoSeatsOver) {
                if (twoSeatsOver.Status === SOLD) {
                    //flashSeat(oneSeatOver);
                    if (ignoreSeatGapIfNoAdequateSpaceLeftInRow(seat.area.Rows[seat.RowIndex])) {
                        return true;
                    }
                    return false;
                }
            }
        }
    }

    return true;
}

// Ensure all sofas with allocated seats on them are full
function checkSofaFull(seat) {
    var i, sofaSeat;

    if (seat.IsSofaSeat && m_sofaSeatingEnabled) { // Seat is in a sofa
        for (i = 0; i < seat.SeatsInGroup.length; i++) {
            sofaSeat = getSeat(seat.area.AreaNumber, seat.SeatsInGroup[i].RowIndex, seat.SeatsInGroup[i].ColumnIndex);

            if (seatAvailable(sofaSeat)) {
                //flashSofa(seat);
                return false; // Ensure the whole sofa is reserved / sold
            }
        }
    }

    return true;
}

function checkForMatchingWheelchair(companionSeat) {

    if (companionSeat.IsCompanion && companionSeat.SeatsInGroup) {
        return checkForWheelchairSeatInGroup(companionSeat);
    }
        // CLIENTS OF LEGACY SALES SERVER INSTANCES ONLY
        // To be removed when all customers support the new Sales Server
        // companion seating constructs
    else if (m_validationRules.CreateLegacyCompanionSeats) {
        return checkForAdjacentWheelchairSeat(companionSeat);
    }

    return true;
}

/**
 * Should be used when companion seat information is returned from Sales Server.
 * If companion seat info is NOT available use checkForAdjacentWheelchairSeat(seat)
 * @param {} companion 
 * @returns {} false if a wheelchair has not been selected for this companion seat
 */
function checkForWheelchairSeatInGroup(companion) {

    // Find any selected wheelchair seat with this companion seat in its group
    var selectedSeats = getSelectedSeatList(companion.area.AreaCategoryCode), selectedSeat, i, j;

    for (i = 0; i < selectedSeats.length; i++) {
        selectedSeat = getSeat(selectedSeats[i].AreaNumber, selectedSeats[i].RowIndex, selectedSeats[i].ColumnIndex);

        if (selectedSeat.OriginalSeatStatus === WHEELCHAIR && selectedSeat.SeatsInGroup) {

            for (j = 0; j < selectedSeat.SeatsInGroup.length; j++) {

                if (areInSamePosition(companion, selectedSeat.SeatsInGroup[j])) {
                    return true;
                }
            }
        }
    }
    return false;
}


/**
 * LEGACY Should be used only when companion seat information is not returned from Sales Server.
 * If companion seat is available, use checkCompanionSeats(seat) instead.
 * @param {} companion 
 * @returns {} false if a wheelchair has not been selected for this companion seat
 */
function checkForAdjacentWheelchairSeat(companion) {

    var seatToLeft = getSeat(companion.area.AreaNumber, companion.RowIndex, companion.ColumnIndex + 1);
    var seatToRight = getSeat(companion.area.AreaNumber, companion.RowIndex, companion.ColumnIndex - 1);

    if (seatToLeft && seatToLeft.Status === WHEELCHAIR) {
        return false;
    }
    else if (seatToRight && seatToRight.Status === WHEELCHAIR) {
        return false;
    }
    return true;
}


function selectedCompanionSeats(wheelchairSeat) {

    var companionSeats = [];

    if (wheelchairSeat.OriginalSeatStatus !== WHEELCHAIR) {
        return companionSeats;
    }

    // CLIENTS OF LEGACY SALES SERVER INSTANCES ONLY
    // To be removed when all customers support the new Sales Server
    // companion seating constructs
    if (wheelchairSeat.SeatsInGroup) {
        var wheelchairGroup = wheelchairSeat.SeatsInGroup || [], seat;
        for (var i = 0; i < wheelchairGroup.length; i++) {
            seat = getSeat(wheelchairSeat.area.AreaNumber, wheelchairGroup[i].RowIndex, wheelchairGroup[i].ColumnIndex);
            if (seat.IsCompanion && seat.Status === SELECTED) {
                companionSeats.push(seat);
            }
        }
    } else if (m_validationRules.CreateLegacyCompanionSeats) {

        var seatToLeft = getSeat(wheelchairSeat.area.AreaNumber, wheelchairSeat.RowIndex, wheelchairSeat.ColumnIndex + 1);
        var seatToRight = getSeat(wheelchairSeat.area.AreaNumber, wheelchairSeat.RowIndex, wheelchairSeat.ColumnIndex - 1);

        if (seatToLeft && seatToLeft.Status === SELECTED) {
            companionSeats.push(seatToLeft);
        }
        else if (seatToRight && seatToRight.Status === SELECTED) {
            companionSeats.push(seatToRight);
        }
    }

    return companionSeats;
}

// TODO: Re-visit how this works and make it clearer for the next person
function getActiveValidationRules() {
    var validationRules = [];

    if (m_validationRules.SingleSeatBetweenSeats) {
        validationRules.push(new SeatRule(m_validationRules.SingleSeatBetweenSeats, checkSingleSeatBetweenSeats));
    }

    if (m_validationRules.SingleSeatGapFromAisle) {
        validationRules.push(new SeatRule(m_validationRules.SingleSeatGapFromAisle, checkSingleSeatGapFromAisle));
    }

    if (m_validationRules.SingleSeatGapFromSoldSeats) {
        validationRules.push(new SeatRule(m_validationRules.SingleSeatGapFromSoldSeats, checkSingleSeatGapFromSoldSeats));
    }

    if (m_validationRules.MustFillSofa) {
        validationRules.push(new SeatRule(m_validationRules.MustFillSofa, checkSofaFull));
    }

    if (m_validationRules.RequireWheelchairToPurchaseCompanionSeat) {
        validationRules.push(new SeatRule(m_validationRules.RequireWheelchairToPurchaseCompanionSeat, checkForMatchingWheelchair));
    }

    return validationRules;
}

// When validation passes this function fills a field on the page with the selected seats string
function setSelectedSeatsField(isTemp) {
    var hiddenField = $('#' + m_hiddenFieldId),
        seat,
        selectedSeatsData = '',
        selectedSeatCount = 0,
        i;

    if (isTemp) {
        //Hidden field for storing seat data, will need to be created on page
        hiddenField = $('#txtSeatSelectionTemp');
    }

    // Create the selected seats string to pass back to the server
    for (i = 0; i < m_selectedSeats.length; i++) {
        for (j = 0; j < m_selectedSeats[i].Seats.length; j++) {
            seat = m_selectedSeats[i].Seats[j];

            selectedSeatsData += m_selectedSeats[i].AreaCategoryCode + '|' + seat.AreaNumber + '|' + (seat.RowIndex + 1) + '|' + (seat.ColumnIndex + 1) + '|';

            selectedSeatCount += 1;
        }
    }

    // Set the hidden fields value
    hiddenField.val('|' + selectedSeatCount + '|' + selectedSeatsData);
}

// Called by the page when the validate button is clicked
function validateSeating() {
    var seatsHaveChanged = false,
        validationRules = getActiveValidationRules(), // Get the current rules
        i, j, k, seat, result;

    // Seat selection not required for unallocated areas
    if (SeatingControl.isSeatFirst() && SeatingControl.isSeatSelectionRequired() && !SeatingControl.hasSelectedSeats()) {
        showPopup(m_validationRules.AllSeatsInOrderMustBeSelected); // TODO: different validation message?
        return false;
    }


    //Special case for seat first & ticket package
    if (SeatingControl.isSeatFirst()) {
        var seatCount = $('#txtSeatFirstSeatCount').val();
        if (seatCount > 0 && (m_selectedSeats[0].Seats.length % seatCount !== 0)) {
            showPopup(m_validationRules.ValidationMultipleNumberOfSeats + seatCount);
            return false;
        }
    }

    // Check whether seating has been changed at all by the user
    for (i = 0; i < m_selectedSeats.length; i++) {
        // Check if there are seats remaining for allocation
        // Seat-first does not require all seats selected
        if (!SeatingControl.isSeatFirst() && m_theatre.AreaCategories[m_selectedSeats[i].AreaCategoryCode].SeatsNotAllocatedCount > 0) {
            showPopup(m_validationRules.AllSeatsInOrderMustBeSelected);
            return false;
        }

        for (j = 0; j < m_selectedSeats[i].Seats.length; j++) {
            seat = getSeat(m_selectedSeats[i].Seats[j].AreaNumber, m_selectedSeats[i].Seats[j].RowIndex, m_selectedSeats[i].Seats[j].ColumnIndex);

            if (seat.OriginalSeatStatus !== seat.Status) { // Seating has changed
                seatsHaveChanged = true;
            }
        }
    }

    // Only need to do validation checks if seats have been changed
    if (seatsHaveChanged) {
        for (i = 0; i < m_selectedSeats.length; i++) {
            for (j = 0; j < m_selectedSeats[i].Seats.length; j++) {
                // Check the current seat against each of the current validation rules
                for (k = 0; k < validationRules.length; k++) {
                    seat = getSeat(m_selectedSeats[i].Seats[j].AreaNumber, m_selectedSeats[i].Seats[j].RowIndex, m_selectedSeats[i].Seats[j].ColumnIndex);

                    result = validationRules[k].validate(seat);

                    if (result === false) { // Validation failed
                        showPopup(validationRules[k].message);
                        return false;
                    }
                }
            }
        }

        // One-time validation against all seats, so not added as a validation rule
        if (!m_validationRules.MustFillSofa && !SeatingControl.checkOnlyOnePartiallyFilledSofa()) {
            showPopup(m_validationRules.SinglePartiallyFilledSofa);
            return false;
        }
    }

    setSelectedSeatsField();

    return true; // Validation passed
}

////////////////////////////////////////////////////
// ZOOM FUNCTIONALITY
////////////////////////////////////////////////////

//var zoomedIn = true;

function scrollToSelectedSeats() {
    var selectedSeats = $('.Seating-Area td[src*="sold"]');

    if (selectedSeats.length !== 0) {
        selectedSeats[0].scrollIntoView();
    }
}

//// Scales the theatre so that the seat images are their original size
//function zoomIn() {
//    var theatreWidth,
//        containerDiv,
//        containerWidth,
//        resizeAmount;

//    zoomedIn = true;

//    containerDiv = $('.Seating-Container').parent();

//    theatreWidth = $('.Seating-Theatre').data('originalsize');
//    containerWidth = containerDiv.width();

//    // Calculate percentage to resize by
//    resizeAmount = theatreWidth / containerWidth;

//    containerDiv.find('img, div, table, tr, td').each(function () {
//        var element = $(this);

//        element.width(resizeAmount * element.width());
//        element.height(resizeAmount * element.height());
//    });
//}

//// Scales the theatre so that all of the seats are visible
//function zoomOut() {
//    var theatreWidth,
//        containerDiv,
//        containerWidth,
//        resizeAmount;

//    zoomedIn = false;

//    containerDiv = $('.Seating-Container').parent();

//    theatreWidth = $('.Seating-Theatre').data('originalsize');
//    containerWidth = containerDiv.width();

//    // Calculate percentage to resize by
//    resizeAmount = containerWidth / theatreWidth;

//    containerDiv.find('img, div, table, tr, td').each(function () {
//        var element = $(this);

//        element.width(resizeAmount * element.width());
//        element.height(resizeAmount * element.height());
//    });
//}

//// Toggles the zoom level
//function zoomSeating() {
//    if (zoomedIn) {
//        zoomOut();
//    }
//    else {
//        zoomIn();
//        scrollToSelectedSeats();
//    }
//}

////////////////////////////////////////////////////
// FIXES
////////////////////////////////////////////////////

function roundNumber(num, dec) {
    var result = String(Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec));
    if (result.indexOf('.') < 0) { result += '.'; }
    while (result.length - result.indexOf('.') <= dec) { result += '0'; }
    return parseFloat(result);
}

function fixRowSizes() {
    var areas = $('.Seating-Area'),
        areaHeight,
        rowHeight, area, areaLen,
        rows, row, rowsLen, i, j;

    for (j = 0, areaLen = areas.length; j < areaLen; j++) {
        area = $(areas[j]);
        rows = area.find('tr');

        areaHeight = area.parent().height() * (area[0].style.height.replace(/[^-\d\.]/g, '') / 100);

        rowHeight = roundNumber(areaHeight / rows.length, 2);

        for (i = 0, rowsLen = rows.length; i < rowsLen; i++) {
            row = $(rows[i]);

            row.css('line-height', rowHeight + 'px');
            row.css('height', rowHeight + 'px');
        }
    }
}

// Make sure the images are the correct size for their area
function fixImageSizes() {
    var areas = $('.Seating-Area'),
        areaWidth, areaHeight,
        imageWidth, imageHeight, area,
        areaContainer, columnCount, images,
        image, i, j, rowCount,
        areaLen, imageLen;

    for (j = 0, areaLen = areas.length; j < areaLen; j++) {
        area = $(areas[j]);
        images = area.find('img');
        columnCount = getArea(area.data('area-number')).ColumnCount;
        rowCount = area.find('tr').length;
        areaContainer = area.parent();

        areaWidth = areaContainer.width() * (area[0].style.width.replace(/[^-\d\.]/g, '') / 100);
        areaHeight = areaContainer.height() * (area[0].style.height.replace(/[^-\d\.]/g, '') / 100);

        imageWidth = areaWidth / columnCount;
        imageHeight = areaHeight / rowCount;

        if (!mobilecheck()) {
            for (i = 0, imageLen = images.length; i < imageLen; i++) {
                image = $(images[i]);
                image.css('width', Math.round(imageWidth) + 'px');
                image.css('height', Math.round(imageHeight) + 'px');
                image.siblings('p').css('line-height', image.closest('tr').css('line-height'));
            }
        } else {

            for (i = 0, imageLen = images.length; i < imageLen; i++) {
                image = images[i];
                var $image = $(images[i]);
                var origWidth = image.naturalWidth;
                var origHeight = image.naturalHeight;

                var aspect = origWidth / origHeight;

                if (imageWidth < imageHeight) {
                    var aspectHeight = imageWidth * aspect;

                    $image.css('width', imageWidth + 'px');
                    $image.css('height', aspectHeight + 'px');
                    $image.siblings('p').css('line-height', $image.closest('tr').css('line-height'));
                } else {
                    var aspectWidth = imageHeight / aspect;
                    $image.css('width', aspectWidth + 'px');
                    $image.css('height', imageHeight + 'px');
                    $image.siblings('p').css('line-height', $image.closest('tr').css('line-height'));
                }
            }
        }
    }
}

function fixSeatingContainerSize(container) {
    container = container || $('.Seating-Control');
    container.children('div').height(container[0].scrollHeight + 8);
}

if (mobilecheck()) {
    window.addEventListener('resize', function () {
        fixRowSizes();
        fixImageSizes();
        setSeatNameWidths();
        fixSeatingContainerSize();
    });
}
// Collapse all rows which don't contain an image
//function collapseEmptyRows() {
//    rows = $(areas[j]).find('tr:not(:has(img))');

//    for (i = 0, rowsLen = rows.length; i < rowsLen; i++) {
//        row = $(rows[i]);

//        row.css('line-height', '0px');
//        row.css('height', '0px');
//    }
//}

// Centers the areas in backwards compatibility mode
function centerAreas() {
    var theatre = $('.Seating-Theatre'),
        container = theatre.parent();

    theatre.css('position', 'relative');
    theatre.css('left', container.width() / 2 - theatre.width() / 2 + 'px');
}

// Fix seat name labels
//function setSeatNameWidths() {
//    var seatLabels = $('.Seating-Area p'),
//        label, i, len, labelParent;

//    for (i = 0, len = seatLabels.length; i < len; i++) {
//        label = $(seatLabels[i]);
//        labelParent = label.parent();

//        label.width(labelParent.width());
//        label.css('line-height', labelParent.height() + 'px');
//    }
//}

function setSeatNameWidths() {
    var areas = $('.Seating-Area'), i, j, k, len, len2, len3;

    var leftRowLabels = $('.Seating-RowLabelContainer-Left tr');
    var rightRowLabels = $('.Seating-RowLabelContainer-Right tr');

    var currentRowIndex = 0;
    for (i = 0, len = areas.length; i < len; i++) {
        var rows = $(areas[i]).find('tr');
        for (j = 0, len2 = rows.length; j < len2; j++) {
            var row = $(rows[j]);
            var cells = row.find('td');
            for (k = 0, len3 = cells.length; k < len3; k++) {
                var cell = cells[k];
                var $cell = $(cell);
                var label = $cell.find('p');
                var img = $cell.find('img');
                label.width(img.width());
                label.css('line-hieght', img.height());
            }

            var rowHeight = row.height();

            $(leftRowLabels[currentRowIndex]).css('line-height', rowHeight + 'px');
            $(rightRowLabels[currentRowIndex]).css('line-height', rowHeight + 'px');

            currentRowIndex++;
        }
    }
}

////////////////////////////////////////////////////
// VALIDATION HELPERS
////////////////////////////////////////////////////

function ignoreSeatGapIfNoAdequateSpaceLeftInRow(row) {
    //In the case that there is only one EMPTY seat left on the entire row (after user has selected seats)
    //Ignore the 1 empty space validation rules
    var emptySeats = getSeatsInRowBasedOnStatus(row, EMPTY);
    if (emptySeats.length !== 1) {
        if (rowHasBetterGapsForSelectedSeats(row)) {
            return false;
        }
    }
    return true;
}


//Check if there are better gaps for the amount of seat selected
//E.g. say if there are two empty seat gaps (3 seats & 2 seats), and the user only wants 2 seats,
//We want them to fill up the 2 seats gap instead of the 3 seats one.
function rowHasBetterGapsForSelectedSeats(row) {
    var emptyGaps = getSeatsInContiguousOrder(row, EMPTY);
    var selectedSeats = getSeatsInRowBasedOnStatus(row, SELECTED);
    var emptySeats = getSeatsInRowBasedOnStatus(row, EMPTY);

    var soldSeats = getSeatsInRowBasedOnStatus(row, SOLD);
    if (soldSeats.length === 0) {
        if (adjacentSeatsAreEmpty(selectedSeats[0]) && adjacentSeatsAreEmpty(selectedSeats[selectedSeats.length - 1])) {
            return true;
        }
    }

    if (adjacentSeatsAreEmpty(selectedSeats[0]) && adjacentSeatsAreEmpty(selectedSeats[selectedSeats.length - 1])) {
        return true;
    }

    var maxGapLength = getMaxGapLength(emptyGaps);

    for (var i = 0; i < emptyGaps.length; i++) {
        if (emptyGaps[i].length - 1 > selectedSeats.length) {
            return true;
        }
        if (emptyGaps[i].length - 1 === selectedSeats.length) {
            if (selectedSeats.length === 1 && maxGapLength - 1 === selectedSeats.length) {
                return false;
            }

        }
        if (emptyGaps[i].length === selectedSeats.length) {
            if (selectedSeats.length === 1 && maxGapLength - 1 === selectedSeats.length) {
                return false;
            }
            if (adjacentSeatsAreEmpty(selectedSeats[0]) || adjacentSeatsAreEmpty(selectedSeats[selectedSeats.length - 1])) {
                return true;
            }
        }
    }

    if (emptySeats.length === selectedSeats.length && emptyGaps.length >= selectedSeats.length) {
        return true;
    }

    if (emptySeats.length < selectedSeats.length) {
        var contSelectedSeats = getSeatsInContiguousOrder(row, SELECTED);
        if (contSelectedSeats.length > 1) {
            return true;
        }
    }

    return false;
}

////////////////////////////////////////////////////
// GENERAL HELPERS
////////////////////////////////////////////////////

function getSeatsInRowBasedOnStatus(row, status) {
    var seats = [];
    for (var i = 0; i < row.Seats.length; i++) {
        if (row.Seats[i]) {
            if (row.Seats[i].Status === status) {
                seats.push(row.Seats[i]);
            }
        }
    }
    return seats;
}

function getSeatsInContiguousOrder(row, status) {
    var seatSets = [];
    var contiguousSeats = [];
    for (var i = 0; i < row.Seats.length; i++) {
        if (row.Seats[i]) {
            if (row.Seats[i].Status === status) {
                if (i === 0) {
                    contiguousSeats.push(row.Seats[i]);
                    continue;
                }
                if (row.Seats[i - 1]) {
                    if (row.Seats[i - 1].Status !== status) {
                        seatSets.push(contiguousSeats);
                        contiguousSeats = [];
                    }
                }

                contiguousSeats.push(row.Seats[i]);
            }
        }
    }

    if (contiguousSeats.length > 0) {
        seatSets.push(contiguousSeats);
    }

    return seatSets;
}

function adjacentSeatsAreEmpty(seat, checkBoth) {
    var seatToLeft = getSeat(seat.area.AreaNumber, seat.RowIndex, seat.ColumnIndex + 1);
    var seatToRight = getSeat(seat.area.AreaNumber, seat.RowIndex, seat.ColumnIndex - 1);

    if (seatToLeft && seatToRight && checkBoth) {
        if (seatToLeft.Status === EMPTY && seatToRight.Status === EMPTY) {
            return true;
        }
        return false;
    }

    if (seatToLeft && seatToRight) {
        if (seatToLeft.Status === EMPTY || seatToRight.Status === EMPTY) {
            return true;
        }
    }

    return false;
}

function getMaxGapLength(gaps) {
    var maxLength = 0;
    for (var i = 0; i < gaps.length; i++) {
        if (maxLength < gaps[i].length) {
            maxLength = gaps[i].length;
        }
    }
    return maxLength;
}

////////////////////////////////////////////////////
// ENTRY POINT
////////////////////////////////////////////////////

function initSeatingControl() {
    // Self-executing to preserve current behaviour
    // If the script is included then the control should be set up

    // assume script included at bottom of page
    // we must select the container in advance because we can't guarantee our $.ready executes before callers
    var container = $('.Seating-Control'),
        seatChangeCallback,
        areaChangeCallback;

    var init = function () {
        // Try to re-select in case script was included before the container
        if (!container.length)
            container = $('.Seating-Control');

        // Scroll to selected seats
        scrollToSelectedSeats(); //TODO: Implement?

        if (m_isLayout) {
            fixRowSizes();
            fixImageSizes();
            setSeatNameWidths();
        } else {
            //collapseEmptyRows(); // Can't use this as sometimes gap rows are in the middle of an area
            centerAreas();
        }

        setSeatNameWidths();

        container.find('.Seating-Area').click(onSeatClick);

        // Resize seating container
        fixSeatingContainerSize(container) // Slight padding to always ensure no scrollbar (ff)

        // Show the seats
        container.find('.Seating-Container').css('visibility', 'visible');

        container.find('.Seating-Popup').click(function (event) {
            hidePopup();
        });

        seatingLoaded = true;
    };

    if (document.readyState === 'complete' || document.readyState === 'loaded') {
        init();
    } else {
        //For mobile layout we want to defer the execution until all resources (eg. images are loaded) 
        $(window).load(init);
    }

    var methods = {
        onSelectionChange: function (callback) {
            seatChangeCallback = callback;
        },

        onActiveAreaCategoryChange: function (callback) {
            areaChangeCallback = callback;
        },

        getSeatCount: getSeatCount,
        hasSelectedSeats: hasSelectedSeats,
        isSeatSelectionRequired: isSeatSelectionRequired,

        getAreaCategories: getAreaCategories,

        validate: validateSeating,
        setSelectedSeatsField: setSelectedSeatsField,
        selectSeat: selectSeat,
        deselectAllSeats: deselectAllSeats,

        setActiveAreaCategory: setActiveAreaCategory,

        isSeatFirst: function () {
            return m_isSeatFirst;
        },

        checkOnlyOnePartiallyFilledSofa: checkOnlyOnePartiallyFilledSofa
    };

    function onSeatClick(event) {
        var seatImage,
            targetTagName = event.target.tagName.toLowerCase(),
            message;

        if (targetTagName !== 'img') { // Missed the image
            if (targetTagName === 'p') { // When seat names are enabled this will be the seat name
                seatImage = $(event.target).next(); // The next sibling after the seat name is the image
            }
            else if (targetTagName === 'td' || targetTagName === 'div') {
                seatImage = $(event.target).find('img');
            }
            else { // This could be the table, or tbody and can't be used
                return;
            }
        }
        else {
            seatImage = $(event.target);  // wraps the seat in a jQuery object
        }

        if (seatImage.length === 0) {
            return; // Seat image not found
        }

        var areaNumber = $(this).data('area-number');

        var area = getArea(areaNumber),
            activeAreaChanged = false;

        if (isAreaDisabled(areaNumber) && (getAvailableSeatCount(area.AreaCategoryCode) > 0 || !isAreaCategoryAllocated(area.AreaCategoryCode))) {
            // Don't switch to disabled areas

            if (hasSelectedSeats()) {
                var confirmationMessage;
                var areaCategoryName = getAreaCategoryName(area.AreaCategoryCode);

                if (areaCategoryName) {
                    confirmationMessage = format(m_validationRules.ChangeAreaSpecific, areaCategoryName);
                }
                else {
                    confirmationMessage = m_validationRules.ChangeAreaGeneric;
                }

                if (!confirm(confirmationMessage)) {
                    // Return if the area does not become active
                    // Otherwise the click should continue through
                    return;
                }

            }

            setActiveAreaCategory(area.AreaCategoryCode);
            activeAreaChanged = true;
        }

        // If changing the active area category, don't trigger the click if the new area is unallocated 
        if (!activeAreaChanged || area.IsAllocatedSeating) {
            message = seatClicked(seatImage, areaNumber);

            if (message) {
                showPopup(message);
            }
            else {
                hidePopup();
            }
        }

        // Fires even when validation fails
        if ((activeAreaChanged || area.IsAllocatedSeating) && typeof seatChangeCallback === 'function')
            seatChangeCallback();
    }

    function getAreaCategories() {
        var categories = [];

        for (var code in m_theatre.AreaCategories) {
            if (m_theatre.AreaCategories.hasOwnProperty(code))
                categories.push(m_theatre.AreaCategories[code]);
        }

        return categories;
    }

    function isAreaDisabled(areaNumber) {
        return container.find('.Seating-Area').filter(inArea(areaNumber)).data('scdisabled');
    }

    function hasSelectedSeats() {
        for (var i = 0; i < m_selectedSeats.length; i++) {
            if (m_selectedSeats[i].Seats.length > 0)
                return true;
        }

        return false;
    }

    function isSeatSelectionRequired() {
        // this will be false when the active area category is unallocated
        var areaCategories = getAreaCategories();

        for (var i = 0; i < areaCategories.length; i++) {

            var areaNumbers = getAreaNumbersForAreaCategory(areaCategories[i].AreaCategoryCode);

            if (isAreaDisabled(areaNumbers)) // ignore disabled area categories
                continue;

            if (areaCategories[i].SeatsToAllocate > 0 && isAreaCategoryAllocated(areaCategories[i].AreaCategoryCode))
                return true;
        }

        return false;
    }

    function getAvailableSeatCount(areaCategoryCode) {
        return m_theatre.AreaCategories[areaCategoryCode].SeatsToAllocate
    }

    function getSeatCount() {
        var sum = 0;

        for (var i = 0; i < m_selectedSeats.length; i++) {
            sum += m_selectedSeats[i].Seats.length;
        }

        return sum;
    }

    function getAreaCategoryName(areaCategoryCode) {
        if (m_areaCategoryNames.hasOwnProperty(areaCategoryCode))
            return m_areaCategoryNames[areaCategoryCode];
        else
            return '';
    }

    function getAreaNumbersForAreaCategory(areaCategoryCode) {
        var result = [];

        for (var i = 0; i < m_theatre.Areas.length; i++) {
            if (m_theatre.Areas[i].AreaCategoryCode === areaCategoryCode) {
                result.push(m_theatre.Areas[i].AreaNumber);
            }
        }

        return result;
    }

    function inArea(areaNumbers) {
        /// <param name="areaNumbers">An area number or an array of area numbers to match.</returns>
        /// <returns type="Function">Filter function for the specified area(s).</returns>

        if (!(areaNumbers instanceof Array))
            areaNumbers = [areaNumbers];

        return function () {
            for (var i = 0; i < areaNumbers.length; i++) {
                if (areaNumbers[i] === $(this).data('area-number'))
                    return true;
            }

            return false;
        };
    }

    function isAreaCategoryAllocated(areaCategoryCode) {
        var areas = getAreaNumbersForAreaCategory(areaCategoryCode);

        for (var i = 0; i < areas.length; i++) {
            if (getArea(areas[i]).IsAllocatedSeating)
                return true;
        }

        return false;
    }

    function getSeatsInGroup(seat) {
        var seats = [];

        if (seat.SeatsInGroup) {
            for (var i = 0; i < seat.SeatsInGroup.length; i++) {
                seats.push(getSeat(seat.area.AreaNumber, seat.SeatsInGroup[i].RowIndex, seat.SeatsInGroup[i].ColumnIndex));
            }
        }

        return seats;
    }

    function getSelectedSeats() {
        var seats = [];

        for (var i = 0; i < m_selectedSeats.length; i++) {
            for (var j = 0; j < m_selectedSeats[i].Seats.length; j++) {
                seats.push(getSeat(m_selectedSeats[i].Seats[j].AreaNumber, m_selectedSeats[i].Seats[j].RowIndex, m_selectedSeats[i].Seats[j].ColumnIndex));
            }
        }

        return seats;
    }

    function checkOnlyOnePartiallyFilledSofa() {
        if (!m_sofaSeatingEnabled) return true;

        var seats = getSelectedSeats(),
            sofaFilled = false,
            seatsExamined = [];

        for (var i = 0; i < seats.length; i++) {
            // Skip seats we've already checked
            if ($.inArray(seats[i], seatsExamined) !== -1) continue;

            var seatsInGroup = getSeatsInGroup(seats[i]);
            for (var j = 0; j < seatsInGroup.length; j++) {
                if (seatAvailable(seatsInGroup[j])) {
                    if (sofaFilled) return false;
                    sofaFilled = true;
                    break;
                }
            }

            // We need to track all seats in this group so we don't revalidate them
            Array.prototype.push.apply(seatsExamined, seatsInGroup);
        }

        return true;
    }

    function setActiveAreaCategory(areaCategoryCode) {
        // deselect seats in all other area categories
        for (var code in m_theatre.AreaCategories) {
            if (!m_theatre.AreaCategories.hasOwnProperty(code)) {
                continue;
            }

            if (code !== areaCategoryCode) {
                deselectAllSeats(code);
            }
        }

        var areaCategory;
        if (areaCategory = m_theatre.AreaCategories[areaCategoryCode]) {
            // Must be done after deselecting all seats for getSelectedSeats to return the correct value
            areaCategory.SeatsToAllocate = m_seatsToAllocate;
            areaCategory.SeatsNotAllocatedCount = m_seatsToAllocate - getSelectedSeats().length; // seats may arleady be selected
        }

        hidePopup(true /* suppress animation */);

        var areasForCategory = getAreaNumbersForAreaCategory(areaCategoryCode);

        // Disable inactive areas
        // Note the disabled class must be added directly onto the image
        // Doing it on the container will cause some overlapping areas to become unclickable due to new stacking context from opacity
        container.find('.Seating-Area')
                     .data('scdisabled', false)
                     .find('img')
                         .removeClass('disabled')
                         .end()
                     .not(inArea(areasForCategory))
                         .data('scdisabled', true)
                         .find('img')
                            .addClass('disabled');

        if (areaCategoryCode && !isAreaCategoryAllocated(areaCategoryCode)) {
            showPopup(m_validationRules.UnallocatedAreaSelected);
        }

        if (typeof areaChangeCallback === 'function') {
            areaChangeCallback(areaCategoryCode);
        }
    }

    function format(formatString) {
        /// <summary>string.format</summary>
        /// <param name="formatString" type="String">The format string.</param>
        for (var i = 0; i < arguments.length - 1; i++) {
            var regex = new RegExp('\\{' + i + '\\}', 'g');
            formatString = formatString.replace(regex, typeof arguments[i + 1] === 'undefined' ? '' : arguments[i + 1]);
        }

        return formatString;
    }

    return methods;
};

SeatingControl = initSeatingControl();
