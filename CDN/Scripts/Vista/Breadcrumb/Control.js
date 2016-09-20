/// <reference path="../Vista.js"/>
/// <reference path="../ButtonWatch.js"/>

Vista.Breadcrumb.Control = function (container) {
    'use strict';

    // assumption: single condition for all conditional steps

    var toNextUncondtionalMandatory, 
        toNextMandatory, 
        conditionals;

    (function () {
        var selected = container.find('.selected');

        // andSelf().next() includes the matching element of nextUntil in the selection
        toNextUncondtionalMandatory = selected.nextUntil('.mandatory:not(.conditional), .after').andSelf().next().find('a, input');
        toNextMandatory = selected.nextUntil('.mandatory, .after').andSelf().next().find('a, input');
        conditionals = toNextUncondtionalMandatory.end().filter('.conditional').find('a, input');
    })();

    function enable(elements) {
        elements.removeClass('disabled').removeAttr('disabled');
    }

    function disable(elements) {
        elements.addClass('disabled').attr('disabled', 'disabled');
    }

    return {
        enableForwardNavigation: function (conditionMet) { 
            if (conditionMet) {
                // only enable as far as the first conditional mandatory step
                disable(toNextUncondtionalMandatory);
                enable(toNextMandatory);
            }
            else {
                // skip over any conditional mandatory steps
                enable(toNextUncondtionalMandatory);
                disable(conditionals);
            }
        },

        disableForwardNavigation: function () {
            disable(toNextUncondtionalMandatory);
        },

        setPrecondition: function (callback) {
            /// <summary>
            /// Set a callback that is called whenever a breadcrumb step is clicked.
            /// The click will not register if the callback returns false.
            ///</summary>

            // assume <a> steps have no side effects, and do not need to have this applied
            container.find('input').click(function () {
                if (typeof callback === 'function')
                    return callback();
            });
        }
    };
};