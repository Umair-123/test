/// <reference path="../Vista.js"/>

Vista.ButtonWatch = (function () {
    'use strict';

    var buttonSets = []; // [ [button, clone, *initialstate], ...]

    (function ctor() {
        setupDomEventHandlers();
    })();

    function setupDomEventHandlers() {
        $(document).ready(function() {
            $(this).on('click', '*[data-js-buttonwatch-disableallonsubmit]', disableAll);
        });
    }

    function stopClick(e) {
        e.preventDefault();
        return false;
    }

    // we can't disable the original button because it will affect POST values as well as stopping submit on IE
    function createClone(button, optionalClass) {
        var clone = button.clone(false /* data & events */).addClass('disabled').click(stopClick);

        if (typeof optionalClass !== 'undefined')
            clone.addClass(optionalClass);

        clone.hide().insertAfter(button);
        
        return clone;
    }

    function disableAll() {

        var buttons = $("*[data-js-buttonwatch]:visible:not(.disabled)");
        
        for (var i = 0; i < buttons.length; i++) {
            var button = $(buttons[i]);
            disable(button);
        }
    }

    function disable(button) {

        var buttonPair = button.data('bwbuttonpair');
        if (!buttonPair) {

            var optionalClass = button.data('js-buttonwatch-optionalclass');

            buttonPair = [button, createClone(button, optionalClass)];

            // keep track of the display value if possible
            // sometimes show/hide messes up block vs inline-block
            if (button.is(':visible'))
                buttonPair[2] = button.css('display');

            // Store a reference so we can enable/disable buttons individually
            button.data('bwbuttonpair', buttonPair);
            buttonSets.push(buttonPair);
        }

        if (buttonPair[2])
            buttonPair[1].css('display', buttonPair[2]);
        else
            buttonPair[1].show();

        buttonPair[0].hide();
    }

    function enableAll() {
        for (var i = 0; i < buttonSets.length; i++) {
            enable(buttonSets[i]);
        }
    }

    function enable(buttonPair) {
        //Make sure the button has been disabled
        if (!buttonPair)
            return;

        buttonPair[1].hide();

        if (buttonPair[2])
            buttonPair[0].css('display', buttonPair[2]);
        else
            buttonPair[0].show();
    }

    return {
       disableAll: function () {
            /// <summary>Manually trigger the button disable. Use with ajax requests and other things with complex behaviour.</summary>
            disableAll();
        },

        enableAll: function () {
            /// <summary>Enables all the buttons.</summary>
            enableAll();
        },

        disable: function ($button) {
            /// <summary>Disables a single button.</summary>
            disable($button);
        },

        enable: function ($button) {
            /// <summary>Enables a single button.</summary>
            enable($button.data('bwbuttonpair'));
        }
    };

})();