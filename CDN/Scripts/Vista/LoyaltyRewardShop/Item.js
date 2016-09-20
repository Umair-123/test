/// <reference path="../../jquery-1.8.1.min.js" />
/// <reference path="../Vista.js"/>

Vista.LoyaltyRewardShop.Item = (function (containerElement, itemCategoryParam) {
    'use strict';

    //Private variables
    var container,
        displayMode,
        
        quantityRemaining,
        redeemButton,
        pointsCost,
        
        confirmMode,
        pointsBalance,
        pickupDetails,
        cinemaPicker,
        cancelButton,
        confirmButton,
                    
        loadingMask,
        loadingIcon,
                
        completeView,
        completeMessage,
        doneButton,        
        self;
    
    //Public Properties
    this.RecognitionId = null;
    this.BalanceTypeId = null;
    this.ItemCategory = null;

    

    self = this;
    
    //Private functions
    var init = function() {        
        self.ItemCategory = itemCategoryParam;
        container = $(containerElement);
        
        //Item Properties
        self.RecognitionId = Number(container.find(".js-recognition-id").val());
        self.BalanceTypeId = Number(container.find(".js-balance-type-id").val());        
        pointsCost = Number(container.find(".js-points-cost").val());

        //Standard View
        displayMode = $(container.find(".display-mode"));
        redeemButton = $(displayMode.find(".redeem-button"));
        quantityRemaining = $(displayMode.find(".quantity-remaining"));

        //Confirm view
        confirmMode = $(container.find(".confirm-mode"));
        pointsBalance = $(confirmMode.find(".points-balance"));
        confirmButton = confirmMode.find(".confirm-button");
        cancelButton = confirmMode.find(".cancel-button");

        //Loading Mask
        loadingMask = $(container.find(".loading-mask"));
        loadingIcon = $(loadingMask.find(".loading"));

        //Pickup Details
        pickupDetails = $(container.find(".pickup-details"));
        cinemaPicker = $(pickupDetails.find(".cinema-picker"));

        //Complete View
        completeView = $(container.find(".complete-view"));
        completeMessage = $(completeView.find(".complete-message"));
        doneButton = $(completeView.find(".done-button"));
        
        redeemButton.on("click", onRedeemButtonClicked);
        cancelButton.on("click", function () {
            deselect();
        });
        doneButton.on("click", function () {
            completeView.removeAttr("form-error");
            completeView.hide();
            deselect();
        });
        confirmButton.on("click", intiateRedmption);
    };
    
    var deselect = function() {
        displayMode.show();
        confirmMode.hide();
        completeView.hide();
    };
    
    var select = function () {
        if (cinemaPicker.find("option").length == 0) {
            var clonedOptions = $("#cinema-picker-source").clone();
            var options = $(clonedOptions).children();
            cinemaPicker.append(options);
        }
        
        displayMode.hide();
        cinemaPicker.show();
        pickupDetails.show();
        confirmMode.show();
        var dynamicTop = (loadingMask.height() - loadingIcon.height()) / 2;
        loadingIcon.css('top', dynamicTop);
    };

    var complete = function (message, isError) {        
        completeMessage.text(message);
        if (isError) {
            completeMessage.addClass("form-error");
            completeMessage.addClass("reversed");
        }
        pickupDetails.hide();
        loadingMask.hide();
        completeView.show();
    };

    var onRedeemButtonClicked = function() {
        if (isUnavailable()) {
            //?
        } else {
            onItemSelected(self);
            Vista.LoyaltyRewardShop.PageController.onItemSelected(self);
        }
    };

    var isUnavailable = function () {
        return container.hasClass("unavailable") || container.hasClass("temp-unavailable");
    };

    //Response is a RedeemManualRecognitionResponse
    var redemptionComplete = function (response) {
        complete(response.RedemptionMessage, !response.RedemptionSuccessful);        
        Vista.LoyaltyRewardShop.PageController.onItemRedemptionCompleted(self, response);        
        loadingMask.hide();
    };

    var redemptionFailed = function (jqXHR, textStatus) {
        complete("An unexpected error occurred redeeming your points", true);
    };

    var intiateRedmption = function () {
        cinemaPicker.hide();
        loadingMask.show();
        var loyaltyCinemaId = cinemaPicker.val();
        Vista.LoyaltyRewardShop.PageController.onItemRedemptionStarted(self);
        $.ajax({
            url: Vista.Urls.LoyaltyRewardShop.purchaseReward,
            type: "POST",
            data: { RecognitionId: self.RecognitionId, LoyaltyCinemaId: loyaltyCinemaId },
            success: redemptionComplete,
            error: redemptionFailed,
            dataType: "json"
        });
    };
    
    var onItemSelected = function (item) {
        if (item === self) {
            select();
        } else {
            deselect();
        }
    };



    //Public Functions 
    
    this.onItemRedemptionStarted = function (item) {
        if (item.RecognitionId === self.RecognitionId) {
            //Do nothing
        } else {
            container.addClass("temp-unavailable");
        }
    };
    
    this.onItemRedemptionCompleted = function (item, redemptionResponse) {
        container.removeClass("temp-unavailable");
        //We need to update our balance type here        
        if (item.BalanceTypeId === self.BalanceTypeId) {
            if (redemptionResponse && redemptionResponse.RedemptionSuccessful) {
                $.each(redemptionResponse.PointBalances, function(index, value) {
                    if (value.IsDefaultBalanceType) {
                        pointsBalance.text(value.BalanceFormatted);
                        if (value.Balance < pointsCost) {
                            container.addClass("unavailable");
                        }
                    }
                });
            }
        }
        if (item.RecognitionId === self.RecognitionId) {
            if (quantityRemaining) {
                quantityRemaining.text(redemptionResponse.ManualRecognition.TotalAvailable);
            }            
        }
    };
    
    this.isUnvailable = isUnavailable;
    this.onItemSelected = onItemSelected;
    
    init();       
});
