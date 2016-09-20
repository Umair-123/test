///<reference path="../Vista.js"/>
/// <reference path="Utilities.js" />

(function () {
    'use strict';

    function parseAjaxOrderUpdateResponse(successCallback, args) {

        // mvc returns json object rather than a string
        var wrappedResponse;
        if (typeof args[0] === 'object') {
            wrappedResponse = args[0];
        }
        else {
            try {
                wrappedResponse = JSON.parse(args[0]);
            }
            catch (ex) {
                wrappedResponse = {}; // server errors return pages, and will break the parse
            }
        }
        
        if (wrappedResponse.updatedOrderValues) {
            orderLastModifiedDateHandler(wrappedResponse.updatedOrderValues.lastUpdatedTime);
        }

        successCallback(wrappedResponse.response, wrappedResponse.updatedOrderValues);
    }

    function orderLastModifiedDateHandler(orderLastUpdatedTime) {
        ///<summary>
        /// Updates a hidden input field on the page to ensure on post back the order
        /// hasn't been modified in a separate browser window.
        ///</summary>

        if (orderLastUpdatedTime)
            $('#txtDateOrderChanged').attr('value', orderLastUpdatedTime);
    }

    Vista.Utilities.orderUpdateAjax = function (url, objectToPost, successCallback, errorCallback, completeCallback) {
        /// <summary>Performs an AJAX POST that updates the order object.</summary>

        $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify(objectToPost),
            contentType: 'application/json; charset=UTF-8',
            traditional: true,
            success: (function () { parseAjaxOrderUpdateResponse(successCallback, arguments); }),
            error: errorCallback,
            complete: completeCallback
        });
    };

} ());
