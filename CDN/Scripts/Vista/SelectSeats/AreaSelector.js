/// <reference path="../Vista.js"/>

Vista.SelectSeats.AreaSelector = function (container) {
    'use strict';

    var clickHandler,
        options,
        inactiveDisabled;

    (function () {
        options = container.find('input');
        container.on('click', 'input', onInputClick);
    })();

    this.onClick = function (handler) {
        clickHandler = handler;
    };

    this.getValue = function () {
        return options.filter(':checked').val();
    };

    this.setValue = function (value) {
        options.filter(function () {
            return $(this).val() === value;
        }).attr('checked', 'checked');

        if (inactiveDisabled) {
            // lazy sync
            enable();
            disable();
        }
    };

    this.disableInactive = disable;
    this.enableInactive = enable;

    function onInputClick() {
        if (typeof clickHandler === 'function') {
            clickHandler();
        }
    }

    function disable() {
        // nb: only disable unchecked inputs, or the selected area won't be sent in the POST
        options.not(':checked')
                   .attr('disabled', 'disabled')
               .next('label') // inactive labels
                   .addClass('disabled');

        inactiveDisabled = true;
    }

    function enable() {
        options.removeAttr('disabled')
               .next('label')
                   .removeClass('disabled');

        inactiveDisabled = false;
    }
};