/// <reference path="../Vista.js"/>
/// <reference path="../Utilities/Utilities.js"/>
/// <reference path="../../Culture/globalize.js"/>
/// <reference path="QuickTickets.js"/>
/// <reference path="Calendar.js"/>
/// <reference path="CategoryFormatter.js"/>
/// <reference path="Stage.js"/>

Vista.QuickTickets.SelectionView = function (container) {
    'use strict';
    var events = {
        change: 'selectionchange.qtselect'
    };

    var selection = container.find('.selection');
    var nextButton = container.find('.next');
    var clearButton = container.find('.clear');
    var searchInput = container.find('.search input');
    var clearSearchButton = container.find('.search button');
    var searchPlaceholder = searchInput.attr('placeholder');

    var subview;
    var defaultDate;

    clearButton.click(onClearClick);
    clearSearchButton.click(clearSearch);

    searchInput.keydown(onSearchKeydown);
    searchInput.keyup(onSearch);

    this.displaySelection = function (stage, data) {
        var hasDate;
        enable();

        switch (stage) {
            case Vista.QuickTickets.Stage.Cinema:
                subview = new Vista.QuickTickets.CinemaView(selection);
                break;
            case Vista.QuickTickets.Stage.Type:
                subview = new Vista.QuickTickets.TypeView(selection);
                break;
            case Vista.QuickTickets.Stage.Time:
                hasDate = true;
                subview = new Vista.QuickTickets.TimeView(selection);
                break;
            case Vista.QuickTickets.Stage.Session:
                hasDate = true;
                subview = new Vista.QuickTickets.SessionView(selection);
                break;
            default:
                subview = new Vista.QuickTickets.MovieView(selection);
        }

        subview.display(data);
        subview.onSelectionChange(onSelectionChange);
        if (hasDate) {
            defaultDate = subview.getSelection()[0].Id;
        }
        else {
            defaultDate = null;
        }
    };

    this.onNextClick = function (handler) {
        nextButton.click(handler); // assume one
    };

    this.onSelectionChange = function (handler) {
        container.bind(events.change, handler);
    };

    this.getSelection = function () {
        return subview.getSelection();
    };

    this.showLoading = function () {
        selection.addClass('container-loading');
    };

    this.clear = function () {
        onClearClick();
    };

    this.disable = function () {
        disable();
    };

    this.setNextText = function (text) {
        nextButton.find('span').text(text);
        nextButton.show();
    };

    this.disableNext = function () {
        nextButton.hide();
    };

    this.showSearch = function () {
        searchInput.show();
    };

    this.hideSearch = function () {
        searchInput.hide();
    };

    function clearSearch() {
        searchInput.val('');
        onSearch();
    }

    function onSearchKeydown(e) {
        if (e.keyCode === 27) { // esc
            if (searchInput.val() !== '') {
                clearSearch(); // this causes onSearch to be called twice
            }
            else {
                searchInput.blur();
            }
        }
    }

    // TODO: this fires on any key (e.g. arrow, enter, ctrl, etc)
    function onSearch() {
        var filter = searchInput.val();

        if (filter !== '') {
            clearSearchButton.show();
        }
        else {
            clearSearchButton.hide();
        }

        subview.filter(filter);
    }

    function onClearClick() {
        subview.clearSelection();
        clearButton.hide();
    }

    function onSelectionChange() {
        var defaultsSelected,
            selected;

        selected = $.grep(subview.getSelection(), function (element) {
            return element.Id;
        });

        if (defaultDate) {
            defaultsSelected = selected[0].Id.getTime() === defaultDate.getTime() && selected.length === 1;
        }
        else {
            defaultsSelected = selected.length === 0;
        }

        if (!defaultsSelected) {
            clearButton.css('display', '');
        }
        else {
            clearButton.hide();
        }

        container.trigger(events.change);
    }

    function enable() {
        selection.removeClass('container-loading');
        nextButton.show();
        clearButton.hide();
        searchInput.removeAttr('disabled');
        searchInput.attr('placeholder', searchPlaceholder);
    }

    function disable() {
        selection.removeClass('container-loading');
        searchInput.val('');
        searchInput.attr('disabled', 'disabled');
        searchInput.attr('placeholder', '');
        searchInput.css('display', '');
        clearSearchButton.hide();
        if (subview) subview.destroy();
        nextButton.hide();
        clearButton.hide();
    }

};