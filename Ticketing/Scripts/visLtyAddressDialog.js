function AddressDialog(verifyButton, dialogElement, streetInput, suburbInput, cityInput, stateInput, postCodeInput, countryInput, referenceInput, handlerUrl, defaultSubmitMethod) {
    var submitOnVerify = false,
        onSuccess;

    // Constructor

    (function ctor() {
        var hideButton = dialogElement.find('#btnHide'),
            selectButton = dialogElement.find('#btnSelect');

        hideButton.click(function () {
            submitOnVerify = false;
            hideDialog();
        });

        selectButton.click(selectAddress);

        streetInput.change(unverifyInput);
        suburbInput.change(unverifyInput);
        cityInput.change(unverifyInput);
        stateInput.change(unverifyInput);
        postCodeInput.change(unverifyInput);
        countryInput.change(unverifyInput);

        verifyButton.click(verify);

        $('form').submit(function () {
            return verifyIfChanged(defaultSubmitMethod);
        });
    })();

    this.verifyAndSubmit = function (successCallback) {
        return verifyIfChanged(successCallback);
    };
    
    function verifyIfChanged(successCallback) {
        var form = $('form');

        onSuccess = successCallback;

        // Ensure the address is verified
        if (form.data('address-changed') === true) {
            submitOnVerify = true;

            verify();

            return false;
        }
        else {
            if (onSuccess) {
                setTimeout(onSuccess, 100);
                return false;
            }
        }
    }

    function verify() {
        var address = {
            street: streetInput.val(),
            city: cityInput.val(),
            postCode: postCodeInput.val()
        };

        showDialog();

        $.ajax({
            url: handlerUrl,
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(address),
            success: function (response) {
                if (response.d.Result === false) {
                    alert(response.d.Data);
                    hideDialog();
                    return;
                }

                showResults(jQuery.parseJSON(response.d.Data));
            },
            error: function (xhr, status, error) {
                if (error) {
                    alert(error);
                }
                else {
                    alert('An unexpected error occurred while trying verify the address.');
                }
                
                hideDialog();
            }
        });
    };

    // Center the dialog and show it
    function showDialog() {
        dialogElement
            .css('top', $(document).scrollTop() + $(window).height() / 2 - dialogElement.height() / 2)
            .css('left', $(window).width() / 2 - dialogElement.width() / 2)
            .show();
    }
    
    function hideDialog() {
        dialogElement
            .find('#loadingImage')
            .show();

        dialogElement
            .find('#addressSelection')
            .hide();

        dialogElement.hide();
    }

    function showResults(addresses) {
        var select = dialogElement.find('select');

        select.empty();
        
        $.each(addresses, function (i, addr) {
            var option = $('<option>' + addr.Address1 + ' ' + addr.City + ' ' + addr.PostCode + '</option>');

            option.data('address', addr);

            select.append(option);
        });

        dialogElement
            .find('#loadingImage')
            .hide();

        dialogElement
            .find('#addressSelection')
            .show();
    };

    function selectAddress() {
        var address = dialogElement.find('option:selected').data('address');

        // Set fields
        streetInput.val(address.Address1);
        suburbInput.val(address.Address2);
        cityInput.val(address.City);
        stateInput.val(address.State);
        countryInput.val(address.Country);
        referenceInput.val(address.PostalReference);
        postCodeInput.val(address.PostCode);

        // Track that the current address is verified
        $('form').data('address-changed', false);

        hideDialog();
        
        // If we need to submit after this then call the call-back
        if (submitOnVerify === true && onSuccess) {
            onSuccess();
        }
    }
    
    function unverifyInput() {
        $('form')
            .data('address-changed', true)
            .removeAttr('onsubmit'); // Remove default form action to stop submitting
    }
}