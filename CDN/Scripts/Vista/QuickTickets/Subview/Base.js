/// <reference path="../../Vista.js"/>
/// <reference path="../../Scrollbox.js"/>
/// <reference path="../../Utilities/Utilities.js"/>

(function () {
    'use strict';
    Vista.QuickTickets.BaseView = function (container) {
        this.container = container;
        this.container.on('click', '.item', { instance: this }, this.onItemClick);

        this.selected = [];
    };

    Vista.QuickTickets.BaseView.prototype.columnTemplate = '<span class="column"></span>';
    Vista.QuickTickets.BaseView.prototype.getAnyItem = function () {
        return $(this.formatItem({ Id: '', Name: this.anyText })).addClass('any unique selected');
    };
    Vista.QuickTickets.BaseView.prototype.changeEvent = 'selectionchange.qtsub';

    Vista.QuickTickets.BaseView.prototype.display = function (data) {
        this.data = data;
        this.container.append.apply(this.container, this.format(data));
        this.container.scrollbox({ step: 432 }); // 2 columns wide
    };

    Vista.QuickTickets.BaseView.prototype.format = function () {
        var items = [],
            i;
        items.push(this.getAnyItem());

        for (i = 0; i < this.data.length; i++) {
            items.push(this.formatItem(this.data[i]));
        }

        return items;
    };

    Vista.QuickTickets.BaseView.prototype.formatItem = function (item) {
        return Vista.Utilities.format(this.template, item.Id, item.Name);
    };

    Vista.QuickTickets.BaseView.prototype.destroy = function () {
        /// <summary>Cleanup function. Unbinds event and destroy controls.</summary>
        this.container.scrollbox('destroy');
        this.container.unbind();
        this.container.empty();
    };

    Vista.QuickTickets.BaseView.prototype.filter = function (phrase) {
        if (phrase === '') {
            this.container.find('.filtered').removeClass('filtered');
        }
        else {
            var searchRegex = new RegExp(phrase, 'i');

            this.container.find('.item').each(function (i, element) {
                element = $(element);

                if (element.is('.any') || !searchRegex.test(element.find('.name').text())) {
                    element.addClass('filtered');
                }
                else {
                    element.removeClass('filtered');
                }

            });
        }

        this.container.scrollbox('refresh');
    };

    Vista.QuickTickets.BaseView.prototype.clearSelection = function (suppressEvent) {
        this.container.find('.any').addClass('selected');
        if (!this.selected.length) return;

        for (var i = 0; i < this.selected.length; i++) {
            this.selected[i].removeClass('selected');
        }

        this.selected.length = 0;
        if (!suppressEvent) this.container.trigger(this.changeEvent);
    };

    Vista.QuickTickets.BaseView.prototype.getSelection = function () {
        if (this.selected.length === 0) {
            var any = this.container.find('.selected');
            if (any.length) return [{ Name: any.find('.name').text()}];
        }

        return $.map(this.selected, function (element) {
            return { Id: element.attr('data-id'), Name: element.find('.name').text() };
        });
    };

    Vista.QuickTickets.BaseView.prototype.onSelectionChange = function (handler) {
        this.container.bind(this.changeEvent, handler);
    };

    Vista.QuickTickets.BaseView.prototype.formatColumns = function (items) {
        /// <summary>Formats items into columns</summary>

        var rowPerColumn = 4;
        var columns = [];
        var columnCount = Math.ceil(items.length / rowPerColumn);

        for (var k = 0; k < columnCount; k++) {
            var column = $(this.columnTemplate);
            for (var l = 0; l < rowPerColumn; l++) {
                var index = rowPerColumn * k + l;
                if (index < items.length) {
                    column.append(items[index]);
                }
                else {
                    break;
                }
            }
            columns.push(column);
        }

        return columns;
    };

    Vista.QuickTickets.BaseView.prototype.onItemClick = function (e) {
        var item = $(this);
        var instance = e.data.instance;

        if (item.hasClass('selected')) {
            if (item.hasClass('any')) return;

            item.removeClass('selected');
            var i;
            for (i = 0; i < instance.selected.length; i++) {
                if (instance.selected[i].is(item)) {
                    break;
                }
            }

            instance.selected.splice(i, 1);

            if (item.hasClass('unique') || !instance.selected.length) { // nothing else selected
                instance.container.find('.any').addClass('selected');
            }
        }
        else {
            item.addClass('selected');
            if (item.hasClass('unique')) {
                for (var j = 0; j < instance.selected.length; j++) {
                    instance.selected[j].removeClass('selected');
                }
                instance.selected.length = 0;
            }
            else {
                instance.container.find('.any').removeClass('selected');
            }

            if (!item.hasClass('any'))
                instance.selected.splice(0, 0, item);
        }

        instance.container.trigger(instance.changeEvent);
    };
})();
