/// <reference path="../Vista.js"/>

Vista.Validation = (function () {
    'use strict';

    return {
        resetForm: function ($form) {
            // the default resetForm doesn't handle our validation icons

            var validator = $form.data('validator');
            if (!validator) return;

            validator.resetForm();

            resetValidationIcon($form);
        },

        resetElements: function ($elements) {
            // remove the markup associated with validation errors
            // note this is not as clean as resetForm
            var validator = $elements.closest('form').data('validator');
            if (!validator) return;

            $elements.removeClass(validator.settings.errorClass).removeAttr('title');
            resetValidationIcon($elements.parent());
        },
        
        configureForms: function (formsToConfigure) {
            configureForms(formsToConfigure);
        }

    };

    function resetValidationIcon(parent) {
        parent.find('.field-validation-error').removeClass('field-validation-error').addClass('field-validation-valid');
    }
    function configureForms(formsToConfigure) {
        $(formsToConfigure).each(function (index, value) {
            overrideErrorPlacement(value);
            // Remove any validation text that may have been inserted following server side mvc validation.
            $(value).find('.field-validation-error').each(function () {
                $(this).attr('title', $(this).html());
                $(this).html("");
            });
        });
    }
    
    function overrideErrorPlacement(form) {
        /// <summary>
        /// Override jquery validates errorPlacement function with our own 
        /// implementation, that sets the tooltips on the validated field and icon.
        ///</summary>
        var validator = $(form).data('validator');

        if (!validator) {
            return;
        }

        validator.settings.errorPlacement = errorPlacement;
        validator.settings.success = success;
    }

    function errorPlacement(error, element) {
        var parentForm = $(element[0].form);
        // TODO: escape the name
        var container = parentForm.find('[data-valmsg-for="' + element[0].name + '"]'); // Try and find existing container
        var errorMessage = error.text();

        container.removeClass('field-validation-valid').addClass('field-validation-error');

        if (container.data('valmsg-type') === 'inner-text') {
            container.text(errorMessage);
        }
        else {
            container.attr('title', errorMessage);


            // Updating a select list on IE causes it to close
            // This could trigger when the dropdown is clicked, so always updating it will cause it to close straight away
            if (errorMessage && element.attr('title') !== errorMessage)
                element.attr('title', errorMessage);
        }

        error.data('unobtrusiveContainer', container);
    }

    function success(error, element) {
        var container = error.data("unobtrusiveContainer"),
            replace = $.parseJSON(container.attr("data-valmsg-replace"));

        element = $(element); // note: native html object, unlike errorPlacement 

        // Remove only if we need to, this closes select lists on IE
        if (element.attr('title'))
            element.removeAttr('title');

        if (container) {
            container.addClass("field-validation-valid").removeClass("field-validation-error");
            container.removeAttr('title');

            error.removeData("unobtrusiveContainer");

            if (replace) {
                container.empty();
            }
        }
    }

})();


(function() {
    /// <summary>Extend unobtrusive adapters.</summary>

    'use strict';

    // Copy pasted from jquery.validate.unobtrusive

    function getModelPrefix(fieldName) {
        return fieldName.substr(0, fieldName.lastIndexOf(".") + 1);
    }

    function escapeAttributeValue(value) {
        // As mentioned on http://api.jquery.com/category/selectors/
        return value.replace(/([!"#$%&'()*+,./:;<=>?@\[\\\]^`{|}~])/g, "\\$1");
    }

    function requiredClient(value, element) {
        element = $(element);
        return element.is(':disabled') || element.val(); // not quite equivalent to the normal required
    }
    
    $.validator.addMethod('requiredclient', requiredClient);

    //For checkboxlist we have a special rule 'require-one' that works for a required check
    $.validator.addMethod('require-one', function (value, element) {        
        var input = $(element);        
        var message = input.attr("data-val-require-one");
        if (!message) {
            message = 'Please check at least one box.';
        }
        $.validator.messages["require-one"] = message;
        var checkBoxList = input.closest(".checkbox-list");
        var elements = checkBoxList.find('.require-one:checked');
        var selectedCount = elements.size();
        return selectedCount > 0;
    });


    $.validator.unobtrusive.adapters.addBool('requiredclient');

    // for checkboxes, which are filtered out of the normal required rule
    $.validator.unobtrusive.adapters.add('mandatory', function(options) {
        options.rules['required'] = true;
        if (options.message) {
            options.messages['required'] = options.message;
        }
    });

    $.validator.unobtrusive.adapters.add('requiredif', ['others'], function(options) {
        // clone of jquery.validate.unobtrusive's required rule, with added handling for dependency expression
        if (options.element.tagName.toUpperCase() !== "INPUT" || options.element.type.toUpperCase() !== "CHECKBOX") {
            if (!options.params.others) return;

            var expressions = [],
                prefix = getModelPrefix(options.element.name),
                others = options.params.others.split(',');

            for (var i = 0; i < others.length; i++) {
                // adapted from equalto
                var other = others[i],
                    fullOtherName = prefix + other,
                    element = $(options.form).find(":input[name='" + escapeAttributeValue(fullOtherName) + "']");

                expressions.push('#' + element.attr('id') + ':filled'); // TODO: id or name?
            }

            options.rules['required'] = expressions.join(',');
            if (options.message) {
                options.messages['required'] = options.message;
            }
        }
    });

    $.validator.unobtrusive.adapters.add('requiredbyrule', ['isrequired'], function (options) {
        // clone of jquery.validate.unobtrusive's required rule, with added handling for dependency expression
        if (options.element.tagName.toUpperCase() !== "INPUT" || options.element.type.toUpperCase() !== "CHECKBOX") {
            if (!options.params.isrequired) return;

            var isRequired = options.params.isrequired === 'True';
            if (isRequired) {
                options.rules['required'] = true;
                if (options.message) {
                    options.messages['required'] = options.message;
                }
            }
        }
    });
    
    
    $.validator.addMethod('datetimemin', function (value, element, params) {
        var min = Date.parse(params[0]),
            date = Date.parse(value);
        return date >= min;
    });

    $.validator.addMethod('datetimeminoptional', function (value, element, params) {
        if (!value || value == '') {
            return true;
        }
        var min = Date.parse(params[0]),
            date = Date.parse(value);
        return date >= min;
    });


    $.validator.addMethod('datetimemax', function (value, element, params) {
        var max = Date.parse(params[0]),
            date = Date.parse(value);
        return date <= max;
    });

    $.validator.addMethod('datetimemaxoptional', function (value, element, params) {
        if (!value || value == '') {
            return true;
        }
        var max = Date.parse(params[0]),
            date = Date.parse(value);
        return date <= max;
    });

    $.validator.addMethod('datetimerange', function (value, element, params) {
        var min = Date.parse(params[0]),
            max = Date.parse(params[1]),
            date = Date.parse(value);
        return (date >= min && date <= max);
    });

    $.validator.addMethod('datetimerangeoptional', function (value, element, params) {
        if (!value || value == '') {
            return true;
        }
        var min = Date.parse(params[0]),
            max = Date.parse(params[1]),
            date = Date.parse(value);
        return (date >= min && date <= max);
    });

    $.validator.unobtrusive.adapters.addMinMax('datetimerange', 'datetimemin', 'datetimemax', 'datetimerange');
    $.validator.unobtrusive.adapters.addMinMax('datetimerangeoptional', 'datetimeminoptional', 'datetimemaxoptional', 'datetimerangeoptional');
})();

$(function () {
    Vista.Validation.configureForms($("form"));
});

