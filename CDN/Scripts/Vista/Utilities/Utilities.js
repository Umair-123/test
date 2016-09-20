///<reference path="../Vista.js"/>
(function () {
    'use strict';

    Vista.Utilities.printPage = function () {
        /// <summary>Requests that the browser print the current web page in focus.</summary>
        /// <remarks>
        /// Uses window.print() which is not part of any standard but implemented by all
        /// current browsers.
        /// </remarks>

        if (!window.print)
            return;

        window.print();

    };

    Vista.Utilities.format = function (format) {
        /// <summary>string.format</summary>
        /// <param name="format" type="String">The format string.</param>
        for (var i = 0; i < arguments.length - 1; i++) {
            var regex = new RegExp('\\{' + i + '\\}', 'g');
            format = format.replace(regex, typeof arguments[i + 1] === 'undefined' ? '' : arguments[i + 1]);
        }

        return format;
    };

    Vista.Utilities.formatDateForPost = function (date) {
        /// <summary>Formats a date into the date string MVC's model binder can handle (yyyy/MM/dd HH:mm:ss).</summary>

        return Vista.Utilities.format('{0}/{1}/{2} {3}:{4}:{5}', date.getFullYear(),
                                                                 date.getMonth() + 1, // 0 based
                                                                 date.getDate(),
                                                                 date.getHours(),
                                                                 date.getMinutes(),
                                                                 date.getSeconds());

    };

    Vista.Utilities.parseDotNetDateString = function (date) {
        /// <summary>Parses the MVC /date()/ string into a javascript date object.</summary>
        return new Date(parseInt(date.substr(6)));
    };

    Vista.Utilities.fixDotNetJsonDateString = function (jsonObject) {
        var i,
            prop,
            DATE_CHECK_STRING = '\/Date(';

        if ($.isArray(jsonObject)) {
            for (i = 0; i < jsonObject.length; i++) {
                Vista.Utilities.fixDotNetJsonDateString(jsonObject[i]);
            }
        }

        // recurse through every property and convert the .net date strings into date objects
        for (prop in jsonObject) {
            if (jsonObject.hasOwnProperty(prop)) {
                if (typeof jsonObject[prop] === 'object') {
                    if (jsonObject[prop]) {
                        Vista.Utilities.fixDotNetJsonDateString(jsonObject[prop]);
                    }
                }
                else if (typeof jsonObject[prop] === 'string' && jsonObject[prop].indexOf(DATE_CHECK_STRING) === 0) {
                    jsonObject[prop] = Vista.Utilities.parseDotNetDateString(jsonObject[prop]);
                }
            }
        }
    };

    Vista.Utilities.getCookie = function (cookieName) {
        var crumbs = document.cookie.split('; ');
        var cookieVal = '';
        crumbs.filter(function (c) {
            var crumb = c.split('=');
            if (crumb[0] == cookieName) {
                cookieVal = crumb[1];
            }
            return false;
        });
        return cookieVal;
    };

    Vista.Utilities.setCookie = function (cookieName, value, expiry) {
        var cookie = cookieName + '=' + value;
        if (expiry)
            cookie += ('; expires=' + expiry.toUTCString());
        cookie += (';path=/');
        document.cookie = cookie;
    };

    Vista.Utilities.getJsonCookie = function (cookieName) {
        var cookieValue = Vista.Utilities.getCookie(cookieName);
        return cookieValue ? JSON.parse(cookieValue) : undefined;
    };

    Vista.Utilities.setJsonCookie = function(cookieName, value, expiry) {
        var cookieValue = JSON.stringify(value);
        Vista.Utilities.setCookie(cookieName, cookieValue, expiry);
    }

    Vista.Utilities.joinWithoutEmpty = function (separator) {
        /// <summary>Joins supplied strings, removing empty entries.</summary>

        // Grep filters out empty items
        return $.grep(Array.prototype.slice.call(arguments, 1), function (element) {
            return element;
        }).join(separator);
    };


    Vista.Utilities.toDataContractDictionary = function (object) {
        /// <summary>Returns an array that can be deserialized as a dictionary by the DataContractSerializer.</summary>
        var dictArray = [];

        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                dictArray.push({ Key: key, Value: object[key]});
            }
        }

        return dictArray;
    };

} ());
