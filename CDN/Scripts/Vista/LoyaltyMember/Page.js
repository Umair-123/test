// Combines signup + details page, split out if necessary

Vista.LoyaltyMember.Page = (function () {
    'use strict';

    var addressModalDialog,
        preferredSites = $('#Member_PreferredSites_SelectedValues'),
        favouriteSite = $('#loyalty-member-favourite'),
        favouriteSiteSelection = $('#loyalty-member-favourite-selection'),
        mailingFrequency = $('#Member_MailingFrequency'),
        mailingPreference = $('#Member_EmailPreference'),
        emailInput = $('#Member_Email'),
        usernameInput = $('#Username');

    function setupButtonDependency(checkboxSelector, buttonSelector) {
        var checkbox = $(checkboxSelector);
        var buttons = $(buttonSelector);

        if (!checkbox.length) return;

        var syncFunc = function () {
            if (checkbox.is(':checked'))
                buttons.removeAttr('disabled').removeClass('page-action-disabled');
            else
                buttons.attr('disabled', 'disabled').addClass('page-action-disabled');
        };

        checkbox.click(syncFunc);
        syncFunc(); // page load sync
    }

    function onFindAddressClick() {
        var filters = new Vista.Models.Address();
        filters.street = $('#Member_Address1').val();
        filters.city = $('#Member_City').val();
        filters.postcode = $('#loyalty-member-postcode').val();
        addressModalDialog.show(filters);
    }

    function onAddressSelected(address) {
        $('#Member_Address1').val(address.street);
        $('#Member_Suburb').val(address.suburb);
        $('#Member_City').val(address.city);
        $('#loyalty-member-postcode').val(address.postcode);
    }
    
    function setFavouriteSiteInCheckboxList() {
        favouriteSiteSelection.text(favouriteSite.find(':selected').text());
    }

    function onFavouriteSiteChange() {
        setFavouriteSiteInCheckboxList();        

        var selectedSite = favouriteSite.val();

        var matchingPreferredSite = preferredSites.find('input').filter(function () {
            return $(this).val() === selectedSite;
        });

        if (matchingPreferredSite.is(':not(:checked)'))
            matchingPreferredSite[0].click(); // trigger native click, jquery .click() triggers handlers before updating checkbox
    }

    function onSiteChange() {
        var selectedSites = $.map(preferredSites.find('.selected'), function (element) {
            return $(element).find('input').val();
        });

        // If the favourite site is not selected, default to None option
        if (selectedSites.indexOf(favouriteSite.val()) === -1) {
            favouriteSite.find('option:first').attr('selected', 'selected');
        }
        
        setFavouriteSiteInCheckboxList();        
    }

    function updateEmailFrequencyState() {
        var isOptIn = $('#Member_EmailPreference').data('optin');
        var isChecked = mailingPreference.is(':checked');
        if (isOptIn === isChecked)  // enable field
            mailingFrequency.removeAttr('disabled');
        else
            mailingFrequency.val(mailingFrequency.find('option:first').val()).attr('disabled', 'disabled').valid();
    }    

    return {
        init: function () {
            // checkboxlist inputs are hidden, but still require validation
            var validator = $('form:first').validate();
            if (validator) validator.settings.ignore = '';

            $('#loyalty-member-hide').click(function () {
                $(this).hide();
                $('#loyalty-member-preferences').hide();
                $('#loyalty-member-show').show();
            });

            $('#loyalty-member-show').click(function () {
                $(this).hide();
                $('#loyalty-member-preferences').show();
                $('#loyalty-member-hide').show();
            });

            setupButtonDependency('#loyalty-signup-agree', '.loyalty-member .submit');

            $('#loyalty-member-address button').click(onFindAddressClick);

            addressModalDialog = new Vista.LoyaltyMember.AddressModalDialog($('#address-modal-dialog'));
            addressModalDialog.onAddressSelected(onAddressSelected);

            preferredSites.on('changecomplete', onSiteChange);
            favouriteSite.change(onFavouriteSiteChange);

            $('#loyalty-member-preferences ul').checkboxlist();

            mailingPreference.on('click', updateEmailFrequencyState);
            updateEmailFrequencyState();

            // One or the other is required. Username is hidden if set to login with email.
            if (usernameInput.length)
                usernameInput.rules('add', { required: true });
            else
                emailInput.rules('add', { required: true });
        }
    };

})();

$(Vista.LoyaltyMember.Page.init);

$('.input-validation-error').last().each(function() {
    $(this).focus(function() {
        this.scrollIntoView(true);
    });
});
