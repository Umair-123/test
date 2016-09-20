
Vista.LoyaltyMember.AddressModalDialog = function (container) {
    'use strict';

    var resultsList = container.find('.search-results'),
        refreshButton = container.find('.search-fields button'),
        closeButton = container.find('.address-modal-close'),
        addressField = container.find('#address-modal-address'),
        postcodeField = container.find('#address-modal-postcode'),
        cityField = container.find('#address-modal-city');

    var addressSelectedCallback;

    container.on('submit', onFormSubmit);
    closeButton.click(onCloseClick);
    resultsList.on('click', 'li:not(.no-result)', onResultClick);

    this.onAddressSelected = function (callback) {
        addressSelectedCallback = callback;
    };

    this.show = function (address) {
        container.modal({
            overlayClose: true,
            modal: true,
            persist: true, /* this is required, or event handlers break */
        });

        addressField.val(address.street);
        cityField.val(address.city);
        postcodeField.val(address.postcode);

        findAddress();
    };

    function onFormSubmit() {
        findAddress();
        return false;
    }

    function onResultClick() {
        var address = $(this).data('address');

        if (typeof addressSelectedCallback === 'function')
            addressSelectedCallback.call(this, address);

        $.modal.close();
    }

    function findAddress() {
        refreshButton.attr('disabled', 'disabled').addClass('disabled');
        resultsList.empty().addClass('container-loading');
        $.ajax({
            url: container.attr('action'), 
            type: 'POST',
            data: {
                street: addressField.val(),
                postcode: postcodeField.val(),
                city: cityField.val()
            },
            success: onFindSuccess,
            complete: onFindComplete,
            error: onFindError
        });
    }

    function onFindComplete() {
        refreshButton.removeAttr('disabled').removeClass('disabled');
        resultsList.removeClass('container-loading');
        repaint();
    }

    function onFindError() {
        resultsList.append($('<li class="no-result"></li>').text(Vista.Lang.Address.ErrorSearch)); 
    }

    function onFindSuccess(addresses) {
        var results = [];
        if (addresses instanceof Array && addresses.length) {
            for (var i = 0; i < addresses.length; i++) {
                var address = new Vista.Models.Address();
                address.parse(addresses[i]);

                var result = Vista.Utilities.joinWithoutEmpty(', ', address.street, address.suburb, address.city, address.postcode);
                if (result.length)
                    results.push($('<li></li>').text(result).data('address', address));
            }
        }

        if (results.length)
            $.fn.append.apply(resultsList, results);
        else 
            resultsList.append($('<li class="no-result"></li>').text(Vista.Lang.Address.NoResult));
    }

    function onCloseClick() {
        $.modal.close();
    }

    function repaint() {
        resultsList.find('li').removeClass('alt').filter(':even').addClass('alt');
    }

};
