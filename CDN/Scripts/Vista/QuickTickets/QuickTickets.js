/// <reference path="../Vista.js" />
/// <reference path="../Utilities/Utilities.js"/>
/// <reference path="Templates/Base.js" />
/// <reference path="Templates/Movie.js" />
/// <reference path="Templates/Cinema.js" />
/// <reference path="Templates/Type.js" />
/// <reference path="Templates/Time.js" />
/// <reference path="Templates/Session.js" />
/// <reference path="QuickTicketsData.js" />
/// <reference path="HomeView.js" />
/// <reference path="DetailsView.js" />
/// <reference path="SelectionView.js" />
/// <reference path="Stage.js" />

Vista.QuickTickets.Main = function (homeView, detailsView, selectionView, dataService) {
    'use strict';

    var lang = Vista.Lang.QuickTickets,
        currentStage,
        defaultStageOrder = [Vista.QuickTickets.Stage.Movie,
                             Vista.QuickTickets.Stage.Cinema,
                             Vista.QuickTickets.Stage.Type,
                             Vista.QuickTickets.Stage.Time],
        currentStageOrder = [],
        filters = {},
        stages = {};

    stages[Vista.QuickTickets.Stage.Movie] = {
        title: lang.Movies,
        nextText: lang.MovieNext,
        searchable: true
    };
    stages[Vista.QuickTickets.Stage.Cinema] = {
        title: lang.Cinemas,
        nextText: lang.CinemaNext,
        searchable: true
    };
    stages[Vista.QuickTickets.Stage.Type] = {
        title: lang.ShowTypes,
        nextText: lang.ShowTypeNext,
        searchable: false
    };
    stages[Vista.QuickTickets.Stage.Time] = {
        title: lang.Times,
        nextText: lang.TimeNext,
        searchable: false
    };

    homeView.onStageSelect(onStageSelect);
    detailsView.onClose(restartProcess);
    detailsView.onRestartClick(restartProcess);
    detailsView.onCompareClick(onCompareClick);
    selectionView.onSelectionChange(onSelectionChange);
    selectionView.onNextClick(onNextClick);

    function onStageSelect(e, stage) {
        homeView.hide();
        filters = {};
        currentStageOrder = defaultStageOrder.slice();
        currentStageOrder.splice($.inArray(stage, currentStageOrder), 1);
        detailsView.show();
        processToStage(stage);
    }

    function onSelectionChange() {
        updateSelection();
        updateNextButton();
    }

    function onCompareClick() {
        // Slight hack: causes POST logic to trigger in the next handler
        currentStageOrder.length = 0;
        onNextClick();
    }

    function onNextClick() {
        var filter = $.map(selectionView.getSelection(), function (element) { return element.Id; });
        if (isSessionStage()) {
            window.location = Vista.Utilities.format(Vista.Urls.QuickTickets.Ticket,
                                                     filters[Vista.QuickTickets.Stage.Cinema][0],
                                                     filter[1] /* date, session id */);
            return;
        }
        else {
            filters[currentStage] = filter;
        }

        if (currentStageOrder.length) {
            processToStage(currentStageOrder.shift());
        }
        else {
            postForCompare();
        }
    }

    function postForCompare() {
        var filter = getFilters();

        // TODO: extract serialize for form post logic
        var form = $('<form method="post"></form>').attr('action', Vista.Urls.QuickTickets.Compare);

        var qs = '?';
        for (var prop in filter) {
            if (filter.hasOwnProperty(prop)) {
                var property = filter[prop];
                if (property instanceof Array) {
                    for (var i = 0; i < property.length; i++) {
                        qs+=('&' + prop + "=" + property[i]);
                        form.append($('<input type="hidden" />').attr({
                            name: prop,
                            value: property[i]
                        }));
                    }
                }
                else {
                    qs+=('&' + prop + '=' + property);
                    form.append($('<input type="hidden" />').attr({
                        name: prop,
                        value: property
                    }));
                }
            }
        }

        // fallback to POST in case environment issues restrict URL length
        var maxUrlLengthForGet = 1900;
        if (qs.length > maxUrlLengthForGet) {
            $('body').append(form); // IE must have form in document in order to submit
            form.submit();
        } else {
            window.location = Vista.Urls.QuickTickets.Compare + qs;
        }
    }

    function restartProcess() {
        dataService.abortCurrent();
        selectionView.disable();
        detailsView.clear();
        homeView.show();
    }

    function updateSelection() {
        var selection = selectionView.getSelection();
        selection = $.map(selection, function (element) { return element.Name; });
        detailsView.setSelection(currentStage, selection);
    }

    function processToStage(stage) {
        selectionView.disable();
        selectionView.showLoading();
        detailsView.disableCompare();

        currentStage = stage;
        detailsView.setTitle(stages[stage].title);

        loadData(stage);
    }

    function isSessionStage() {
        /// <summary>True if displaying sessions instead of time filters.</summary>
        return currentStage === Vista.QuickTickets.Stage.Time &&
               (filters[Vista.QuickTickets.Stage.Movie] || []).length === 1 &&
               (filters[Vista.QuickTickets.Stage.Cinema] || []).length === 1 &&
               (filters[Vista.QuickTickets.Stage.Type] || []).length === 1;
    }


    function updateNextButton() {
        if (isSessionStage()) {
            var selection = selectionView.getSelection();
            if (selection.length === 2 /* date + time */) {
                selectionView.setNextText(lang.BookNow);
            }
            else {
                selectionView.disableNext();
            }
        }
        else if (currentStageOrder.length) {
            selectionView.setNextText(stages[currentStageOrder[0]].nextText);
        }
        else {
            selectionView.setNextText(lang.Compare);
        }
    }


    function getFilters() {
        /// <summary>Returns the filter object to POST to the server.</summary>
        var timeFilters,
            sessionDate;

        if (filters[Vista.QuickTickets.Stage.Time] && filters[Vista.QuickTickets.Stage.Time].length) {
            sessionDate = Vista.Utilities.formatDateForPost(filters[Vista.QuickTickets.Stage.Time][0]);
            timeFilters = filters[Vista.QuickTickets.Stage.Time].slice(1);
        }

        var postObject = {
            'Movies': filters[Vista.QuickTickets.Stage.Movie],
            'Cinemas': filters[Vista.QuickTickets.Stage.Cinema],
            'ShowTypes': filters[Vista.QuickTickets.Stage.Type],
            'Time': timeFilters,
            'Date': sessionDate
        };

        // Undefined properties gets bound as nulls, leave it off so the default empty array is used instead
        for (var key in postObject) {
            if (postObject.hasOwnProperty(key) && typeof postObject[key] === 'undefined')
                delete postObject[key];
        }

        return postObject;
    }

    function loadData(stage) {
        dataService.abortCurrent();

        var filter = getFilters();

        switch (stage) {
            case Vista.QuickTickets.Stage.Movie:
                dataService.getMoviesAsync(filter, buildLoadHandler(stage));
                break;
            case Vista.QuickTickets.Stage.Cinema:
                dataService.getCinemasAsync(filter, buildLoadHandler(stage));
                break;
            case Vista.QuickTickets.Stage.Type:
                dataService.getTypesAsync(filter, buildLoadHandler(stage));
                break;
            case Vista.QuickTickets.Stage.Time:
                dataService.getTimesAsync(filter, buildLoadHandler(stage));
                break;
        }
    }

    function buildLoadHandler(stage) {
        return function (data) {
            if (stage !== currentStage) return;

            if (stages[stage].searchable) {
                selectionView.showSearch();
            }
            else {
                selectionView.hideSearch();
            }

            if (isSessionStage()) {
                selectionView.displaySelection(Vista.QuickTickets.Stage.Session, data);
            }
            else {
                selectionView.displaySelection(stage, data);
            }

            updateSelection();
            updateNextButton();
            detailsView.enableCompare();
        };
    }

};

// TODO: shouldn't really be starting itself
$(function () {
    var container = $('#quick-tickets');

    if (container.length) {
        var control = new Vista.QuickTickets.Main(
            new Vista.QuickTickets.HomeView(container),
            new Vista.QuickTickets.DetailsView($('#quick-tickets-overlay')),
            new Vista.QuickTickets.SelectionView($('#quick-tickets-selection')),
            new Vista.QuickTickets.Data()
        );
    }
});
