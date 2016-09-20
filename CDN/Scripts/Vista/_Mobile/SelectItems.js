/// <reference path="../../jquery-1.8.1.min.js" />

$(function () {

    highlightSelectedTickets();
    highlightSelectedConcessionItems();
    showAddVoucherButton();

    function highlightSelectedTickets() {
        //Add the 'selected' class when page loads
        var ticketQuantities = $('.ticket-quantity');
        $.each(ticketQuantities, function(index, quantity) {
            if ($(quantity).find('input.quantity').val() != '0') {
                $(quantity).parent().addClass('selected');
            }
        });

        //Add/Remove 'selected' class when quanity changes
        $('.ticket-quantity button').on('click', function (event) {
            var button = $(event.target);
            var quantity = $(button).parent().find('.quantity');
            if ($(quantity).val() != '0') {
                $(quantity).parent().parent().addClass('selected');
            } else {
                $(quantity).parent().parent().removeClass('selected');
            }
        });
    }

    function highlightSelectedConcessionItems() {
        //Add the 'selected' class when page loads
        var quantities = $('.item-footer-quantity');
        $.each(quantities, function (index, quantity) {
            if ($(quantity).find('input.quantity').val() != '0') {
                $(quantity).parent().parent().addClass('selected');
            }
        });

        //Add/Remove 'selected' class when quanity changes
        $('.item-footer-quantity button').on('click', function (event) {
            var button = $(event.target);
            var quantity = $(button).parent().find('.quantity');
            if ($(quantity).val() != '0') {
                $(quantity).parents().eq(2).addClass('selected');
            } else {
                $(quantity).parents().eq(2).removeClass('selected');
            }
        });

    }

    function showAddVoucherButton() {
        $('#ticket-voucher').on('keyup', function() {
            var inputText = $('#ticket-voucher').val();

            if (inputText.length > 0) {
                $('#add-voucher').show();
            } else {
                $('#add-voucher').hide();
            }
        });
    }

});
