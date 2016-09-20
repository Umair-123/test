/// <reference path="../../jquery-1.8.1.min.js" />
/// <reference path="../Vista.js"/>

Vista.LoyaltyRewardShop.ItemClassCategory = (function (containerElement, recognitionTypeParam) {
    'use strict';

    //Private variables
    var container,
        expander,
        items;
    var self = this;
    

    //Public properties
    this.RecognitionType = null;

    //Private functions
    var init = function () {
        items = [];
        container = $(containerElement);
        expander = container.find(".expander");
        self.RecognitionType = recognitionTypeParam;
        
        expander.each(function (index, value) {
            if ($(value).hasClass("no-expansion")) {
            } else {
                $(value).on("click", function () {
                    container.toggleClass("collapsed");
                });
            }
        });
        var itemElements = container.find(".manual-recognition-item");
        itemElements.each(function (index, value) {
            items.push(new Vista.LoyaltyRewardShop.Item(value, self));
        });
    };
        
    //Public functions
    this.onItemSelected = function(item) {
        $.each(items, function(index, value) {
            value.onItemSelected(item);
        });
    };
    
    this.onItemRedemptionStarted = function (item) {
        $.each(items, function (index, value) {
            value.onItemRedemptionStarted(item);
        });
    };

    this.onItemRedemptionCompleted = function (item, redemptionResponse) {
        $.each(items, function (index, value) {
            value.onItemRedemptionCompleted(item, redemptionResponse);
        });
    };

    init();
});
