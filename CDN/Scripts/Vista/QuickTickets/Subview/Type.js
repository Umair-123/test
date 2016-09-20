/// <reference path="../../Vista.js"/>
/// <reference path="../../Utilities/Utilities.js"/>
/// <reference path="Base.js"/>
(function () {
    'use strict';

    Vista.QuickTickets.TypeView = function (container) {
        Vista.QuickTickets.BaseView.call(this, container);
    };

    Vista.QuickTickets.TypeView.prototype = Object.create(Vista.QuickTickets.BaseView.prototype);
    Vista.QuickTickets.TypeView.prototype.template = '<span class="item selectable" data-id="{0}"><span class="name">{1}</span></span>';

    Vista.QuickTickets.TypeView.prototype.anyText = Vista.Lang.QuickTickets.ShowTypeAny;

    Vista.QuickTickets.TypeView.prototype.format = function () {
        var items = Vista.QuickTickets.BaseView.prototype.format.call(this);
        return this.formatColumns(items);
    };
})();
