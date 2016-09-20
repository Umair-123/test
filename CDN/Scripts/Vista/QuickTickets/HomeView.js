/// <reference path="../Vista.js"/>
/// <reference path="Stage.js"/>

Vista.QuickTickets.HomeView = function (container) {
    'use strict';
    var events = {
        stageSelect: 'stageselect.qthome' 
    };

    container.find('button').click(onButtonClick);

    var stageMap = {
        movie: Vista.QuickTickets.Stage.Movie,
        cinema: Vista.QuickTickets.Stage.Cinema,
        type: Vista.QuickTickets.Stage.Type,
        time: Vista.QuickTickets.Stage.Time
    };

    this.show = function () {
        container.show();
    };

    this.hide = function () {
        container.hide();
    };

    this.onStageSelect = function (handler) {
        container.bind(events.stageSelect, handler);
    };

    function onButtonClick() {
        container.trigger(events.stageSelect, stageMap[$(this).val()]);
    }

};