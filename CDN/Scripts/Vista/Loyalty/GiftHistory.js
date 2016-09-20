$(function() {
    var methods = {
        showTransaction: function (data) {
          $.modal(data, {
              modal: true,
              overlayClose: true
          });
      },
      
      getTransactionData: function (transactionId, cinemaId) {
          //          return $.get('GetTransactionData?transactionId=' + transactionId + '&cinemaId=' + cinemaId);
          var selector = '.i-' + transactionId + '-' + cinemaId;
          return $(selector).html();
      },

      loadAndShowTransactionHistory: function (transactionId, cinemaId) {
          var data = methods.getTransactionData(transactionId, cinemaId);
          methods.showTransaction(data);
      }
    };

    $('.gift-purchase').click(function() {
        var link = $(this);
        var transactionId = link.data('transid');
        var cinemaId = link.data('cinemaid');
        methods.loadAndShowTransactionHistory(transactionId, cinemaId);
    });

    //If the gift icon is clicked, perform a click action on the sibling gift purchase link
    $('.icon-gift').click(function() {
        var giftIcon = $(this);
        var giftPurchaseLink = giftIcon.siblings('.gift-purchase');
        giftPurchaseLink.click();
    });
});