/// <reference path="../../Vista.js"/>
/// <reference path="../../../Culture/globalize.js"/>
/// <reference path="../../Utilities/Utilities.js"/>
/// <reference path="Time.js"/>
/// <reference path="Base.js"/>
/// <reference path="../Calendar.js"/>
(function () {
    'use strict';

    Vista.QuickTickets.SessionView = function (container) {
        Vista.QuickTickets.TimeView.call(this, container);
    };

    Vista.QuickTickets.SessionView.prototype = Object.create(Vista.QuickTickets.TimeView.prototype);
    Vista.QuickTickets.SessionView.prototype.template = '<span class="item selectable unique" data-id="{0}"><span class="name">{1}</span></span>';
    Vista.QuickTickets.SessionView.prototype.anyText = Vista.Lang.QuickTickets.SessionAny;

    Vista.QuickTickets.SessionView.prototype.display = function (data) {
        // calculates date range and normalizes format
        var maxDate,
            minDate;
        for (var i = 0; i < data.length; i++) {
            if (data[i].Time) {
                data[i].Name = Globalize.format(data[i].Time, Vista.Formatting.TimeFormat);

                if (data[i].SoldOut) continue; // invalid sessions should not be considered in time range

                if (typeof maxDate === 'undefined' || data[i].Time > maxDate)
                    maxDate = data[i].Time;

                if (typeof minDate === 'undefined' || data[i].Time < minDate)
                    minDate = data[i].Time;
            }
        }

        if (typeof maxDate === 'undefined') {
            maxDate = new Date(); // if no date range, just limit to today. we don't want users to scroll forever.
        }

        this.minDate = minDate;
        this.maxDate = maxDate;

        Vista.QuickTickets.BaseView.prototype.display.call(this, data);
    };

    Vista.QuickTickets.SessionView.prototype.format = function () {
        var calendar = this.buildCalendar(this.maxDate);

        this.items = [];
        for (var i = 0; i < this.data.length; i++) {
            var item = $(this.formatItem(this.data[i])).data('date', this.data[i].Time);

            if (this.data[i].SoldOut)
                item.removeClass('item').addClass('label invalid');

            this.items.push(item);
        }

        this.static = calendar;

        // hack: dynamic content is added against the calendar
        // need the calendar in the DOM to add stuff after it
        this.container.append(calendar);
        this.refresh();
        return [];
    };

    Vista.QuickTickets.SessionView.prototype.refresh = function () {
        var calendarDate = this.calendar.getDate();
        var hasAvailableSession = false;

        var sessions = [];
        $.each(this.items, function (i, element) {
            element.detach();
            var valid = element.data('date').getDate() === calendarDate.getDate() &&
                        element.data('date').getMonth() === calendarDate.getMonth() &&
                        element.data('date').getYear() === calendarDate.getYear();

            if (valid) {
                hasAvailableSession |= !element.hasClass('invalid');
                sessions.push(element);
            }
        });

        this.static.nextAll().remove();
        if (hasAvailableSession) {
            this.static.after.apply(this.static, this.formatColumns(sessions));
        }
        else {
            var text = sessions.length ? Vista.Lang.QuickTickets.SoldOutSessions : Vista.Lang.QuickTickets.NoSessions;
            var error = $(this.formatItem({
                Name: Vista.Utilities.format(text, Globalize.format(calendarDate, 'D'))
            })).removeClass('item').addClass('label');

            error.css({ width: 'auto', display: 'inline-block' }).find('.name').css('width', 'auto');

            this.static.after(error);
        }
    };

    Vista.QuickTickets.SessionView.prototype.calendarChange = function () {
        this.refresh();
        this.container.scrollbox('refresh');
        this.container.trigger(this.changeEvent);
    };
})();
