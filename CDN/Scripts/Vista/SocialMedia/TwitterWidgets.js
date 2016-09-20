
Vista.SocialMedia.Twitter = function () {

    'use strict';

    var tweetOnClickFunction;

    var methods = {
        init: function (window) {
            
            // Fetches and injects the Twitter widgets SDK onto the page.
            window.twttr = (function (d, s, id) {
                var t, js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s);
                js.id = id;
                js.src = "//platform.twitter.com/widgets.js";
                fjs.parentNode.insertBefore(js, fjs);
                return window.twttr || (t = { _e: [], ready: function (f) { t._e.push(f); } });
            }(document, "script", "twitter-wjs"));
            
            window.twttr.ready(function (twttr) {
                
                if (typeof (tweetOnClickFunction) === "function") {
                    twttr.events.bind('tweet', tweetOnClickFunction);
                }
            });
        },
        
        bindTweetButtonClick: function (action) {
            // if the twitter api has not initialised then store the action function
            // where it can be bound to the tweet event later.
            if (typeof(window.twttr) !== "function") {
                tweetOnClickFunction = action;
            } else {
                twttr.events.bind('tweet', action);
            }
        }
    };

    return methods;
}();

$(Vista.SocialMedia.Twitter.init(window));