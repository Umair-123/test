Vista.PlusMinusNumeric = function (containerElement, onValueChangeCallback) {
    ///<summary>
    /// Widget for input fields that can be controlled with plus and minus buttons.
    ///</summary>
    ///<param name="containerElement">
    /// DOMElement wrapper for the plus minus numeric field. Example format of the
    /// of the elements: 
    /// <div class="plus-minus-numeric">
    ///     <button type="button" class="clear"></button> 
    ///     <button type="button" class="plus"></button>
    ///     <input type="text" min="0" max="10" value="0" />
    ///     <button type="button" class="minus"></button>
    /// </div>
    /// Note: container can be any element type.
    /// Note: min and max attributes on the input field are optional.
    /// Note: clear button is optional.
    ///</param>
    ///<param name="onValueChangeCallback">
    /// Callback function for changes in value. Will be passed three parameters;
    /// function (containerElement, newValue, previousValue) { }.
    ///</param>

    'use strict';


    var $containerElement,
        $inputElement,
        $plusButtonElement,
        $minusButtonElement,
        minValue = Number.NEGATIVE_INFINITY,
        maxValue = Number.POSITIVE_INFINITY,
        currentValue;

    (function () {

        $containerElement = $(containerElement);

        loadElementsFromDOM();
        bindDOMEventHandlers();

        currentValue = getValueFromInputField();
    })();

    ///<summary>Returns a Number value from the input field.</summary>
    this.getValue = function () {
        return currentValue;
    };

    function loadElementsFromDOM() {
        $inputElement = $containerElement.find('input');
        $plusButtonElement = $containerElement.find('.plus');
        $minusButtonElement = $containerElement.find('.minus');


        var minVal = Number($inputElement.attr('min'));
        var maxVal = Number($inputElement.attr('max'));

        if (!isNaN(minVal))
            minValue = minVal;

        if (!isNaN(maxVal))
            maxValue = maxVal;
    }

    function bindDOMEventHandlers() {

        //suppress enter key on input field to prevent form submission 
        suppressEnterKeydownEvent($inputElement);

        $plusButtonElement.on('click', increment);
        $minusButtonElement.on('click', decrement);
        $inputElement.on('change', onInputChange);
    }


    // DOM EVENT HANDLERS
    function increment() {
        var value = getValueFromInputField();

        setInputFieldValue(value + 1);
    }

    function decrement() {
        var value = getValueFromInputField();

        setInputFieldValue(value - 1);
    }

    function onInputChange() {
        var value = getValueFromInputField();

        // pump back through this method which updates the DOM to ensure input field value is the numeric value, not padded with spaces etc.
        // also fires callback
        setInputFieldValue(value);
    }

    function suppressEnterKeydownEvent($inputField) {
        var enterKeyCode = 13;

        $inputField.keydown(function (e) {
            if (e.keyCode === enterKeyCode) {
                return false;
            }
            return true;
        });
    }


    // INTERNAL IMPLEMENTATION
    function getValueFromInputField() {
        return Number($inputElement.val());
    }

    function setInputFieldValue(value) {

        if (!isValidInteger(value)) {
            $inputElement.val(currentValue); // reset value back to original
            return;
        }


        // update DOM
        $inputElement.val(value);

        notifyListener(value);
    }

    function isValidInteger(value) {

        if (isNaN(value))
            return false;

        // value must be an integer
        if (value % 1 !== 0)
            return false;

        if (value < minValue || value > maxValue)
            return false;

        return true;
    }

    function notifyListener(value) {
        // update local value
        var previousValue = currentValue;
        currentValue = value;

        if (typeof onValueChangeCallback === 'function')
            onValueChangeCallback(containerElement, value, previousValue);
    }
};
