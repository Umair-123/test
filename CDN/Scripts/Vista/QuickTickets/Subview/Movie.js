/// <reference path="../../Vista.js"/>
/// <reference path="../../Utilities/Utilities.js"/>
/// <reference path="Base.js"/>
(function () {
    'use strict';

    Vista.QuickTickets.MovieView = function (container) {
        Vista.QuickTickets.BaseView.call(this, container);
    };

    Vista.QuickTickets.MovieView.prototype = Object.create(Vista.QuickTickets.BaseView.prototype);
    Vista.QuickTickets.MovieView.prototype.template = '<span class="movie item" data-id="{1}"><img src="' + Vista.Urls.QuickTickets.MovieImages + '" alt="{2}" /><span class="name">{2}</span></span>';
    Vista.QuickTickets.MovieView.prototype.anyText = Vista.Lang.QuickTickets.MovieAny;

    Vista.QuickTickets.MovieView.prototype.formatItem = function (item) {
        return Vista.Utilities.format(this.template, item.ImageId || 'default', item.Id, item.Name);
    };
})();
