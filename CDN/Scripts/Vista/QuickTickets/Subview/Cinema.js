/// <reference path="../../Vista.js"/>
/// <reference path="../../Utilities/Utilities.js"/>
/// <reference path="Base.js"/>
(function () {
    'use strict';

    Vista.QuickTickets.CinemaView = function (container) {
        Vista.QuickTickets.BaseView.call(this, container);
    };

    Vista.QuickTickets.CinemaView.prototype = Object.create(Vista.QuickTickets.BaseView.prototype);
    Vista.QuickTickets.CinemaView.prototype.template = '<span class="item selectable cinema" data-id="{0}"><span class="name">{1}</span><span class="attributes">{2}</span></span>';
    Vista.QuickTickets.CinemaView.prototype.anyText = Vista.Lang.QuickTickets.CinemaAny;

    Vista.QuickTickets.CinemaView.prototype.formatItem = function (item) {
        return Vista.Utilities.format(this.template, item.Id, item.Name, item.Attributes);
    };

    Vista.QuickTickets.CinemaView.prototype.format = function () {
        var items = Vista.QuickTickets.BaseView.prototype.format.call(this);
        return this.formatColumns(items);
    };

})();
