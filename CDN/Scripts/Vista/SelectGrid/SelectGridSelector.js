/// <reference path="../../jquery-1.8.1.min.js" />
/// <reference path="../Vista.js"/>

Vista.SelectGrid.SelectGridSelector = function () {
    /// <param name="max" type="Number" />
    'use strict';

    var container = $('<div class="select-grid-selector"></div>'),
        selected = $(),
        source = $(),
        max = 10,
        weigh = 1,
        jqShow = $.proxy(container.show, container),
        jqHide = $.proxy(container.hide, container);

    (function () {
        for (var i = 1; i <= 10; i++) {
            container.append($('<span></span>').data('value', i).text(i));
        }
    })();

    $.extend(this, container);

    container.on('click', 'span', function (e) {
        /// <param name="e" type="jQuery.Event" />
        e.stopPropagation();

        selected = $(this);

        if (selected.is('.disabled')) {
            e.preventDefault();
        }
        else {
            source.val(+selected.data('value')).change();
        }
    });

    this.setMax = function (maxValue) {
        /// <param name="maxValue" type="Number" />
        max = maxValue;

        if (container.is(':visible') || source.is(':visible'))
            refresh();
    };

    this.setSource = function (selectElement) {
        /// <param name="selectElement" type="jQuery" />
        if (source) source.hide();
        source = selectElement;
    };

    this.setWeigh = function (value) {
        /// <param name="value" type="Number" />
        weigh = value;
    };

    this.show = function () {
        /// <returns type="Vista.SelectGrid.SelectGridSelector" />
        refresh();

        return this;
    };

    this.hide = function () {
        /// <returns type="Vista.SelectGrid.SelectGridSelector" />
        source.hide();
        jqHide();

        return this;
    };

    function refresh() {
        if (max / weigh <= 10) {
            source.hide();
            jqShow();

            container.find('span').each(function () {
                var element = $(this);

                element[(element.data('value') * weigh) > max? 'addClass' : 'removeClass']('disabled');
            });
        }
        else {
            jqHide();
            source.show();

            // IE does not allow show/hide of option, must remove
            var removedOptions = source.data('selectgridoptions');
            if (!removedOptions) {
                removedOptions = [];
                source.data('selectgridoptions', removedOptions);
            }

            source.append(removedOptions);
            removedOptions.length = 0;
            source.find('option').each(function () {
                var element = $(this);
                if ((element.val() * weigh) > max) {
                    element.detach();
                    removedOptions.push(element);
                }
            });
        }
    }

};
