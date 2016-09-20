/// <reference path="../../jquery-1.8.1.min.js"/>

Vista.SelectSeats.Popup = (function () {
    'use strict';

    var SeatingControl = window.SeatingControl, // explicit import suppresses warnings
        buttonDoneOnClick;

    function init() {
        $('.countdown').countdown();
        $('#select-seats-tabs').scrollTop($('#select-seats-tabs .selected').position().top);

        var buttonDone = $('#ibtnNext');
            
        // TODO: possibly better to do this on a global level (i.e. replace __doPostBack)?
        // hijack asp.net generated handler
        buttonDoneOnClick = buttonDone.attr('onclick');
        buttonDone.removeAttr('onclick');
        buttonDone.click(onDoneClick);

        if (SeatingControl) {

            syncState();

            // Wire up event handlers last, to prevent repeatedly triggering syncState on initial setup
            SeatingControl.onSelectionChange(onSeatChange);
        }
    };

    function onSeatChange() {
        syncState();
    }

    function onDoneClick() {
        Vista.ButtonWatch.disableAll();
        if (trySetSelectedSeats()) {
            eval(buttonDoneOnClick);
            return true;
        }
        else {
            Vista.ButtonWatch.enableAll();
            return false;
        }
    }

    function syncState() {
        /// <summary>Update the state of the controls on the page according to the number of seats selected.</summary>

        var seatCount = SeatingControl.getSeatCount(),
            buttonDown = $('#ibtnNext');

        if (seatCount === 0) {
            // not valid to continue 
            Vista.ButtonWatch.disable(buttonDown);
        }
        else {
            Vista.ButtonWatch.enable(buttonDown);
        }
    }

    function trySetSelectedSeats() {
        var success = SeatingControl.validate(); 
        if (success) setSelectedSeats();
        return success;
    }

    function setSelectedSeats() {
        var strSelectedSeats;

        var selectedSeatsHiddenField = document.getElementById('SelectedSeatsHiddenField');
        strSelectedSeats = selectedSeatsHiddenField.value;
        strSelectedSeats = strSelectedSeats.substring(0, strSelectedSeats.length-1);
        document.frmSelectSeats.txtSeatInfo.value = strSelectedSeats;
    }

    return {
        init: init,
        update: onDoneClick
    };
})();

$(Vista.SelectSeats.Popup.init);