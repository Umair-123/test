/// <reference path="../../Vista.js"/>
/// <reference path="../../../Culture/globalize.js"/>
/// <reference path="../../Utilities/Utilities.js"/>
/// <reference path="Base.js"/>
/// <reference path="../Calendar.js"/>
(function () {
    'use strict';

    Vista.QuickTickets.TimeView = function (container) {
        Vista.QuickTickets.BaseView.call(this, container);
    };

    Vista.QuickTickets.TimeView.prototype = Object.create(Vista.QuickTickets.BaseView.prototype);
    Vista.QuickTickets.TimeView.prototype.template = '<span class="item selectable" data-id="{0}"><span class="name">{1}</span></span>';
    Vista.QuickTickets.TimeView.prototype.anyText = Vista.Lang.QuickTickets.TimeAny;

    Vista.QuickTickets.TimeView.prototype.display = function (data) {
        this.maxDate = data.MaxDate;
        this.minDate = data.MinDate;

        data = data.Filters;

        Vista.QuickTickets.BaseView.prototype.display.call(this, data);
    };

    Vista.QuickTickets.TimeView.prototype.format = function () {
        var calendar = this.buildCalendar(this.maxDate);

        var fixed = $(this.columnTemplate);
        fixed.append(this.getAnyItem());
        fixed.append(this.formatItem({ Id: 'Day', Name: Vista.Lang.QuickTickets.TimeDay })); 
        fixed.append(this.formatItem({ Id: 'Evening', Name: Vista.Lang.QuickTickets.TimeEvening }));

        return [calendar, fixed];
    };

    Vista.QuickTickets.TimeView.prototype.clearSelection = function () {
        Vista.QuickTickets.BaseView.prototype.clearSelection.call(this, true);
        this.calendar.reset(false);
    };

    Vista.QuickTickets.TimeView.prototype.getSelection = function () {
        var selected = Vista.QuickTickets.BaseView.prototype.getSelection.call(this);
        var selectedDate = this.calendar.isToday() ? Vista.Lang.QuickTickets.Today : Globalize.format(this.calendar.getDate(), 'M');
        selected.splice(0, 0, { Id: this.calendar.getDate(), Name: selectedDate });
        return selected;
    };

    Vista.QuickTickets.TimeView.prototype.buildCalendar = function () {
        var calendarColumn = $(this.columnTemplate);
        this.calendar = new Vista.QuickTickets.Calendar(calendarColumn, {
            maxDate: this.maxDate,
            minDate: this.minDate,
            change: $.proxy(this.calendarChange, this)
        });
        return calendarColumn;
    };

    Vista.QuickTickets.TimeView.prototype.calendarChange = function () {
        this.container.trigger(this.changeEvent);
    };
})();
