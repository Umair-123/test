/// <reference path="../../jquery-1.8.1.min.js" />
/// <reference path="../Vista.js"/>
/// <reference path="ItemClassCategory.js"/>
Vista.LoyaltyRewardShop.RecognitionTypeCategory = (function (containerElement) {
    'use strict';

    //Private variables
    var container,
        itemClassCategories;

    //Private functions
    var init = function() {
        container = $(containerElement);
        itemClassCategories = [];        
        var itemClassCategoryElements = container.find(".item-class-category");
        itemClassCategoryElements.each(function (index, value) {
            itemClassCategories.push(new Vista.LoyaltyRewardShop.ItemClassCategory(value, self));
        });
    };
    
    //Public functions
    //TODO - these are events - use a framework
    this.onItemSelected = function (item) {
        $.each(itemClassCategories, function (index, value) {
            value.onItemSelected(item);
        });
    };
    
    this.onItemRedemptionStarted = function (item) {
        $.each(itemClassCategories, function (index, value) {
            value.onItemRedemptionStarted(item);
        });
    };
    
    this.onItemRedemptionCompleted = function (item, redemptionResponse) {
        $.each(itemClassCategories, function (index, value) {
            value.onItemRedemptionCompleted(item, redemptionResponse);
        });
    };

    init();       
});
