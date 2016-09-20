Vista.Loyalty.Messages = (function () {

    
    //Swaps out the loading container with the form container containing the form
    function displayForm(data, messageType) {
        var modal = $("#reply-modal");
        var formContainer = $(modal.find(".form-container"));
        var loadingContainer = $(modal.find(".loading-container"));        
        formContainer.html(data);
        var form = $(formContainer.find("form"));


        
        //We have to re-do validation and checkboxlist configuration here
        form.find("ul").checkboxlist();
        $.validator.unobtrusive.parse(form);
        Vista.Validation.configureForms(form);
        form.on("submit", function (e) {
            if (!$(this).valid()) {
                e.preventDefault();
            }
        });
        loadingContainer.hide();
        //Show form
        formContainer.show();
    }

    function onReplyClick(e) {
        e.preventDefault();

        var target = $(this);
        var messageId = target.attr("data-message-id");
        var messageType = target.attr("data-message-type");
        
        var modal = $("#reply-modal");
        modal.removeClass("type-list");
        modal.removeClass("type-number");
        modal.removeClass("type-text");
        modal.addClass("type-" + messageType);
        
        modal.modal(
            {
                containerId: "reply-modal-container",
                
                escClose: true,
                overlayClose: true,
                onShow: function() {
                    $.get("RespondToMessageDialog?messageId=" + messageId, function (data) {
                        window.setTimeout(function () { displayForm(data, messageType); }, 300);
                    });
                }                
            });
        return;
    }

    return {
        init: function () {
            $('.loyalty-messages').on('click', '.message-action-reply', onReplyClick);
        }
    };

})();

$.validator.setDefaults({ ignore: [] });
$(Vista.Loyalty.Messages.init);
