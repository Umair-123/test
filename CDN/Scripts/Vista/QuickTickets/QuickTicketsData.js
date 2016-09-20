/// <reference path="../Vista.js"/>
/// <reference path="../Utilities/Utilities.js"/>
/// <reference path="QuickTickets.js"/>

Vista.QuickTickets.Data = function () {
    'use strict';
    var current,
        movies = {
            url: Vista.Urls.QuickTickets.Movies,
            cache: undefined
        },
        cinemas = {
            url: Vista.Urls.QuickTickets.Cinemas,
            cache: undefined
        },
        types = {
            url: Vista.Urls.QuickTickets.ShowTypes,
            cache: undefined
        },
        times = {
            url: Vista.Urls.QuickTickets.Times,
            cache: undefined
        };

    function request(category, filters, callback) {
        if (isEmpty(filters) && category.cache) {
            callback(category.cache);
            return;
        }

        current = $.ajax({
            type: 'POST',
            url: category.url,
            data: filters,
            traditional: true, // required for array model binding
            success: function (response) {
                Vista.Utilities.fixDotNetJsonDateString(response);

                if (isEmpty(filters))
                    category.cache = response;

                callback(response);
            }
        });
    }

    function isEmpty(filters) {
        for (var filter in filters) {
            if (filters.hasOwnProperty(filter)) {
                if (filters[filter] && filters[filter].length) return false;
            }
        }

        return true;
    }

    return {
        abortCurrent: function () {
            if (current && current.abort) current.abort();
        },

        getMoviesAsync: function (filters, callback) {
            request(movies, filters, callback);
        },

        getCinemasAsync: function (filters, callback) {
            request(cinemas, filters, callback);
        },

        getTypesAsync: function (filters, callback) {
            request(types, filters, callback);
        },

        getTimesAsync: function (filters, callback) {
            request(times, filters, callback);
        }
    };
};