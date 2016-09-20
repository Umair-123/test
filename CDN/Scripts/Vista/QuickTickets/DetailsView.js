/// <reference path="../Vista.js"/>
/// <reference path="../Collapsible.js"/>
/// <reference path="Stage.js"/>

Vista.QuickTickets.DetailsView = function (container) {
    'use strict';
    var events = {
        close: 'close.qtdetails'
    };

    // must be top level to cover all other elements in IE6
    var pageOverlay = $('<div id="page-overlay"></div>').appendTo($('body'));

    var title = container.find('h3 em'),
        restartButton = container.find('.restart'),
        closeButton = container.find('.close'),
        compareButton = container.find('.compare');

    var stages = (function () {
        var moviesTerm = container.find('dl .movies');
        var moviesDef = moviesTerm.next();
        var cinemasTerm = container.find('dl .cinemas');
        var cinemasDef = cinemasTerm.next();
        var typesTerm = container.find('dl .types');
        var typesDef = typesTerm.next();
        var timesTerm = container.find('dl .times');
        var timesDef = timesTerm.next();

        var values = {};

        values[Vista.QuickTickets.Stage.Movie] = {
            term: moviesTerm,
            def: moviesDef,
            control: new Vista.Collapsible(moviesDef)
        };

        values[Vista.QuickTickets.Stage.Cinema] = {
            term: cinemasTerm,
            def: cinemasDef,
            control: new Vista.Collapsible(cinemasDef)
        };

        values[Vista.QuickTickets.Stage.Type] = {
            term: typesTerm,
            def: typesDef,
            control: new Vista.Collapsible(typesDef)
        };

        values[Vista.QuickTickets.Stage.Time] = {
            term: timesTerm,
            def: timesDef,
            control: new Vista.Collapsible(timesDef)
        };

        return values;
    })();

    pageOverlay.click(hideOverlay);
    closeButton.click(hideOverlay);

    this.setTitle = function (titleText) {
        title.text(titleText);
    };

    this.setSelection = function (stage, items) {
        setSelection(stage, items);
    };

    this.clear = function () {
        for (var stage in stages) {
            stages[stage].control.reset();
            stages[stage].term.hide();
            stages[stage].def.hide();
        }
    };

    this.onRestartClick = function (handler) {
        restartButton.click(handler); // assume single binding
    };

    this.onCompareClick = function (handler) {
        compareButton.click(handler); // assume single binding
    };

    this.onClose = function (handler) {
        container.bind(events.close, handler);
    };

    this.disableCompare = function () {
        compareButton.addClass('disabled').attr('disabled', 'disabled');
    };

    this.enableCompare = function () {
        compareButton.removeClass('disabled').removeAttr('disabled');
    };

    this.show = showOverlay;
    this.hide = hideOverlay;

    var previousCategory;
    function setSelection(stage, items) {
        var term = stages[stage].term;
        var definition = stages[stage].def;

        var existing = container.find('dl dt:visible:last');
        if (existing.length) {
            term.insertAfter(existing.next('dd'));
            definition.insertAfter(term);
        }

        term.show();
        definition.show();

        if (previousCategory && previousCategory !== stages[stage].control) previousCategory.collapse();

        stages[stage].control.reset();
        for (var i = 0; i < items.length; i++) {
            stages[stage].control.append(items[i]);
        }

        previousCategory = stages[stage].control;
    }

    function hideOverlay() {
        if (!container.is(':visible')) return;

        container.hide();
        pageOverlay.hide();
        $(window).unbind('resize', adjustOverlay);

        container.trigger(events.close);
    }

    function showOverlay() {
        if (container.is(':visible')) return;

        adjustOverlay();
        $(window).resize(adjustOverlay);
        pageOverlay.show();
        container.show();
    }

    function adjustOverlay() {
        pageOverlay.width($(document).width());
        pageOverlay.height($(document).height());
    }

};