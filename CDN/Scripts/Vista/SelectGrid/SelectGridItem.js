/// <reference path="../../jquery-1.8.1.min.js" />
/// <reference path="../Vista.js"/>
/// <reference path="../Utilities/FormatUtilities.js" />
/// <reference path="SelectGridSelector.js"/>

(function () {
    'use strict';

    var events = { change: 'selectgriditemchange' },
        activeItem;

    $('body').on('click', resetActive);

    Vista.SelectGrid.SelectGridItem = function (container, selector) {
        /// <param name="container" type="jQuery" />
        /// <param name="selector" type="Vista.SelectGrid.SelectGridSelector" />
        this.container = container;
        this.display = container.find('.select-grid-count');
        this.input = container.find('select').hide();
        this.selector = selector;
        this.finalValue = 0;

        this.input.on('change', $.proxy(onChange, this));
        this.container.on('click', $.proxy(onClick, this));

        this.description = container.find('.select-grid-description');
        this.total = container.find('.select-grid-total');
    };

    Vista.SelectGrid.SelectGridItem.Events = events;

    Vista.SelectGrid.SelectGridItem.prototype.getCode = function () {
        /// <returns type="String" />
        return this.input.data('code');
    };

    Vista.SelectGrid.SelectGridItem.prototype.getData = function () {
        /// <returns type="Object" />
        return this.input.data();
    };

    Vista.SelectGrid.SelectGridItem.prototype.getDescription = function () {
        /// <returns type="String" />
        return this.description.text();
    };

    Vista.SelectGrid.SelectGridItem.prototype.getCount = function () {
        /// <returns type="Number" />
        return +this.input.val();
    };

    Vista.SelectGrid.SelectGridItem.prototype.getWeigh = function () {
        /// <returns type="Number" />
        return +(this.input.data('weigh') || 1);
    };

    Vista.SelectGrid.SelectGridItem.prototype.getValue = function () {
        /// <returns type="Number" />
        return +this.input.data('value');
    };

    Vista.SelectGrid.SelectGridItem.prototype.setTotal = function (value) {
        /// <param name="value" type="Number" />
        this.total.text(Vista.FormatUtilities.formatCurrency(value, true /* display currency */));
    };

    Vista.SelectGrid.SelectGridItem.prototype.setActive = function () {
        activeItem = this;

        this.container.addClass('select-grid-selected').removeClass('select-grid-active');

        // Cache current value in case user clicks out
        this.finalValue = this.input.val();
        this.input.val(this.input.find('option:first').val());
        notifyChange.call(this);

        this.display.hide();

        // TODO: this causes performance issues always moving the container around
        // perhaps better to do an instance per item
        this.selector.setSource(this.input);
        this.selector.setWeigh(this.getWeigh());
        this.container.append(this.selector.show());
    };

    Vista.SelectGrid.SelectGridItem.prototype.setInactive = function () {
        if (this === activeItem) activeItem = undefined;

        this.container.removeClass('select-grid-selected');

        this.selector.hide();

        updateValue.call(this);
    };

    Vista.SelectGrid.SelectGridItem.prototype.isActive = function () {
        /// <returns type="Boolean" />
        return this.container.hasClass('select-grid-selected');
    };

    Vista.SelectGrid.SelectGridItem.prototype.clear = function () {
        this.finalValue = this.input.find('option:first').val(); 
    };

    function onClick(e) {
        /// <param name="e" type="jQuery.Event" />
        e.stopPropagation();

        var target = $(e.target);

        // select clicks leak up when we have max > 10
        if (target.is('select')) return;

        if (target.is('.icon')) { // clear clicked
            this.clear();

            if (this.isActive()) { 
                this.setInactive();
            }
            else {
                updateValue.call(this);
            }
        }
        else {
            if (this.isActive()) {
                this.setInactive();
            }
            else {
                resetActive();
                this.setActive();
            }
        }
    }

    function onChange() {
        // commit the value and deactivate the item
        // setInactive will chain into a notify call
        this.finalValue = this.input.val();
        this.setInactive();
    }

    function resetActive() {
        if (activeItem) activeItem.setInactive();
        activeItem = undefined;
    }

    function notifyChange() {
        /// <summary>Notify any listeners of a value change.</summary>
        this.container.trigger(events.change);
    }

    function updateValue() {
        this.input.val(this.finalValue);

        if (!this.display.length) {
            this.display = $('<div></div>').addClass('select-grid-count').hide().appendTo(this.container);
        }

        if (this.input.val() > 0) {
            this.container.addClass('select-grid-active');
            this.display.text(this.input.val());
            this.display.show();
        }
        else {
            this.container.removeClass('select-grid-active');
            this.display.hide();
        }

        notifyChange.call(this);
    }

})();