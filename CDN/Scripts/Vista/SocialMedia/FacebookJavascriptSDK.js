$(function () {
    ///<summary>
    ///     Retrieves the Facebook Javascript SDK and injects it into the page. Requires
    ///     a root div with an id of "fb-root".
    ///</summary>
    $("body").prepend("<div id=\"fb-root\"></div>");

    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/all.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
});

Vista.SocialMedia.Facebook = function() {

    'use strict';

    var methods = {
        init: function (window) {
            // once loaded, the facebook SDK will call window.fbAsyncInit
            window.fbAsyncInit = function() {
                FB.init({ status: true, xfbml: true });
            };
        },
        
        bindLikeButtonClick: function(action) {
            
            var currentAsyncInit = window.fbAsyncInit;

            if (typeof(window.fbAsyncInit) !== "function") {
                throw new Error("The function fbAsyncInit is not initialised. " +
                    "You must call Vista.SocialMedia.Facebook.init before using this function");
            }

            window.fbAsyncInit = function () {
                // execute any previous functionality
                currentAsyncInit();
                // subscribe our like click event
                FB.Event.subscribe("edge.create", action);
            };
        }
    };

    return methods;
}();

Vista.SocialMedia.Facebook.init(window);
