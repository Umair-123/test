/// <reference path="../../Culture/globalize.js"/>
/// <reference path="../Vista.js"/>
(function () {
    'use strict';

    Vista.QuickTickets.Calendar = function (container, options) {
        var defaultOptions = {
            change: function () { },
            maxDate: undefined,
            minDate: undefined
        };

        this.options = $.extend(defaultOptions, options);

        this.options.minDate = this.options.minDate || new Date();
        this.options.minDate.setHours(0);
        this.options.minDate.setMinutes(0);
        this.options.minDate.setSeconds(0);
        this.options.minDate.setMilliseconds(0);

        if (this.options.maxDate) {
            this.options.maxDate.setHours(0);
            this.options.maxDate.setMinutes(0);
            this.options.maxDate.setSeconds(0);
            this.options.maxDate.setMilliseconds(0);
        }

        var template = '<div class="calendar-container">' +
                           '<span class="calendar-left-arrow"></span>' +
                           '<div class="calendar" tabindex="1">' +
                               '<span class="calendar-month"></span>' +
                               '<span class="calendar-day"></span>' +
                               '<span class="calendar-footer"></span>' +
                           '</div>' +
                           '<span class="calendar-right-arrow"></span>' +
                       '</div>';

        this.container = container.find('.calendar-container');

        this.calendar = $(template).appendTo(container)
                                   .find('.calendar')
                                   .click(function () {
                                       this.focus();
                                   });

        this.month = container.find('.calendar-month');
        this.day = container.find('.calendar-day');
        this.footer = container.find('.calendar-footer');
        this.leftArrow = container.find('.calendar-left-arrow');
        this.rightArrow = container.find('.calendar-right-arrow');

        this.calendar.keydown($.proxy(function (e) {
            switch (e.which) {
                case 37: // left
                    return !this.decrement();
                case 39: // right
                    return !this.increment();
                case 27: // esc
                    this.reset();
                    return false;
            }
        }, this));

        this.calendar.mousewheel($.proxy(function (e, delta, deltaX, deltaY) {
            if (deltaY === 1) {
                return !this.decrement();
            }
            else if (deltaY === -1) {
                return !this.increment();
            }
        }, this));

        this.leftArrow.click($.proxy(function (e) { e.preventDefault(); e.stopPropagation(); this.decrement(); }, this));
        this.rightArrow.click($.proxy(function (e) { e.preventDefault(); e.stopPropagation(); this.increment(); }, this));

        this.reset(true);
    };

    Vista.QuickTickets.Calendar.prototype.isToday = function () {
        var today = new Date();
        return this.date.getDate() === today.getDate() &&
           this.date.getMonth() === today.getMonth() &&
           this.date.getYear() === today.getYear();
    };

    Vista.QuickTickets.Calendar.prototype.printDate = function (suppressEvents) {
        this.month.text(Globalize.format(this.date, 'MMMM'));
        this.day.text(Globalize.format(this.date, 'dd'));

        if (this.isToday()) {
            this.footer.text(Vista.Lang.QuickTickets.Today);
        }
        else {
            this.footer.empty();
        }

        if (this.date <= this.options.minDate) {
            this.leftArrow.css('visibility', 'hidden');
        }
        else {
            this.leftArrow.css('visibility', '');
        }

        if (this.date >= this.options.maxDate) {
            this.rightArrow.css('visibility', 'hidden');
        }
        else {
            this.rightArrow.css('visibility', '');
        }

        if (!suppressEvents) this.options.change();
    };

    Vista.QuickTickets.Calendar.prototype.increment = function () {
        if (this.date >= this.options.maxDate) return false;
        this.date.setDate(this.date.getDate() + 1);
        this.printDate();

        return true;
    };

    Vista.QuickTickets.Calendar.prototype.reset = function (suppressEvents) {
        /// <summary>Resets the calendar to today's date.</summary>
        /// <param name="suppressEvents" type="Boolean">True to suppress change handler being called.</param>

        this.date = new Date(this.options.minDate);
        this.date.setHours(0);
        this.date.setMinutes(0);
        this.date.setSeconds(0);
        this.date.setMilliseconds(0);
        this.printDate(suppressEvents);
    };

    Vista.QuickTickets.Calendar.prototype.decrement = function () {
        if (this.date <= this.options.minDate) return false;

        this.date.setDate(this.date.getDate() - 1);
        this.printDate();
        return true;
    };

    Vista.QuickTickets.Calendar.prototype.getDate = function () {
        return new Date(this.date);
    };
})();
