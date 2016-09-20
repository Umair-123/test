/// <reference path="../../jquery-1.8.1.min.js" />
/// <reference path="../Vista.js"/>
/// <reference path="../CategoryTabs.js" />
/// <reference path="../SelectGrid/SelectGridControl.js" />
/// <reference path="RecognitionTypeCategory.js"/>

//TODO - this page would be a prime candidate for moving to backbone.js or some such
//At present this is a simple model/view mish-mash system
Vista.LoyaltyRewardShop.Page = function () {
    'use strict';

    //Private variables
    var categoryTabs,
        recognitionTypeCategories,
        lastUpdatedDateString,
        overallBalanceString;
    
    //Private functions
    var init = function () {
        
        overallBalanceString = $("#lblPointsBalanceValue");
        lastUpdatedDateString = $("#lblTimeValue");
        
        recognitionTypeCategories = [];
        var recognitionClassCategoryElements = $(".recognition-type-category");
        recognitionClassCategoryElements.each(function (index, value) {
            recognitionTypeCategories.push(new Vista.LoyaltyRewardShop.RecognitionTypeCategory(value, this));
        });
        
        //Do the category tabs business
        categoryTabs = $('.category-tabs');
        categoryTabs.categorytabs({
            setContainerHeights: false,
            onActivate: onTabSelected
        });
    };
    
    var onTabSelected = function (event, ui) {
        //TODO - why doesn't this work?
    };

    //Public functions
    //TODO - these are essentially model events => backbone.js
    this.onItemSelected = function (item) {
        $.each(recognitionTypeCategories, function (index, value) {
            value.onItemSelected(item);
        });        
    };

    this.onItemRedemptionStarted = function(item) {
        $.each(recognitionTypeCategories, function (index, value) {
            value.onItemRedemptionStarted(item);
        });
    };
    
    this.onItemRedemptionCompleted = function (item, redemptionResponse) {
        //TODO - one day support multiple balance types properly
        $.each(redemptionResponse.PointBalances, function(index, value) {
            if (value.IsDefaultBalanceType) {
                overallBalanceString.text(value.BalanceFormatted);
            }
        });
        lastUpdatedDateString.text(redemptionResponse.LoyaltyMemberUpdateDateFormatted);
        
        $.each(recognitionTypeCategories, function (index, value) {
            value.onItemRedemptionCompleted(item, redemptionResponse);
        });
    };
    


    init();
};
Vista.LoyaltyRewardShop.PageController = new Vista.LoyaltyRewardShop.Page();
