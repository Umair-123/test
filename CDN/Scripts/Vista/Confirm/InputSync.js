/// <reference path="../Vista.js"/>
/// <reference path="../Validation/Validation.js"/>

//Useful class for syncing values from a bunch of input elements from inside 'targetContainer' to a 'parentContainer'
Vista.Confirm.InputSync = function (settings) {
    /// <summary>Sync a set of inputs with another.</summary>
    'use strict';

    // 'settings'
    var targetContainer = settings.targetContainer || $(), // container of the inputs to copy values from
        parentContainer = settings.parentContainer || $(), // container of the inputs to sync
        disableElements = settings.disableElements || $(), // elements to disable when syncing is enabled, e.g. the line containers
        inputFilter = settings.inputFilter || "input", // filter for the target/parent containers so only specified elements are targeted if required
        selectorFunc = settings.selectorFunc || function (targetId) { return $(); }, // function mapping target element id to the input to sync
        disableValidation = !!settings.disableValidation;

    var $inputs = parentContainer.find(inputFilter),
        $targetInputs = targetContainer.find(inputFilter),
        formRules,
        validators = {}, // element id -> validator
        targetInputs = {}, // input id -> input
        map = {}; // input id -> syncced input

    var validator = parentContainer.closest('form').validate();
    if (validator)
        formRules = validator.settings.rules;

    $targetInputs.each(function () {
        map[this.id] = selectorFunc(this.id);
        targetInputs[this.id] = $(this);
    });

    this.start = function () {

        if (disableValidation) {
            // Clear existing validation markup
            Vista.Validation.resetElements($inputs);

            // Detach validation rules
            $inputs.each(function () {
                validators[this.name] = formRules[this.name];
                delete formRules[this.name];
            });
        }

        // Initial sync
        for (var id in targetInputs) {
            if (targetInputs.hasOwnProperty(id)) {
                copy(id);
            }
        }
        
        //Revalidate inputs now they have new values to ensure page state is correct
        if (validator) {
            $inputs.valid();
        }
        disableElements.addClass('disabled');
        $inputs.attr('readonly', 'readonly');

        targetContainer.on('change', inputFilter, changeHandler);

        
    };

    this.stop = function () {
        disableElements.removeClass('disabled');
        $inputs.removeAttr('readonly');

        if (disableValidation) {
            // Restore validation rules
            $inputs.each(function () {
                formRules[this.name] = validators[this.name];
            });
        }

        targetContainer.off('change', inputFilter, changeHandler);
        
        if (validator) {
            parentContainer.closest('form').validate();
        }
    };

    function changeHandler() {
        copy(this.id);
        map[this.id].valid(); // trigger validation on newly entered values
    }

    function copy(elementId) {
        map[elementId].val(targetInputs[elementId].val());
    }

};